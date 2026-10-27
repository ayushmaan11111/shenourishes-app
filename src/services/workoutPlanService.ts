/**
 * Workout Plan Data & Service
 * 
 * Contains:
 * - 8 Curated Workout Program Templates directly from the She Nourishes syllabus:
 *   1. Foundation: 7 Days Mobility & Stretches
 *   2. Beginner Routine for Sedentary Beginner (Day 2 to Day 7)
 *   3. Beginner Home Workout (Day 1 to Day 7)
 *   4. Beginner Gym Chart (Day 1 to Day 7)
 *   5. Intermediate Gym Workout (Monday to Sunday)
 *   6. Advanced Gym Program (Monday to Sunday)
 *   7. Home High-Intensity Program (Monday to Sunday)
 *   8. Moderate Intensity Home PT Workout (Week 1 & Week 2)
 * - Map to 162 local illustrating MP4 videos stored in /vids-work/
 * - YouTube link property support for every exercise
 * - Client-specific persistence (Firebase Realtime Database + LocalStorage cache)
 * - Custom events for instant live sync between Admin and Client panels
 */

import { database, isFirebaseConfigured } from './firebase';
import { ref, get, set } from 'firebase/database';

export interface PrescribedExerciseItem {
  id: string;
  name: string;
  target: string; // e.g. "3 sets x 12-15 reps" or "5-8 reps" or "Hold 15-20 sec"
  videoFileName?: string; // e.g. "wall_squats.mp4"
  videoUrl?: string; // e.g. "/vids-work/wall_squats.mp4"
  youtubeUrl?: string; // YouTube tutorial link (e.g. "https://www.youtube.com/watch?v=...")
  instructions?: string;
  completed?: boolean;
}

export interface DailyWorkoutDay {
  dayId: string;
  dayName: string; // e.g. "Monday - Lower Body + Glutes"
  focusArea: string;
  isRestDay: boolean;
  exercises: PrescribedExerciseItem[];
}

export interface ClientDailyWorkoutPlan {
  id: string;
  clientId: string;
  clientName: string;
  planTitle: string; // e.g. "Section 8 - Moderate Intensity Home PT Workout"
  programType: string;
  assignedAt: number;
  assignedBy: string;
  notes?: string;
  days: DailyWorkoutDay[];
}

// Available local video names in /vids-work/
export const AVAILABLE_VIDEOS: string[] = [
  'abdominal_crunches.mp4',
  'alternating_bench_step_ups.mp4',
  'alternating_dumbbell_bicep_curl.mp4',
  'arm_circles_and_marching.mp4',
  'barbell_back_squat.mp4',
  'barbell_front_squat.mp4',
  'battle_ropes.mp4',
  'bear_plank.mp4',
  'beginner_dead_bug.mp4',
  'bench_step_ups.mp4',
  'bicycle_crunches.mp4',
  'bird_dog.mp4',
  'bodyweight_squat.mp4',
  'bodyweight_squat_hold.mp4',
  'bodyweight_squats.mp4',
  'box_jumps.mp4',
  'bulgarian_split_squat.mp4',
  'burpees.mp4',
  'cable_triceps_pushdowns.mp4',
  'calf_raises.mp4',
  'chair_squats.mp4',
  'chest_stretch.mp4',
  'copenhagen_plank.mp4',
  'cross_body_mountain_climbers.mp4',
  'crunch_twists.mp4',
  'crunch_twists_2.mp4',
  'crunches.mp4',
  'curtsy_lunges.mp4',
  'cycling.mp4',
  'donkey_calf_raises.mp4',
  'dumbbell_bicep_curls.mp4',
  'dumbbell_bird_dog.mp4',
  'dumbbell_bulgarian_split_squat.mp4',
  'dumbbell_dead_bug.mp4',
  'dumbbell_front_squat.mp4',
  'dumbbell_glute_bridge.mp4',
  'dumbbell_glute_bridge_2.mp4',
  'dumbbell_heel_taps.mp4',
  'dumbbell_hip_thrust.mp4',
  'dumbbell_march.mp4',
  'dumbbell_pullover.mp4',
  'dumbbell_punches.mp4',
  'dumbbell_renegade_row.mp4',
  'dumbbell_romanian_deadlift.mp4',
  'dumbbell_row.mp4',
  'dumbbell_russian_twists.mp4',
  'dumbbell_shrugs.mp4',
  'dumbbell_side_bends.mp4',
  'dumbbell_sit_to_stand.mp4',
  'dumbbell_squats.mp4',
  'dumbbell_suitcase_march.mp4',
  'dumbbell_thrusters.mp4',
  'elliptical.mp4',
  'fast_feet.mp4',
  'floor_dumbbell_press.mp4',
  'forward_steps.mp4',
  'forward_steps_2.mp4',
  'frog_pumps.mp4',
  'glute_bridge.mp4',
  'glute_bridge_march.mp4',
  'goblet_squat.mp4',
  'good_mornings.mp4',
  'hamstring_bridge.mp4',
  'hamstring_heel_digs.mp4',
  'high_knees_march.mp4',
  'hip_abduction.mp4',
  'hip_adduction.mp4',
  'hip_flexor_stretch.mp4',
  'hollow_body_hold.mp4',
  'incline_dumbbell_press.mp4',
  'incline_treadmill_walking.mp4',
  'jumping_jacks.mp4',
  'lat_pulldown.mp4',
  'lateral_lunges.mp4',
  'lateral_step_ups.mp4',
  'lateral_steps.mp4',
  'leg_curls.mp4',
  'leg_press.mp4',
  'leg_raises.mp4',
  'lunges.mp4',
  'lying_dumbbell_hamstring_curls.mp4',
  'lying_leg_raises.mp4',
  'machine_chest_press.mp4',
  'neck_stretch.mp4',
  'overhead_triceps_extension.mp4',
  'plank_hip_extension.mp4',
  'plank_knee_drives.mp4',
  'plank_shoulder_taps.mp4',
  'resistance_band_lateral_walks.mp4',
  'reverse_crunches.mp4',
  'seated_arm_circles_and_punches.mp4',
  'seated_bicep_curls.mp4',
  'seated_chair_march.mp4',
  'seated_dumbbell_calf_raises.mp4',
  'seated_dumbbell_chest_press.mp4',
  'seated_dumbbell_front_raises.mp4',
  'seated_dumbbell_isometric_hold.mp4',
  'seated_dumbbell_lateral_raises.mp4',
  'seated_dumbbell_leg_extensions.mp4',
  'seated_dumbbell_row.mp4',
  'seated_dumbbell_rows.mp4',
  'seated_dumbbell_shoulder_press.mp4',
  'seated_dumbbell_squat_to_knee_raise.mp4',
  'seated_foot_taps.mp4',
  'seated_foot_taps_2.mp4',
  'seated_heel_taps.mp4',
  'seated_heel_taps_2.mp4',
  'seated_jumping_jacks.mp4',
  'seated_knee_raises.mp4',
  'seated_machine_calf_raises.mp4',
  'seated_march.mp4',
  'seated_punches.mp4',
  'seated_resistance_band_rows.mp4',
  'seated_toe_taps.mp4',
  'shoulder_stretch.mp4',
  'side_bend_stretch.mp4',
  'side_heel_digs.mp4',
  'side_plank.mp4',
  'side_plank_hold.mp4',
  'side_steps.mp4',
  'side_to_side_steps.mp4',
  'single_arm_dumbbell_row.mp4',
  'single_leg_deadlift.mp4',
  'single_leg_hip_thrust.mp4',
  'sit_up_crunch.mp4',
  'skater_steps.mp4',
  'sliding_leg_curls.mp4',
  'split_squats.mp4',
  'squat_jumps.mp4',
  'squat_thrusts.mp4',
  'squat_to_calf_raise.mp4',
  'standing_alternating_punches.mp4',
  'standing_calf_raises.mp4',
  'standing_dumbbell_bicep_curls.mp4',
  'standing_dumbbell_calf_raises.mp4',
  'standing_dumbbell_lateral_raises.mp4',
  'standing_dumbbell_shoulder_press.mp4',
  'standing_forward_punches.mp4',
  'standing_hamstring_stretch.mp4',
  'standing_knee_raises.mp4',
  'standing_quad_stretch.mp4',
  'step_jacks.mp4',
  'step_ups.mp4',
  'step_ups_2.mp4',
  'step_ups_3.mp4',
  'straight_leg_reverse_crunch.mp4',
  'studio_walking.mp4',
  'studio_walking_2.mp4',
  'studio_walking_3.mp4',
  'toe_touch_crunches.mp4',
  'treadmill_running.mp4',
  'treadmill_walking.mp4',
  'wall_arm_slides.mp4',
  'wall_calf_stretch.mp4',
  'wall_push_ups.mp4',
  'wall_sit.mp4',
  'wall_sit_2.mp4',
  'wall_squats.mp4',
  'weighted_leg_raises.mp4',
  'windshield_wipers.mp4',
  'wrist_stretch.mp4',
  'wrist_stretch_2.mp4'
];

/**
 * Match exercise name to best video filename if one exists
 */
export const findVideoForExercise = (name: string): string | undefined => {
  const clean = name.toLowerCase().trim().replace(/[*]/g, '');
  
  // Exact match with .mp4
  const candidate = clean.replace(/[\s-]+/g, '_') + '.mp4';
  if (AVAILABLE_VIDEOS.includes(candidate)) return candidate;

  // Manual key matching based on syllabus notes
  const mapping: Record<string, string> = {
    'neck_stretch': 'neck_stretch.mp4',
    'standing_hamstring_stretch': 'standing_hamstring_stretch.mp4',
    'standing_quad_stretch': 'standing_quad_stretch.mp4',
    'chest_stretch': 'chest_stretch.mp4',
    'hip_abduction': 'hip_abduction.mp4',
    'hip_adduction': 'hip_adduction.mp4',
    'windshield_wipers': 'windshield_wipers.mp4',
    'wall_push_ups': 'wall_push_ups.mp4',
    'wall_squats': 'wall_squats.mp4',
    'lying_leg_raises': 'lying_leg_raises.mp4',
    'glute_bridge': 'glute_bridge.mp4',
    'calf_raises': 'calf_raises.mp4',
    'shoulder_stretch': 'shoulder_stretch.mp4',
    'side_bend_stretch': 'side_bend_stretch.mp4',
    'hip_flexor_stretch': 'hip_flexor_stretch.mp4',
    'wall_calf_stretch': 'wall_calf_stretch.mp4',
    'split_squats': 'split_squats.mp4',
    'wall_arm_slides': 'wall_arm_slides.mp4',
    'chair_squats': 'chair_squats.mp4',
    'bodyweight_squat': 'bodyweight_squat.mp4',
    'bodyweight_squats': 'bodyweight_squats.mp4',
    'single_arm_dumbbell_row': 'single_arm_dumbbell_row.mp4',
    'dumbbell_bicep_curls': 'dumbbell_bicep_curls.mp4',
    'standing_dumbbell_shoulder_press': 'standing_dumbbell_shoulder_press.mp4',
    'beginner_dead_bug': 'beginner_dead_bug.mp4',
    'bird_dog': 'bird_dog.mp4',
    'glute_bridge_march': 'glute_bridge_march.mp4',
    'standing_knee_raises': 'standing_knee_raises.mp4',
    'dumbbell_dead_bug': 'dumbbell_dead_bug.mp4',
    'dumbbell_heel_taps': 'dumbbell_heel_taps.mp4',
    'seated_dumbbell_squat_to_knee_raise': 'seated_dumbbell_squat_to_knee_raise.mp4',
    'dumbbell_russian_twists': 'dumbbell_russian_twists.mp4',
    'dumbbell_glute_bridge': 'dumbbell_glute_bridge.mp4',
    'dumbbell_suitcase_march': 'dumbbell_suitcase_march.mp4',
    'dumbbell_side_bends': 'dumbbell_side_bends.mp4',
    'dumbbell_bird_dog': 'dumbbell_bird_dog.mp4',
    'dumbbell_march': 'dumbbell_march.mp4',
    'dumbbell_pullover': 'dumbbell_pullover.mp4',
    'seated_bicep_curls': 'seated_bicep_curls.mp4',
    'seated_dumbbell_front_raises': 'seated_dumbbell_front_raises.mp4',
    'seated_dumbbell_lateral_raises': 'seated_dumbbell_lateral_raises.mp4',
    'seated_dumbbell_shoulder_press': 'seated_dumbbell_shoulder_press.mp4',
    'seated_dumbbell_chest_press': 'seated_dumbbell_chest_press.mp4',
    'seated_dumbbell_row': 'seated_dumbbell_row.mp4',
    'seated_dumbbell_leg_extensions': 'seated_dumbbell_leg_extensions.mp4',
    'seated_dumbbell_isometric_hold': 'seated_dumbbell_isometric_hold.mp4',
    'dumbbell_sit_to_stand': 'dumbbell_sit_to_stand.mp4',
    'standing_calf_raises': 'standing_calf_raises.mp4',
    'leg_curls': 'leg_curls.mp4',
    'floor_dumbbell_press': 'floor_dumbbell_press.mp4',
    'wrist_stretch': 'wrist_stretch.mp4',
    'treadmill_walking': 'treadmill_walking.mp4',
    'treadmill_running': 'treadmill_running.mp4',
    'jumping_jacks': 'jumping_jacks.mp4',
    'side_steps': 'side_steps.mp4',
    'hamstring_heel_digs': 'hamstring_heel_digs.mp4',
    'seated_toe_taps': 'seated_toe_taps.mp4',
    'side_to_side_steps': 'side_to_side_steps.mp4',
    'step_jacks': 'step_jacks.mp4',
    'standing_alternating_punches': 'standing_alternating_punches.mp4',
    'standing_forward_punches': 'standing_forward_punches.mp4',
    'arm_circles_and_marching': 'arm_circles_and_marching.mp4',
    'seated_heel_taps': 'seated_heel_taps.mp4',
    'studio_walking': 'studio_walking.mp4',
    'dumbbell_squats': 'dumbbell_squats.mp4',
    'barbell_front_squat': 'barbell_front_squat.mp4',
    'barbell_back_squat': 'barbell_back_squat.mp4',
    'leg_press': 'leg_press.mp4',
    'seated_machine_calf_raises': 'seated_machine_calf_raises.mp4',
    'crunches': 'crunches.mp4',
    'sit_up_crunch': 'sit_up_crunch.mp4',
    'crunch_twists': 'crunch_twists.mp4',
    'crunch_twists_2': 'crunch_twists_2.mp4',
    'leg_raises': 'leg_raises.mp4',
    'machine_chest_press': 'machine_chest_press.mp4',
    'incline_dumbbell_press': 'incline_dumbbell_press.mp4',
    'lat_pulldown': 'lat_pulldown.mp4',
    'alternating_dumbbell_bicep_curl': 'alternating_dumbbell_bicep_curl.mp4',
    'cable_triceps_pushdowns': 'cable_triceps_pushdowns.mp4',
    'dumbbell_shrugs': 'dumbbell_shrugs.mp4',
    'standing_dumbbell_lateral_raises': 'standing_dumbbell_lateral_raises.mp4',
    'cycling': 'cycling.mp4',
    'burpees': 'burpees.mp4',
    'box_jumps': 'box_jumps.mp4',
    'battle_ropes': 'battle_ropes.mp4',
    'elliptical': 'elliptical.mp4',
    'step_ups': 'step_ups.mp4',
    'high_knees_march': 'high_knees_march.mp4',
    'cross_body_mountain_climbers': 'cross_body_mountain_climbers.mp4',
    'dumbbell_hip_thrust': 'dumbbell_hip_thrust.mp4',
    'dumbbell_romanian_deadlift': 'dumbbell_romanian_deadlift.mp4',
    'overhead_triceps_extension': 'overhead_triceps_extension.mp4',
    'lunges': 'lunges.mp4',
    'goblet_squat': 'goblet_squat.mp4',
    'dumbbell_bulgarian_split_squat': 'dumbbell_bulgarian_split_squat.mp4',
    'copenhagen_plank': 'copenhagen_plank.mp4',
    'resistance_band_lateral_walks': 'resistance_band_lateral_walks.mp4',
    'standing_dumbbell_calf_raises': 'standing_dumbbell_calf_raises.mp4',
    'seated_dumbbell_calf_raises': 'seated_dumbbell_calf_raises.mp4',
    'lying_dumbbell_hamstring_curls': 'lying_dumbbell_hamstring_curls.mp4',
    'squat_jumps': 'squat_jumps.mp4',
    'dumbbell_punches': 'dumbbell_punches.mp4',
    'dumbbell_renegade_row': 'dumbbell_renegade_row.mp4',
    'dumbbell_row': 'dumbbell_row.mp4',
    'dumbbell_thrusters': 'dumbbell_thrusters.mp4',
    'bulgarian_split_squat': 'bulgarian_split_squat.mp4',
    'single_leg_hip_thrust': 'single_leg_hip_thrust.mp4',
    'lateral_lunges': 'lateral_lunges.mp4',
    'wall_sit': 'wall_sit.mp4',
    'wall_sit_2': 'wall_sit_2.mp4',
    'donkey_calf_raises': 'donkey_calf_raises.mp4',
    'reverse_crunches': 'reverse_crunches.mp4',
    'plank_shoulder_taps': 'plank_shoulder_taps.mp4',
    'bicycle_crunches': 'bicycle_crunches.mp4',
    'bear_plank': 'bear_plank.mp4',
    'incline_treadmill_walking': 'incline_treadmill_walking.mp4',
    'bench_step_ups': 'bench_step_ups.mp4',
    'skater_steps': 'skater_steps.mp4',
    'lateral_step_ups': 'lateral_step_ups.mp4',
    'hollow_body_hold': 'hollow_body_hold.mp4',
    'plank_knee_drives': 'plank_knee_drives.mp4',
    'side_plank': 'side_plank.mp4',
    'curtsy_lunges': 'curtsy_lunges.mp4',
    'frog_pumps': 'frog_pumps.mp4',
    'single_leg_deadlift': 'single_leg_deadlift.mp4',
    'toe_touch_crunches': 'toe_touch_crunches.mp4',
    'straight_leg_reverse_crunch': 'straight_leg_reverse_crunch.mp4',
    'plank_hip_extension': 'plank_hip_extension.mp4',
    'squat_to_calf_raise': 'squat_to_calf_raise.mp4',
    'alternating_bench_step_ups': 'alternating_bench_step_ups.mp4',
    'squat_thrusts': 'squat_thrusts.mp4',
    'good_mornings': 'good_mornings.mp4',
    'hamstring_bridge': 'hamstring_bridge.mp4',
    'bodyweight_squat_hold': 'bodyweight_squat_hold.mp4',
  };

  if (mapping[clean]) return mapping[clean];

  // Try substring search
  for (const v of AVAILABLE_VIDEOS) {
    const rawName = v.replace('.mp4', '').replace(/_/g, ' ');
    if (clean.includes(rawName) || rawName.includes(clean)) {
      return v;
    }
  }

  return undefined;
};

const createEx = (name: string, target: string, customYt?: string): PrescribedExerciseItem => {
  const vid = findVideoForExercise(name);
  return {
    id: 'ex_' + Math.random().toString(36).substring(2, 9),
    name,
    target,
    videoFileName: vid,
    videoUrl: vid ? `/vids-work/${vid}` : undefined,
    youtubeUrl: customYt || 'https://www.youtube.com/results?search_query=' + encodeURIComponent(name + ' exercise tutorial'),
    completed: false,
  };
};

/**
 * 8 PRE-BUILT CLINICAL WORKOUT PROGRAM TEMPLATES
 */
export const WORKOUT_PROGRAM_TEMPLATES: {
  id: string;
  name: string;
  category: string;
  description: string;
  days: DailyWorkoutDay[];
}[] = [
  {
    id: 'sec-8-moderate-pt',
    name: 'Section 8: Moderate Intensity Home PT Workout (2-Week Cycle)',
    category: 'Home PT & Metabolic Conditioning',
    description: 'Periodized 2-week progressive split focusing on glutes, core, upper strength, and aerobic intervals.',
    days: [
      {
        dayId: 'w1_mon',
        dayName: 'Week 1 - Monday: Lower Body + Glutes',
        focusArea: 'Glute Medius, Quads & Lower Chain',
        isRestDay: false,
        exercises: [
          createEx('bulgarian_split_squat', '3 sets: 10 / 12 / 8 reps each leg'),
          createEx('lunges', '3 sets: 10 / 12 / 8 reps each leg'),
          createEx('single_leg_hip_thrust', '3 sets: 10 / 12 / 8 reps each leg'),
          createEx('lateral_lunges', '3 sets: 10 / 12 / 8 reps each side'),
          createEx('wall_sit', '3 sets: 30 / 40 / 45 sec hold'),
          createEx('donkey_calf_raises', '3 sets: 10 / 12 / 8 reps'),
        ],
      },
      {
        dayId: 'w1_tue',
        dayName: 'Week 1 - Tuesday: Abs + Treadmill',
        focusArea: 'Core Bracing & Aerobic Base',
        isRestDay: false,
        exercises: [
          createEx('beginner_dead_bug', '3 sets: 10 / 12 / 8 reps each side'),
          createEx('reverse_crunches', '3 sets: 10 / 12 / 8 reps'),
          createEx('plank_shoulder_taps', '3 sets: 10 / 12 / 8 reps each side'),
          createEx('bicycle_crunches', '3 sets: 10 / 12 / 8 reps each side'),
          createEx('bear_plank', '3 sets: 30 / 40 / 45 sec hold'),
          createEx('incline_treadmill_walking', '20-25 minutes, moderate incline'),
        ],
      },
      {
        dayId: 'w1_wed',
        dayName: 'Week 1 - Wednesday: Upper Body Push & Pull',
        focusArea: 'Chest, Back, Arms & Scapular Stability',
        isRestDay: false,
        exercises: [
          createEx('machine_chest_press', '3 sets: 10 / 12 / 8 reps'),
          createEx('wall_arm_slides', '3 sets: 10 / 12 / 8 reps'),
          createEx('single_arm_dumbbell_row', '3 sets: 10 / 12 / 8 reps each side'),
          createEx('overhead_triceps_extension', '3 sets: 10 / 12 / 8 reps'),
          createEx('dumbbell_bicep_curls', '3 sets: 20-30 sec isometric squeeze'),
        ],
      },
      {
        dayId: 'w1_thu',
        dayName: 'Week 1 - Thursday: Cardio + Full Body Agility',
        focusArea: 'Cardiovascular Conditioning & Coordination',
        isRestDay: false,
        exercises: [
          createEx('incline_treadmill_walking', '10 minutes, moderate pace warm-up'),
          createEx('bench_step_ups', '3 sets: 10 / 12 / 8 reps each leg'),
          createEx('skater_steps', '3 sets: 10 / 12 / 8 reps each side'),
          createEx('cross_body_mountain_climbers', '3 sets: 10 / 12 / 8 reps each side'),
          createEx('treadmill_running', '10-15 minutes, moderate steady pace'),
        ],
      },
      {
        dayId: 'w1_fri',
        dayName: 'Week 1 - Friday: Lower Body + Posterior Chain',
        focusArea: 'Hamstrings, Glute Bridges & Balance',
        isRestDay: false,
        exercises: [
          createEx('bulgarian_split_squat', '3 sets: 10 / 12 / 8 reps each leg'),
          createEx('step_ups', '3 sets: 10 / 12 / 8 reps each leg'),
          createEx('glute_bridge', '3 sets: 10 / 12 / 8 reps each leg'),
          createEx('lateral_step_ups', '3 sets: 10 / 12 / 8 reps each leg'),
          createEx('wall_sit_2', '3 sets: 20 / 30 / 30 sec single leg hold'),
          createEx('donkey_calf_raises', '3 sets: 10 / 12 / 8 reps'),
        ],
      },
      {
        dayId: 'w1_sat',
        dayName: 'Week 1 - Saturday: Abs + Cardio Finisher',
        focusArea: 'Isometric Core & Interval Cardio',
        isRestDay: false,
        exercises: [
          createEx('hollow_body_hold', '3 sets: 20 / 30 / 30 sec hold'),
          createEx('plank_knee_drives', '3 sets: 10 / 12 / 8 reps each side'),
          createEx('side_plank', '3 sets: 20 / 30 / 30 sec each side'),
          createEx('beginner_dead_bug', '3 sets: 10 / 12 / 8 reps each side'),
          createEx('incline_treadmill_walking', '15-20 minutes, moderate pace'),
        ],
      },
      {
        dayId: 'w1_sun',
        dayName: 'Week 1 - Sunday: Rest & Recovery',
        focusArea: 'Parasympathetic Reset & Mobility',
        isRestDay: true,
        exercises: [
          createEx('neck_stretch', 'Hold 20-30 sec each side'),
          createEx('chest_stretch', 'Hold 20-30 sec'),
          createEx('standing_hamstring_stretch', 'Hold 20-30 sec each leg'),
        ],
      },
    ],
  },
  {
    id: 'sec-1-foundation-mobility',
    name: 'Section 1: Foundation (7 Days, 7 Types of Mobility)',
    category: 'Mobility & Joint Health',
    description: '7-day daily mobility drills and restorative stretching series for fascia decompression.',
    days: [
      {
        dayId: 'mob_d1',
        dayName: 'Day 1 - Leg Swing Mobility',
        focusArea: 'Hip Flexor & Hamstring Dynamic Range',
        isRestDay: false,
        exercises: [
          createEx('Front-to-back leg swing*', '5 repetitions each leg'),
          createEx('Side-to-side leg swing*', '5 repetitions alternate legs'),
          createEx('standing_hamstring_stretch', 'Hold 15-20 sec each leg'),
          createEx('standing_quad_stretch', 'Hold 15-20 sec each leg'),
        ],
      },
      {
        dayId: 'mob_d2',
        dayName: 'Day 2 - Cat & Camel Spinal Waves',
        focusArea: 'Thoracic & Lumbar Mobility',
        isRestDay: false,
        exercises: [
          createEx('Cat-Cow Spinal Flow*', 'Slow movement: 5-8 reps'),
          createEx('chest_stretch', 'Hold 15-20 sec each side'),
          createEx('neck_stretch', 'Hold 15-20 sec each side'),
        ],
      },
      {
        dayId: 'mob_d3',
        dayName: 'Day 3 - Shoulder Mobility',
        focusArea: 'Scapular Protraction, Retraction, Elevation',
        isRestDay: false,
        exercises: [
          createEx('Shoulder Protraction & Retraction*', '8-10 reps'),
          createEx('Shoulder Elevation & Depression*', '8-10 reps'),
          createEx('shoulder_stretch', 'Hold 15-20 sec each side'),
          createEx('chest_stretch', 'Hold 15-20 sec'),
        ],
      },
      {
        dayId: 'mob_d4',
        dayName: 'Day 4 - Arm Rotation',
        focusArea: 'Glenohumeral Joint Health',
        isRestDay: false,
        exercises: [
          createEx('arm_circles_and_marching', 'Forward & backward: 5-10 reps each'),
          createEx('wrist_stretch', 'Hold 15-20 sec each wrist'),
          createEx('neck_stretch', 'Hold 15-20 sec each side'),
        ],
      },
      {
        dayId: 'mob_d5',
        dayName: 'Day 5 - Downward Dog Mobility',
        focusArea: 'Posterior Kinetic Chain & Ankles',
        isRestDay: false,
        exercises: [
          createEx('Downward Dog Mobility Flow*', '5 reps each leg bring knee forward'),
          createEx('wall_calf_stretch', 'Hold 15-20 sec each leg'),
          createEx('hip_flexor_stretch', 'Hold 15-20 sec each side'),
        ],
      },
      {
        dayId: 'mob_d6',
        dayName: 'Day 6 - Foot & Ankle Mobility',
        focusArea: 'Plantar Flexion & Ankle Dorsiflexion',
        isRestDay: false,
        exercises: [
          createEx('standing_calf_raises', 'Toe-to-stand slow raise: 8-10 reps'),
          createEx('wall_calf_stretch', 'Hold 15-20 sec each leg'),
        ],
      },
      {
        dayId: 'mob_d7',
        dayName: 'Day 7 - Neck Mobility & Full Stretches',
        focusArea: 'Cervical Spine & Recovery',
        isRestDay: false,
        exercises: [
          createEx('neck_stretch', 'Look down, up, right, left: 5 reps each'),
          createEx('standing_hamstring_stretch', 'Hold 15-20 sec each leg'),
          createEx('standing_quad_stretch', 'Hold 15-20 sec each leg'),
          createEx('chest_stretch', 'Hold 15-20 sec each side'),
        ],
      },
    ],
  },
  {
    id: 'sec-2-sedentary-beginner',
    name: 'Section 2: Beginner Routine for a Sedentary Beginner',
    category: 'Gentle Re-conditioning',
    description: 'Safe starting progression using bodyweight and wall assistance to build baseline tendon strength.',
    days: [
      {
        dayId: 'sed_d2',
        dayName: 'Version 2nd Day - Wall Support & Core',
        focusArea: 'Introductory Push-Ups, Wall Squats & Holds',
        isRestDay: false,
        exercises: [
          createEx('wall_push_ups', '10-15 reps x 3 sets, 10s rest between sets'),
          createEx('wall_squats', '15-20 total reps; rest 10s after every 5 reps'),
          createEx('neck_stretch', '15-20 sec each side'),
          createEx('standing_hamstring_stretch', '15-20 sec each leg'),
          createEx('standing_quad_stretch', '15-20 sec each leg'),
          createEx('chest_stretch', '15-20 sec each side'),
        ],
      },
      {
        dayId: 'sed_d3',
        dayName: 'Version 3rd Day - Hip & Glute Bridges',
        focusArea: 'Posterior Activation & Knee Extensions',
        isRestDay: false,
        exercises: [
          createEx('lying_leg_raises', '10-12 each leg'),
          createEx('glute_bridge', '8-10 reps'),
          createEx('calf_raises', '10-12 reps'),
          createEx('wall_push_ups', '10-15 reps x 3 sets; 10s rest'),
          createEx('wall_squats', '15-20 reps; rest 10s after every 5 reps'),
          createEx('standing_quad_stretch', '15-20 sec each leg'),
          createEx('shoulder_stretch', '15-20 sec each side'),
        ],
      },
      {
        dayId: 'sed_d4',
        dayName: 'Version 4th Day - Lateral Mobility & Wall Squats',
        focusArea: 'Hip Abduction, Side Bends & Stretches',
        isRestDay: false,
        exercises: [
          createEx('side_bend_stretch', '5-8 reps each side'),
          createEx('wall_squats', '10-15 reps (or chair sit-to-stand)'),
          createEx('standing_quad_stretch', '15-20 sec each leg'),
          createEx('hip_flexor_stretch', '15-20 sec each side'),
          createEx('wall_calf_stretch', '15-20 sec each leg'),
          createEx('chest_stretch', '15-20 sec each side'),
        ],
      },
      {
        dayId: 'sed_d5',
        dayName: 'Version 5th Day - Glute Bridge & Static Lunges',
        focusArea: 'Unilateral Stability & Quadriceps Stretch',
        isRestDay: false,
        exercises: [
          createEx('glute_bridge', 'Single-leg focus: 6-8 each leg'),
          createEx('split_squats', 'Wall-supported static lunge: 8-10 each leg'),
          createEx('wall_squats', '10-15 reps'),
          createEx('side_bend_stretch', '5-8 each side'),
          createEx('chest_stretch', '15-20 sec each side'),
        ],
      },
      {
        dayId: 'sed_d6',
        dayName: 'Version 6th Day - Wall Slides & Split Squats',
        focusArea: 'Push-Ups, Wall Arm Slides & Split Squats',
        isRestDay: false,
        exercises: [
          createEx('wall_push_ups', '10-12 reps x 2-3 sets; rest 10s'),
          createEx('wall_arm_slides', '8-10 reps'),
          createEx('wall_squats', '10-15 reps'),
          createEx('split_squats', '6-10 each leg'),
          createEx('standing_hamstring_stretch', '15-20 sec each leg'),
          createEx('hip_flexor_stretch', '15-20 sec each side'),
        ],
      },
      {
        dayId: 'sed_d7',
        dayName: 'Day 7 - Squat, Lunge & Core Day',
        focusArea: 'Full Kinetic Integration & Heel Touches',
        isRestDay: false,
        exercises: [
          createEx('wall_squats', '10-15 reps'),
          createEx('split_squats', '8-10 each leg'),
          createEx('standing_quad_stretch', '15-20 sec each leg'),
          createEx('wall_calf_stretch', '15-20 sec each leg'),
          createEx('shoulder_stretch', '15-20 sec each side'),
        ],
      },
    ],
  },
  {
    id: 'sec-3-beginner-home',
    name: 'Section 3: Beginner Home Workout (Dumbbells + Bodyweight)',
    category: 'Home Fitness',
    description: 'Home program combining chair squats, light dumbbells, core deadbugs, and mobility.',
    days: [
      {
        dayId: 'bh_d1',
        dayName: '1st Day - Squat Options + Stretching',
        focusArea: 'Chair Squats & Lower Body Stretches',
        isRestDay: false,
        exercises: [
          createEx('chair_squats', 'Sit down and stand up from stable chair (15 reps)'),
          createEx('wall_squats', 'Slide down into comfortable squat (15 reps)'),
          createEx('bodyweight_squat', '12-15 reps if comfortable'),
          createEx('standing_quad_stretch', '15-20 sec each leg'),
          createEx('hip_flexor_stretch', '15-20 sec each side'),
          createEx('chest_stretch', '15-20 sec each side'),
        ],
      },
      {
        dayId: 'bh_d3',
        dayName: '3rd Day - Light Dumbbells Routine',
        focusArea: 'Rows, Bicep Curls & Shoulder Press',
        isRestDay: false,
        exercises: [
          createEx('chair_squats', '15-20 reps x 3 sets'),
          createEx('wall_push_ups', '15-20 reps x 3 sets'),
          createEx('wall_arm_slides', '15-20 reps x 3 sets'),
          createEx('single_arm_dumbbell_row', '15-20 reps each side x 3 sets'),
          createEx('dumbbell_bicep_curls', '15-20 reps x 3 sets'),
          createEx('standing_dumbbell_shoulder_press', '15-20 reps x 3 sets'),
        ],
      },
      {
        dayId: 'bh_d4',
        dayName: '4th Day - Core Exercises & Stretching',
        focusArea: 'Deadbugs, Bird Dogs & Glute Bridges',
        isRestDay: false,
        exercises: [
          createEx('leg_raises', '12-15 reps'),
          createEx('beginner_dead_bug', '10-12 reps each side'),
          createEx('bird_dog', '10-12 reps each side'),
          createEx('glute_bridge_march', '12-15 reps'),
          createEx('standing_knee_raises', '15 reps each leg'),
          createEx('hip_flexor_stretch', '15-20 sec each side'),
          createEx('side_bend_stretch', '15-20 sec each side'),
        ],
      },
      {
        dayId: 'bh_d5',
        dayName: '5th Day - Core + Legs Strength',
        focusArea: 'Split Squats & Deep Core',
        isRestDay: false,
        exercises: [
          createEx('wall_squats', '15-20 reps x 3 sets'),
          createEx('split_squats', '15 reps each leg x 3 sets'),
          createEx('glute_bridge', '15-20 reps x 3 sets'),
          createEx('leg_raises', '15 reps each leg x 3 sets'),
          createEx('beginner_dead_bug', '10-15 reps each side x 3 sets'),
          createEx('bird_dog', '10-15 reps each side x 3 sets'),
        ],
      },
      {
        dayId: 'bh_d6',
        dayName: '6th Day - Dumbbell Core Series',
        focusArea: 'Weighted Deadbugs, Russian Twists & Pullovers',
        isRestDay: false,
        exercises: [
          createEx('dumbbell_dead_bug', '10-12 reps each side'),
          createEx('dumbbell_heel_taps', '12-15 reps'),
          createEx('seated_dumbbell_squat_to_knee_raise', '10-12 reps'),
          createEx('dumbbell_russian_twists', '15-20 total reps'),
          createEx('dumbbell_glute_bridge', '12-15 reps'),
          createEx('dumbbell_suitcase_march', '30-45 sec march'),
          createEx('dumbbell_side_bends', '12-15 reps each side'),
          createEx('dumbbell_pullover', '10-12 reps'),
        ],
      },
      {
        dayId: 'bh_d7',
        dayName: '7th Day - Seated Dumbbell Routine',
        focusArea: 'Desk/Seated Ergonomic Dumbbell Conditioning',
        isRestDay: false,
        exercises: [
          createEx('seated_bicep_curls', '12-15 reps'),
          createEx('seated_dumbbell_front_raises', '10-12 reps'),
          createEx('seated_dumbbell_lateral_raises', '10-12 reps'),
          createEx('seated_dumbbell_shoulder_press', '12-15 reps'),
          createEx('seated_dumbbell_chest_press', '12-15 reps'),
          createEx('seated_dumbbell_row', '12-15 reps'),
          createEx('dumbbell_sit_to_stand', '10-15 reps x 2-3 sets'),
        ],
      },
    ],
  },
  {
    id: 'sec-4-beginner-gym',
    name: 'Section 4: Beginner Gym Chart (Machines + Free Weights)',
    category: 'Commercial Gym Onboarding',
    description: 'Ideal for clients stepping into a commercial gym: leg press, cardio machines, and seated DB work.',
    days: [
      {
        dayId: 'bg_d1',
        dayName: '1st Day - Stretching + Strength + Seated Dumbbell',
        focusArea: 'Compound Squats, Calf Raises & Presses',
        isRestDay: false,
        exercises: [
          createEx('bodyweight_squats', '15-20 reps x 3 sets'),
          createEx('split_squats', '15 reps each leg x 3 sets'),
          createEx('standing_calf_raises', '15-20 reps x 3 sets'),
          createEx('leg_curls', '15-20 reps each leg x 3 sets'),
          createEx('seated_dumbbell_row', '15-20 reps x 3 sets'),
          createEx('floor_dumbbell_press', '15-20 reps x 3 sets'),
          createEx('seated_dumbbell_shoulder_press', '12-15 reps x 3 sets'),
        ],
      },
      {
        dayId: 'bg_d3',
        dayName: '3rd Day - Beginner Cardio & Conditioning',
        focusArea: 'Treadmill Incline & Bodyweight Cadence',
        isRestDay: false,
        exercises: [
          createEx('treadmill_walking', '10 minutes brisk warm-up'),
          createEx('jumping_jacks', '15-20 reps x 3 sets'),
          createEx('bodyweight_squats', '15-20 reps x 3 sets'),
        ],
      },
      {
        dayId: 'bg_d5',
        dayName: '5th Day - Low-Impact Cardio Conditioning',
        focusArea: 'Side Steps, Heel Digs & Step Jacks',
        isRestDay: false,
        exercises: [
          createEx('side_steps', '30-60 sec continuous'),
          createEx('hamstring_heel_digs', '30-60 sec'),
          createEx('seated_toe_taps', '30-60 sec'),
          createEx('side_to_side_steps', '30-60 sec'),
          createEx('step_jacks', '30-60 sec'),
          createEx('standing_knee_raises', '30-60 sec'),
          createEx('treadmill_walking', '10-15 minutes slow comfortable pace'),
        ],
      },
      {
        dayId: 'bg_d6',
        dayName: '6th Day - Light Dumbbell Gym Split',
        focusArea: 'Dumbbell Squats, Leg Curls & Presses',
        isRestDay: false,
        exercises: [
          createEx('dumbbell_squats', '15-20 reps x 3 sets'),
          createEx('split_squats', '15 reps each leg x 3 sets'),
          createEx('standing_calf_raises', '15-20 reps x 3 sets'),
          createEx('leg_curls', '15-20 reps each leg x 3 sets'),
          createEx('seated_dumbbell_row', '15-20 reps x 3 sets'),
          createEx('floor_dumbbell_press', '15-20 reps x 3 sets'),
          createEx('leg_raises', '15-20 reps x 3 sets'),
        ],
      },
    ],
  },
  {
    id: 'sec-5-intermediate-gym',
    name: 'Section 5: Intermediate Gym Workout (Structured Split)',
    category: 'Gym Hypertrophy & Fat Loss',
    description: 'Classic bodybuilding & hypertrophy split: Lower, Abs + Cardio, Cardio Options, Lower, Rest.',
    days: [
      {
        dayId: 'ig_mon',
        dayName: 'Monday - Lower Body Power',
        focusArea: 'Front & Back Squats, Leg Press, Leg Curls',
        isRestDay: false,
        exercises: [
          createEx('barbell_front_squat', '3 sets x 10-12 reps'),
          createEx('barbell_back_squat', '3 sets x 10-12 reps'),
          createEx('leg_press', '3 sets x 12-15 reps'),
          createEx('leg_curls', '3 sets x 12-15 reps'),
          createEx('standing_calf_raises', '3 sets x 15-20 reps'),
          createEx('seated_machine_calf_raises', '3 sets x 15 reps'),
        ],
      },
      {
        dayId: 'ig_tue',
        dayName: 'Tuesday - Abs + Upper Push/Pull',
        focusArea: 'Rotational Abdominals & Upper Torso Sculpt',
        isRestDay: false,
        exercises: [
          createEx('crunches', '3 sets x 22-25 reps'),
          createEx('sit_up_crunch', '3 sets x 22-25 reps'),
          createEx('crunch_twists', '3 sets x 22-25 reps (right side)'),
          createEx('crunch_twists_2', '3 sets x 22-25 reps (left side)'),
          createEx('leg_raises', '3 sets x 22-25 reps'),
          createEx('windshield_wipers', '3 sets x 22-25 reps'),
          createEx('machine_chest_press', '3 sets x 20-25 reps'),
          createEx('incline_dumbbell_press', '3 sets x 20-25 reps'),
          createEx('lat_pulldown', '3 sets x 20-25 reps'),
          createEx('single_arm_dumbbell_row', '3 sets x 20-25 reps'),
          createEx('dumbbell_bicep_curls', '3 sets x 20-25 reps'),
          createEx('cable_triceps_pushdowns', '2 sets x 20-25 reps'),
        ],
      },
      {
        dayId: 'ig_thu',
        dayName: 'Thursday - Cardio Day (HIIT / Low Impact)',
        focusArea: 'Treadmill, Cycling & Explosive Plyometrics',
        isRestDay: false,
        exercises: [
          createEx('treadmill_running', '15 min moderate steady pace'),
          createEx('cycling', '10 min moderate resistance'),
          createEx('burpees', '3 sets x 20 reps controlled pace'),
          createEx('box_jumps', '3 sets x 12 reps soft landing'),
          createEx('battle_ropes', '3 sets x 30 sec high intensity waves'),
        ],
      },
      {
        dayId: 'ig_fri',
        dayName: 'Friday - Lower Body Hypertrophy',
        focusArea: 'Pyramid Squats & Heavy Leg Press',
        isRestDay: false,
        exercises: [
          createEx('barbell_back_squat', '3 sets: 15 / 12 / 10 reps'),
          createEx('leg_press', '3 sets: 15 / 12 / 10 reps'),
          createEx('leg_curls', '3 sets: 15 / 12 / 10 reps'),
          createEx('calf_raises', '3 sets: 15 / 12 / 10 reps'),
        ],
      },
      {
        dayId: 'ig_sat',
        dayName: 'Saturday - Cardio & Core Circuit',
        focusArea: 'Running, Cycling & Mountain Climbers',
        isRestDay: false,
        exercises: [
          createEx('treadmill_running', '15 min moderate pace'),
          createEx('cycling', '10 min moderate resistance'),
          createEx('cross_body_mountain_climbers', '3 sets x 20 reps'),
          createEx('battle_ropes', '3 sets x 30 sec high intensity'),
        ],
      },
      {
        dayId: 'ig_sun',
        dayName: 'Sunday - Rest & Restoration',
        focusArea: 'Complete Muscular Recovery',
        isRestDay: true,
        exercises: [
          createEx('neck_stretch', 'Hold 20 sec each side'),
          createEx('standing_hamstring_stretch', 'Hold 20 sec each leg'),
          createEx('chest_stretch', 'Hold 20 sec'),
        ],
      },
    ],
  },
  {
    id: 'sec-6-advanced-gym',
    name: 'Section 6: Advanced Gym Program (Heavy RM Periodization)',
    category: 'Advanced Strength & Hypertrophy',
    description: 'High-intensity 6-8 RM training designed for seasoned clients aiming for maximal lean mass retention.',
    days: [
      {
        dayId: 'ag_mon',
        dayName: 'Monday - Heavy Legs (6-8 RM)',
        focusArea: 'Heavy Leg Press & Glute Thrusts',
        isRestDay: false,
        exercises: [
          createEx('leg_press', '3 sets - 6 to 8 RM heavy'),
          createEx('dumbbell_hip_thrust', '3 sets - 6 to 8 RM'),
          createEx('hip_adduction', '3 sets - 6 to 8 RM'),
          createEx('hip_abduction', '3 sets - 6 to 8 RM'),
        ],
      },
      {
        dayId: 'ag_tue',
        dayName: 'Tuesday - Calves, Hamstrings & Heavy Abs',
        focusArea: 'Romanian Deadlifts & Direct Ab Work',
        isRestDay: false,
        exercises: [
          createEx('standing_calf_raises', '3 sets - 6 to 8 RM'),
          createEx('seated_machine_calf_raises', '3 sets - 6 to 8 RM'),
          createEx('leg_curls', '3 sets - 6 to 8 RM'),
          createEx('dumbbell_romanian_deadlift', '3 sets - 6 to 8 RM'),
          createEx('crunches', '3 sets x 20 reps'),
          createEx('sit_up_crunch', '3 sets x 20 reps'),
          createEx('leg_raises', '3 sets x 20 reps'),
        ],
      },
      {
        dayId: 'ag_wed',
        dayName: 'Wednesday - Cardio Conditioning',
        focusArea: 'Treadmill, Burpees & Battle Ropes',
        isRestDay: false,
        exercises: [
          createEx('treadmill_running', '1 set - 15 minutes steady pace'),
          createEx('burpees', '3 sets x 20 reps'),
          createEx('box_jumps', '3 sets x 20 reps'),
          createEx('battle_ropes', '3 sets x 20 reps'),
        ],
      },
      {
        dayId: 'ag_thu',
        dayName: 'Thursday - Heavy Pull (Back & Biceps)',
        focusArea: 'Lat Pulldowns, Heavy Dumbbell Rows',
        isRestDay: false,
        exercises: [
          createEx('single_arm_dumbbell_row', '3 sets - 6 to 8 RM'),
          createEx('lat_pulldown', '3 sets - 6 to 8 RM'),
          createEx('standing_dumbbell_shoulder_press', '3 sets - 6 to 8 RM'),
          createEx('dumbbell_bicep_curls', '3 sets - 6 to 8 RM'),
        ],
      },
      {
        dayId: 'ag_fri',
        dayName: 'Friday - Push Day (Chest, Delts & Triceps)',
        focusArea: 'Presses, Lateral Raises & Cable Triceps',
        isRestDay: false,
        exercises: [
          createEx('machine_chest_press', '3 sets - 20 to 25 reps'),
          createEx('incline_dumbbell_press', '3 sets - 20 to 25 reps'),
          createEx('standing_dumbbell_lateral_raises', '3 sets - 20 to 25 reps'),
          createEx('standing_dumbbell_shoulder_press', '3 sets - 20 to 25 reps'),
          createEx('cable_triceps_pushdowns', '3 sets - 20 to 25 reps'),
          createEx('overhead_triceps_extension', '3 sets - 20 to 25 reps'),
        ],
      },
      {
        dayId: 'ag_sat',
        dayName: 'Saturday - Functional Strength & Mobility',
        focusArea: 'Bodyweight Squats, Lunges & Downward Dog',
        isRestDay: false,
        exercises: [
          createEx('bodyweight_squats', '3 sets - 15 to 20 reps'),
          createEx('lunges', '3 sets - 10 reps each leg'),
          createEx('standing_hamstring_stretch', 'Hold 20 sec each leg'),
        ],
      },
      {
        dayId: 'ag_sun',
        dayName: 'Sunday - Complete Rest & Recovery',
        focusArea: 'Central Nervous System Reset',
        isRestDay: true,
        exercises: [
          createEx('neck_stretch', 'Hold 20 sec each side'),
          createEx('chest_stretch', 'Hold 20 sec'),
        ],
      },
    ],
  },
  {
    id: 'sec-7-home-hiit',
    name: 'Section 7: Home High-Intensity Program (HIIT + Dumbbells)',
    category: 'Home Fat Oxidation & Density',
    description: 'High-density home routine featuring Goblet Squats, Bulgarian Split Squats, and Renegade Rows.',
    days: [
      {
        dayId: 'hhiit_mon',
        dayName: 'Monday - Heavy Home Legs',
        focusArea: 'Goblet Squats, Bulgarian Split Squats & Planks',
        isRestDay: false,
        exercises: [
          createEx('goblet_squat', '3 sets x 6-8 RM'),
          createEx('dumbbell_bulgarian_split_squat', '3 sets x 8-10 reps each leg'),
          createEx('dumbbell_hip_thrust', '3 sets x 8-12 RM'),
          createEx('copenhagen_plank', '3 sets x 20-30 sec each side'),
          createEx('resistance_band_lateral_walks', '3 sets x 12-15 steps each direction'),
        ],
      },
      {
        dayId: 'hhiit_tue',
        dayName: 'Tuesday - Calves, Hamstrings & Abs',
        focusArea: 'Romanian Deadlifts, Hamstring Curls & Crunches',
        isRestDay: false,
        exercises: [
          createEx('standing_dumbbell_calf_raises', '3 sets x 10-15 each leg'),
          createEx('seated_dumbbell_calf_raises', '3 sets x 12-15 reps'),
          createEx('lying_dumbbell_hamstring_curls', '3 sets x 8-12 reps'),
          createEx('dumbbell_romanian_deadlift', '3 sets x 6-8 RM'),
          createEx('crunches', '3 sets x 20 reps'),
          createEx('sit_up_crunch', '3 sets x 15-20 reps'),
          createEx('leg_raises', '3 sets x 12-20 reps'),
        ],
      },
      {
        dayId: 'hhiit_wed',
        dayName: 'Wednesday - Cardio Burn (Choose 5)',
        focusArea: 'Treadmill, Burpees, Mountain Climbers & Punches',
        isRestDay: false,
        exercises: [
          createEx('treadmill_running', '1 set x 15-20 min, moderate to high'),
          createEx('burpees', '3 sets x 15-20 reps'),
          createEx('squat_jumps', '3 sets x 10-15 reps'),
          createEx('dumbbell_punches', '3 sets x 30-45 sec'),
          createEx('dumbbell_renegade_row', '3 sets x 10-15 reps'),
          createEx('cross_body_mountain_climbers', '3 sets x 30-45 sec'),
        ],
      },
      {
        dayId: 'hhiit_thu',
        dayName: 'Thursday - Home Pull Day (Back & Biceps)',
        focusArea: 'Single Arm Rows & Shoulder Press',
        isRestDay: false,
        exercises: [
          createEx('single_arm_dumbbell_row', '3 sets x 6-8 RM each side'),
          createEx('lat_pulldown', '3 sets x 10-15 reps'),
          createEx('dumbbell_row', '3 sets x 8-12 reps'),
          createEx('standing_dumbbell_shoulder_press', '3 sets x 6-8 RM'),
          createEx('dumbbell_bicep_curls', '3 sets x 8-12 RM'),
        ],
      },
      {
        dayId: 'hhiit_fri',
        dayName: 'Friday - Home Push Day (Chest & Triceps)',
        focusArea: 'Floor Press, Incline DB Press & Extensions',
        isRestDay: false,
        exercises: [
          createEx('floor_dumbbell_press', '3 sets x 6-8 RM'),
          createEx('incline_dumbbell_press', '3 sets x 6-8 RM'),
          createEx('standing_dumbbell_shoulder_press', '3 sets x 6-8 RM'),
          createEx('overhead_triceps_extension', '3 sets x 8-12 reps each arm'),
        ],
      },
      {
        dayId: 'hhiit_sat',
        dayName: 'Saturday - Cardio & Thrusters',
        focusArea: 'Full Body Metabolic Flush',
        isRestDay: false,
        exercises: [
          createEx('treadmill_running', '1 set x 15-20 min'),
          createEx('burpees', '3 sets x 20 reps'),
          createEx('squat_jumps', '3 sets x 10-15 reps'),
          createEx('dumbbell_thrusters', '3 sets x 12-15 reps'),
          createEx('cross_body_mountain_climbers', '3 sets x 30-45 sec'),
        ],
      },
      {
        dayId: 'hhiit_sun',
        dayName: 'Sunday - Rest & Full Stretch Routine',
        focusArea: 'Lower Back & Quadriceps Release',
        isRestDay: true,
        exercises: [
          createEx('standing_hamstring_stretch', 'Hold 20-30 sec'),
          createEx('standing_quad_stretch', 'Hold 20-30 sec'),
          createEx('chest_stretch', 'Hold 20-30 sec'),
          createEx('shoulder_stretch', 'Hold 20-30 sec'),
        ],
      },
    ],
  },
];

const LOCAL_WORKOUT_PLAN_PREFIX = 'she_nourishes_workout_plan_';

/**
 * Get assigned workout plan for a specific client
 */
export const getClientWorkoutPlan = async (clientId: string): Promise<ClientDailyWorkoutPlan | null> => {
  if (!clientId) clientId = 'default';

  // 1. Check LocalStorage cache
  try {
    const raw = localStorage.getItem(LOCAL_WORKOUT_PLAN_PREFIX + clientId);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading local workout plan:', err);
  }

  // 2. Check Firebase Realtime Database
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, `customers/${clientId}/dailyWorkoutPlan`));
      if (snap.exists()) {
        const val = snap.val();
        localStorage.setItem(LOCAL_WORKOUT_PLAN_PREFIX + clientId, JSON.stringify(val));
        return val;
      }
    } catch (err) {
      console.warn('Firebase get error for dailyWorkoutPlan:', err);
    }
  }

  // 3. Fallback: No automated plan assigned. Return null until Admin manually creates/assigns one.
  return null;
};

/**
 * Save / Update assigned workout plan for a client
 */
export const saveClientWorkoutPlan = async (plan: ClientDailyWorkoutPlan): Promise<void> => {
  const cid = plan.clientId || 'default';

  // Update local cache
  try {
    localStorage.setItem(LOCAL_WORKOUT_PLAN_PREFIX + cid, JSON.stringify(plan));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // Save to Firebase
  if (isFirebaseConfigured && database) {
    try {
      await set(ref(database, `customers/${cid}/dailyWorkoutPlan`), plan);
    } catch (err) {
      console.warn('Firebase set error for dailyWorkoutPlan:', err);
    }
  }

  // Dispatch custom event for reactive real-time UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('client_workout_plan_updated', { detail: plan }));
  }
};

const LOCAL_PROGRESS_PREFIX = 'she_nourishes_workout_progress_';

export interface DayExerciseProgressRecord {
  clientId: string;
  date: string; // YYYY-MM-DD
  dayId?: string;
  completedExerciseIds: Record<string, boolean>;
  percentage: number;
  totalExercises: number;
  completedExercisesCount: number;
  updatedAt: number;
}

export function getTodayDateKey(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get daily exercise completion progress for a client on a specific date
 */
export const getDayExerciseProgress = (clientId: string, date = getTodayDateKey()): DayExerciseProgressRecord => {
  const cid = clientId || 'default';
  const key = `${LOCAL_PROGRESS_PREFIX}${cid}_${date}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading day exercise progress:', e);
  }

  return {
    clientId: cid,
    date,
    completedExerciseIds: {},
    percentage: 0,
    totalExercises: 0,
    completedExercisesCount: 0,
    updatedAt: Date.now(),
  };
};

/**
 * Save daily exercise completion progress to LocalStorage, Firebase, and dispatch event
 */
export const saveDayExerciseProgress = async (record: DayExerciseProgressRecord): Promise<void> => {
  const cid = record.clientId || 'default';
  const key = `${LOCAL_PROGRESS_PREFIX}${cid}_${record.date}`;

  try {
    localStorage.setItem(key, JSON.stringify(record));
  } catch (e) {
    console.warn('Error saving day exercise progress to localStorage:', e);
  }

  if (isFirebaseConfigured && database && cid) {
    try {
      await set(ref(database, `customers/${cid}/dailyWorkoutProgress/${record.date}`), record);
    } catch (err) {
      console.warn('Firebase error saving daily workout progress:', err);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('daily_activity_progress_updated', { detail: record }));
  }
};

