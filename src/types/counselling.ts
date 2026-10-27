/**
 * Types and interfaces for Counselling Sessions, PAR-Q,
 * Multi-Month Blood Test Schedules, Lab Reports, and Vouchers.
 */

import type { Gender } from './customer';

export type MeetingMode = 'Video Call' | 'Coffee Shop (In-Person)';

export interface MeetingLocationOption {
  id: string;
  name: string;
  address: string;
  area: string;
  isPopular?: boolean;
}

export interface CounsellingBooking {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientMobile: string;
  meetingMode: MeetingMode;
  selectedDate: string;
  selectedTimeSlot: string;
  coffeeShopLocation?: string;
  customLocationDetails?: string;
  agreementAccepted: boolean;
  agreementSignedAt: number;
  startDate: string;
  endDate: string;
  confirmationEmailSent: boolean;
  status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled';
}

export interface PersonalCounsellingInfo {
  fullName: string;
  age: number | null;
  gender: Gender;
  occupation: string;
  sittingHabit: 'Desk-bound (8+ hrs)' | 'Moderate Sitting (4-6 hrs)' | 'Active on Feet' | 'Mixed Routine';
  email: string;
  dietaryOrientation: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan' | 'Jain';
  location: string;
}

export interface CounsellingLifestyle {
  currentWeightKg: number;
  targetWeightKg: number;
  wakeUpTime: string;
  sleepingTime: string;
}

export interface CounsellingGoals {
  selectedGoals: string[]; // 'building healthy eating', 'reducing fat', 'improve stamina', 'build muscle', 'flexibility', 'manage stress', 'managing daily activity', 'building consistency'
  additionalNotes?: string;
}

export interface AdminClinicalAssessment {
  sleepQuality: 'Poor' | 'Average' | 'Good' | 'Excellent';
  generalStress: 'Low' | 'Moderate' | 'High' | 'Extremely High';
  anxietyLevels: 'Low' | 'Moderate' | 'High';
  clinicalNotes?: string;
  reviewedByAdmin?: boolean;
  reviewedAt?: number;
}

export interface CurrentLifeChallenges {
  relationshipStressAnswer: string; // What’s the biggest challenge affecting your personal life right now?
  familyResponsibilitiesAnswer: string; // Are relationships/family affecting your ability to focus on yourself?
  isFeelingIsolated: boolean;
  isFeelingLowConfidence: boolean;
  isOftenFeelingLowMotivation: boolean;
  isLackingMotivationForSelfCare: boolean;
  isAvoidanceOfSocialGatherings: boolean;
  isLosingInterestInActivities: boolean;
  stressOverwhelmSituations: string; // Situations causing you to feel stressed, overwhelmed, and emotionally drained
}

export interface LifestyleSupportOvercome {
  personalizedActionPlan: string;
  habitReminders: string[];
  practicalTipsSleepStress: string[];
  doubtsAndAnswers: { question: string; answer: string }[];
}

export interface FullCounsellingSessionRecord {
  id: string;
  clientId: string;
  booking: CounsellingBooking;
  personalInfo: PersonalCounsellingInfo;
  lifestyle: CounsellingLifestyle;
  goals: CounsellingGoals;
  adminAssessment: AdminClinicalAssessment;
  challenges: CurrentLifeChallenges;
  supportPlan: LifestyleSupportOvercome;
  createdAt: number;
  updatedAt: number;
}

// ==========================================
// PAR-Q (Physical Activity Readiness)
// ==========================================
export interface ParQHealthAssessment {
  hasHeartCondition: boolean;
  hasChestPainWithActivity: boolean;
  hasChestPainWithoutActivity: boolean;
  hasDizzinessOrLossOfConsciousness: boolean;
  hasBoneOrJointProblem: boolean;
  hasHighBloodPressureOrMedication: boolean;
  hasOtherReasonNotToExercise: boolean;
  chronicConditions: string[]; // 'PCOS/PCOD', 'Thyroid', 'Diabetes', 'Hypertension', 'Fatty Liver', 'None'
  otherConditionsNotes?: string;
  signedAgreement: boolean;
  signedAt: number;
}

// ==========================================
// Multi-Month Recurring Blood Test Schedule
// ==========================================
export interface ScheduledBloodTestItem {
  id: string;
  testPhase: string; // e.g. '1st Month (Baseline)', '2nd Month', '3rd Month (Mid-Plan Check)', '6th Month (Final Assessment)', etc.
  scheduledMonthNumber: number; // 1, 2, 3, 6, 9, 12
  scheduledDate: string;
  timeSlot: string;
  collectionType: 'Home Blood Sample Collection' | 'Diagnostic Lab Visit';
  biomarkers: string[];
  status: 'Upcoming' | 'Sample Collected' | 'Report Uploaded' | 'Completed';
  reportUrl?: string;
  reportFileName?: string;
  reportUploadedAt?: number;
  doctorRemarks?: string;
}

export interface BloodTestPlanSchedule {
  planDurationMonths: 1 | 2 | 3 | 6 | 9 | 12;
  planStartDate: string;
  planEndDate: string;
  tests: ScheduledBloodTestItem[];
  emailConfirmationSent: boolean;
}

// Lipid Profile Biomarker Values
export interface LipidProfileValues {
  totalCholesterol?: number; // mg/dL
  triglycerides?: number; // mg/dL
  hdl?: number; // mg/dL
  ldl?: number; // mg/dL
  vldl?: number; // mg/dL
  cholesterolHdlRatio?: number;
}

// Prior Blood Test Record Uploaded by Admin
export interface PriorBloodTestRecord {
  id: string;
  clientId: string;
  testDate: string;
  testTitle: string;
  category: 'Lipid Profile' | 'HbA1c / Glycemic' | 'Vitamin Profile' | 'Comprehensive Panel';
  lipidValues?: LipidProfileValues;
  hba1cValue?: number; // %
  fastingGlucose?: number; // mg/dL
  vitaminDValue?: number; // ng/mL
  vitaminB12Value?: number; // pg/mL
  lpaValue?: number; // nmol/L or mg/dL
  reportPdfUrl?: string;
  reportFileName?: string;
  doctorRemarks?: string;
  uploadedAt: number;
}

// ==========================================
// Gift Vouchers
// ==========================================
export interface GiftVoucherItem {
  id: string;
  code: string;
  title: string;
  description: string;
  isCompulsoryWelcome: boolean;
  planApplicable: string;
  discountOrPerkValue: string;
  imageUrl?: string;
  isClaimed: boolean;
  claimedAt?: number;
  validUntil: string;
}

