/**
 * Official Nutrition Consultation Agreement Data
 * Analyzed directly from the high-resolution certificate images:
 * - 1, 2, 3, 6, 9, 12 Month Long-Term Support Agreements (20 Clauses)
 * - 1-on-1 Lifestyle & Nutrition Counseling Agreements
 */

export interface LongTermAgreementConfig {
  durationMonths: number;
  badgeTitle: string; // e.g. 'ONE MONTH AGREEMENT'
  durationWord: string; // e.g. 'one month'
  validityClauseText: string; // e.g. 'one (1) month'
  extensionClauseText: string; // e.g. 'one month'
  fixedPriceInr: number;
  imagePath: string;
  points: string[];
}

export function getLongTermAgreementConfig(months: number): LongTermAgreementConfig {
  let badgeTitle = 'ONE MONTH AGREEMENT';
  let durationWord = 'one month';
  let validityClauseText = 'one (1) month';
  let extensionClauseText = 'one month';
  let fixedPriceInr = 25000;
  let imagePath = '/agreements/agreement_1_month.png';

  if (months === 2) {
    badgeTitle = 'TWO MONTH AGREEMENT';
    durationWord = 'two months';
    validityClauseText = 'two (2) months';
    extensionClauseText = 'two months';
    fixedPriceInr = 35599;
    imagePath = '/agreements/agreement_2_month.png';
  } else if (months === 3) {
    badgeTitle = 'THREE MONTH AGREEMENT';
    durationWord = 'three months';
    validityClauseText = 'three (3) months';
    extensionClauseText = 'three months';
    fixedPriceInr = 51199;
    imagePath = '/agreements/agreement_3_month.png';
  } else if (months === 6) {
    badgeTitle = 'SIX MONTH AGREEMENT';
    durationWord = 'six months';
    validityClauseText = 'six (6) months';
    extensionClauseText = 'six months';
    fixedPriceInr = 91999;
    imagePath = '/agreements/agreement_6_month.png';
  } else if (months === 9) {
    badgeTitle = 'NINE MONTH AGREEMENT';
    durationWord = 'nine months';
    validityClauseText = 'nine (9) months';
    extensionClauseText = 'nine months';
    fixedPriceInr = 131999;
    imagePath = '/agreements/agreement_9_month.png';
  } else if (months === 12) {
    badgeTitle = 'ONE YEAR AGREEMENT';
    durationWord = 'one year';
    validityClauseText = 'one (1) year';
    extensionClauseText = 'one year';
    fixedPriceInr = 171999;
    imagePath = '/agreements/agreement_12_month.png';
  }

  const formattedPrice = `₹${fixedPriceInr.toLocaleString('en-IN')}`;

  const points: string[] = [
    `I have given consent to Sneha Dey to provide Nutrition Counseling services to me for ${durationWord}.`,
    `I confirm that the package fee of ${formattedPrice} for ${durationWord} is a fixed, non-refundable fee with zero hidden charges.`,
    'NON-TRANSFERABILITY: I understand and agree that this agreement, enrollment, and personalized program are strictly non-transferable. The participant cannot transfer, assign, share, or give their sessions, lab tests, meal plans, or counseling access to any other individual or participant under any circumstances.',
    'RESULTS DISCLAIMER: I understand and agree that results are NOT 100% guaranteed. Outcomes, metabolic responses, fat loss, and muscle adaptations vary significantly based on individual physiological baselines, medical history, genetics, and my own strict adherence to the prescribed nutrition, exercise, and lifestyle protocol.',
    'I confirm that I have provided complete and accurate health, medical, medication, allergy, and lifestyle information.',
    'I understand that the Nutrition Consultant is not a medical doctor and does not diagnose, prescribe, or treat any medical conditions.',
    'I agree to seek medical advice before following this plan if I have any illness, pregnancy, injury, or medical condition.',
    'I understand that nutrition consultation is educational and cannot replace medical care or treatment.',
    'I agree to follow the recommendations consistently and understand that my results depend on my own adherence and lifestyle choices.',
    'I understand that the consultation/package fee is non-refundable once paid.',
    'I understand that if I postpone or reschedule three sessions during my package period, the package may be cancelled without refund.',
    'I understand that consultation hours are Monday–Friday, 10:00 AM–6:00 PM, and responses are generally provided within 24 hours.',
    'I understand that follow-up sessions and plan revisions are provided only according to my selected package.',
    'I understand that all my personal and health information will remain confidential except where disclosure is required by law or authorized by me.',
    'I acknowledge that any information shared is used only for creating personalized dietary and lifestyle recommendations.',
    'I acknowledge that I am responsible for implementing the recommendations and accept full responsibility for my actions and decisions.',
    'I understand that correct nutrition can support energy, performance, recovery, body composition, and overall well-being.',
    'I understand that nutrition may improve mental clarity, focus, and mood but results depend on individual factors.',
    'I hereby release and waive any claims against the Nutrition Consultant for any outcomes arising from these services.',
    `I understand that this agreement is valid for ${validityClauseText} from the start date of my consultation.`,
    `I understand that any extension of services after ${extensionClauseText} will be considered as a new agreement and subject to our terms.`,
    'I confirm that I have read, understood, and voluntarily agree to all the terms and conditions outlined in this agreement.',
  ];

  return {
    durationMonths: months,
    badgeTitle,
    durationWord,
    validityClauseText,
    extensionClauseText,
    fixedPriceInr,
    imagePath,
    points,
  };
}

export interface OneOnOneAgreementConfig {
  price: number;
  imagePath: string;
  points: string[];
}

export function getOneOnOneAgreementConfig(price: number = 1699): OneOnOneAgreementConfig {
  let imagePath = '/agreements/agreement_one_on_one_1699.png';
  if (price === 2100) imagePath = '/agreements/agreement_one_on_one_2100.png';
  else if (price === 3100) imagePath = '/agreements/agreement_one_on_one_3100.png';
  else if (price === 4999) imagePath = '/agreements/agreement_one_on_one_4999.png';
  else if (price === 6100 || price === 6199) imagePath = '/agreements/agreement_one_on_one_6100.png';

  const formattedPrice = `₹${price.toLocaleString('en-IN')}`;

  const points = [
    'I confirm that I have voluntarily enrolled for the Lifestyle & Nutrition Counseling Session with She Nourishes.',
    `I understand that the counseling fee of ${formattedPrice} is non-refundable once the session has been booked or completed.`,
    'I understand that this service is intended to provide professional nutrition and lifestyle guidance.',
    'I accept full responsibility for implementing the recommendations provided.',
    'I understand that my results depend on my own commitment, consistency, and lifestyle changes.',
    'I have read, understood, and agree to all the terms mentioned above without any pressure.',
  ];

  return {
    price,
    imagePath,
    points,
  };
}
