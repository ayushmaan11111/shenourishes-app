import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  accentColor?: string;
  className?: string;
}

// 1. Muscle Gain — Flexed bicep with muscle hypertrophy growth indicators
export const IconMuscleGain: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#F8F6EF" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Flexed Arm & Bicep Peak */}
    <path
      d="M18 42C18 36 21 31 27 30C27.5 24 33 22 39 23C44 24 47 28 47 34C47 38 44 42 40 43C36 44 26 44 18 42Z"
      fill="#EEF4E8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bicep Muscle Peak Definition */}
    <path
      d="M32 23C35 25.5 37 29 37 33"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M24 34C28 35 32 37 35 41"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    {/* Growth / Hypertrophy Sparkles */}
    <path d="M37 16L39 12L41 16L45 18L41 20L39 24L37 20L33 18L37 16Z" fill={accentColor} />
    <circle cx="47" cy="22" r="1.5" fill={accentColor} />
  </svg>
);

// 2. Bone Health Support — Dense bone matrix with mineralization plus cross
export const IconBoneHealth: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#F8F6EF" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Anatomical Bone Outline */}
    <path
      d="M20 22C17.5 22 16 20 16 17.5C16 15 18 13 20.5 13C22.5 13 24 14.5 24.5 16.5C25.5 16 27 16.5 28 17.5L46.5 36C47.5 37 48 38.5 47.5 39.5C49.5 40 51 41.5 51 43.5C51 46 49 48 46.5 48C44 48 42 46.5 42 44C41 43 40.5 41.5 41.5 40.5L23 22C22 21 21 22 20 22Z"
      fill="#EEF4E8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Mineralization Cross / Shield Badge */}
    <circle cx="25" cy="39" r="10" fill="#FFFDF8" stroke={accentColor} strokeWidth="1.5" />
    <path d="M25 34V44M20 39H30" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 3. Strength & Power — Heavy barbell with kinetic explosive energy
export const IconPowerStrength: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#F8F6EF" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Barbell Shaft */}
    <line x1="12" y1="32" x2="52" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Outer Plates */}
    <rect x="16" y="20" width="5" height="24" rx="2" fill="#EEF4E8" stroke={color} strokeWidth="2" />
    <rect x="43" y="20" width="5" height="24" rx="2" fill="#EEF4E8" stroke={color} strokeWidth="2" />
    {/* Inner Collars */}
    <rect x="22" y="24" width="3" height="16" rx="1.5" fill={color} />
    <rect x="39" y="24" width="3" height="16" rx="1.5" fill={color} />
    {/* Explosive Power Lightning Symbol */}
    <path
      d="M33 14L28 26H34L31 38L41 24H35L38 14H33Z"
      fill={accentColor}
      stroke="#FFFDF8"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

// 4. Burning Sensation After Heavy Lift — Striated muscle with thermal heat waves
export const IconBurningSensation: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF0EE" stroke="#E8C5BE" strokeWidth="1.5" />
    {/* Muscle Fibers Bundle */}
    <path
      d="M18 42C18 34 24 28 32 28C40 28 46 34 46 42C46 47 40 48 32 48C24 48 18 47 18 42Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M25 36C29 38 35 38 39 36" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M28 42C30 43 34 43 36 42" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Thermal Flame / Lactic Heat Waves */}
    <path
      d="M32 14C32 14 37 19 37 23C37 26 34.5 28 32 28C29.5 28 27 26 27 23C27 19 32 14 32 14Z"
      fill={accentColor}
    />
    <path
      d="M32 19C32 19 34 22 34 24C34 25.5 33 26.5 32 26.5C31 26.5 30 25.5 30 24C30 22 32 19 32 19Z"
      fill="#D4AF37"
    />
    {/* Heat Rays */}
    <path d="M22 20L25 23" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    <path d="M42 20L39 23" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 5. Improve Endurance / Delay Fatigue — Running athlete with stamina pulse
export const IconEnduranceFatigue: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#2B6A78' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EBF4F6" stroke="#C8DDE1" strokeWidth="1.5" />
    {/* Runner Head */}
    <circle cx="36" cy="18" r="4" fill={color} />
    {/* Runner Dynamic Body */}
    <path
      d="M33 23L27 31L34 35L30 47"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 31L20 28"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M30 26L39 29L45 25"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34 35L42 38L45 48"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Aerobic Stamina Pulse Trail */}
    <path
      d="M13 36H18L21 32L24 40L27 36H30"
      stroke={accentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 6. Vascularity / Muscle Pump — Blood vessel / vascular nitric oxide & muscle pump
export const IconVascularityPump: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF0EE" stroke="#E8C5BE" strokeWidth="1.5" />
    {/* Nitric Oxide Vasodilation Vessel */}
    <path
      d="M18 24C24 22 40 22 46 24C48 30 48 34 46 40C40 42 24 42 18 40C16 34 16 30 18 24Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
    />
    {/* Pulsing Vascular Branch */}
    <path
      d="M20 32C25 32 28 27 33 27C38 27 40 37 45 37"
      stroke={accentColor}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M28 27C30 33 34 35 38 35"
      stroke={accentColor}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    {/* Expansion Waves */}
    <path d="M14 32C14 26 14 38 14 32" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    <path d="M50 32C50 26 50 38 50 32" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 7. Joint Pain — Joint hinge with radiating inflammatory spark
export const IconJointPain: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF0EE" stroke="#E8C5BE" strokeWidth="1.5" />
    {/* Upper Bone Component */}
    <path
      d="M26 14V26C26 29 29 31 32 31C35 31 38 29 38 26V14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Lower Bone Component */}
    <path
      d="M26 50V38C26 35 29 33 32 33C35 33 38 35 38 38V50"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Joint Synovial Capsule */}
    <circle cx="32" cy="32" r="5" fill="#FFFDF8" stroke={color} strokeWidth="1.5" />
    {/* Pain Radiance Indicator */}
    <path d="M21 32L17 32M47 32L43 32M24 24L20 20M44 44L40 40M24 40L20 44M44 20L40 24" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 8. Long-Term Joint Health — Protected joint capsule with longevity shield
export const IconJointHealth: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#66734A' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EEF4E8" stroke="#CFDCB9" strokeWidth="1.5" />
    {/* Joint Outline */}
    <circle cx="32" cy="30" r="8" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    {/* Synovial Fluid Drop */}
    <path d="M32 25C32 25 35 29 35 31C35 32.6 33.6 34 32 34C30.4 34 29 32.6 29 31C29 29 32 25 32 25Z" fill={accentColor} />
    {/* Protective Outer Shield */}
    <path
      d="M20 20C20 20 32 16 32 16C32 16 44 20 44 20C44 34 32 46 32 46C32 46 20 34 20 20Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 9. Better Sleep — Crescent moon with deep delta ZZZ sleep waves
export const IconBetterSleep: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF4E4" stroke="#EBDDB8" strokeWidth="1.5" />
    {/* Glowing Crescent Moon */}
    <path
      d="M36 18C27.16 18 20 25.16 20 34C20 42.84 27.16 50 36 50C38.8 50 41.4 49.3 43.7 48C37.5 45.8 33 39.9 33 33C33 26.1 37.5 20.2 43.7 18C41.4 16.7 38.8 18 36 18Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Deep Sleep ZZZ Typography Elements */}
    <path d="M42 22H47L42 28H47" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M46 32H49L46 36H49" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="26" cy="24" r="1.5" fill={accentColor} />
  </svg>
);

// 10. Muscle Cramps — Contracted muscle knot with tension shockwave
export const IconMuscleCramps: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF0EE" stroke="#E8C5BE" strokeWidth="1.5" />
    {/* Calf / Muscle Knot Anatomy */}
    <path
      d="M24 16C24 24 20 28 20 36C20 44 26 48 32 48C38 48 44 44 44 36C44 28 40 24 40 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Spasm Tension Node */}
    <circle cx="32" cy="34" r="6" fill="#FFFDF8" stroke={accentColor} strokeWidth="2" />
    {/* Radial Muscle Cramp Shockwaves */}
    <path d="M28 34H22M42 34H36M32 30V24M32 44V38" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 11. Low Energy — Depleted battery with lightning drain/recharge indicator
export const IconLowEnergy: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF8F0" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Battery Shell */}
    <rect x="22" y="18" width="20" height="32" rx="4" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    <path d="M28 14H36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Low Level Cell Indicator */}
    <rect x="25" y="40" width="14" height="7" rx="2" fill="#C85A48" />
    {/* Dynamic Lightning Recharge Pulse */}
    <path
      d="M34 22L28 31H34L30 40L38 29H32L34 22Z"
      fill={accentColor}
      stroke="#FFFDF8"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

// 12. Fat Loss — Waistline contour caliper with metabolic scale metric
export const IconFatLoss: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#66734A' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EEF4E8" stroke="#CFDCB9" strokeWidth="1.5" />
    {/* Tapered Waist Silhouette */}
    <path
      d="M20 18C24 24 24 30 20 46M44 18C40 24 40 30 44 46"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Measuring Tape with Tick Marks */}
    <path
      d="M17 32C24 35 40 35 47 32"
      stroke={accentColor}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M26 32V35M32 32V36M38 32V35" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
    {/* Downward Fat Loss Arrow */}
    <path d="M32 18V26M29 23L32 26L35 23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 13. Constipation / Gut Health — Gastrointestinal motility tract with smooth flow
export const IconGutHealth: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#66734A' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF4E4" stroke="#EBDDB8" strokeWidth="1.5" />
    {/* Anatomical Gut Loops */}
    <path
      d="M24 20C24 20 32 18 36 22C40 26 36 30 30 30C24 30 22 36 28 40C34 44 42 42 42 42"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Microbiome Flora Micro-Dots */}
    <circle cx="34" cy="22" r="1.5" fill={accentColor} />
    <circle cx="28" cy="30" r="1.5" fill={accentColor} />
    <circle cx="36" cy="38" r="1.5" fill={accentColor} />
    {/* Motility Flow Arrow */}
    <path d="M38 42L42 42L41 38" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 14. Poor Immunity — Defense shield with white blood cell cross
export const IconImmunity: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF0EE" stroke="#E8C5BE" strokeWidth="1.5" />
    {/* Defense Shield */}
    <path
      d="M32 14L44 19V32C44 41 38 47 32 50C26 47 20 41 20 32V19L32 14Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Clinical Immune Cross */}
    <path d="M32 24V38M25 31H39" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 15. Busy Lifestyle / Skips Meals — Pocket clock with cutlery meal reminder
export const IconBusyLifestyle: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#F8F6EF" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Timepiece Clock Face */}
    <circle cx="30" cy="34" r="14" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    <path d="M30 26V34L35 37" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M27 16H33" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Dining Fork & Spoon Accents */}
    <path d="M45 22V42M42 22V28H48V22" stroke={accentColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 16. Improve Stamina — Aerobic lungs with dynamic endurance gauge
export const IconImproveStamina: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#2B6A78' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EBF4F6" stroke="#C8DDE1" strokeWidth="1.5" />
    {/* Trachea */}
    <path d="M32 16V26" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Left Lung */}
    <path
      d="M30 26C24 24 18 28 18 36C18 44 24 46 30 42V26Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Right Lung */}
    <path
      d="M34 26C40 24 46 28 46 36C46 44 40 46 34 42V26Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Aerobic Pulse Rhythm */}
    <path d="M22 34L25 32L28 36L30 34" stroke={accentColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 34L36 32L39 36L42 34" stroke={accentColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 17. Heal Metabolically — Metabolic renewal flame with circular cycle arrows
export const IconHealMetabolically: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF4E4" stroke="#EBDDB8" strokeWidth="1.5" />
    {/* Circular Renewal Cycle Arrows */}
    <path
      d="M44 26C42 20 37 16 31 16C23.5 16 17.5 22 17.5 29.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M42 21L45 26L49 23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M20 38C22 44 27 48 33 48C40.5 48 46.5 42 46.5 34.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M22 43L19 38L15 41" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Core Metabolic Bio-Flame */}
    <path
      d="M32 23C32 23 37 28 37 32C37 34.8 34.8 37 32 37C29.2 37 27 34.8 27 32C27 28 32 23 32 23Z"
      fill={accentColor}
    />
  </svg>
);

// 18. Poor Hydration — Cellular water droplet with fluid level gauge
export const IconPoorHydration: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#2B6A78' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EBF4F6" stroke="#C8DDE1" strokeWidth="1.5" />
    {/* Water Droplet Vessel */}
    <path
      d="M32 14C32 14 44 28 44 36C44 42.6 38.6 48 32 48C25.4 48 20 42.6 20 36C20 28 32 14 32 14Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Internal Fluid Level Waves */}
    <path
      d="M22 38C26 36 30 40 34 38C38 36 41 39 43 38C44 40 43.5 42 42 44C39.5 47 35 48 32 48C28 48 24 46 22 42V38Z"
      fill={accentColor}
    />
    {/* Calibrated Gauge Marks */}
    <line x1="28" y1="28" x2="33" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="26" y1="34" x2="31" y2="34" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 19. Focus in Gym — Precision bullseye target aligned over training barbell
export const IconFocusGym: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#F8F6EF" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Precision Target Rings */}
    <circle cx="32" cy="32" r="16" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="32" cy="32" r="10" stroke={color} strokeWidth="2" />
    <circle cx="32" cy="32" r="4" fill={accentColor} />
    {/* Target Reticle Crosshairs */}
    <line x1="32" y1="12" x2="32" y2="20" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    <line x1="32" y1="44" x2="32" y2="52" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="32" x2="20" y2="32" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    <line x1="44" y1="32" x2="52" y2="32" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 20. No Clear Plan / Direction — Navigational roadmap & compass
export const IconNoClearPlan: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#F8F6EF" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Compass Dial */}
    <circle cx="32" cy="32" r="15" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    <path d="M32 17V20M32 44V47M17 32H20M44 32H47" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Precision Needle Indicator */}
    <polygon points="32,21 36,32 32,29 28,32" fill={accentColor} />
    <polygon points="32,43 36,32 32,29 28,32" fill={color} />
    <circle cx="32" cy="32" r="2" fill="#FFFDF8" />
  </svg>
);

// 21. Insufficient Protein Intake — Protein container with branched amino acid chain
export const IconInsufficientProtein: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#66734A' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EEF4E8" stroke="#CFDCB9" strokeWidth="1.5" />
    {/* Protein Jar Canister */}
    <rect x="22" y="22" width="20" height="26" rx="4" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    <path d="M25 18H39V22H25V18Z" fill="#EEF4E8" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    {/* Amino Peptide Chain */}
    <circle cx="28" cy="35" r="2.5" fill={accentColor} />
    <circle cx="36" cy="31" r="2.5" fill={accentColor} />
    <circle cx="34" cy="40" r="2.5" fill={accentColor} />
    <line x1="28" y1="35" x2="36" y2="31" stroke={color} strokeWidth="1.5" />
    <line x1="28" y1="35" x2="34" y2="40" stroke={color} strokeWidth="1.5" />
  </svg>
);

// 22. Meal Replacer — Meal shake bottle with nutrient balance measure
export const IconMealReplacer: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF4E4" stroke="#EBDDB8" strokeWidth="1.5" />
    {/* Shaker Bottle */}
    <path
      d="M24 22L26 46C26 48 28 50 31 50H33C36 50 38 48 38 46L40 22H24Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <rect x="22" y="16" width="20" height="6" rx="2" fill="#EEF4E8" stroke={color} strokeWidth="2" />
    <path d="M30 16V13H34V16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Liquid Shake Level & Calibrations */}
    <path d="M25 34C28 35 36 33 39 34L38 46C38 48 36 50 33 50H31C28 50 26 48 26 46L25 34Z" fill={accentColor} opacity="0.6" />
    <line x1="28" y1="28" x2="32" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="28" y1="34" x2="32" y2="34" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 23. Energy Focus / Extra Kick — Workout alert kick lightning aperture
export const IconEnergyKick: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF4E4" stroke="#EBDDB8" strokeWidth="1.5" />
    {/* Radiating Energy Burst Ring */}
    <circle cx="32" cy="32" r="16" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
    {/* Sharp Kinetic Lightning Bolt */}
    <path
      d="M35 15L23 33H33L29 49L43 29H33L35 15Z"
      fill={accentColor}
      stroke={color}
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
  </svg>
);

// 24. Custom Goal — Personalized goal aspiration star & quill
export const IconCustomGoal: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#66734A' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EEF4E8" stroke="#CFDCB9" strokeWidth="1.5" />
    {/* Aspiration Star */}
    <path
      d="M32 16L35.5 24.5L44 26L38 32L39.5 41L32 37L24.5 41L26 32L20 26L28.5 24.5L32 16Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="29" r="3" fill={accentColor} />
    {/* Quill Writing Accent */}
    <path d="M40 44L48 48L46 40" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Goal Icon Registry for mapping goal names or IDs to their dedicated components
export const GOAL_VECTOR_ICON_REGISTRY: Record<string, React.FC<IconProps>> = {
  // Goal IDs
  icon_muscle_gain: IconMuscleGain,
  icon_bone_health: IconBoneHealth,
  icon_power_strength: IconPowerStrength,
  icon_burning_sensation: IconBurningSensation,
  icon_endurance_delay_fatigue: IconEnduranceFatigue,
  icon_vascularity_pump: IconVascularityPump,
  icon_joint_pain: IconJointPain,
  icon_joint_health: IconJointHealth,
  icon_better_sleep: IconBetterSleep,
  icon_reduce_muscle_cramps: IconMuscleCramps,
  icon_low_energy: IconLowEnergy,
  icon_fat_loss: IconFatLoss,
  icon_constipation_flatulence: IconGutHealth,
  icon_poor_immunity: IconImmunity,
  icon_busy_lifestyle_meal_skips: IconBusyLifestyle,
  icon_improve_stamina: IconImproveStamina,
  icon_heal_metabolically: IconHealMetabolically,
  icon_poor_hydration: IconPoorHydration,
  icon_struggles_with_focus: IconFocusGym,
  icon_no_clear_plan: IconNoClearPlan,
  icon_insufficient_protein: IconInsufficientProtein,
  icon_meal_replacer: IconMealReplacer,
  icon_energy_focus_kick: IconEnergyKick,
  icon_custom_goal: IconCustomGoal,

  // Fallback string matching for goal names
  'muscle gain': IconMuscleGain,
  'bone health support': IconBoneHealth,
  'power / strength / performance': IconPowerStrength,
  'burning sensation after heavy lift': IconBurningSensation,
  'improve endurance / delay fatigue': IconEnduranceFatigue,
  'vascularity / improved performance / muscle pump': IconVascularityPump,
  'joint pain': IconJointPain,
  'support long-term joint health': IconJointHealth,
  'support joint health': IconJointHealth,
  'better sleep': IconBetterSleep,
  'reduce muscle cramps': IconMuscleCramps,
  'frequency of muscle cramps': IconMuscleCramps,
  'low energy': IconLowEnergy,
  'fat loss': IconFatLoss,
  'experience of constipation and flatulence': IconGutHealth,
  'poor immunity': IconImmunity,
  'busy lifestyle / skips meals often': IconBusyLifestyle,
  'improve stamina': IconImproveStamina,
  'heal metabolically': IconHealMetabolically,
  'poor hydration': IconPoorHydration,
  'struggles with focus in the gym': IconFocusGym,
  'no clear plan or direction': IconNoClearPlan,
  'insufficient protein intake': IconInsufficientProtein,
  'meal replacer': IconMealReplacer,
  'energy focus / alert / extra kick for workout': IconEnergyKick,
};

/**
 * Resolves and renders the dedicated purpose-built vector icon for any goal identifier or name.
 */
export function renderGoalVectorIcon(iconIdentifierOrGoalName: string, size = 48): React.ReactElement {
  const key = iconIdentifierOrGoalName.trim().toLowerCase();
  const IconComponent = GOAL_VECTOR_ICON_REGISTRY[key] || IconCustomGoal;
  return <IconComponent size={size} />;
}
