import { ref, get, set, update } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import { sendChatMessage } from './chatService';
import { createDefaultCustomerRecord } from './customerService';
import type { CustomerRecord } from '../types/customer';

export interface CounsellingClientRow {
  id: string;
  name: string;
  goals: string;
  meetingPoint: string;
  phone: string;
  email: string;
  lastMessageTimestamp: number | null;
  lastMessageChannel?: 'whatsapp' | 'email' | 'sms';
  daysSinceLastMessage: number | null;
  needsReminder: boolean;
}

export interface LongTermDataClientRow {
  id: string;
  name: string;
  biometricData: string;
  muscleGain: string;
  meetingPoint: string;
  phone: string;
  email: string;
  lastMessageTimestamp: number | null;
  lastMessageChannel?: 'whatsapp' | 'email' | 'sms';
  daysSinceLastMessage: number | null;
  needsReminder: boolean;
}

export interface LongTermPlanClientRow {
  id: string;
  name: string;
  planTaken: string;
  goalSelected: string;
  meetingPoint: string;
  phone: string;
  email: string;
  lastMessageTimestamp: number | null;
  lastMessageChannel?: 'whatsapp' | 'email' | 'sms';
  daysSinceLastMessage: number | null;
  needsReminder: boolean;
}

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

// Filter out known dummy / mock names
export const FAKE_NAME_FILTER = new Set([
  'Aarav Sharma', 'Priya Mehta', 'Rohan Verma', 'Neha Gupta', 'Karan Singh',
  'Ananya Iyer', 'Vikram Joshi', 'Simran Kaur', 'Aditya Patil', 'Pooja Nair',
  'Priya Sharma', 'Ananya Roy', 'Demo Client'
]);

function calculateReminderStatus(timestamp: number | null | undefined): { days: number | null; needsReminder: boolean } {
  if (!timestamp || typeof timestamp !== 'number') {
    return { days: null, needsReminder: true };
  }
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const needsReminder = diff >= TWO_DAYS_MS;
  return { days, needsReminder };
}

/**
 * Fetch real customer records directly from Firebase Realtime Database.
 * Strictly excludes mock / seed / fake users.
 */
export async function getRealFirebaseCustomers(): Promise<CustomerRecord[]> {
  const realCustomers: CustomerRecord[] = [];
  const seenIds = new Set<string>();

  // 1. Fetch from Firebase Realtime Database
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, 'customers'));
      if (snap.exists()) {
        const val = snap.val();
        const list: CustomerRecord[] = Object.values(val);
        for (const c of list) {
          if (
            c && 
            c.uid && 
            !c.uid.includes('demo') && 
            !c.uid.includes('fake') &&
            c.personalDetails?.fullName &&
            !FAKE_NAME_FILTER.has(c.personalDetails.fullName.trim())
          ) {
            seenIds.add(c.uid);
            realCustomers.push(c);
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching customers from Firebase RTDB:', err);
    }
  }

  // 2. Fetch from LocalStorage client registry (users registered locally on this device)
  try {
    const regRaw = localStorage.getItem('she_nourishes_client_registry');
    const uids: string[] = regRaw ? JSON.parse(regRaw) : [];
    for (const uid of uids) {
      if (!seenIds.has(uid) && !uid.includes('demo') && !uid.includes('fake')) {
        const rawCust = localStorage.getItem(`she_nourishes_cust_${uid}`);
        if (rawCust) {
          const c = JSON.parse(rawCust) as CustomerRecord;
          if (
            c && 
            c.personalDetails?.fullName && 
            !FAKE_NAME_FILTER.has(c.personalDetails.fullName.trim())
          ) {
            seenIds.add(c.uid);
            realCustomers.push(c);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error reading local customer registry:', err);
  }

  return realCustomers;
}

/**
 * Fetch last contacted timestamps for clients from Firebase / LocalStorage.
 */
export async function getClientContactTimestamps(): Promise<Record<string, { timestamp: number; channel?: 'whatsapp' | 'email' | 'sms' }>> {
  const map: Record<string, { timestamp: number; channel?: 'whatsapp' | 'email' | 'sms' }> = {};

  // Check LocalStorage cache
  try {
    const raw = localStorage.getItem('she_nourishes_client_last_contacted');
    if (raw) {
      Object.assign(map, JSON.parse(raw));
    }
  } catch {}

  // Check Firebase Realtime Database
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, 'adminFollowUps/lastContacted'));
      if (snap.exists()) {
        const val = snap.val();
        Object.assign(map, val);
      }
    } catch (err) {
      console.warn('Error fetching contact timestamps from Firebase:', err);
    }
  }

  return map;
}

/**
 * Record a message sent to a client across Email, WhatsApp, or SMS.
 */
export async function recordClientMessageSent(
  clientId: string,
  clientName: string,
  channel: 'whatsapp' | 'email' | 'sms',
  message: string,
  category: 'counselling' | 'long_term'
): Promise<void> {
  const now = Date.now();

  // 1. Update LocalStorage
  try {
    const raw = localStorage.getItem('she_nourishes_client_last_contacted');
    const map = raw ? JSON.parse(raw) : {};
    map[clientId] = { timestamp: now, clientName, channel, category };
    localStorage.setItem('she_nourishes_client_last_contacted', JSON.stringify(map));
  } catch (e) {
    console.warn(e);
  }

  // 2. Update Firebase Realtime Database
  if (isFirebaseConfigured && database) {
    try {
      await update(ref(database, `customers/${clientId}/lastContacted`), {
        timestamp: now,
        clientName,
        channel,
        category,
        message,
      });
      await update(ref(database, `adminFollowUps/lastContacted/${clientId}`), {
        timestamp: now,
        clientName,
        channel,
        category,
      });
    } catch (e) {
      console.warn('Firebase error recording message timestamp:', e);
    }
  }

  // 3. Mirror into chat thread
  try {
    await sendChatMessage('admin', 'Sneha Dey (Nutritionist)', `[${channel.toUpperCase()}] To ${clientName}: ${message}`);
  } catch {}
}

/**
 * BOX 1 DATA LOADER:
 * Names of clients on 1-on-1 counselling --> their goals --> where did they meet --> their contact info
 */
export async function getRealCounsellingRows(): Promise<CounsellingClientRow[]> {
  const customers = await getRealFirebaseCustomers();
  const timestamps = await getClientContactTimestamps();

  const rows: CounsellingClientRow[] = [];

  for (const c of customers) {
    const goalsList = c.goalAssessment?.primaryGoals || [];
    const goalsStr = goalsList.length > 0 ? goalsList.join(', ') : (c.physicalActivity?.activityTrait || 'Hormonal & Muscle Health');
    
    // Meeting Point extraction: from booking / support / location
    const meetingPoint = 
      (c as any).counsellingRecord?.booking?.coffeeShopLocation ||
      (c as any).counsellingRecord?.booking?.meetingMode ||
      c.personalDetails?.address ||
      c.supportExpectations?.preferredContactMethod ||
      'Clinic / In-Person Consultation';

    const phone = c.personalDetails?.mobileNumber || 'No phone';
    const email = c.personalDetails?.emailAddress || 'No email';
    const contactInfo = timestamps[c.uid];
    const { days, needsReminder } = calculateReminderStatus(contactInfo?.timestamp);

    rows.push({
      id: c.uid,
      name: c.personalDetails?.fullName || 'Client',
      goals: goalsStr,
      meetingPoint,
      phone,
      email,
      lastMessageTimestamp: contactInfo?.timestamp || null,
      lastMessageChannel: contactInfo?.channel,
      daysSinceLastMessage: days,
      needsReminder,
    });
  }

  return rows;
}

/**
 * BOX 2 (SUB-BOX A) DATA LOADER:
 * Name --> Data (weight, height, body fat, etc.), muscle gain --> meeting point --> contact info
 */
export async function getRealLongTermDataRows(): Promise<LongTermDataClientRow[]> {
  const customers = await getRealFirebaseCustomers();
  const timestamps = await getClientContactTimestamps();

  const rows: LongTermDataClientRow[] = [];

  for (const c of customers) {
    const weight = c.personalDetails?.weight ? `${c.personalDetails.weight} kg` : '64 kg';
    const height = c.personalDetails?.height ? `${c.personalDetails.height} cm` : '165 cm';
    const bodyFat = c.personalDetails?.bodyFatPercentage != null ? `${c.personalDetails.bodyFatPercentage}% Body Fat` : '22% Fat';
    const biometricData = `${weight} • ${height} • ${bodyFat}`;

    // Muscle Gain status / goals
    const goalsList = c.goalAssessment?.primaryGoals || [];
    const muscleGain = goalsList.includes('Muscle Gain') 
      ? 'Muscle Gain (Active Target)' 
      : (c.physicalActivity?.activityTrait || 'Muscle Gain & Metabolic Reset');

    const meetingPoint = 
      (c as any).longTermRecord?.meetingPoint ||
      (c as any).counsellingRecord?.booking?.coffeeShopLocation ||
      c.personalDetails?.address ||
      c.supportExpectations?.preferredContactMethod ||
      'Online Video / In-Person Clinic';

    const phone = c.personalDetails?.mobileNumber || 'No phone';
    const email = c.personalDetails?.emailAddress || 'No email';
    const contactInfo = timestamps[c.uid];
    const { days, needsReminder } = calculateReminderStatus(contactInfo?.timestamp);

    rows.push({
      id: c.uid,
      name: c.personalDetails?.fullName || 'Client',
      biometricData,
      muscleGain,
      meetingPoint,
      phone,
      email,
      lastMessageTimestamp: contactInfo?.timestamp || null,
      lastMessageChannel: contactInfo?.channel,
      daysSinceLastMessage: days,
      needsReminder,
    });
  }

  return rows;
}

/**
 * BOX 2 (SUB-BOX B) DATA LOADER:
 * Counselling plan taken --> muscle gain etc, goal selected --> their contact info
 */
export async function getRealLongTermPlanRows(): Promise<LongTermPlanClientRow[]> {
  const customers = await getRealFirebaseCustomers();
  const timestamps = await getClientContactTimestamps();

  const rows: LongTermPlanClientRow[] = [];

  for (const c of customers) {
    // Determine plan taken
    const planTaken = 
      (c as any).longTermRecord?.activePackage?.name ||
      (c as any).longTermRecord?.packageType ||
      (c.commitment?.commitmentLevel ? `${c.commitment.commitmentLevel} Transformation Plan` : '3 Month Vitality & Reset Protocol');

    // Goals selected
    const goalsList = c.goalAssessment?.primaryGoals || [];
    const goalSelected = goalsList.length > 0 
      ? goalsList.join(' • ') 
      : 'Muscle Gain • Body Recomposition';

    const meetingPoint = 
      (c as any).counsellingRecord?.booking?.coffeeShopLocation ||
      c.supportExpectations?.preferredContactMethod ||
      'WhatsApp & Scheduled Clinic Slot';

    const phone = c.personalDetails?.mobileNumber || 'No phone';
    const email = c.personalDetails?.emailAddress || 'No email';
    const contactInfo = timestamps[c.uid];
    const { days, needsReminder } = calculateReminderStatus(contactInfo?.timestamp);

    rows.push({
      id: c.uid,
      name: c.personalDetails?.fullName || 'Client',
      planTaken,
      goalSelected,
      meetingPoint,
      phone,
      email,
      lastMessageTimestamp: contactInfo?.timestamp || null,
      lastMessageChannel: contactInfo?.channel,
      daysSinceLastMessage: days,
      needsReminder,
    });
  }

  return rows;
}

/**
 * Create a new real client directly into Firebase Realtime Database
 */
export async function createRealCustomerInFirebase(data: {
  fullName: string;
  email: string;
  mobile: string;
  goals: string[];
  meetingPoint: string;
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  planTaken?: string;
}): Promise<CustomerRecord> {
  const uid = `client_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const base = createDefaultCustomerRecord(uid, data.fullName.trim(), data.email.trim(), data.mobile.trim());

  const newRecord: CustomerRecord = {
    ...base,
    metadata: {
      ...base.metadata,
      onboardingCompleted: true,
      currentOnboardingStep: 11,
    },
    personalDetails: {
      ...base.personalDetails,
      fullName: data.fullName.trim(),
      mobileNumber: data.mobile.trim(),
      emailAddress: data.email.trim(),
      address: data.meetingPoint.trim(),
      height: data.height || 165,
      weight: data.weight || 64,
      bodyFatPercentage: data.bodyFatPercentage || 22,
    },
    goalAssessment: {
      ...base.goalAssessment,
      primaryGoals: data.goals.length > 0 ? data.goals : ['Muscle Gain', 'Fat Loss'],
    },
  };

  // Add custom counselling and long-term subnodes
  (newRecord as any).counsellingRecord = {
    booking: {
      coffeeShopLocation: data.meetingPoint,
      meetingMode: 'In-Person Coffee Shop / Clinic',
      selectedDate: new Date().toISOString().split('T')[0],
      selectedTimeSlot: '11:00 AM - 12:00 PM',
    },
    goals: {
      selectedGoals: data.goals,
    },
  };

  (newRecord as any).longTermRecord = {
    packageType: data.planTaken || '3 Month Vitality Reset',
    meetingPoint: data.meetingPoint,
    activePackage: {
      name: data.planTaken || '3 Month Vitality Reset',
      durationMonths: 3,
    },
  };

  // Save to Firebase RTDB
  if (isFirebaseConfigured && database) {
    try {
      await set(ref(database, `customers/${uid}`), newRecord);
    } catch (e) {
      console.warn('Firebase set error:', e);
    }
  }

  // Save to LocalStorage
  try {
    localStorage.setItem(`she_nourishes_cust_${uid}`, JSON.stringify(newRecord));
    const regRaw = localStorage.getItem('she_nourishes_client_registry');
    const registry: string[] = regRaw ? JSON.parse(regRaw) : [];
    if (!registry.includes(uid)) {
      registry.push(uid);
      localStorage.setItem('she_nourishes_client_registry', JSON.stringify(registry));
    }
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  return newRecord;
}
