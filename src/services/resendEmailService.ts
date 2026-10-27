/**
 * Resend Email Notification Service for She Nourishes
 * Handles automated email dispatch to both Client and Admin upon key milestone events:
 * - Onboarding & Assessment Submission
 * - 1-on-1 Counselling Consultation Booking
 * - Clinical Diet Chart & Prescription Updates
 * - Blood Test & Lab Report Scheduling
 * - PAR-Q Health Clearances
 */

import type { CustomerRecord } from '../types/customer';
import type { ClinicalDietChart } from '../types/clinicalChart';
import type { FullCounsellingSessionRecord } from '../types/counselling';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
const RESEND_API_URL = 'https://api.resend.com/emails';
export const DEFAULT_ADMIN_EMAIL = 'she.nourishes.clinical@gmail.com';
const SENDER_EMAIL = 'She Nourishes <onboarding@resend.dev>';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Core function to send an email via Resend REST API
 */
export async function sendResendEmail(params: SendEmailParams): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const recipients = Array.isArray(params.to) ? params.to : [params.to];
    // Filter out invalid/placeholder emails
    const validRecipients = recipients.filter((email) => email && email.includes('@') && !email.includes('example.com'));

    if (validRecipients.length === 0) {
      console.warn('Resend: No valid email addresses provided', params.to);
      return { success: false, error: 'No valid recipients' };
    }

    const payload = {
      from: SENDER_EMAIL,
      to: validRecipients,
      subject: params.subject,
      html: params.html,
      reply_to: params.replyTo || DEFAULT_ADMIN_EMAIL,
    };

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API Error:', result);
      return { success: false, error: result.message || 'Failed to send email' };
    }

    console.log('Resend Email successfully sent:', result.id, 'to', validRecipients);
    return { success: true, data: result };
  } catch (err: any) {
    console.error('Resend Email Exception:', err);
    return { success: false, error: err.message || 'Network error' };
  }
}

/**
 * 1. Sends Onboarding & Assessment Confirmation Email to User & Admin
 */
export async function sendOnboardingCompletionEmails(customerRecord: CustomerRecord): Promise<void> {
  const userName = customerRecord.personalDetails?.fullName || 'Valued Member';
  const userEmail = customerRecord.personalDetails?.emailAddress;
  const userMobile = customerRecord.personalDetails?.mobileNumber || 'N/A';
  const goals = (customerRecord.goalAssessment?.primaryGoals || []).join(', ') || 'General Health Optimization';
  const activityLevel = customerRecord.physicalActivity?.currentActivityLevel || 'Sedentary';
  const dietPattern = customerRecord.dietaryNutrition?.dietType || 'Vegetarian';
  const mealsCount = customerRecord.dietaryNutrition?.mealsCount || 4;

  // 1. Email to User
  if (userEmail) {
    const userHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F0; border-radius: 12px; overflow: hidden; border: 1px solid #D9D8CC;">
        <div style="background-color: #0A1C44; color: #FFFFFF; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.05em; color: #E8CA56;">SHE NOURISHES</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #FFFFFF; opacity: 0.9;">Welcome to Your Clinical Wellness Journey</p>
        </div>
        <div style="padding: 24px; color: #242820;">
          <h2 style="font-size: 18px; color: #0A1C44; margin-top: 0;">Hello ${userName},</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #4F5C38;">
            Thank you for completing your comprehensive health & dietary assessment. Our clinical nutritionist desk is reviewing your biometric profile to calibrate your personalized protocol.
          </p>
          <div style="background-color: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid #ECEAE0; margin: 16px 0;">
            <h3 style="font-size: 14px; color: #0A1C44; margin-top: 0; margin-bottom: 10px;">📋 Assessment Summary:</h3>
            <ul style="font-size: 13px; color: #4F5C38; line-height: 1.6; padding-left: 20px; margin: 0;">
              <li><strong>Primary Goals:</strong> ${goals}</li>
              <li><strong>Activity Classification:</strong> ${activityLevel}</li>
              <li><strong>Dietary Orientation:</strong> ${dietPattern}</li>
              <li><strong>Meal Frequency:</strong> ${mealsCount} Meals / Day</li>
            </ul>
          </div>
          <p style="font-size: 13px; line-height: 1.5; color: #6B7063;">
            You can access your customized diet chart, recipe cards, supplement schedules, and progress tracking anytime inside the app.
          </p>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://she-nourishes.web.app" style="background-color: #0A1C44; color: #E8CA56; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Open She Nourishes App</a>
          </div>
        </div>
        <div style="background-color: #F1EEDF; padding: 14px; text-align: center; font-size: 11px; color: #6B7063; border-top: 1px solid #D9D8CC;">
          © She Nourishes Clinical Sciences • Holistic Nutrition & Clinical Wellness
        </div>
      </div>
    `;

    await sendResendEmail({
      to: userEmail,
      subject: '✨ Welcome to She Nourishes — Your Assessment Is Received',
      html: userHtml,
    });
  }

  // 2. Email to Admin
  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 2px solid #0A1C44;">
      <div style="background-color: #0A1C44; color: #FFFFFF; padding: 20px;">
        <span style="font-size: 11px; color: #E8CA56; font-weight: 800; text-transform: uppercase;">ADMIN CLINICAL ALERT</span>
        <h1 style="margin: 4px 0 0; font-size: 18px; color: #FFFFFF;">New Patient Onboarding Completed</h1>
      </div>
      <div style="padding: 20px; color: #242820;">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 8px 0; font-weight: 700; color: #0A1C44; width: 140px;">Patient Name:</td><td style="padding: 8px 0;">${userName}</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 8px 0; font-weight: 700; color: #0A1C44;">Email:</td><td style="padding: 8px 0;">${userEmail || 'N/A'}</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 8px 0; font-weight: 700; color: #0A1C44;">Mobile:</td><td style="padding: 8px 0;">${userMobile}</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 8px 0; font-weight: 700; color: #0A1C44;">Activity Level:</td><td style="padding: 8px 0;">${activityLevel}</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 8px 0; font-weight: 700; color: #0A1C44;">Diet & Meals:</td><td style="padding: 8px 0;">${dietPattern} (${mealsCount} Meals/Day)</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 8px 0; font-weight: 700; color: #0A1C44;">Selected Goals:</td><td style="padding: 8px 0; color: #38571A; font-weight: 600;">${goals}</td></tr>
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://she-nourishes.web.app" style="background-color: #0A1C44; color: #E8CA56; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; display: inline-block;">Open Admin Portal</a>
        </div>
      </div>
    </div>
  `;

  await sendResendEmail({
    to: DEFAULT_ADMIN_EMAIL,
    subject: `🔔 New Patient Registered: ${userName} (${activityLevel})`,
    html: adminHtml,
  });
}

/**
 * 2. Sends 1-on-1 Counselling Booking Email to User & Admin
 */
export async function sendCounsellingBookingEmails(record: FullCounsellingSessionRecord): Promise<void> {
  const userName = record.personalInfo?.fullName || record.booking?.clientName || 'Client';
  const userEmail = record.personalInfo?.email || record.booking?.clientEmail;
  const meetingMode = record.booking?.meetingMode || 'Video Call';
  const date = record.booking?.selectedDate || 'Upcoming';
  const time = record.booking?.selectedTimeSlot || 'Flexible';
  const location = record.booking?.meetingMode === 'Coffee Shop (In-Person)' ? record.booking?.coffeeShopLocation || 'Selected Coffee Shop' : 'Secure HD Video Consultation Link';
  const startDate = record.booking?.startDate || date;
  const endDate = record.booking?.endDate || '90 Days Program Window';
  const goals = (record.goals?.selectedGoals || []).join(', ') || 'Metabolic Optimization';

  // 1. Email to User
  if (userEmail) {
    const userHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F0; border-radius: 12px; overflow: hidden; border: 1px solid #D9D8CC;">
        <div style="background-color: #0A1C44; color: #FFFFFF; padding: 24px; text-align: center;">
          <span style="font-size: 11px; color: #E8CA56; font-weight: 800; text-transform: uppercase;">BOOKING CONFIRMATION</span>
          <h1 style="margin: 6px 0 0; font-size: 20px; color: #FFFFFF;">1-on-1 Counselling Session Confirmed</h1>
        </div>
        <div style="padding: 24px; color: #242820;">
          <p style="font-size: 14px; color: #4F5C38;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 13.5px; line-height: 1.5; color: #242820;">
            Your personal 1-on-1 counselling and clinical strategy consultation has been successfully scheduled.
          </p>
          <div style="background-color: #FFFFFF; padding: 18px; border-radius: 8px; border: 1.5px solid #0A1C44; margin: 16px 0;">
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; font-weight: 700; color: #0A1C44;">Date & Time:</td><td style="padding: 6px 0; font-weight: 800; color: #38571A;">📅 ${date} at ⏰ ${time}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 700; color: #0A1C44;">Format / Location:</td><td style="padding: 6px 0;">${meetingMode} (${location})</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 700; color: #0A1C44;">Package Start Date:</td><td style="padding: 6px 0;">${startDate}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 700; color: #0A1C44;">Package End Date:</td><td style="padding: 6px 0;">${endDate}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 700; color: #0A1C44;">Target Focus:</td><td style="padding: 6px 0;">${goals}</td></tr>
            </table>
          </div>
          <p style="font-size: 12.5px; color: #6B7063; line-height: 1.4;">
            Please have your recent blood test reports or lifestyle notes handy during the consultation.
          </p>
        </div>
      </div>
    `;

    await sendResendEmail({
      to: userEmail,
      subject: `🗓️ Confirmed: 1-on-1 Counselling Session on ${date} (${time})`,
      html: userHtml,
    });
  }

  // 2. Email to Admin
  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 2px solid #38571A;">
      <div style="background-color: #38571A; color: #FFFFFF; padding: 20px;">
        <span style="font-size: 11px; color: #E8CA56; font-weight: 800; text-transform: uppercase;">ADMIN NOTIFICATION</span>
        <h1 style="margin: 4px 0 0; font-size: 18px; color: #FFFFFF;">New 1-on-1 Counselling Session Booked</h1>
      </div>
      <div style="padding: 20px; color: #242820;">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700; width: 140px;">Client:</td><td style="padding: 6px 0;">${userName} (${userEmail || 'N/A'})</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700;">Meeting Slot:</td><td style="padding: 6px 0; font-weight: 800; color: #0A1C44;">${date} • ${time}</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700;">Mode & Location:</td><td style="padding: 6px 0;">${meetingMode} — ${location}</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700;">Program Term:</td><td style="padding: 6px 0;">${startDate} to ${endDate}</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700;">Selected Goals:</td><td style="padding: 6px 0; color: #38571A;">${goals}</td></tr>
        </table>
      </div>
    </div>
  `;

  await sendResendEmail({
    to: DEFAULT_ADMIN_EMAIL,
    subject: `📅 New Counselling Session: ${userName} — ${date} (${time})`,
    html: adminHtml,
  });
}

/**
 * 3. Sends Diet Chart Published / Updated Email to User & Admin
 */
export async function sendDietChartPublishedEmail(clientEmail: string, clientName: string, chart: ClinicalDietChart): Promise<void> {
  const title = chart.title || 'FAT, PROTEIN DIET';
  const tag = chart.dietTypeTag || 'Prescription Protocol';
  const totalCalories = chart.totalMealPlanCalorie || chart.totalDailyCalorieTarget || 1750;
  const mealsCount = chart.meals.length;

  const userHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F0; border-radius: 12px; overflow: hidden; border: 1px solid #D9D8CC;">
      <div style="background-color: #0A1C44; color: #FFFFFF; padding: 24px; text-align: center;">
        <span style="font-size: 11px; color: #E8CA56; font-weight: 800; text-transform: uppercase;">CLINICAL PRESCRIPTION UPDATE</span>
        <h1 style="margin: 6px 0 0; font-size: 20px; color: #FFFFFF;">Your Diet Chart Has Been Updated</h1>
      </div>
      <div style="padding: 24px; color: #242820;">
        <p style="font-size: 14px; color: #4F5C38;">Hello <strong>${clientName}</strong>,</p>
        <p style="font-size: 13.5px; line-height: 1.5; color: #242820;">
          Your customized clinical meal plan has been prescribed and published to your mobile application.
        </p>
        <div style="background-color: #FFFFFF; padding: 18px; border-radius: 8px; border: 1.5px solid #66734A; margin: 16px 0;">
          <h3 style="font-size: 15px; color: #0A1C44; margin-top: 0; margin-bottom: 4px;">🥗 ${title}</h3>
          <div style="font-size: 12px; color: #66734A; font-weight: 700; margin-bottom: 12px;">${tag}</div>
          <div style="font-size: 13px; color: #242820; line-height: 1.6;">
            • <strong>Daily Calorie Target:</strong> ${totalCalories} kcal<br/>
            • <strong>Meal Partitioning:</strong> ${mealsCount} Structured Daily Meals<br/>
            • <strong>Clinical Supplements:</strong> Integrated Pre & Post Meal Protocol
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://she-nourishes.web.app" style="background-color: #0A1C44; color: #E8CA56; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13.5px; display: inline-block;">View Diet Chart in App</a>
        </div>
      </div>
    </div>
  `;

  if (clientEmail && clientEmail.includes('@')) {
    await sendResendEmail({
      to: clientEmail,
      subject: `🥗 New Clinical Diet Chart Prescribed: ${title}`,
      html: userHtml,
    });
  }

  // Notify admin
  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFFFFF; border: 1px solid #D9D8CC; border-radius: 8px;">
      <h2 style="font-size: 16px; color: #0A1C44; margin-top: 0;">Diet Chart Published for ${clientName}</h2>
      <p style="font-size: 13px; color: #4F5C38;">Protocol: <strong>${title} (${tag})</strong> — ${totalCalories} kcal • ${mealsCount} meals.</p>
    </div>
  `;

  await sendResendEmail({
    to: DEFAULT_ADMIN_EMAIL,
    subject: `✅ Diet Chart Published: ${clientName} (${title})`,
    html: adminHtml,
  });
}

/**
 * 4. Sends Long-Term Transformation Program Started Email to User & Admin
 */
export async function sendLongTermProgramStartedEmail(params: {
  clientEmail: string;
  clientName: string;
  packageName: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  goals: string[];
  openToSupplements: boolean;
  dietType: string;
  mealsCount: number;
}): Promise<void> {
  const {
    clientEmail,
    clientName,
    packageName,
    durationMonths,
    startDate,
    endDate,
    goals,
    openToSupplements,
    dietType,
    mealsCount,
  } = params;

  const goalsList = goals.length > 0 ? goals.join(', ') : 'Metabolic Stabilization';
  const supplementStatus = openToSupplements ? '✅ Supplement Protocol Enabled' : '🍃 100% Whole Food Nutrition (No Supplements)';

  // 1. Email to User
  if (clientEmail && clientEmail.includes('@')) {
    const userHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F0; border-radius: 12px; overflow: hidden; border: 1px solid #D9D8CC;">
        <div style="background-color: #0A1C44; color: #FFFFFF; padding: 26px; text-align: center;">
          <span style="font-size: 11px; color: #E8CA56; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;">OFFICIAL PROGRAM CONFIRMATION</span>
          <h1 style="margin: 6px 0 0; font-size: 22px; color: #FFFFFF; font-weight: 800;">Your Long-Term Journey Has Begun!</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #E8CA56;">${packageName} (${durationMonths} Months Intensive Transformation)</p>
        </div>
        <div style="padding: 24px; color: #242820;">
          <p style="font-size: 14.5px; color: #4F5C38;">Hello <strong>${clientName}</strong>,</p>
          <p style="font-size: 13.5px; line-height: 1.6; color: #242820;">
            Congratulations on taking this defining commitment toward lifelong vitality and metabolic healing. Your official Long-Term Transformation Program agreement has been signed and registered with She Nourishes Clinical Sciences.
          </p>
          <div style="background-color: #FFFFFF; padding: 18px; border-radius: 8px; border: 1.5px solid #0A1C44; margin: 18px 0;">
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #F1EEDF;"><td style="padding: 6px 0; font-weight: 700; color: #0A1C44; width: 140px;">Program Term:</td><td style="padding: 6px 0; font-weight: 800; color: #38571A;">📅 ${startDate} to ${endDate}</td></tr>
              <tr style="border-bottom: 1px solid #F1EEDF;"><td style="padding: 6px 0; font-weight: 700; color: #0A1C44;">Target Milestones:</td><td style="padding: 6px 0; color: #242820;">${goalsList}</td></tr>
              <tr style="border-bottom: 1px solid #F1EEDF;"><td style="padding: 6px 0; font-weight: 700; color: #0A1C44;">Dietary Model:</td><td style="padding: 6px 0; color: #242820;">${dietType} • ${mealsCount} Meals Daily</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 700; color: #0A1C44;">Supplement Mode:</td><td style="padding: 6px 0; font-weight: 700; color: #38571A;">${supplementStatus}</td></tr>
            </table>
          </div>
          <p style="font-size: 12.5px; color: #6B7063; line-height: 1.5;">
            Your assigned Senior Clinical Nutritionist has received your complete assessment and is preparing your personalized diet chart & diagnostic roadmap.
          </p>
          <div style="text-align: center; margin-top: 22px;">
            <a href="https://she-nourishes.web.app" style="background-color: #0A1C44; color: #E8CA56; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13.5px; display: inline-block;">Access Your Program Portal</a>
          </div>
        </div>
      </div>
    `;

    await sendResendEmail({
      to: clientEmail,
      subject: `🌟 Welcome to Your ${durationMonths}-Month Transformation Journey — She Nourishes`,
      html: userHtml,
    });
  }

  // 2. Email to Admin
  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 2px solid #0A1C44;">
      <div style="background-color: #0A1C44; color: #FFFFFF; padding: 20px;">
        <span style="font-size: 11px; color: #E8CA56; font-weight: 800; text-transform: uppercase;">ADMIN CLINICAL ALERT</span>
        <h1 style="margin: 4px 0 0; font-size: 18px; color: #FFFFFF;">Long-Term Program Started: ${clientName}</h1>
      </div>
      <div style="padding: 20px; color: #242820;">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700; width: 140px;">Client:</td><td style="padding: 6px 0;">${clientName} (${clientEmail || 'N/A'})</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700;">Package:</td><td style="padding: 6px 0; font-weight: 800; color: #0A1C44;">${packageName} (${durationMonths} Mo)</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700;">Term:</td><td style="padding: 6px 0;">${startDate} to ${endDate}</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700;">Supplement Openness:</td><td style="padding: 6px 0; font-weight: 700; color: ${openToSupplements ? '#38571A' : '#C85A48'};">${openToSupplements ? 'YES (Supplements In Diet Chart)' : 'NO (Whole Foods Only)'}</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700;">Diet & Meals:</td><td style="padding: 6px 0;">${dietType} (${mealsCount} Meals/Day)</td></tr>
          <tr style="border-bottom: 1px solid #ECEAE0;"><td style="padding: 6px 0; font-weight: 700;">Goals:</td><td style="padding: 6px 0; color: #38571A;">${goalsList}</td></tr>
        </table>
        <div style="margin-top: 18px; text-align: center;">
          <a href="https://she-nourishes.web.app" style="background-color: #0A1C44; color: #E8CA56; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; display: inline-block;">Open Admin Desk</a>
        </div>
      </div>
    </div>
  `;

  await sendResendEmail({
    to: DEFAULT_ADMIN_EMAIL,
    subject: `🚀 New Long-Term Client Started: ${clientName} (${durationMonths} Mo Package)`,
    html: adminHtml,
  });
}

/**
 * 7. Sends Clinical Follow-Up Email (Weekly Counselling or Long-Term Support)
 */
export async function sendClinicalFollowUpEmail(params: {
  clientName: string;
  clientEmail: string;
  category: 'Weekly Counselling' | 'Long-Term Support';
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 2px solid #0A1C44;">
      <div style="background-color: #0A1C44; color: #FFFFFF; padding: 22px 24px; text-align: center;">
        <span style="font-size: 11px; color: #E8CA56; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;">
          SHE NOURISHES • CLINICAL CARE
        </span>
        <h1 style="margin: 6px 0 0; font-size: 20px; color: #FFFFFF; font-weight: 800;">
          ${params.category} Follow-Up
        </h1>
      </div>
      <div style="padding: 24px; color: #242820;">
        <p style="font-size: 15px; margin-top: 0; color: #0A1C44;">Dear <strong>${params.clientName}</strong>,</p>
        <div style="background-color: #F8F6EF; border-left: 4px solid #38571A; padding: 16px 18px; margin: 16px 0; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #2B4214; white-space: pre-wrap;">${params.message}</div>
        <div style="margin: 22px 0 16px; text-align: center;">
          <a href="https://she-nourishes.web.app" style="background-color: #0A1C44; color: #E8CA56; padding: 11px 22px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 13.5px; display: inline-block;">
            Open Your Health Portal
          </a>
        </div>
        <div style="border-top: 1px solid #ECEAE0; padding-top: 16px; margin-top: 20px; font-size: 12.5px; color: #6B7063;">
          <strong style="color: #0A1C44;">Sneha Dey</strong><br>
          Clinical Nutritionist & Lifestyle Counselor<br>
          She Nourishes Health Systems
        </div>
      </div>
    </div>
  `;

  return await sendResendEmail({
    to: [params.clientEmail, DEFAULT_ADMIN_EMAIL],
    subject: `[She Nourishes] ${params.subject}`,
    html,
  });
}

