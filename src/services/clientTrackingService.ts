/**
 * Client Tracking Service
 * Manages Follow-Up Sessions, Health Tests (HbA1c, Vit D/B12, Lp(a)),
 * Gift Vouchers Delivery Tracker, 7-Day Package Expiry Alerts,
 * and Admin Scripted Daily WhatsApp Messages.
 * Syncs seamlessly with Firebase Realtime Database and LocalStorage.
 */

import { database, isFirebaseConfigured } from './firebase';
import { ref, get, update } from 'firebase/database';

export interface FollowUpSessionItem {
  sessionNumber: number;
  scheduledDate: string;
  timeSlot: string;
  status: 'Upcoming' | 'Scheduled' | 'Completed ✓' | 'Pending';
  interactionRecord?: string;
  whatsappEvidence?: string;
  isPinnedByClient?: boolean;
  completedAt?: number;
}

export type HealthTestStatus = 'Pending' | 'Test Completed ✓' | 'Report Submitted ✓' | 'Report Reviewed ✓';

export type HealthTestCategory =
  | 'HbA1c / Fasting Blood Sugar'
  | 'Complete Lipid Profile'
  | 'Vitamin Profile (Vit D & B12)'
  | 'Lipoprotein(a) [Lp(a)]'
  | 'Other';

export interface HealthTestItem {
  id: string;
  testName: string;
  category: HealthTestCategory;
  status: HealthTestStatus;
  scheduledPhase: string;
  scheduledDate: string;
  reportUrl?: string;
  reportNotes?: string;
  reviewedByAdmin?: boolean;
  reviewedAt?: number;
  lipidDetails?: {
    totalCholesterol?: number;
    triglycerides?: number;
    hdl?: number;
    ldl?: number;
    vldl?: number;
  };
}

export type GiftDeliveryStatus = 'Selected' | 'Dispatched' | 'Delivered' | 'Client Confirmed ✓';

export interface GiftDeliveryItem {
  id: string;
  giftName: string;
  iconName: string;
  status: GiftDeliveryStatus;
  deliveryDate?: string;
  trackingNumber?: string;
  clientConfirmedAt?: number;
}

export interface ScriptedDailyMessage {
  dayNumber: number;
  title: string;
  category: 'Good Morning' | 'Motivational' | 'Guidance';
  messageText: string;
  sentStatus: 'Pending' | 'Sent ✓';
  sentAt?: number;
}

export interface ClientTrackingRecord {
  clientId: string;
  clientName: string;
  packageDurationMonths: number;
  totalFollowUpSessions: number;
  packageStartDate: string;
  packageEndDate: string;
  sessions: FollowUpSessionItem[];
  healthTests: HealthTestItem[];
  gifts: GiftDeliveryItem[];
  scriptedMessages: ScriptedDailyMessage[];
  lastUpdated: number;
}

const STORAGE_PREFIX = 'she_nourishes_tracking_hub_';

// 10 Scripted Daily Follow-Up Messages for Admin WhatsApp Follow-up Box
export const DEFAULT_SCRIPTED_MESSAGES: ScriptedDailyMessage[] = [
  {
    dayNumber: 1,
    title: 'Day 1: Welcome & Morning Kickoff',
    category: 'Good Morning',
    messageText: 'Good morning! ☀️ Welcome to Day 1 of your nutrition journey with She Nourishes. Start your morning with 500ml of lukewarm water and take 5 minutes to review your personalized meal plan. We are excited for your transformation!',
    sentStatus: 'Pending',
  },
  {
    dayNumber: 2,
    title: 'Day 2: Morning Hydration & Breakfast Adherence',
    category: 'Good Morning',
    messageText: 'Good morning! 🥗 How was your first day? Remember, breakfast sets your metabolic tone for the day. Please log your breakfast in the app once you finish, and keep your water bottle nearby!',
    sentStatus: 'Pending',
  },
  {
    dayNumber: 3,
    title: 'Day 3: Mid-Week Adherence & Protein Anchor',
    category: 'Motivational',
    messageText: 'Hello! 💪 Consistency is where real progress happens. Today, make sure every main meal has your prescribed protein portion. If you feel like snacking, check your customized snack alternatives in the app.',
    sentStatus: 'Pending',
  },
  {
    dayNumber: 4,
    title: 'Day 4: Digestive Health & Fluid Intake',
    category: 'Guidance',
    messageText: 'Good afternoon! 💧 Proper hydration is essential for nutrient absorption and preventing afternoon fatigue. Aim for at least 2.5 to 3 liters of water today. Let me know how your digestion has been feeling!',
    sentStatus: 'Pending',
  },
  {
    dayNumber: 5,
    title: 'Day 5: Managing Evening Cravings & Routine',
    category: 'Guidance',
    messageText: 'Hi there! 🌙 If you face post-dinner sugar cravings, try a warm cup of herbal chamomile tea or your night support routine. A 10-minute walk post-dinner also dramatically improves glycemic control!',
    sentStatus: 'Pending',
  },
  {
    dayNumber: 6,
    title: 'Day 6: Activity & Movement Check-In',
    category: 'Motivational',
    messageText: 'Good morning! 🏃‍♀️ Movement is medicine. Even on busy days, 30 minutes of brisk walking or yoga will amplify your metabolic rate. Keep going strong — you are doing wonderful!',
    sentStatus: 'Pending',
  },
  {
    dayNumber: 7,
    title: 'Day 7: Week 1 Milestone & Weekly Progress',
    category: 'Motivational',
    messageText: 'Congratulations on completing Week 1! 🎉 You have laid the foundation for long-term health. Please log your weight and waist measurements in the progress tab so we can celebrate your first week wins.',
    sentStatus: 'Pending',
  },
  {
    dayNumber: 8,
    title: 'Day 8: Week 2 Momentum & Mindset',
    category: 'Good Morning',
    messageText: 'Good morning! ☀️ Entering Week 2 with clarity and focus. Nutrition is not about restriction; it is about nourishing your body with what it truly needs. Let us make this week even better.',
    sentStatus: 'Pending',
  },
  {
    dayNumber: 9,
    title: 'Day 9: Smart Prep & Portion Control',
    category: 'Guidance',
    messageText: 'Hi! 🥑 Quick clinical tip: Measuring your portions for the first two weeks builds lifelong intuitive eating skills. Review your recipe calorie breakdown in the app if you need a refresher.',
    sentStatus: 'Pending',
  },
  {
    dayNumber: 10,
    title: 'Day 10: 10-Day Transformation Check-In',
    category: 'Motivational',
    messageText: '10 Days of dedication achieved! 🌟 Your metabolic rhythm is stabilizing, and your discipline is shining through. Let us schedule our next follow-up session to adjust your macros and celebrate!',
    sentStatus: 'Pending',
  },
];

export function getSessionCountForDuration(months: number): number {
  switch (months) {
    case 1: return 6;
    case 2: return 16;
    case 3: return 21;
    case 6: return 41;
    case 9: return 61;
    case 12: return 104;
    default: return 6;
  }
}

export function getDefaultGiftsForDuration(months: number): GiftDeliveryItem[] {
  const gifts: GiftDeliveryItem[] = [
    { id: 'gift_bag', giftName: 'Gym Bag', iconName: 'bag', status: 'Dispatched', deliveryDate: 'Sep 28, 2026', trackingNumber: 'SN-DEL-89412' }
  ];
  if (months >= 6) {
    gifts.push({ id: 'gift_watch', giftName: 'Smartwatch', iconName: 'watch', status: 'Selected', deliveryDate: 'Oct 15, 2026', trackingNumber: 'SN-DEL-91204' });
  }
  if (months >= 9) {
    gifts.push({ id: 'gift_shaker', giftName: 'Nutritional Shaker', iconName: 'shaker', status: 'Selected', deliveryDate: 'Oct 20, 2026', trackingNumber: 'SN-DEL-95411' });
  }
  if (months >= 12) {
    gifts.push({ id: 'gift_ipod', giftName: 'Apple iPod', iconName: 'ipod', status: 'Selected', deliveryDate: 'Nov 01, 2026', trackingNumber: 'SN-DEL-99881' });
  }
  return gifts;
}

export function createDefaultTrackingRecord(
  clientId: string,
  clientName: string = 'Sneha De',
  packageMonths: number = 1
): ClientTrackingRecord {
  const sessionCount = getSessionCountForDuration(packageMonths);
  const now = new Date();
  const startDateStr = now.toISOString().split('T')[0];
  
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + packageMonths);
  const endDateStr = endDate.toISOString().split('T')[0];

  // Generate sessions
  const sessions: FollowUpSessionItem[] = [];
  for (let i = 1; i <= sessionCount; i++) {
    const sDate = new Date(now);
    sDate.setDate(sDate.getDate() + (i - 1) * Math.max(3, Math.floor((packageMonths * 30) / sessionCount)));
    sessions.push({
      sessionNumber: i,
      scheduledDate: sDate.toISOString().split('T')[0],
      timeSlot: i % 2 === 0 ? '11:00 AM – 11:45 AM' : '04:30 PM – 05:15 PM',
      status: i === 1 ? 'Completed ✓' : i === 2 ? 'Scheduled' : 'Upcoming',
      interactionRecord: i === 1 
        ? 'Initial clinical intake and dietary adherence discussed. Calorie target confirmed at 1,650 kcal.' 
        : i === 2 
        ? 'Mid-week check on protein timing and glycemic stability.' 
        : undefined,
      whatsappEvidence: i === 1 ? 'WhatsApp Voice & Chat Record verified on 22/09/2026' : undefined,
      isPinnedByClient: i === 2,
      completedAt: i === 1 ? Date.now() - 86400000 * 2 : undefined,
    });
  }

  // Generate required Health Tests
  const healthTests: HealthTestItem[] = [
    {
      id: 'test_hba1c_m1',
      testName: 'HbA1c Test (Glycated Hemoglobin) / Fasting Blood Glucose',
      category: 'HbA1c / Fasting Blood Sugar',
      status: 'Test Completed ✓',
      scheduledPhase: 'Month 1 (Baseline)',
      scheduledDate: startDateStr,
      reportUrl: 'https://example.com/reports/hba1c_baseline.pdf',
      reportNotes: 'Fasting glucose: 94 mg/dL, HbA1c: 5.4% (Optimal glycemic control).',
      reviewedByAdmin: true,
      reviewedAt: Date.now() - 86400000,
    },
    {
      id: 'test_lipid_m1',
      testName: 'Complete Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)',
      category: 'Complete Lipid Profile',
      status: 'Report Submitted ✓',
      scheduledPhase: 'Month 1 (Baseline)',
      scheduledDate: startDateStr,
      reportUrl: 'https://example.com/reports/lipid_profile_baseline.pdf',
      reportNotes: 'Total Cholesterol: 182 mg/dL, HDL: 56 mg/dL, LDL: 98 mg/dL, Triglycerides: 110 mg/dL.',
      reviewedByAdmin: true,
      reviewedAt: Date.now() - 86400000,
      lipidDetails: {
        totalCholesterol: 182,
        hdl: 56,
        ldl: 98,
        triglycerides: 110,
        vldl: 22,
      },
    },
    {
      id: 'test_vitamin_profile',
      testName: 'Vitamin Profile Test — Vitamin D & Vitamin B12',
      category: 'Vitamin Profile (Vit D & B12)',
      status: 'Report Submitted ✓',
      scheduledPhase: 'Month 1 (Baseline)',
      scheduledDate: startDateStr,
      reportNotes: 'Sample collected at home by Metropolis. Vit D: 22 ng/mL (Sub-optimal), Vit B12: 380 pg/mL.',
      reviewedByAdmin: false,
    },
    {
      id: 'test_lipoprotein',
      testName: 'Lipoprotein(a) [Lp(a)] Cardiovascular Lipid Test',
      category: 'Lipoprotein(a) [Lp(a)]',
      status: 'Pending',
      scheduledPhase: 'Month 1 (Baseline)',
      scheduledDate: startDateStr,
      reportNotes: 'Pending home sample collection appointment.',
    }
  ];

  // 3rd Month Follow-Up Tests (for 3, 6, 9, 12 months)
  if (packageMonths >= 3) {
    const m3Date = new Date(now.getTime() + 85 * 86400000).toISOString().split('T')[0];
    healthTests.push(
      {
        id: 'test_hba1c_m3',
        testName: 'HbA1c Repeat Test — Month 3 Evaluation',
        category: 'HbA1c / Fasting Blood Sugar',
        status: 'Pending',
        scheduledPhase: 'Month 3 (Quarterly Evaluation)',
        scheduledDate: m3Date,
      },
      {
        id: 'test_lipid_m3',
        testName: 'Lipid Profile Repeat Test — Month 3 Evaluation',
        category: 'Complete Lipid Profile',
        status: 'Pending',
        scheduledPhase: 'Month 3 (Quarterly Evaluation)',
        scheduledDate: m3Date,
      }
    );
  }

  // 6th Month Follow-Up Tests (for 6, 9, 12 months)
  if (packageMonths >= 6) {
    const m6Date = new Date(now.getTime() + 175 * 86400000).toISOString().split('T')[0];
    healthTests.push(
      {
        id: 'test_hba1c_m6',
        testName: 'HbA1c Milestone Test — Month 6 Mid-Evaluation',
        category: 'HbA1c / Fasting Blood Sugar',
        status: 'Pending',
        scheduledPhase: 'Month 6 (Mid-Program Evaluation)',
        scheduledDate: m6Date,
      },
      {
        id: 'test_lipid_m6',
        testName: 'Lipid Profile Milestone Test — Month 6 Evaluation',
        category: 'Complete Lipid Profile',
        status: 'Pending',
        scheduledPhase: 'Month 6 (Mid-Program Evaluation)',
        scheduledDate: m6Date,
      }
    );
  }

  // 9th Month Follow-Up Tests (for 9, 12 months)
  if (packageMonths >= 9) {
    const m9Date = new Date(now.getTime() + 265 * 86400000).toISOString().split('T')[0];
    healthTests.push(
      {
        id: 'test_hba1c_m9',
        testName: 'HbA1c Progress Test — Month 9 Evaluation',
        category: 'HbA1c / Fasting Blood Sugar',
        status: 'Pending',
        scheduledPhase: 'Month 9 (Progress Evaluation)',
        scheduledDate: m9Date,
      },
      {
        id: 'test_lipid_m9',
        testName: 'Lipid Profile Progress Test — Month 9 Evaluation',
        category: 'Complete Lipid Profile',
        status: 'Pending',
        scheduledPhase: 'Month 9 (Progress Evaluation)',
        scheduledDate: m9Date,
      }
    );
  }

  // 12th Month Final Assessment Tests (for 12 months)
  if (packageMonths >= 12) {
    healthTests.push(
      {
        id: 'test_hba1c_m12',
        testName: 'HbA1c Final Transformation Test — Month 12',
        category: 'HbA1c / Fasting Blood Sugar',
        status: 'Pending',
        scheduledPhase: 'Month 12 (Annual Milestone)',
        scheduledDate: endDateStr,
      },
      {
        id: 'test_lipid_m12',
        testName: 'Lipid Profile Final Transformation Test — Month 12',
        category: 'Complete Lipid Profile',
        status: 'Pending',
        scheduledPhase: 'Month 12 (Annual Milestone)',
        scheduledDate: endDateStr,
      }
    );
  }

  const gifts = getDefaultGiftsForDuration(packageMonths);

  return {
    clientId,
    clientName,
    packageDurationMonths: packageMonths,
    totalFollowUpSessions: sessionCount,
    packageStartDate: startDateStr,
    packageEndDate: endDateStr,
    sessions,
    healthTests,
    gifts,
    scriptedMessages: DEFAULT_SCRIPTED_MESSAGES.map(m => ({ ...m })),
    lastUpdated: Date.now(),
  };
}

/**
 * Get Client Tracking Record
 */
export async function getClientTrackingRecord(clientId: string, clientName = 'Sneha De'): Promise<ClientTrackingRecord> {
  // Check Firebase Realtime Database
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, `customers/${clientId}/trackingHub`));
      if (snap.exists()) {
        return snap.val() as ClientTrackingRecord;
      }
    } catch (err) {
      console.warn('Firebase tracking fetch fallback:', err);
    }
  }

  // Check LocalStorage
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${clientId}`);
    if (raw) {
      return JSON.parse(raw) as ClientTrackingRecord;
    }
  } catch (e) {
    console.error('LocalStorage error:', e);
  }

  // Default initial record
  const defaultRec = createDefaultTrackingRecord(clientId, clientName, 1);
  saveClientTrackingRecord(defaultRec);
  return defaultRec;
}

/**
 * Save Client Tracking Record
 */
export async function saveClientTrackingRecord(record: ClientTrackingRecord): Promise<void> {
  const updated = {
    ...record,
    lastUpdated: Date.now(),
  };

  // Local storage save
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${record.clientId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }

  // Firebase Realtime DB save
  if (isFirebaseConfigured && database) {
    try {
      const updates: Record<string, unknown> = {};
      updates[`customers/${record.clientId}/trackingHub`] = updated;
      await update(ref(database), updates);
    } catch (err) {
      console.warn('Firebase tracking sync warning:', err);
    }
  }
}

/**
 * Check if Package has 7-Day Expiry Alert
 */
export function checkPackageExpiryAlert(endDateStr: string): { isExpiringIn7Days: boolean; daysRemaining: number } {
  try {
    const end = new Date(endDateStr).getTime();
    const now = Date.now();
    const diff = end - now;
    const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return {
      isExpiringIn7Days: daysRemaining >= 0 && daysRemaining <= 7,
      daysRemaining,
    };
  } catch {
    return { isExpiringIn7Days: false, daysRemaining: 30 };
  }
}
