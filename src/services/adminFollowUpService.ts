import { ref, get, set } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import { sendChatMessage } from './chatService';

export interface AdminFollowUpNote {
  id: string;
  clientId: string;
  clientName: string;
  category: 'counselling' | 'long_term';
  channel: 'whatsapp' | 'email' | 'sms';
  subject: string;
  message: string;
  senderName: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = 'she_nourishes_admin_followup_notes';

// Default clinical welcome notes if admin hasn't dispatched a specific note yet
export const DEFAULT_CLINICAL_NOTES: Record<'counselling' | 'long_term', (name: string) => AdminFollowUpNote> = {
  counselling: (name: string) => ({
    id: 'default_counselling_note',
    clientId: 'default',
    clientName: name || 'Valued Member',
    category: 'counselling',
    channel: 'email',
    subject: 'Weekly 1-on-1 Nutrition Consultation Check-In',
    message: `Hi ${name || 'there'}! This is Sneha Dey. Welcome to your 1-on-1 weekly clinical counselling. I am reviewing your daily food logs and hydration records. Please log your morning fasting weight and let me know if you need to adjust any meal timings or recipes before our next slot!`,
    senderName: 'Sneha Dey (Lead Nutritionist)',
    timestamp: Date.now() - 3600000 * 3, // 3 hours ago
    read: false,
  }),
  long_term: (name: string) => ({
    id: 'default_long_term_note',
    clientId: 'default',
    clientName: name || 'Valued Member',
    category: 'long_term',
    channel: 'whatsapp',
    subject: 'Long-Term Health Transformation Protocol Update',
    message: `Hi ${name || 'there'}! Sneha Dey here. Your personalized long-term transformation protocol is active. Please take your prescribed morning supplements after breakfast, drink at least 2.5L of water today, and check your updated meal chart in the app. Keep up the great consistency!`,
    senderName: 'Sneha Dey (Lead Nutritionist)',
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
    read: false,
  }),
};

/**
 * Fetch all admin follow-up notes from localStorage and Firebase.
 */
export async function getAllAdminFollowUps(): Promise<AdminFollowUpNote[]> {
  try {
    if (isFirebaseConfigured && database) {
      const snap = await get(ref(database, 'adminFollowUps/all'));
      if (snap.exists()) {
        const val = snap.val();
        const list: AdminFollowUpNote[] = Array.isArray(val) ? val : Object.values(val);
        return list.sort((a, b) => b.timestamp - a.timestamp);
      }
    }
  } catch (e) {
    console.warn('Firebase error fetching admin followups:', e);
  }

  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed: AdminFollowUpNote[] = JSON.parse(local);
      return parsed.sort((a, b) => b.timestamp - a.timestamp);
    } catch {}
  }

  return [];
}

/**
 * Save and dispatch a new follow-up note from Admin to client.
 */
export async function dispatchAdminFollowUpNote(
  data: Omit<AdminFollowUpNote, 'id' | 'timestamp' | 'read'>
): Promise<AdminFollowUpNote> {
  const newNote: AdminFollowUpNote = {
    ...data,
    id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    read: false,
  };

  const existing = await getAllAdminFollowUps();
  const updated = [newNote, ...existing];

  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage error saving admin follow-up:', e);
  }

  // Save to Firebase
  try {
    if (isFirebaseConfigured && database) {
      await set(ref(database, `adminFollowUps/all/${newNote.id}`), newNote);
      if (newNote.clientId) {
        await set(ref(database, `adminFollowUps/byClient/${newNote.clientId}/${newNote.id}`), newNote);
      }
    }
  } catch (e) {
    console.warn('Firebase write error for follow-up note:', e);
  }

  // Mirror to chat history
  try {
    const categoryTag = data.category === 'counselling' ? '[Weekly Counselling Follow-up]' : '[Long-Term Protocol Update]';
    await sendChatMessage('admin', 'Sneha Dey (Nutritionist)', `${categoryTag} ${data.message}`);
  } catch (e) {
    console.warn('Could not mirror follow-up to chat:', e);
  }

  return newNote;
}

/**
 * Get latest follow-up note for a specific client and category.
 */
export async function getLatestFollowUpForClient(
  clientId: string,
  category: 'counselling' | 'long_term',
  clientName = 'Valued Member'
): Promise<AdminFollowUpNote> {
  const all = await getAllAdminFollowUps();
  const match = all.find(
    (n) => (n.clientId === clientId || n.clientId === 'default' || !clientId) && n.category === category
  );

  if (match) {
    return match;
  }

  // Fallback to default clinical note
  return DEFAULT_CLINICAL_NOTES[category](clientName);
}

/**
 * Mark a follow-up note as read by the client.
 */
export async function markFollowUpAsRead(noteId: string): Promise<void> {
  const all = await getAllAdminFollowUps();
  const updated = all.map((n) => (n.id === noteId ? { ...n, read: true } : n));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (isFirebaseConfigured && database) {
      await set(ref(database, `adminFollowUps/all/${noteId}/read`), true);
    }
  } catch (e) {
    console.warn('Error marking follow-up as read:', e);
  }
}
