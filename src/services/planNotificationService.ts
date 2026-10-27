/**
 * Plan Lifecycle Notification Service
 * Manages automated notifications for Android & iOS via Capacitor LocalNotifications,
 * Firebase Realtime Database sync, and in-app triggers.
 * 
 * Rules:
 * 1. Week 1 (Days 1 to 7): Daily notification every day regarding the plan.
 * 2. Mid-Plan (Week 2 to Penultimate Week): 2 to 3 notifications weekly.
 * 3. Final Week (Last 7 Days): Renewal, new plan suggestions & exit consultation.
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { database, isFirebaseConfigured } from './firebase';
import { ref, set, get } from 'firebase/database';

export type PlanNotificationPhase = 'week1_daily' | 'mid_weekly' | 'final_renewal' | 'instant_nudge';

export interface PlanNotificationItem {
  id: number; // Numeric ID required by Capacitor LocalNotifications
  notificationKey: string;
  planId: string;
  planName: string;
  phase: PlanNotificationPhase;
  dayNumber: number;
  title: string;
  body: string;
  scheduleTime: number; // Epoch timestamp in ms
  scheduleTimeFormatted: string;
  deepLink: string;
  delivered: boolean;
  channelId: string;
}

const NOTIFICATION_CHANNEL_ID = 'she_nourishes_plan_reminders';
const STORAGE_PREFIX = 'she_nourishes_plan_notifications_';

/**
 * Initialize Notification Channels on Android (API 26+)
 */
export async function initializeNotificationChannels(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await LocalNotifications.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'She Nourishes Plan Updates',
      description: 'Daily habit check-ins, weekly counselling follow-ups, and plan renewal suggestions',
      importance: 4, // HIGH
      visibility: 1, // PUBLIC
      vibration: true,
      sound: 'res_custom_notification.wav',
    });
  } catch (err) {
    console.warn('[PlanNotificationService] Error creating notification channel:', err);
  }
}

/**
 * Request notification permissions on Android & iOS
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (Capacitor.isNativePlatform()) {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') return true;

      const requested = await LocalNotifications.requestPermissions();
      return requested.display === 'granted';
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      // Web Notification API fallback
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        return perm === 'granted';
      }
    }
    return false;
  } catch (err) {
    console.warn('[PlanNotificationService] Permission request failed:', err);
    return false;
  }
}

/**
 * Generate the full notification schedule based on the plan duration:
 * - Week 1: Everyday (Days 1 to 7)
 * - Mid-Plan: 2-3 weekly (e.g. Days 9, 12, 14, 17, 20, 22...)
 * - Final Week: Days (TotalDays - 6) up to TotalDays
 */
export function generatePlanNotificationSchedule(
  planId: string,
  planName: string,
  durationMonths: number = 1,
  startDateMs: number = Date.now(),
  clientName: string = 'Client'
): PlanNotificationItem[] {
  const totalDays = Math.max(14, Math.round(durationMonths * 30));
  const notifications: PlanNotificationItem[] = [];
  const firstName = clientName.trim().split(' ')[0] || 'Client';

  // Base integer offset for Capacitor notification IDs based on plan hash
  const baseId = Math.abs(
    planId.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ) % 100000;

  // Helper to calculate target scheduled time (set at default 09:30 AM local time)
  const getScheduledEpoch = (dayOffset: number, hour: number = 9, minute: number = 30): number => {
    const d = new Date(startDateMs + dayOffset * 24 * 60 * 60 * 1000);
    d.setHours(hour, minute, 0, 0);
    return d.getTime();
  };

  const formatDate = (ms: number): string => {
    const d = new Date(ms);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // =========================================================================
  // PHASE 1: WEEK 1 — DAILY NOTIFICATIONS (Days 1 to 7)
  // =========================================================================
  const week1Templates = [
    {
      day: 1,
      hour: 9,
      minute: 0,
      title: `🌱 Welcome, ${firstName}! Your Plan is Live`,
      body: `Your ${planName} begins today! Tap to review your personalized meal blueprint and kick-off checklist.`,
      deepLink: '/diet-chart',
    },
    {
      day: 2,
      hour: 8,
      minute: 30,
      title: '💧 Hydration & Morning Fuel',
      body: 'Start your morning with warm water and your prescribed breakfast portion. Consistency starts now!',
      deepLink: '/daily-tracking',
    },
    {
      day: 3,
      hour: 13,
      minute: 0,
      title: '🥗 Lunch Balance & Protein Portions',
      body: 'How is your plate balanced today? Remember your prescribed protein target to sustain afternoon energy.',
      deepLink: '/daily-tracking',
    },
    {
      day: 4,
      hour: 18,
      minute: 30,
      title: '🏃 Daily Movement & Steps Check-In',
      body: 'Time for your evening brisk walk or workout. Consistent physical activity enhances metabolic sensitivity.',
      deepLink: '/daily-tracking',
    },
    {
      day: 5,
      hour: 9,
      minute: 30,
      title: '💊 Supplement & Micronutrient Stack',
      body: 'Take your prescribed Vitamin D3 and morning supplement stack with breakfast for optimal bioavailability.',
      deepLink: '/diet-chart',
    },
    {
      day: 6,
      hour: 20,
      minute: 30,
      title: '🌙 Sleep & Rest Recovery Routine',
      body: 'Dim your screens and drink your herbal chamomile/warm water. Quality deep sleep accelerates fat loss.',
      deepLink: '/daily-tracking',
    },
    {
      day: 7,
      hour: 10,
      minute: 0,
      title: `🎉 Week 1 Complete, ${firstName}!`,
      body: 'You successfully completed your first 7 days! Tap to view your consistency score and week 2 preview.',
      deepLink: '/summary',
    },
  ];

  week1Templates.forEach((item, idx) => {
    const epoch = getScheduledEpoch(item.day - 1, item.hour, item.minute);
    notifications.push({
      id: baseId + idx + 1,
      notificationKey: `${planId}_day_${item.day}`,
      planId,
      planName,
      phase: 'week1_daily',
      dayNumber: item.day,
      title: item.title,
      body: item.body,
      scheduleTime: epoch,
      scheduleTimeFormatted: formatDate(epoch),
      deepLink: item.deepLink,
      delivered: false,
      channelId: NOTIFICATION_CHANNEL_ID,
    });
  });

  // =========================================================================
  // PHASE 2: MID-PLAN WEEKS — 2 TO 3 NOTIFICATIONS WEEKLY
  // Spaced across days between Day 8 and (totalDays - 7)
  // =========================================================================
  const midPlanTemplates = [
    {
      dayOffsetFactor: 0.15, // Approx Day 9-10
      hour: 10,
      minute: 0,
      title: '📊 Metabolic Momentum Underway',
      body: 'Your body is adjusting to balanced nutrient timing. Keep your hydration and meal windows steady today!',
      deepLink: '/diet-chart',
    },
    {
      dayOffsetFactor: 0.25, // Approx Day 12-13
      hour: 17,
      minute: 0,
      title: '⚡ Weekend Balance & Adherence',
      body: 'Heading into the weekend: stick to your 80/20 lifestyle guideline and enjoy guilt-free mindful nourishment.',
      deepLink: '/daily-tracking',
    },
    {
      dayOffsetFactor: 0.35, // Approx Day 14-15
      hour: 20,
      minute: 0,
      title: '📝 Mid-Plan Reflection & Waist Tracking',
      body: 'Log your energy level and waist measurements to track your clinical transformation progress.',
      deepLink: '/daily-tracking',
    },
    {
      dayOffsetFactor: 0.48, // Approx Day 18-20
      hour: 11,
      minute: 0,
      title: '🩸 Diagnostic Lab Diagnostics Check',
      body: 'Review your upcoming blood test diagnostic milestones and lab reports with your clinical nutritionist.',
      deepLink: '/blood-tests',
    },
    {
      dayOffsetFactor: 0.60, // Approx Day 22-24
      hour: 9,
      minute: 30,
      title: `🌟 Habit Master Milestone, ${firstName}!`,
      body: 'Notice how much lighter and more energized you feel throughout the day. Consistency is your superpower!',
      deepLink: '/summary',
    },
    {
      dayOffsetFactor: 0.72, // Approx Day 26-27
      hour: 16,
      minute: 0,
      title: '🤝 1-on-1 Nutritionist Chat Touchpoint',
      body: 'Have questions on recipe variations or workout fatigue? Send a direct check-in message to Sneha Dey.',
      deepLink: '/counselling',
    },
  ];

  const midPlanStartDay = 8;
  const midPlanEndDay = Math.max(midPlanStartDay + 3, totalDays - 7);
  const midRange = midPlanEndDay - midPlanStartDay;

  midPlanTemplates.forEach((item, idx) => {
    const targetDay = Math.min(
      midPlanEndDay,
      Math.max(midPlanStartDay, Math.round(midPlanStartDay + item.dayOffsetFactor * midRange))
    );
    const epoch = getScheduledEpoch(targetDay - 1, item.hour, item.minute);

    notifications.push({
      id: baseId + 100 + idx,
      notificationKey: `${planId}_mid_${targetDay}`,
      planId,
      planName,
      phase: 'mid_weekly',
      dayNumber: targetDay,
      title: item.title,
      body: item.body,
      scheduleTime: epoch,
      scheduleTimeFormatted: formatDate(epoch),
      deepLink: item.deepLink,
      delivered: false,
      channelId: NOTIFICATION_CHANNEL_ID,
    });
  });

  // =========================================================================
  // PHASE 3: FINAL WEEK — RENEWAL, UPGRADE & EXIT CONSULTATION
  // Last 7 Days (e.g. Day Total-6 up to Total)
  // =========================================================================
  const finalWeekStartDay = Math.max(midPlanEndDay + 1, totalDays - 6);

  const finalTemplates = [
    {
      dayOffset: 0, // Day Total-6
      hour: 10,
      minute: 0,
      title: `🏆 Final Week Begins, ${firstName}!`,
      body: `You are entering the final 7 days of your ${planName}. Let's finish strong and cement your results!`,
      deepLink: '/summary',
    },
    {
      dayOffset: 2, // Day Total-4
      hour: 11,
      minute: 30,
      title: '📈 Your Transformation Report is Ready',
      body: 'Sneha Dey has analyzed your multi-week adherence metrics. Tap to see how your body metrics improved!',
      deepLink: '/summary',
    },
    {
      dayOffset: 3, // Day Total-3
      hour: 14,
      minute: 0,
      title: '🌿 Transition to Your Next Care Phase',
      body: 'Avoid the rebound plateau: 89% of clients continue with the 2-Month or 3-Month Metabolic Reset plan.',
      deepLink: '/packages',
    },
    {
      dayOffset: 4, // Day Total-2
      hour: 9,
      minute: 30,
      title: '🎁 Exclusive Alumni Renewal Offer',
      body: 'Special continuing care discount unlocked: Save on your next Long-Term Transformation package.',
      deepLink: '/packages',
    },
    {
      dayOffset: 5, // Day Total-1
      hour: 17,
      minute: 0,
      title: '📅 Book Your Exit Consultation with Sneha Dey',
      body: 'Schedule your comprehensive 1-on-1 exit consultation to review biomarkers and establish your future blueprint.',
      deepLink: '/counselling',
    },
    {
      dayOffset: 6, // Final Day (TotalDays)
      hour: 9,
      minute: 0,
      title: `🌟 Congratulations on Completing ${planName}!`,
      body: 'Milestone achieved! Your transformation journey has just begun. Pick your renewal package to stay on track.',
      deepLink: '/packages',
    },
  ];

  finalTemplates.forEach((item, idx) => {
    const targetDay = Math.min(totalDays, finalWeekStartDay + item.dayOffset);
    const epoch = getScheduledEpoch(targetDay - 1, item.hour, item.minute);

    notifications.push({
      id: baseId + 200 + idx,
      notificationKey: `${planId}_final_${targetDay}`,
      planId,
      planName,
      phase: 'final_renewal',
      dayNumber: targetDay,
      title: item.title,
      body: item.body,
      scheduleTime: epoch,
      scheduleTimeFormatted: formatDate(epoch),
      deepLink: item.deepLink,
      delivered: false,
      channelId: NOTIFICATION_CHANNEL_ID,
    });
  });

  // Sort chronologically by scheduleTime
  return notifications.sort((a, b) => a.scheduleTime - b.scheduleTime);
}

/**
 * Schedule notifications on native device via Capacitor LocalNotifications
 */
export async function schedulePlanLocalNotifications(
  notifications: PlanNotificationItem[]
): Promise<boolean> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn('[PlanNotificationService] Notification permission not granted');
    }

    await initializeNotificationChannels();

    if (Capacitor.isNativePlatform()) {
      const now = Date.now();
      const futureNotifications = notifications.filter((n) => n.scheduleTime > now);

      if (futureNotifications.length > 0) {
        await LocalNotifications.schedule({
          notifications: futureNotifications.map((n) => ({
            id: n.id,
            title: n.title,
            body: n.body,
            schedule: { at: new Date(n.scheduleTime) },
            channelId: NOTIFICATION_CHANNEL_ID,
            extra: {
              deepLink: n.deepLink,
              planId: n.planId,
              dayNumber: n.dayNumber,
              phase: n.phase,
            },
          })),
        });
      }
    }

    return true;
  } catch (err) {
    console.error('[PlanNotificationService] Failed to schedule native notifications:', err);
    return false;
  }
}

/**
 * Cancel previously scheduled notifications for a plan
 */
export async function cancelPlanLocalNotifications(planId: string): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      const pending = await LocalNotifications.getPending();
      const toCancel = pending.notifications.filter(
        (n) => n.extra?.planId === planId
      );

      if (toCancel.length > 0) {
        await LocalNotifications.cancel({
          notifications: toCancel.map((n) => ({ id: n.id })),
        });
      }
    }
  } catch (err) {
    console.warn('[PlanNotificationService] Error cancelling notifications:', err);
  }
}

/**
 * Sync scheduled notifications to Firebase Realtime Database
 */
export async function syncPlanNotificationsToFirebase(
  userId: string,
  planId: string,
  notifications: PlanNotificationItem[]
): Promise<void> {
  // Store locally in LocalStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}_${planId}`, JSON.stringify(notifications));
  }

  // Store in Firebase Realtime Database
  if (isFirebaseConfigured && database && userId) {
    try {
      const targetRef = ref(database, `users/${userId}/scheduledPlanNotifications/${planId}`);
      await set(targetRef, {
        planId,
        updatedAt: Date.now(),
        totalCount: notifications.length,
        notifications,
      });
    } catch (err) {
      console.warn('[PlanNotificationService] Firebase sync failed, relying on local storage:', err);
    }
  }
}

/**
 * Retrieve active plan notifications from LocalStorage or Firebase
 */
export async function getPlanNotifications(
  userId: string,
  planId: string
): Promise<PlanNotificationItem[]> {
  // 1. Try LocalStorage
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(`${STORAGE_PREFIX}${userId}_${planId}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // ignore parse error
      }
    }
  }

  // 2. Try Firebase
  if (isFirebaseConfigured && database && userId) {
    try {
      const targetRef = ref(database, `users/${userId}/scheduledPlanNotifications/${planId}`);
      const snap = await get(targetRef);
      if (snap.exists()) {
        const val = snap.val();
        return val.notifications || [];
      }
    } catch (e) {
      console.warn('[PlanNotificationService] Error fetching from Firebase:', e);
    }
  }

  return [];
}

/**
 * Trigger an immediate test notification for live verification
 */
export async function triggerInstantTestNotification(
  title: string = '🌱 She Nourishes Plan Check-in',
  body: string = 'Your daily nutrition & hydration reminder is active! Tap to open.'
): Promise<void> {
  const perm = await requestNotificationPermissions();

  if (Capacitor.isNativePlatform()) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Math.floor(Math.random() * 999999),
          title,
          body,
          schedule: { at: new Date(Date.now() + 1500) }, // 1.5 seconds delay
          channelId: NOTIFICATION_CHANNEL_ID,
        },
      ],
    });
  } else if (typeof window !== 'undefined' && 'Notification' in window && perm) {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  }
}
