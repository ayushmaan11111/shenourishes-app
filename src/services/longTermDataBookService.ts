import { ref, get, set } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import { getAllCustomerRecords } from './customerService';
import { sendClinicalFollowUpEmail } from './resendEmailService';

export type PackageDurationOption = '1 Month' | '2 Months' | '3 Months' | '6 Months' | '9 Months' | '12 Months';

export interface LongTermSupportLead {
  id: string;
  name: string;
  age: number;
  date: string; // Lead date
  decidedPackageOption: PackageDurationOption;
  locationOfMeeting: string;
  goal: string;
  contactNo: string;
  email: string;
  status: 'New Lead' | 'Follow-up Pending' | 'Contacted' | 'Interested' | 'Converted to Sold';
  dailyReminderActive: boolean;
  reminderDispatchMode: 'auto' | 'manual' | 'scripted';
  notes?: string;
  createdAt: number;
}

export interface LongTermSoldClient {
  id: string;
  clientId?: string;
  name: string;
  age?: number;
  startDate: string; // e.g. "2025-05-20" or "20 May 2025"
  endDate: string;   // e.g. "2025-08-19" or "19 Aug 2025"
  packageTaken: PackageDurationOption;
  packageDurationMonths: number;
  totalPackageFee: number;
  perMonthFee: number;
  contactNo: string;
  email: string;
  locationOfMeeting?: string;
  goal?: string;
  status: 'Active' | 'Ending Soon' | 'Completed' | 'Renewed';
  daysRemaining: number;
  validityAlertSent: boolean;
  lastMessageChannel?: 'whatsapp' | 'sms' | 'email';
  lastMessageSentAt?: number;
  notes?: string;
}

export interface ScriptedDailyTemplate {
  day: number;
  title: string;
  message: string;
}

export const SCRIPTED_DAILY_TEMPLATES: ScriptedDailyTemplate[] = [
  {
    day: 1,
    title: 'Day 1: Consultation Recap & Welcome',
    message: 'Hi {name}, thank you for discussing your transformation goals ({goal}) today with Sneha Dey! We are designing your tailored {package} protocol. Do you have your recent blood reports handy?',
  },
  {
    day: 2,
    title: 'Day 2: Clinical Nutrition & Metabolic Overview',
    message: 'Hi {name}, following up on your clinical consultation! For your target in {goal}, clinical meal planning and scheduled follow-ups will maximize your results. Let us know if you would like us to reserve your onboarding slot.',
  },
  {
    day: 3,
    title: 'Day 3: Package Recommendation & Diagnostics Plan',
    message: 'Hi {name}, Sneha Dey here! For {package}, your program includes complete fasting sugar, vitamin B12, D25 hydroxyl & lipoprotein diagnostics plus personalized exercise plans. Ready to get started?',
  },
  {
    day: 5,
    title: 'Day 5: Exclusive Enrolment Incentive',
    message: 'Hi {name}, we are holding your spot for the {package} long-term transformation protocol. Complete your onboarding this week to receive your complimentary welcome fitness kit and diagnostics voucher!',
  },
  {
    day: 7,
    title: 'Day 7: Final Transformation Onboarding Window',
    message: 'Hi {name}, our next coaching cohort for {goal} starts this week. Let us know today so we can finalize your nutrition chart and diagnostic home pickup slot!',
  },
];

const LEADS_STORAGE_KEY = 'she_nourishes_lt_leads';
const SOLD_STORAGE_KEY = 'she_nourishes_lt_sold';

export const PACKAGE_PRICING_MAP: Record<PackageDurationOption, { months: number; totalFee: number }> = {
  '1 Month': { months: 1, totalFee: 25000 },
  '2 Months': { months: 2, totalFee: 35599 },
  '3 Months': { months: 3, totalFee: 51199 },
  '6 Months': { months: 6, totalFee: 91999 },
  '9 Months': { months: 9, totalFee: 131999 },
  '12 Months': { months: 12, totalFee: 171999 },
};

function calculateDaysRemaining(endDateStr: string): { days: number; status: LongTermSoldClient['status'] } {
  try {
    const endMs = new Date(endDateStr).getTime();
    if (isNaN(endMs)) return { days: 30, status: 'Active' };
    const now = Date.now();
    const diff = endMs - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) {
      return { days, status: 'Completed' };
    } else if (days <= 14) {
      return { days, status: 'Ending Soon' };
    }
    return { days, status: 'Active' };
  } catch {
    return { days: 30, status: 'Active' };
  }
}

/**
 * Fetch Long-Term Support Leads from Firebase RTDB & LocalStorage
 */
export async function getLongTermLeads(): Promise<LongTermSupportLead[]> {
  const map = new Map<string, LongTermSupportLead>();

  // 1. Fetch from Firebase
  try {
    if (isFirebaseConfigured && database) {
      const snap = await get(ref(database, 'databook/long_term_leads'));
      if (snap.exists()) {
        const val = snap.val();
        const list: LongTermSupportLead[] = Array.isArray(val) ? val : Object.values(val);
        for (const item of list) {
          if (item && item.id) map.set(item.id, item);
        }
      }
    }
  } catch (err) {
    console.warn('Firebase error loading long term leads:', err);
  }

  // 2. LocalStorage backup
  try {
    const local = localStorage.getItem(LEADS_STORAGE_KEY);
    if (local) {
      const parsed: LongTermSupportLead[] = JSON.parse(local);
      for (const item of parsed) {
        if (item && item.id && !map.has(item.id)) map.set(item.id, item);
      }
    }
  } catch {}

  // 3. Populate from registered Firebase customer records if empty
  if (map.size === 0) {
    try {
      const customers = await getAllCustomerRecords();
      for (const c of customers) {
        if (c && c.personalDetails?.fullName && !c.uid.includes('demo')) {
          const leadId = `lt_lead_${c.uid}`;
          const lead: LongTermSupportLead = {
            id: leadId,
            name: c.personalDetails.fullName,
            age: c.personalDetails.age || 29,
            date: c.personalDetails.date || new Date().toISOString().split('T')[0],
            decidedPackageOption: '3 Months',
            locationOfMeeting: c.personalDetails.address || 'Clinic / Coffee Shop In-Person',
            goal: (c.goalAssessment?.primaryGoals || ['Muscle Gain & Fat Loss'])[0] || 'Clinical Transformation',
            contactNo: c.personalDetails.mobileNumber || '+91 98765 43210',
            email: c.personalDetails.emailAddress || 'client@example.com',
            status: 'Interested',
            dailyReminderActive: true,
            reminderDispatchMode: 'auto',
            notes: 'Registered in She Nourishes platform',
            createdAt: Date.now(),
          };
          map.set(leadId, lead);
        }
      }
    } catch {}
  }

  const result = Array.from(map.values());
  return result;
}

/**
 * Save Long-Term Support Leads to Firebase & LocalStorage
 */
export async function saveLongTermLeads(leads: LongTermSupportLead[]): Promise<void> {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  try {
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'databook/long_term_leads'), leads);
    }
  } catch (e) {
    console.warn('Error saving long term leads to Firebase:', e);
  }
}

/**
 * Add or Update a Long-Term Lead
 */
export async function addOrUpdateLongTermLead(lead: LongTermSupportLead): Promise<LongTermSupportLead[]> {
  const current = await getLongTermLeads();
  const index = current.findIndex(l => l.id === lead.id);
  let updated: LongTermSupportLead[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = lead;
  } else {
    updated = [lead, ...current];
  }
  await saveLongTermLeads(updated);
  return updated;
}

/**
 * Delete a Long-Term Lead
 */
export async function deleteLongTermLead(leadId: string): Promise<LongTermSupportLead[]> {
  const current = await getLongTermLeads();
  const updated = current.filter(l => l.id !== leadId);
  await saveLongTermLeads(updated);
  return updated;
}

/**
 * Fetch Long-Term Sold Clients
 */
export async function getLongTermSoldClients(): Promise<LongTermSoldClient[]> {
  const map = new Map<string, LongTermSoldClient>();

  // 1. Fetch from Firebase
  try {
    if (isFirebaseConfigured && database) {
      const snap = await get(ref(database, 'databook/long_term_sold'));
      if (snap.exists()) {
        const val = snap.val();
        const list: LongTermSoldClient[] = Array.isArray(val) ? val : Object.values(val);
        for (const item of list) {
          if (item && item.id) {
            const { days, status } = calculateDaysRemaining(item.endDate);
            map.set(item.id, { ...item, daysRemaining: days, status });
          }
        }
      }
    }
  } catch (err) {
    console.warn('Firebase error loading long term sold:', err);
  }

  // 2. LocalStorage backup
  try {
    const local = localStorage.getItem(SOLD_STORAGE_KEY);
    if (local) {
      const parsed: LongTermSoldClient[] = JSON.parse(local);
      for (const item of parsed) {
        if (item && item.id && !map.has(item.id)) {
          const { days, status } = calculateDaysRemaining(item.endDate);
          map.set(item.id, { ...item, daysRemaining: days, status });
        }
      }
    }
  } catch {}

  // 3. Fallback seeds if brand new
  if (map.size === 0) {
    const today = new Date();
    const plus3Months = new Date(today);
    plus3Months.setMonth(today.getMonth() + 3);
    const plus6Months = new Date(today);
    plus6Months.setMonth(today.getMonth() + 6);
    const endingSoonDate = new Date(today);
    endingSoonDate.setDate(today.getDate() + 5);

    const seeds: LongTermSoldClient[] = [
      {
        id: 'lt_sold_1',
        name: 'Sneha Kulkarni',
        age: 31,
        startDate: today.toISOString().split('T')[0],
        endDate: plus3Months.toISOString().split('T')[0],
        packageTaken: '3 Months',
        packageDurationMonths: 3,
        totalPackageFee: 51199,
        perMonthFee: Math.round(51199 / 3),
        contactNo: '+91 98201 45678',
        email: 'sneha.k@example.com',
        locationOfMeeting: 'Blue Tokai Cafe & Clinic',
        goal: 'PCOS & Muscle Tone Transformation',
        status: 'Active',
        daysRemaining: 90,
        validityAlertSent: true,
      },
      {
        id: 'lt_sold_2',
        name: 'Ritu Deshmukh',
        age: 36,
        startDate: new Date(Date.now() - 160 * 86400000).toISOString().split('T')[0],
        endDate: endingSoonDate.toISOString().split('T')[0],
        packageTaken: '6 Months',
        packageDurationMonths: 6,
        totalPackageFee: 91999,
        perMonthFee: Math.round(91999 / 6),
        contactNo: '+91 98112 33445',
        email: 'ritu.d@example.com',
        locationOfMeeting: 'In-Person Nutrition Clinic',
        goal: 'Hormonal Reset & Weight Loss',
        status: 'Ending Soon',
        daysRemaining: 5,
        validityAlertSent: true,
      },
      {
        id: 'lt_sold_3',
        name: 'Meera Sengupta',
        age: 28,
        startDate: today.toISOString().split('T')[0],
        endDate: plus6Months.toISOString().split('T')[0],
        packageTaken: '6 Months',
        packageDurationMonths: 6,
        totalPackageFee: 91999,
        perMonthFee: Math.round(91999 / 6),
        contactNo: '+91 98450 78901',
        email: 'meera.s@example.com',
        locationOfMeeting: 'Online Consultation & Lab Booking',
        goal: 'Metabolic Health & Muscle Gain',
        status: 'Active',
        daysRemaining: 180,
        validityAlertSent: true,
      },
    ];

    for (const s of seeds) map.set(s.id, s);
  }

  const result = Array.from(map.values());
  return result;
}

/**
 * Save Long-Term Sold Clients
 */
export async function saveLongTermSoldClients(clients: LongTermSoldClient[]): Promise<void> {
  localStorage.setItem(SOLD_STORAGE_KEY, JSON.stringify(clients));
  try {
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'databook/long_term_sold'), clients);
    }
  } catch (e) {
    console.warn('Error saving long term sold clients to Firebase:', e);
  }
}

/**
 * Add or Update Long-Term Sold Client
 */
export async function addOrUpdateLongTermSoldClient(client: LongTermSoldClient): Promise<LongTermSoldClient[]> {
  const current = await getLongTermSoldClients();
  const index = current.findIndex(c => c.id === client.id);
  let updated: LongTermSoldClient[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = client;
  } else {
    updated = [client, ...current];
  }
  await saveLongTermSoldClients(updated);
  return updated;
}

/**
 * Delete a Sold Client
 */
export async function deleteLongTermSoldClient(clientId: string): Promise<LongTermSoldClient[]> {
  const current = await getLongTermSoldClients();
  const updated = current.filter(c => c.id !== clientId);
  await saveLongTermSoldClients(updated);
  return updated;
}

/**
 * Send Multi-Channel Message (WhatsApp, SMS, Email)
 */
export async function dispatchClientCommunication(params: {
  clientName: string;
  phone: string;
  email: string;
  channel: 'whatsapp' | 'sms' | 'email';
  subject: string;
  message: string;
}): Promise<void> {
  const { clientName, phone, email, channel, subject, message } = params;
  const cleanPhone = phone.replace(/\D/g, '');

  if (channel === 'whatsapp') {
    const encoded = encodeURIComponent(message);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  } else if (channel === 'sms') {
    const encoded = encodeURIComponent(message);
    window.open(`sms:${cleanPhone}?body=${encoded}`, '_self');
  } else if (channel === 'email') {
    if (!email || email.includes('example.com') || email === 'No email') {
      alert(`No verified email on file for ${clientName}. Please choose WhatsApp or SMS.`);
      return;
    }
    await sendClinicalFollowUpEmail({
      clientName,
      clientEmail: email,
      category: 'Long-Term Support',
      subject,
      message,
    });
  }
}
