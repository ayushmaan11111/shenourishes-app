/**
 * Service for Counselling Sessions, PAR-Q, Blood Test Scheduling,
 * and Gift Vouchers with Firebase Realtime Database & LocalStorage sync.
 */

import { database, isFirebaseConfigured } from './firebase';
import { ref, set, get, update } from 'firebase/database';
import type {
  FullCounsellingSessionRecord,
  ParQHealthAssessment,
  BloodTestPlanSchedule,
  ScheduledBloodTestItem,
  GiftVoucherItem,
} from '../types/counselling';

// Default Coffee Shop Location Suggestions
export const POPULAR_COFFEE_SHOPS = [
  { id: 'loc_1', name: 'Blue Tokai Coffee Roasters', address: 'Indiranagar / Cyber Hub / Bandra West', area: 'Central Hub', isPopular: true },
  { id: 'loc_2', name: 'Third Wave Coffee', address: 'Koramangala / GK-2 / Jubilee Hills', area: 'Metro Center', isPopular: true },
  { id: 'loc_3', name: 'Starbucks Coffee Reserve', address: 'Connaught Place / Powai / Brigade Rd', area: 'Downtown', isPopular: true },
  { id: 'loc_4', name: 'Roastery Coffee House', address: 'Banjara Hills / South City / Sector 29', area: 'Green Oasis', isPopular: false },
];

// Preconfigured Biomarkers with Dedicated Lipid Profile
export const STANDARD_PACKAGE_BIOMARKERS = [
  'HbA1c (Glycated Hemoglobin) / Fasting Blood Sugar',
  'Complete Lipid Profile (Total Cholesterol, HDL, LDL, VLDL, Triglycerides)',
  'Vitamin Profile (Vitamin D3 & Vitamin B12)',
  'Lipoprotein(a) [Lp(a)] Cardiovascular Marker',
  'Nutrient Requirement Assessment',
];

// Preconfigured Gift Vouchers
export const DEFAULT_VOUCHERS: GiftVoucherItem[] = [
  {
    id: 'voucher_welcome_compulsory',
    code: 'SHE-WELCOME-GIFT',
    title: '1x Compulsory Senior Clinical Consultation (1-on-1)',
    description: 'Complimentary 45-minute deep-dive clinical consultation with senior nutritionist.',
    isCompulsoryWelcome: true,
    planApplicable: 'All Plans (1, 2, 3, 6, 9, 12 Months)',
    discountOrPerkValue: '₹2,500 Value (100% Free)',
    isClaimed: false,
    validUntil: 'Valid for 6 Months',
  },
  {
    id: 'voucher_metabolic_blueprint',
    code: 'METABOLIC-TRANSFORM',
    title: 'Hormonal & Metabolic Transformation Blueprint',
    description: 'Complete digital vault containing 120+ clinical hormonal balancing meal blueprints.',
    isCompulsoryWelcome: false,
    planApplicable: '3, 6, 9 & 12 Month Transformation Plans',
    discountOrPerkValue: '₹3,999 Value (Bonus Perk)',
    isClaimed: false,
    validUntil: 'Full Lifetime Access',
  },
  {
    id: 'voucher_lab_test_credit',
    code: 'DIAGNOSTIC-CARE',
    title: 'Diagnostic Lab Test Partner Credit',
    description: 'Home blood sample collection voucher covering full 5-biomarker lipid and vitamin panel.',
    isCompulsoryWelcome: false,
    planApplicable: '6, 9 & 12 Month Plans',
    discountOrPerkValue: '₹1,500 Lab Rebate',
    isClaimed: false,
    validUntil: 'Valid for 12 Months',
  },
];

/**
 * Generates automated recurring blood test schedules based on plan duration:
 * 1 Month: 1 Test at start (Month 1 Baseline)
 * 2 Months: 1 Test at start (Month 1 Baseline)
 * 3 Months: 2 Tests (Month 1 Baseline + Month 3 Final Assessment)
 * 6 Months: 3 Tests (Month 1 Baseline + Month 3 Mid-check + Month 6 Final Assessment)
 * 9 Months: 4 Tests (Month 1 Baseline + Month 3 + Month 6 + Month 9 Final Assessment)
 * 12 Months: 5 Tests (Month 1 Baseline + Month 3 + Month 6 + Month 9 + Month 12 Final Assessment)
 */
export function generateBloodTestScheduleForPlan(
  planMonths: 1 | 2 | 3 | 6 | 9 | 12 = 3,
  startDateStr?: string
): BloodTestPlanSchedule {
  const startDate = startDateStr ? new Date(startDateStr) : new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + planMonths);

  const tests: ScheduledBloodTestItem[] = [];

  // 1st Month Baseline Test (All plans)
  const date1 = new Date(startDate);
  date1.setDate(date1.getDate() + 3); // 3 days buffer for test
  tests.push({
    id: 'test_phase_1',
    testPhase: '1st Month (Baseline Biomarker Panel)',
    scheduledMonthNumber: 1,
    scheduledDate: date1.toISOString().split('T')[0],
    timeSlot: '07:30 AM – 09:30 AM (Fasting)',
    collectionType: 'Home Blood Sample Collection',
    biomarkers: STANDARD_PACKAGE_BIOMARKERS,
    status: 'Upcoming',
  });

  // 3rd Month Test (For 3, 6, 9, 12 month plans)
  if (planMonths >= 3) {
    const date3 = new Date(startDate);
    date3.setMonth(date3.getMonth() + 2);
    date3.setDate(date3.getDate() + 25);
    tests.push({
      id: 'test_phase_3',
      testPhase: planMonths === 3 ? '3rd Month (Final Milestone Review)' : '3rd Month (Quarterly Evaluation)',
      scheduledMonthNumber: 3,
      scheduledDate: date3.toISOString().split('T')[0],
      timeSlot: '07:30 AM – 09:30 AM (Fasting)',
      collectionType: 'Home Blood Sample Collection',
      biomarkers: STANDARD_PACKAGE_BIOMARKERS,
      status: 'Upcoming',
    });
  }

  // 6th Month Test (For 6, 9, 12 month plans)
  if (planMonths >= 6) {
    const date6 = new Date(startDate);
    date6.setMonth(date6.getMonth() + 5);
    date6.setDate(date6.getDate() + 25);
    tests.push({
      id: 'test_phase_6',
      testPhase: planMonths === 6 ? '6th Month (Final Milestone Review)' : '6th Month (Mid-Year Evaluation)',
      scheduledMonthNumber: 6,
      scheduledDate: date6.toISOString().split('T')[0],
      timeSlot: '07:30 AM – 09:30 AM (Fasting)',
      collectionType: 'Home Blood Sample Collection',
      biomarkers: STANDARD_PACKAGE_BIOMARKERS,
      status: 'Upcoming',
    });
  }

  // 9th Month Test (For 9, 12 month plans)
  if (planMonths >= 9) {
    const date9 = new Date(startDate);
    date9.setMonth(date9.getMonth() + 8);
    date9.setDate(date9.getDate() + 25);
    tests.push({
      id: 'test_phase_9',
      testPhase: planMonths === 9 ? '9th Month (Final Milestone Review)' : '9th Month (Progress Evaluation)',
      scheduledMonthNumber: 9,
      scheduledDate: date9.toISOString().split('T')[0],
      timeSlot: '07:30 AM – 09:30 AM (Fasting)',
      collectionType: 'Home Blood Sample Collection',
      biomarkers: STANDARD_PACKAGE_BIOMARKERS,
      status: 'Upcoming',
    });
  }

  // 12th Month Test (For 12 month plan)
  if (planMonths === 12) {
    const date12 = new Date(startDate);
    date12.setMonth(date12.getMonth() + 11);
    date12.setDate(date12.getDate() + 25);
    tests.push({
      id: 'test_phase_12',
      testPhase: '12th Month (Annual Final Milestone)',
      scheduledMonthNumber: 12,
      scheduledDate: date12.toISOString().split('T')[0],
      timeSlot: '07:30 AM – 09:30 AM (Fasting)',
      collectionType: 'Home Blood Sample Collection',
      biomarkers: STANDARD_PACKAGE_BIOMARKERS,
      status: 'Upcoming',
    });
  }

  return {
    planDurationMonths: planMonths,
    planStartDate: startDate.toISOString().split('T')[0],
    planEndDate: endDate.toISOString().split('T')[0],
    tests,
    emailConfirmationSent: true,
  };
}

/**
 * Save / Update Full Counselling Session Record
 */
export async function saveCounsellingRecord(
  clientId: string,
  record: FullCounsellingSessionRecord
): Promise<FullCounsellingSessionRecord> {
  const updated = {
    ...record,
    clientId,
    updatedAt: Date.now(),
  };

  // Local storage backup
  try {
    localStorage.setItem(`counselling_${clientId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }

  // Firebase Realtime DB sync
  if (isFirebaseConfigured && database) {
    try {
      const updates: Record<string, unknown> = {};
      updates[`customers/${clientId}/counsellingRecord`] = updated;
      updates[`counsellingBookings/${record.id || clientId}`] = updated;
      await update(ref(database), updates);
    } catch (err) {
      console.error('Error saving counselling record to Firebase:', err);
    }
  }

  return updated;
}

/**
 * Get Counselling Session Record for Client
 */
export async function getCounsellingRecord(
  clientId: string
): Promise<FullCounsellingSessionRecord | null> {
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, `customers/${clientId}/counsellingRecord`));
      if (snap.exists()) {
        return snap.val() as FullCounsellingSessionRecord;
      }
    } catch (err) {
      console.error('Error fetching counselling record from Firebase:', err);
    }
  }

  // Fallback to local storage
  const local = localStorage.getItem(`counselling_${clientId}`);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('JSON parse error:', e);
    }
  }

  return null;
}

/**
 * Save PAR-Q Health Assessment
 */
export async function saveParQAssessment(
  clientId: string,
  parqData: ParQHealthAssessment
): Promise<ParQHealthAssessment> {
  try {
    localStorage.setItem(`parq_${clientId}`, JSON.stringify(parqData));
  } catch (e) {
    console.error(e);
  }

  if (isFirebaseConfigured && database) {
    try {
      await set(ref(database, `customers/${clientId}/parqAssessment`), parqData);
    } catch (err) {
      console.error('Error saving PAR-Q to Firebase:', err);
    }
  }

  return parqData;
}

/**
 * Get PAR-Q Health Assessment for a client with Firebase and LocalStorage fallback
 */
export async function getParQAssessment(
  clientId: string
): Promise<ParQHealthAssessment | null> {
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, `customers/${clientId}/parqAssessment`));
      if (snap.exists()) {
        const val = snap.val() as ParQHealthAssessment;
        try {
          localStorage.setItem(`parq_${clientId}`, JSON.stringify(val));
        } catch {}
        return val;
      }
    } catch (err) {
      console.warn('Error fetching PAR-Q from Firebase:', err);
    }
  }

  try {
    const local = localStorage.getItem(`parq_${clientId}`);
    if (local) {
      return JSON.parse(local) as ParQHealthAssessment;
    }
  } catch (e) {
    console.error('LocalStorage PAR-Q parse error:', e);
  }

  return null;
}

/**
 * Save Recurring Blood Test Schedule & Lab Reports
 */
export async function saveBloodTestSchedule(
  clientId: string,
  schedule: BloodTestPlanSchedule
): Promise<BloodTestPlanSchedule> {
  try {
    localStorage.setItem(`blood_schedule_${clientId}`, JSON.stringify(schedule));
  } catch (e) {
    console.error(e);
  }

  if (isFirebaseConfigured && database) {
    try {
      await set(ref(database, `customers/${clientId}/bloodTestSchedule`), schedule);
    } catch (err) {
      console.error('Error saving Blood Test Schedule to Firebase:', err);
    }
  }

  return schedule;
}

export async function getBloodTestSchedule(
  clientId: string
): Promise<BloodTestPlanSchedule> {
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, `customers/${clientId}/bloodTestSchedule`));
      if (snap.exists()) {
        return snap.val() as BloodTestPlanSchedule;
      }
    } catch (err) {
      console.error('Error fetching blood schedule:', err);
    }
  }

  const local = localStorage.getItem(`blood_schedule_${clientId}`);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {}
  }

  // Default fallback schedule for 3 months
  return generateBloodTestScheduleForPlan(3);
}
