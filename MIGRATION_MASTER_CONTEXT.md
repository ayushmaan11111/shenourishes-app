# She Nourishes — Project Master Context & Full Migration Guide

> **Project Name:** She Nourishes (`she-nourishes-app`)  
> **Platform:** Responsive Web Application + Native Mobile (iOS & Android via Capacitor)  
> **Live Production URL:** [https://she-nourishes.web.app](https://she-nourishes.web.app) / [https://she-nourishes.firebaseapp.com](https://she-nourishes.firebaseapp.com)  
> **Repository Directory:** `valiant-meitner`  
> **Primary Technology Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS / Custom Luxury Tokens, Firebase (Auth, RTDB, Hosting, Storage), Capacitor 7, Resend Email API, Lucide Icons.

---

## 1. Executive Summary & Core Purpose

**She Nourishes** is a clinical-grade nutrition, lifestyle, hormonal health, and fitness platform tailored for women. It supports conditions such as **PCOS / PCOD, Thyroid disorders, Gestational & Postpartum recovery, Hormonal Imbalance, Gut Health, and Sustainable Fat Loss**.

The platform consists of two interconnected portals in a single codebase:
1. **Client Experience Portal**:
   - Comprehensive multi-step clinical onboarding (dietary habits, PAR-Q, medical history, blood reports, lifestyle assessment).
   - Real-time **Home Dashboard** with reactive circular progress rings (**Daily Activity %**, **Food Intake %**, **Diet Plan %**).
   - **Nutrition Screen** with 500+ Indian food database, macro calculators, meal swaps, water and calorie tracking.
   - **Activity & Exercise Screen** with prescribed workout routines, interactive daily checkboxes, **162 local 9:16 vertical demonstration videos**, and YouTube tutorial links.
   - **Progress Tracking** with weight logs, measurement journals, and progress photo galleries.
   - Direct interactive follow-up chat with Clinical Nutritionist & Counselor (**Sneha Dey**).
2. **Admin & Clinical Management Portal** (Accessed via `#admin` route):
   - Client registry with search, active plan status, and deep client dossiers.
   - **Workout Plan Assignment System**: 8 curated clinical templates + custom workout builder, video preview, target setting, and real-time client push.
   - **Clinical Diet Chart Editor**: Macro-balanced meal planner with interchangeable food items and portion guides.
   - **Supplement Formula & Rule Engine**: Customized micronutrient dosing and contraindication safety checks.
   - **Long-Term Data Book & CRM**: Lead capture, packages sold, renewal tracking, follow-up scheduling, and automated reminders.

---

## 2. Secrets, API Keys & Environment Configuration

When moving to a new device, recreate the `.env` file in the project root:

### `.env` File (Project Root)
```env
VITE_FIREBASE_API_KEY=AIzaSyDTAh2v9p0hjw4ibExIfVCRQwZLoPzMeqc
VITE_FIREBASE_AUTH_DOMAIN=she-nourishes.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=she-nourishes
VITE_FIREBASE_STORAGE_BUCKET=she-nourishes.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=744107507317
VITE_FIREBASE_APP_ID=1:744107507317:web:799e7499babc58944c023c
VITE_FIREBASE_MEASUREMENT_ID=G-95KSFG1PDC
VITE_FIREBASE_DATABASE_URL=https://she-nourishes-default-rtdb.firebaseio.com
```

### Third-Party Service Keys
- **Resend Email API Key**:
  - Environment Variable: `VITE_RESEND_API_KEY` in `.env`
  - Function: Sends onboarding receipts, blood test reminders, metabolic blueprints, and counselling confirmations.
- **Firebase Console**:
  - Project Console: [https://console.firebase.google.com/project/she-nourishes/overview](https://console.firebase.google.com/project/she-nourishes/overview)
  - Firebase RTDB: [https://she-nourishes-default-rtdb.firebaseio.com](https://she-nourishes-default-rtdb.firebaseio.com)

### Admin Portal Access
- **No hardcoded secret gate**: The admin dashboard is enabled whenever the browser URL contains `#admin`:
  - URL: `https://she-nourishes.web.app/#admin` or `http://localhost:5173/#admin`
  - In `src/App.tsx`, `isAdminPortalActive` is initialized from `window.location.hash.includes('admin')` and listens to `hashchange` events.
  - Clicking "Exit Admin" resets the hash to `''` and returns to the client view.

---

## 3. High-Level Architecture & Project Structure

```
valiant-meitner/
├── .env                              # Production Firebase environment variables
├── .firebaserc                       # Points to project: she-nourishes
├── firebase.json                     # Hosting rewrites and RTDB rules config
├── database.rules.json               # Firebase Realtime Database security rules
├── capacitor.config.ts               # Capacitor native iOS/Android bridge config
├── package.json                      # Dependencies and automation scripts
├── tsconfig.json / vite.config.ts    # TypeScript & Vite bundler settings
├── deploy-batched.sh                 # Batched deployer for initial large asset uploads
├── deploy-resume.sh                  # 5-video micro-batch deployer for flaky networks
│
├── public/                           # Static assets served at root
├── vids-work/                        # Master collection of 162 vertical exercise MP4s
│
├── src/
│   ├── App.tsx                       # Main root component, router (#admin), native bridge
│   ├── main.tsx                      # Vite React entry point
│   ├── index.css                     # Master design tokens & Tailwind CSS
│   │
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication state (Firebase Auth + LocalStorage fallback)
│   │
│   ├── screens/                      # Main views and tabs
│   │   ├── HomeScreen.tsx            # Client Home: Progress rings, Today's Overview, chat
│   │   ├── NutritionScreen.tsx       # Meals, macro tracking, calorie burn, food swap
│   │   ├── ActivityScreen.tsx        # Activity tab hosting ClientDailyWorkoutPlanView
│   │   ├── ProgressScreen.tsx        # Weight trends, measurements, photo progress
│   │   ├── ProfileScreen.tsx         # User profile, clinical summary, plan settings
│   │   ├── AdminDashboardScreen.tsx  # Full-screen clinical administration hub
│   │   ├── OnboardingWizard.tsx      # Step-by-step clinical intake wizard
│   │   ├── ParQHealthScreen.tsx      # Physical Activity Readiness Questionnaire
│   │   ├── BloodTestScheduleScreen.tsx # Blood lab test scheduling and tracking
│   │   ├── CounsellingPackageScreen.tsx# Nutritionist counselling sessions & packages
│   │   ├── LongTermSupportScreen.tsx # Long-term maintenance and lifestyle support
│   │   └── steps/                    # 10+ granular onboarding step components
│   │
│   ├── components/
│   │   ├── admin/                    # Admin modals and clinical tools
│   │   │   ├── AdminWorkoutPlanAssignmentModal.tsx # Exercise routine builder & previewer
│   │   │   ├── ClinicalDietChartEditorModal.tsx    # Meal plans, portion & macro editor
│   │   │   ├── SupplementFormulaManagerModal.tsx   # Supplement formulas & rules
│   │   │   ├── GoalRecommendationManagerModal.tsx  # Goals and vector icon picker
│   │   │   ├── AdminLifestyleSupplementAssessmentModal.tsx # Diagnostic assessments
│   │   │   └── LongTermSupportDataBookModal.tsx    # CRM, leads, renewals & databook
│   │   ├── workout/
│   │   │   └── ClientDailyWorkoutPlanView.tsx      # 9:16 Video player & exercise checkboxes
│   │   ├── nutrition/
│   │   │   ├── IndianFoodMacroModal.tsx            # Indian food database and search
│   │   │   └── MacronutrientMetabolismSection.tsx  # Dynamic macro breakdown bars
│   │   ├── common/
│   │   │   ├── TodaysOverviewFollowUpBoxes.tsx     # Follow-up cards & chat with counselor
│   │   │   └── ClientPackageCoreHubModal.tsx       # Package details modal
│   │   └── notifications/
│   │       └── PlanNotificationManagerModal.tsx    # Push & email notification triggers
│   │
│   ├── services/                     # Business logic and external sync
│   │   ├── firebase.ts               # Firebase initialization (Auth, Database, Storage)
│   │   ├── workoutPlanService.ts     # 8 Templates, 162 videos, daily progress persistence
│   │   ├── customerService.ts        # Customer profile, onboarding data, active plan state
│   │   ├── clinicalDietTemplates.ts  # Pre-built clinical meal plans (PCOS, Veg, Non-Veg)
│   │   ├── formulaEngineService.ts   # Body composition & supplement formula rules
│   │   ├── recommendationEngine.ts   # Algorithmic diet & fitness recommendations
│   │   ├── longTermDataBookService.ts# Lead registry and sold package tracking
│   │   ├── resendEmailService.ts     # Transactional email dispatcher via Resend API
│   │   ├── chatService.ts            # Live counselor-client chat syncing to RTDB
│   │   ├── nativeBridge.ts           # Capacitor hardware back button & status bar handlers
│   │   └── foodDatabaseService.ts    # Indian food library with macronutrient values
│   │
│   └── types/                        # TypeScript type definitions
│       ├── customer.ts
│       ├── recommendations.ts
│       └── ...
│
├── android/                          # Native Android Studio project
└── ios/                              # Native Xcode project
```

---

## 4. Key Systems Built & Implementation Details

### A. Dynamic Daily Progress Rings & Real-Time Sync
- **Location**: `src/screens/HomeScreen.tsx`, `src/components/workout/ClientDailyWorkoutPlanView.tsx`, `src/services/workoutPlanService.ts`
- **Mechanism**:
  - The three top circular rings on the Home screen represent:
    1. **Daily Activity %**: `(completed exercises today / total prescribed exercises today) * 100`
    2. **Food Intake %**: Calculated from meals logged vs daily goal for today.
    3. **Diet Plan %**: Compliance score based on logged diet plan items.
  - When a user checks or unchecks an exercise in `ClientDailyWorkoutPlanView`:
    - The new state is saved to `localStorage` under `sn_workout_progress_${clientId}_${date}` for instant zero-latency recall.
    - Synced in the background to Firebase RTDB: `customers/${clientId}/dailyWorkoutProgress/${date}`.
    - A custom event `daily_activity_progress_updated` is dispatched across `window`.
    - `HomeScreen.tsx` listens to this event and instantly recalculates and re-animates the progress rings.
  - Closing the widget, switching tabs, or refreshing the page fully preserves the checked states and percentages for that day.

### B. 9:16 Vertical Video Player for 162 Exercise Routines
- **Location**: `src/components/workout/ClientDailyWorkoutPlanView.tsx` & `src/components/admin/AdminWorkoutPlanAssignmentModal.tsx`
- **Asset Location**: Served from `/vids-work/<videoFileName>` (backed up in `vids-work/` in source control and deployed to Firebase Hosting).
- **Player Specs**:
  - Container aspect ratio: `9 / 16` (`aspectRatio: '9/16'`), `maxWidth: '320px'`, rounded corners (`16px`).
  - Implemented as direct `<video key={videoFileName} src={`/vids-work/${videoFileName}`} controls playsInline ...>` rather than nested `<source>` tags to prevent mobile Safari/Chrome playback stalls.
  - In addition to local 9:16 videos, exercises support custom **YouTube tutorial links** (`youtubeUrl`) that open directly.

### C. Workout Plan Assignment (Admin -> Client)
- **Clinical Rule**: There is **no automatic workout assignment**. Unassigned clients see a friendly placeholder: *"Your personalized workout protocol is being curated by your nutritionist."*
- In the Admin Portal (`#admin` -> Workouts tab):
  - Admin selects from **8 Clinical Templates**:
    1. Foundation: 7 Days Mobility & Stretches
    2. Beginner Routine for Sedentary Beginner (Day 2 to Day 7)
    3. Beginner Home Workout (Day 1 to Day 7)
    4. Beginner Gym Chart (Day 1 to Day 7)
    5. Intermediate Gym Workout (Mon-Sun)
    6. Advanced Gym Program (Mon-Sun)
    7. Home High-Intensity Program (Mon-Sun)
    8. Moderate Intensity Home PT Workout (Week 1 & 2)
  - Or creates a custom split by picking exercises, assigning targets (e.g., `3 sets x 12-15 reps`), attaching 9:16 videos from the dropdown, and entering YouTube links.
  - Saving persists the plan to Firebase RTDB under `customers/${clientId}/workoutPlan` and immediately updates the client interface.

### D. Firebase Realtime Database Architecture
All data is partitioned by `uid` / `clientId`:
- `customers/${uid}`: Customer profile, onboarding answers, biometric stats.
- `customers/${uid}/workoutPlan`: Currently assigned workout routine.
- `customers/${uid}/dailyWorkoutProgress/${date}`: Completed exercise IDs for a given date (`YYYY-MM-DD`).
- `customers/${uid}/dailyLogs/${date}`: Meal entries, water intake, calories.
- `chat/${chatId}`: Direct messages between counselor Sneha Dey and client.
- `databook/leads`: Long-term support prospective inquiries.
- `databook/sold`: Active enrolled clients and expiry dates.

---

## 5. Deployment Procedures

### Regular Code Updates (HTML / CSS / TSX)
Once videos are cached on Firebase CDN, deploying standard code updates takes **~10-20 seconds**:
```bash
# 1. Build the production bundle
npm run build

# 2. Deploy only hosting
./node_modules/.bin/firebase deploy --only hosting
```

### Video Asset Hosting Strategy (Why Batching Exists)
The `vids-work/` directory contains **162 vertical MP4 files (~1.2 GB total)**. Uploading 162 large video files in a single `firebase deploy` over consumer internet connections can trigger socket timeouts or rate limits.
To solve this permanently, two utility scripts are included:
1. `deploy-batched.sh`: Splits videos into 5 alphabetical batches and deploys them sequentially so Firebase CDN caches each batch.
2. `deploy-resume.sh`: A micro-batcher that deploys videos 5 at a time in a loop with safety traps.

> **Important Note:** All 162 videos are ALREADY uploaded and cached on Firebase CDN for `she-nourishes.web.app`. You do NOT need to re-upload videos unless you add new `.mp4` files. Running standard `npm run build && ./node_modules/.bin/firebase deploy --only hosting` automatically re-uses the CDN cached videos without re-uploading them.

---

## 6. How to Set Up on a New Device

### Step 1: Install Prerequisites
- **Node.js**: Recommended `v18.x` or `v20.x` LTS.
- **Git**: Installed and configured.

### Step 2: Clone or Copy the Repository
```bash
# Navigate to your workspace directory
cd /path/to/your/workspace/

# Copy or clone the project
cd valiant-meitner
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Configure Environment Variables
Create the `.env` file in the root of the project with the values detailed in Section 2.

### Step 5: Start Local Development Server
```bash
npm run dev
```
Open your browser to:
- Client App: `http://localhost:5173/`
- Admin Portal: `http://localhost:5173/#admin`

### Step 6: Verify Build & Type Checking
```bash
npm run build
```

### Step 7: Firebase Authentication (For Deployments)
```bash
./node_modules/.bin/firebase login
# If running in a headless or remote terminal:
./node_modules/.bin/firebase login:ci
```

---

## 7. Native Mobile Builds (iOS & Android)

The application includes configured Capacitor wrappers for Android Studio and Xcode:
- App ID: `com.shenourishes.app`
- App Name: `She Nourishes`

### Android
```bash
npm run build:native
npm run cap:android
# Opens the 'android/' folder in Android Studio. Build APK / AAB as normal.
```

### iOS (macOS only)
```bash
npm run build:native
npm run cap:ios
# Opens the 'ios/' folder in Xcode.
```
