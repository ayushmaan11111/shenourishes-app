import { ref, set, get } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import { getAllCustomerRecords } from './customerService';
import type { LeadRegistrationRecord, LongTermReminderRecord } from '../types/longTermSupport';

const LEADS_STORAGE_KEY = 'she_nourishes_lead_registrations';
const REMINDERS_STORAGE_KEY = 'she_nourishes_long_term_reminders';

const FAKE_LEAD_IDS = new Set([
  'lead_1', 'lead_2', 'lead_3', 'lead_4', 'lead_5',
  'lead_6', 'lead_7', 'lead_8', 'lead_9', 'lead_10'
]);

const FAKE_NAMES = new Set([
  'Aarav Sharma', 'Priya Mehta', 'Rohan Verma', 'Neha Gupta', 'Karan Singh',
  'Ananya Iyer', 'Vikram Joshi', 'Simran Kaur', 'Aditya Patil', 'Pooja Nair'
]);

/**
 * Retrieves ONLY real user leads:
 * 1. Converts actual registered users from CustomerRecords (Firebase/LocalStorage).
 * 2. Merges with manually created real leads saved by Admin.
 * 3. Filters out any legacy fake/dummy test entries.
 */
export async function getLeadRegistrations(): Promise<LeadRegistrationRecord[]> {
  const leadMap = new Map<string, LeadRegistrationRecord>();

  // 1. Fetch real customer records from database/storage
  try {
    const customers = await getAllCustomerRecords();
    for (const c of customers) {
      if (
        c && 
        c.personalDetails && 
        c.personalDetails.fullName && 
        !c.uid.includes('demo') && 
        !FAKE_NAMES.has(c.personalDetails.fullName)
      ) {
        const leadId = `lead_cust_${c.uid}`;
        const createdMs = typeof c.metadata?.createdAt === 'number' ? c.metadata.createdAt : Date.now();
        const regDate = c.personalDetails.date || new Date(createdMs).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        leadMap.set(leadId, {
          id: leadId,
          name: c.personalDetails.fullName,
          phone: c.personalDetails.mobileNumber || 'Not provided',
          email: c.personalDetails.emailAddress || 'Not provided',
          source: c.supportExpectations?.preferredContactMethod || 'She Nourishes App Registration',
          interest: c.goalAssessment?.primaryGoals?.[0] || 'Clinical Nutrition & Health',
          registrationDate: regDate,
          followUpReminder: 'Scheduled in Portal',
          status: c.metadata?.onboardingCompleted ? 'Interested' : 'New Lead',
          actionPlan: {
            counsellingPackage: false,
            longTermPackage: true,
            state: 'On Process',
          },
          notes: (c.goalAssessment?.primaryGoals || []).join(' • ') || 'Verified client app user',
        });
      }
    }
  } catch (err) {
    console.warn('Error fetching customer records for leads:', err);
  }

  // 2. Fetch any manually added real leads from Firebase / LocalStorage
  let storedLeads: LeadRegistrationRecord[] = [];
  try {
    if (isFirebaseConfigured && database) {
      const dbRef = ref(database, 'databook/leads');
      const snap = await get(dbRef);
      if (snap.exists()) {
        const val = snap.val();
        storedLeads = Array.isArray(val) ? val : Object.values(val);
      }
    }
  } catch (e) {
    console.warn('Firebase error fetching leads, falling back:', e);
  }

  if (storedLeads.length === 0) {
    const local = localStorage.getItem(LEADS_STORAGE_KEY);
    if (local) {
      try {
        storedLeads = JSON.parse(local);
      } catch {
        // fallback
      }
    }
  }

  // Filter out any fake/dummy data
  for (const l of storedLeads) {
    if (l && l.id && !FAKE_LEAD_IDS.has(l.id) && !FAKE_NAMES.has(l.name)) {
      leadMap.set(l.id, l);
    }
  }

  const result = Array.from(leadMap.values());
  // Save cleansed list
  saveLeadRegistrations(result);
  return result;
}

export async function saveLeadRegistrations(leads: LeadRegistrationRecord[]): Promise<void> {
  const filtered = leads.filter(l => l && !FAKE_LEAD_IDS.has(l.id) && !FAKE_NAMES.has(l.name));
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(filtered));
  try {
    if (isFirebaseConfigured && database) {
      const dbRef = ref(database, 'databook/leads');
      await set(dbRef, filtered);
    }
  } catch (e) {
    console.warn('Firebase error saving leads:', e);
  }
}

export async function addLeadRegistration(newLead: LeadRegistrationRecord): Promise<LeadRegistrationRecord[]> {
  const current = await getLeadRegistrations();
  const updated = [newLead, ...current.filter(l => l.id !== newLead.id)];
  await saveLeadRegistrations(updated);
  return updated;
}

export async function removeLeadRegistration(leadId: string): Promise<LeadRegistrationRecord[]> {
  const current = await getLeadRegistrations();
  const updated = current.filter(l => l.id !== leadId);
  await saveLeadRegistrations(updated);
  return updated;
}

export const INITIAL_REMINDERS: LongTermReminderRecord[] = [
  {
    id: 'rem_1',
    clientId: 'cust_aarav',
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    packageTaken: '3-Month Plan',
    packageDurationMonths: 3,
    serviceStartDate: '24 May 2025',
    serviceEndDate: '23 Aug 2025',
    status: 'Completed',
    daysLeftOrOverdue: '2 Days Overdue',
    reminderDate: '25 Aug 2025',
    channel: 'WhatsApp',
    messageOfferToSend: 'Hi Aarav, continue your transformation with our 3-Month Plan & get 10% off!',
    reminderSent: 'Yes',
    clientResponse: 'Interested',
    nextFollowUp: '27 Aug 2025',
    notes: 'Prefers Morning',
  },
  {
    id: 'rem_2',
    clientId: 'cust_neha',
    name: 'Neha Gupta',
    phone: '+91 90123 45678',
    packageTaken: '2-Month Plan',
    packageDurationMonths: 2,
    serviceStartDate: '24 Jun 2025',
    serviceEndDate: '23 Aug 2025',
    status: 'Completed',
    daysLeftOrOverdue: '2 Days Overdue',
    reminderDate: '25 Aug 2025',
    channel: 'Email',
    messageOfferToSend: 'Hi Neha, stay on track with our 2-Month Extended Plan. Special offer for you!',
    reminderSent: 'Yes',
    clientResponse: 'Replied',
    nextFollowUp: '29 Aug 2025',
    notes: 'Email Preferred',
  },
  {
    id: 'rem_3',
    clientId: 'cust_simran',
    name: 'Simran Kaur',
    phone: '+91 95555 66778',
    packageTaken: '6-Month Plan',
    packageDurationMonths: 6,
    serviceStartDate: '10 Mar 2025',
    serviceEndDate: '09 Sep 2025',
    status: 'Active',
    daysLeftOrOverdue: '-12 Days Left',
    reminderDate: '01 Sep 2025',
    channel: 'WhatsApp',
    messageOfferToSend: 'Upcoming completion reminder for continued progress.',
    reminderSent: 'Scheduled',
    clientResponse: 'Pending',
    nextFollowUp: '01 Sep 2025',
    notes: 'Loves Reminders',
  },
  {
    id: 'rem_4',
    clientId: 'cust_aditya',
    name: 'Aditya Patil',
    phone: '+91 98989 11223',
    packageTaken: '1-Month Plan',
    packageDurationMonths: 1,
    serviceStartDate: '20 Jul 2025',
    serviceEndDate: '19 Aug 2025',
    status: 'Completed',
    daysLeftOrOverdue: '6 Days Overdue',
    reminderDate: '21 Aug 2025',
    channel: 'SMS',
    messageOfferToSend: 'Hi Aditya, follow up on your nutrition plan. Upgrade to 3-Month Plan & save more!',
    reminderSent: 'Yes',
    clientResponse: 'Not Interested',
    nextFollowUp: '28 Aug 2025',
    notes: 'Busy Schedule',
  },
  {
    id: 'rem_5',
    clientId: 'cust_pooja',
    name: 'Pooja Nair',
    phone: '+91 97654 32109',
    packageTaken: '1-Year Plan',
    packageDurationMonths: 12,
    serviceStartDate: '01 Jan 2025',
    serviceEndDate: '31 Dec 2025',
    status: 'Active',
    daysLeftOrOverdue: '-128 Days Left',
    reminderDate: '01 Dec 2025',
    channel: 'Email',
    messageOfferToSend: 'Year-end check-in & renewal offer coming soon.',
    reminderSent: 'Scheduled',
    clientResponse: 'Pending',
    nextFollowUp: '01 Dec 2025',
    notes: 'Check-in Monthly',
  },
  {
    id: 'rem_6',
    clientId: 'cust_rohan',
    name: 'Rohan Verma',
    phone: '+91 99876 54321',
    packageTaken: '9-Month Plan',
    packageDurationMonths: 9,
    serviceStartDate: '15 Jan 2025',
    serviceEndDate: '14 Oct 2025',
    status: 'Active',
    daysLeftOrOverdue: '-50 Days Left',
    reminderDate: '01 Oct 2025',
    channel: 'WhatsApp',
    messageOfferToSend: 'Almost there! Continue your journey with our long-term plan.',
    reminderSent: 'Scheduled',
    clientResponse: 'Pending',
    nextFollowUp: '01 Oct 2025',
    notes: 'Highly Motivated',
  },
];

export async function getLongTermReminders(): Promise<LongTermReminderRecord[]> {
  const reminderMap = new Map<string, LongTermReminderRecord>();

  // 1. Fetch real Customer Records from Firebase Realtime Database
  try {
    const customers = await getAllCustomerRecords();
    for (const c of customers) {
      if (
        c &&
        c.personalDetails?.fullName &&
        !c.uid.includes('demo') &&
        !c.uid.includes('fake') &&
        !FAKE_NAMES.has(c.personalDetails.fullName.trim())
      ) {
        const id = `rem_${c.uid}`;
        const createdMs = typeof c.metadata?.createdAt === 'number' ? c.metadata.createdAt : Date.now();
        const startDate = new Date(createdMs).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        
        // Duration from commitment or default 3 months
        const durationMonths = (c.commitment?.commitmentLevel === 'Highly Committed' || c.commitment?.commitmentLevel === '100% Committed') ? 6 : 3;
        const endMs = createdMs + durationMonths * 30 * 24 * 60 * 60 * 1000;
        const endDate = new Date(endMs).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        
        const nowMs = Date.now();
        const diffDays = Math.round((endMs - nowMs) / (24 * 60 * 60 * 1000));
        const daysLeftOrOverdue = diffDays < 0 ? `${Math.abs(diffDays)} Days Overdue` : `${diffDays} Days Left`;
        const isCompleted = diffDays < 0;

        reminderMap.set(id, {
          id,
          clientId: c.uid,
          name: c.personalDetails.fullName,
          phone: c.personalDetails.mobileNumber || 'Not provided',
          packageTaken: (c as any).longTermRecord?.activePackage?.name || `${durationMonths}-Month Clinical Plan`,
          packageDurationMonths: durationMonths,
          serviceStartDate: startDate,
          serviceEndDate: endDate,
          status: isCompleted ? 'Completed' : 'Active',
          daysLeftOrOverdue,
          reminderDate: new Date(endMs + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          channel: 'WhatsApp',
          messageOfferToSend: `Hi ${c.personalDetails.fullName}, continue your progress with our clinical nutrition follow-up protocol.`,
          reminderSent: (c as any).lastContacted ? 'Yes' : 'Scheduled',
          clientResponse: 'Pending',
          nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          notes: (c.goalAssessment?.primaryGoals || []).join(' • ') || 'Real patient from Firebase',
        });
      }
    }
  } catch (err) {
    console.warn('Error fetching customers for reminders:', err);
  }

  // 2. Merge any custom saved reminders from Firebase / LocalStorage
  let storedReminders: LongTermReminderRecord[] = [];
  try {
    if (isFirebaseConfigured && database) {
      const dbRef = ref(database, 'databook/reminders');
      const snap = await get(dbRef);
      if (snap.exists()) {
        const val = snap.val();
        storedReminders = Array.isArray(val) ? val : Object.values(val);
      }
    }
  } catch (e) {
    console.warn('Firebase error fetching reminders:', e);
  }

  if (storedReminders.length === 0) {
    const local = localStorage.getItem(REMINDERS_STORAGE_KEY);
    if (local) {
      try {
        storedReminders = JSON.parse(local);
      } catch {}
    }
  }

  // Strictly filter out any fake names or mock IDs
  for (const r of storedReminders) {
    if (r && r.name && !FAKE_NAMES.has(r.name) && !FAKE_LEAD_IDS.has(r.id)) {
      reminderMap.set(r.id, r);
    }
  }

  return Array.from(reminderMap.values());
}

export async function saveLongTermReminders(reminders: LongTermReminderRecord[]): Promise<void> {
  const filtered = reminders.filter(r => r && !FAKE_NAMES.has(r.name) && !FAKE_LEAD_IDS.has(r.id));
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(filtered));
  try {
    if (isFirebaseConfigured && database) {
      const dbRef = ref(database, 'databook/reminders');
      await set(dbRef, filtered);
    }
  } catch (e) {
    console.warn('Firebase error saving reminders:', e);
  }
}
