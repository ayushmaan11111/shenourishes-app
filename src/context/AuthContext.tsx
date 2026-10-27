import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import {
  getCustomerRecord,
  initializeCustomerRecord,
} from '../services/customerService';
import { getFriendlyAuthErrorMessage } from '../services/authErrors';
import type { CustomerRecord } from '../types/customer';

interface AuthContextType {
  user: { uid: string; email: string | null } | null;
  customerRecord: CustomerRecord | null;
  loading: boolean;
  isFirebaseActive: boolean;
  error: string | null;
  signUp: (fullName: string, email: string, mobile: string, pass: string) => Promise<CustomerRecord>;
  login: (email: string, pass: string) => Promise<CustomerRecord | null>;
  signInWithGoogle: () => Promise<CustomerRecord | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshCustomerRecord: () => Promise<void>;
  setCustomerRecordState: React.Dispatch<React.SetStateAction<CustomerRecord | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'she_nourishes_active_session';
const DEMO_USERS_KEY = 'she_nourishes_demo_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_SESSION_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [customerRecord, setCustomerRecordState] = useState<CustomerRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync customer record from database whenever user UID is available
  const syncCustomerRecord = async (uid: string) => {
    try {
      const record = await getCustomerRecord(uid);
      if (record) {
        setCustomerRecordState(record);
      }
      return record;
    } catch (err) {
      console.error('Error syncing customer record:', err);
      return null;
    }
  };

  useEffect(() => {
    // Immediate local cache restore
    const cachedSession = localStorage.getItem(LOCAL_SESSION_KEY);
    if (cachedSession) {
      try {
        const parsed = JSON.parse(cachedSession);
        setUser(parsed);
        syncCustomerRecord(parsed.uid);
      } catch {
        // ignore
      }
    }

    let isSubscribed = true;

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (!isSubscribed) return;
        if (firebaseUser) {
          const active = { uid: firebaseUser.uid, email: firebaseUser.email };
          setUser(active);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(active));
          await syncCustomerRecord(firebaseUser.uid);
        } else {
          // If no firebaseUser, check if we had a local session
          const local = localStorage.getItem(LOCAL_SESSION_KEY);
          if (!local) {
            setUser(null);
            setCustomerRecordState(null);
          }
        }
        setLoading(false);
      });

      // Safety fallback timeout to guarantee loading never hangs
      const timer = setTimeout(() => {
        if (isSubscribed) {
          setLoading(false);
        }
      }, 1500);

      return () => {
        isSubscribed = false;
        clearTimeout(timer);
        unsubscribe();
      };
    } else {
      if (cachedSession) {
        try {
          const parsed = JSON.parse(cachedSession);
          setUser(parsed);
          syncCustomerRecord(parsed.uid).finally(() => setLoading(false));
          return;
        } catch {
          // ignore
        }
      }
      setLoading(false);
    }
  }, []);

  const signUp = async (fullName: string, email: string, mobile: string, pass: string): Promise<CustomerRecord> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        const firebaseUser = userCredential.user;
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        
        const record = await initializeCustomerRecord(firebaseUser.uid, fullName, cleanEmail, mobile);
        setCustomerRecordState(record);
        return record;
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        const rawMsg = (err as { message?: string })?.message || '';
        console.error('Firebase Sign Up Error:', code, rawMsg, err);
        const msg = getFriendlyAuthErrorMessage(code, rawMsg);
        setError(msg);
        throw new Error(msg);
      }
    } else {
      // Local fallback auth
      const rawUsers = localStorage.getItem(DEMO_USERS_KEY);
      const demoUsers: Record<string, { email: string; pass: string; fullName: string; mobile: string }> = 
        rawUsers ? JSON.parse(rawUsers) : {};

      if (demoUsers[cleanEmail]) {
        const msg = getFriendlyAuthErrorMessage('auth/email-already-in-use');
        setError(msg);
        throw new Error(msg);
      }

      const mockUid = 'cust_' + Math.random().toString(36).substring(2, 9);
      demoUsers[cleanEmail] = { email: cleanEmail, pass, fullName, mobile };
      localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(demoUsers));

      const activeUser = { uid: mockUid, email: cleanEmail };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(activeUser));
      setUser(activeUser);

      const record = await initializeCustomerRecord(mockUid, fullName, cleanEmail, mobile);
      setCustomerRecordState(record);
      return record;
    }
  };

  const login = async (email: string, pass: string): Promise<CustomerRecord | null> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const firebaseUser = userCredential.user;
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        
        const record = await syncCustomerRecord(firebaseUser.uid);
        return record;
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        const rawMsg = (err as { message?: string })?.message || '';
        console.error('Firebase Sign In Error:', code, rawMsg, err);
        const msg = getFriendlyAuthErrorMessage(code, rawMsg);
        setError(msg);
        throw new Error(msg);
      }
    } else {
      // Local fallback login
      const rawUsers = localStorage.getItem(DEMO_USERS_KEY);
      const demoUsers: Record<string, { email: string; pass: string; fullName: string; mobile: string; uid?: string }> = 
        rawUsers ? JSON.parse(rawUsers) : {};

      const existingUser = demoUsers[cleanEmail];
      if (!existingUser || existingUser.pass !== pass) {
        const msg = getFriendlyAuthErrorMessage('auth/invalid-credential');
        setError(msg);
        throw new Error(msg);
      }

      let uid = existingUser.uid;
      if (!uid) {
        uid = 'cust_' + Math.random().toString(36).substring(2, 9);
        existingUser.uid = uid;
        localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(demoUsers));
      }

      const activeUser = { uid, email: cleanEmail };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(activeUser));
      setUser(activeUser);

      let record = await syncCustomerRecord(uid);
      if (!record) {
        record = await initializeCustomerRecord(uid, existingUser.fullName, cleanEmail, existingUser.mobile);
        setCustomerRecordState(record);
      }
      return record;
    }
  };

  const signInWithGoogle = async (): Promise<CustomerRecord | null> => {
    setError(null);
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const userCredential = await signInWithPopup(auth, provider);
        const firebaseUser = userCredential.user;
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });

        let record = await syncCustomerRecord(firebaseUser.uid);
        if (!record) {
          record = await initializeCustomerRecord(
            firebaseUser.uid,
            firebaseUser.displayName || '',
            firebaseUser.email || '',
            firebaseUser.phoneNumber || ''
          );
          setCustomerRecordState(record);
        }
        return record;
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        const rawMsg = (err as { message?: string })?.message || '';
        console.error('Firebase Google Auth Error:', code, rawMsg, err);
        const msg = getFriendlyAuthErrorMessage(code, rawMsg);
        setError(msg);
        throw new Error(msg);
      }
    } else {
      // Demo sandbox Google sign in
      const mockUid = 'google_demo_' + Math.random().toString(36).substring(2, 9);
      const activeUser = { uid: mockUid, email: 'member.wellness@gmail.com' };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(activeUser));
      setUser(activeUser);

      let record = await syncCustomerRecord(mockUid);
      if (!record) {
        record = await initializeCustomerRecord(mockUid, 'Sarah Jenkins', 'member.wellness@gmail.com', '+1 (555) 234-5678');
        setCustomerRecordState(record);
      }
      return record;
    }
  };

  const logout = async (): Promise<void> => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setUser(null);
    setCustomerRecordState(null);
  };

  const resetPassword = async (email: string): Promise<void> => {
    setError(null);
    if (isFirebaseConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email.trim());
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        const msg = getFriendlyAuthErrorMessage(code);
        setError(msg);
        throw new Error(msg);
      }
    }
  };

  const refreshCustomerRecord = async (): Promise<void> => {
    if (user?.uid) {
      await syncCustomerRecord(user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerRecord,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        error,
        signUp,
        login,
        signInWithGoogle,
        logout,
        resetPassword,
        refreshCustomerRecord,
        setCustomerRecordState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
