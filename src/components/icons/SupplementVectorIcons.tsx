import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  accentColor?: string;
  className?: string;
}

// 1. Calcium Citrate Malate — Bioavailable calcium mineral matrix inside bone lattice
export const IconCalciumCitrateMalate: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#F8F6EF" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Mineral Tablet / Capsule */}
    <rect x="22" y="22" width="20" height="20" rx="6" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    {/* Calcium "Ca²⁺" Chemical Lattice Symbol */}
    <path d="M28 28C27 28 25.5 29 25.5 32C25.5 35 27 36 28 36" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M33 36V30C33 30 35 29 36 30V36M36 33C35 33 33 34 33 34" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    <path d="M39 28H41M40 27V29" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
    {/* Bone Support Sparkles */}
    <circle cx="44" cy="20" r="2" fill={accentColor} />
    <circle cx="20" cy="44" r="1.5" fill={accentColor} />
  </svg>
);

// 2. Vitamin K2 MK-7 — Directs calcium transport to skeletal bone
export const IconVitaminK2MK7: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF4E4" stroke="#EBDDB8" strokeWidth="1.5" />
    {/* Menaquinone Quinone Ring */}
    <polygon points="32,17 43,23 43,37 32,43 21,37 21,23" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    {/* "K2" Symbol */}
    <path d="M28 26V34M28 30L32 26M28 30L32 34" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 29C34 27.5 36 27.5 36 29C36 31 34 32 34 34H37" stroke={accentColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    {/* Directional Calcium Guide Arrow */}
    <path d="M32 43V51M29 48L32 51L35 48" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 3. Creatine Monohydrate — Cellular phosphocreatine ATP energy burst
export const IconCreatine: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF0EE" stroke="#E8C5BE" strokeWidth="1.5" />
    {/* Power Micro-Canister */}
    <rect x="23" y="24" width="18" height="24" rx="4" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    <rect x="21" y="19" width="22" height="5" rx="2" fill="#EEF4E8" stroke={color} strokeWidth="1.75" />
    {/* ATP Phosphagen Energy Bolt */}
    <path
      d="M33 28L28 35H33L31 43L37 34H32L33 28Z"
      fill={accentColor}
      stroke="#FFFDF8"
      strokeWidth="0.75"
      strokeLinejoin="round"
    />
  </svg>
);

// 4. Magnesium Glycinate — Relaxing neuro-calm and muscle relaxation
export const IconMagnesium: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF8F0" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Chelated Ring Orbit */}
    <circle cx="32" cy="32" r="14" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    <ellipse cx="32" cy="32" rx="18" ry="7" stroke={accentColor} strokeWidth="1.5" strokeDasharray="3 2" />
    {/* "Mg" Element Identifier */}
    <path d="M26 36V28L29 32L32 28V36" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M35 34C35 31 38 31 38 34V36M38 33H35" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

// 5. Omega-3 Fatty Acids (EPA & DHA) — Anti-inflammatory marine & algal lipid droplet
export const IconOmega3: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#2B6A78' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EBF4F6" stroke="#C8DDE1" strokeWidth="1.5" />
    {/* Lipid Droplet */}
    <path
      d="M32 16C32 16 43 28 43 36C43 42 38 47 32 47C26 47 21 42 21 36C21 28 32 16 32 16Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Double Bond Carbon Chain (ω-3) */}
    <path d="M26 36C28 34 30 38 33 36C36 34 38 37 40 35" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    <path d="M26 40C28 38 30 42 33 40C36 38 38 41 40 39" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 6. Beta-Alanine — Carnosine buffer & stamina wave
export const IconBetaAlanine: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF0EE" stroke="#E8C5BE" strokeWidth="1.5" />
    {/* Amino Buffer Capsule */}
    <rect x="20" y="24" width="24" height="16" rx="8" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    {/* Beta "β" Symbol */}
    <path d="M28 26V38C28 38 33 38 33 35C33 32 30 32 30 32C30 32 32 32 32 29C32 26 28 26 28 26Z" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    {/* Intramuscular Buffer Pulse */}
    <path d="M37 28L40 32L37 36" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 7. L-Citrulline / Citrulline Malate — Nitric oxide vasodilation ring
export const IconCitrulline: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF0EE" stroke="#E8C5BE" strokeWidth="1.5" />
    {/* Nitric Oxide Vasodilation Vessel */}
    <ellipse cx="32" cy="32" rx="16" ry="11" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    <path d="M25 32H39" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
    {/* "NO" (Nitric Oxide) */}
    <circle cx="28" cy="27" r="1.5" fill={color} />
    <circle cx="36" cy="37" r="1.5" fill={color} />
  </svg>
);

// 8. Whey Protein Isolate — Ultra-pure protein canister
export const IconWheyIsolate: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#66734A' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EEF4E8" stroke="#CFDCB9" strokeWidth="1.5" />
    <rect x="22" y="22" width="20" height="26" rx="4" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    <rect x="20" y="17" width="24" height="5" rx="2" fill="#EEF4E8" stroke={color} strokeWidth="2" />
    {/* Gold Isolate Quality Badge */}
    <circle cx="32" cy="35" r="5" fill="#FAF4E4" stroke={accentColor} strokeWidth="1.5" />
    <path d="M30 35L31.5 36.5L34.5 33.5" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 9. L-Carnitine — Mitochondrial fatty acid transporter
export const IconCarnitine: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF8F0" stroke="#E2DEC9" strokeWidth="1.5" />
    {/* Mitochondrion Silhouette */}
    <ellipse cx="32" cy="32" rx="16" ry="10" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    {/* Inner Cristae Waves */}
    <path d="M22 32C24 28 26 36 28 32C30 28 32 36 34 32C36 28 38 36 40 32" stroke={accentColor} strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

// 10. L-Leucine — mTOR anabolic amino trigger
export const IconLeucine: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#66734A' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#EEF4E8" stroke="#CFDCB9" strokeWidth="1.5" />
    {/* Branched Chain Amino Acid Structure */}
    <circle cx="32" cy="22" r="3" fill={color} />
    <circle cx="24" cy="34" r="3" fill={accentColor} />
    <circle cx="40" cy="34" r="3" fill={accentColor} />
    <circle cx="32" cy="44" r="3" fill={color} />
    <line x1="32" y1="22" x2="24" y2="34" stroke={color} strokeWidth="2" />
    <line x1="32" y1="22" x2="40" y2="34" stroke={color} strokeWidth="2" />
    <line x1="24" y1="34" x2="32" y2="44" stroke={color} strokeWidth="2" />
    <line x1="40" y1="34" x2="32" y2="44" stroke={color} strokeWidth="2" />
  </svg>
);

// 11. Multi-Strain Probiotics — Beneficial gut flora capsule
export const IconProbiotics: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#66734A' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF4E4" stroke="#EBDDB8" strokeWidth="1.5" />
    {/* Probiotic Dual Capsule */}
    <rect x="22" y="24" width="20" height="16" rx="8" fill="#FFFDF8" stroke={color} strokeWidth="2" transform="rotate(-30 32 32)" />
    {/* Beneficial Microflora Colonies */}
    <circle cx="28" cy="28" r="1.5" fill={accentColor} />
    <circle cx="34" cy="32" r="2" fill={accentColor} />
    <circle cx="38" cy="36" r="1.5" fill={accentColor} />
  </svg>
);

// 12. Antioxidant Defense (ALA, CoQ10, Vit C, Vit E) — Cellular free-radical neutralizer
export const IconAntioxidant: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#C85A48' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF0EE" stroke="#E8C5BE" strokeWidth="1.5" />
    {/* Cellular Shield */}
    <path
      d="M32 15L43 20V32C43 40 38 46 32 49C26 46 21 40 21 32V20L32 15Z"
      fill="#FFFDF8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Neutralizing Spark Core */}
    <path d="M32 23L34 29L40 31L34 33L32 39L30 33L24 31L30 29L32 23Z" fill={accentColor} />
  </svg>
);

// 13. Caffeine Anhydrous — CNS stimulant focus crystal
export const IconCaffeine: React.FC<IconProps> = ({ size = 48, color = '#4F5C38', accentColor = '#D4AF37' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FAF4E4" stroke="#EBDDB8" strokeWidth="1.5" />
    {/* Crystalline Focus Prism */}
    <polygon points="32,16 44,25 40,42 24,42 20,25" fill="#FFFDF8" stroke={color} strokeWidth="2" />
    {/* Energy Spark Bolt */}
    <path d="M33 22L28 31H34L30 40L37 30H32L33 22Z" fill={accentColor} stroke="#FFFDF8" strokeWidth="0.75" />
  </svg>
);

export const SUPPLEMENT_VECTOR_ICON_REGISTRY: Record<string, React.FC<IconProps>> = {
  supp_calcium_citrate_malate: IconCalciumCitrateMalate,
  supp_vitamin_k2_mk7: IconVitaminK2MK7,
  supp_creatine_monohydrate: IconCreatine,
  supp_magnesium_glycinate: IconMagnesium,
  supp_omega3_epa_dha: IconOmega3,
  supp_beta_alanine: IconBetaAlanine,
  supp_l_citrulline: IconCitrulline,
  supp_whey_isolate: IconWheyIsolate,
  supp_l_carnitine: IconCarnitine,
  supp_leucine: IconLeucine,
  supp_probiotics: IconProbiotics,
  supp_antioxidant_complex: IconAntioxidant,
  supp_caffeine_anhydrous: IconCaffeine,

  // Fallbacks by name
  'calcium citrate malate': IconCalciumCitrateMalate,
  'vitamin k2 mk-7': IconVitaminK2MK7,
  'creatine monohydrate': IconCreatine,
  'magnesium glycinate': IconMagnesium,
  'omega-3 fish oil (high epa)': IconOmega3,
  'algal omega-3 (high dha / veg epa)': IconOmega3,
  'omega-3 fatty acids (epa & dha)': IconOmega3,
  'beta-alanine': IconBetaAlanine,
  'l-citrulline / citrulline malate': IconCitrulline,
  'whey protein isolate': IconWheyIsolate,
  'whey protein isolate + coconut oil / cream': IconWheyIsolate,
  'l-carnitine': IconCarnitine,
  'l-carnitine metabolic fuel': IconCarnitine,
  'l-leucine & whey protein isolate': IconLeucine,
  'multi-strain probiotics': IconProbiotics,
  'multi-strain probiotics + hydration protocol': IconProbiotics,
  'magnesium glycinate + multi-strain probiotics': IconMagnesium,
  'antioxidant defense (ala, coq10, vit c, vit e)': IconAntioxidant,
  'antioxidant complex (ala, coq10, vit c, vit e)': IconAntioxidant,
  'caffeine anhydrous': IconCaffeine,
};

export function renderSupplementVectorIcon(identifierOrName: string, size = 48): React.ReactElement {
  const key = identifierOrName.trim().toLowerCase();
  const IconComponent = SUPPLEMENT_VECTOR_ICON_REGISTRY[key] || IconCalciumCitrateMalate;
  return <IconComponent size={size} />;
}
