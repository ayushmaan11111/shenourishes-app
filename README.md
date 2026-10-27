# She Nourishes — Mobile App (Android & iOS)

> **Nutrition • Lifestyle • Wellness**
> Production-quality cross-platform mobile application foundation for **Android & iOS**, built with React, TypeScript, Capacitor, and Firebase.

---

## 🌿 Phase 1 Architectural Overview

Phase 1 establishes the rock-solid foundation for **She Nourishes**:
1. **Cross-Platform Native Android & iOS Project Scaffolding**:
   - Native **Android** project in [`android/`](file:///Users/ayushmaangupta/Documents/antigravity/valiant-meitner/android) ready to build `.apk` or open in Android Studio.
   - Native **iOS** project in [`ios/`](file:///Users/ayushmaangupta/Documents/antigravity/valiant-meitner/ios) ready to build with Xcode using Swift Package Manager.
2. **Native Device Features**:
   - Brand Olive (`#66734A`) native Status Bar with dark icon styling.
   - Android hardware back button handler navigating back through questionnaire steps before exit.
   - Native keyboard adjustment and notch/safe-area insets for modern edge-to-edge screens.
3. **Firebase Authentication** with human-readable error handling.
4. **Customer Nutrition & Lifestyle Assessment (8 Steps)** with progressive Realtime Database persistence.
5. **Structured Data Model** under `customers/{firebaseUserUID}/`.
6. **Basic Personalized Home Screen** displaying the customer's live goals and Phase 1 placeholder actions.
7. **Profile & Assessment Review** enabling real-time updates without duplicate record creation.
8. **Firebase Security Rules** enforcing private user isolation.

---

## 🎨 Visual Identity & Palette

* **Primary Olive**: `#66734A`
* **Deep Olive**: `#4F5C38`
* **Light Olive**: `#8A9568`
* **Warm Background**: `#F8F6EF`
* **Card Surface**: `#FFFDF8`
* **Cream Accent**: `#F1EEDF`
* **Text Primary**: `#242820`
* **Text Secondary**: `#6B7063`
* **Border**: `#D9D8CC`

---

## 📱 Native Android & iOS Mobile Commands

### 1. Build and Sync Web Assets into Native Projects
```bash
npm run build:native
```
This builds the TypeScript distribution and syncs all assets and plugins to both `android/` and `ios/`.

### 2. Run / Open on Android (Android Studio / APK)
```bash
npm run cap:android
```
Or open the `android/` directory in **Android Studio** and click **Run** (or `Build > Build Bundle(s) / APK(s) > Build APK(s)`).

### 3. Run / Open on iOS (Xcode / Simulator / iPhone)
```bash
npm run cap:ios
```
Or open `ios/App/App.xcodeproj` in **Xcode** and select your simulator or connected iOS device.

### 4. Interactive Web / Mobile Preview
```bash
npm run dev
```
Accessible at `http://localhost:3000`.

---

## 📂 Customer Data Model Structure

```text
customers/
    {firebaseUserUID}/
        metadata/
            createdAt: timestamp
            updatedAt: timestamp
            onboardingCompleted: boolean
            currentOnboardingStep: number (1..8)
            appVersion: "1.0.0"
        personalDetails/
            fullName: string
            date: string
            age: number
            gender: "Female" | "Male" | "Other" | "Prefer not to say"
            mobileNumber: string
            emailAddress: string
            address: string
            height: number
            heightUnit: "cm" | "ft/in"
            weight: number
            weightUnit: "kg" | "lbs"
            waistCircumference:
                atNaval: number
                aboveNaval: number
                belowNaval: number
                waistUnit: "cm" | "inches"
        goalAssessment/
            primaryGoals: string[]
            otherGoal: string
            goalTimeline: string
            goalImportance: string
            biggestFitnessChallenges: string[]
            otherFitnessChallenge: string
            nutritionistSupportExpectations: string[]
            otherNutritionistSupport: string
        lifestyleHealth/
            sleepDuration: string
            sleepQuality: string
            stressLevel: string
            dailySittingDuration: string
            digestiveIssues: string[]
            otherDigestiveIssue: string
            otherLifestyleFactors: string
        supportExpectations/
            programSupport: string[]
            otherProgramSupport: string
            preferredContactMethod: string
            otherContactMethod: string
        dietaryNutrition/
            dietType: "VEGETARIAN" | "EGGETARIAN" | "NON-VEGETARIAN" | "VEGAN" | "OTHER"
            otherDietType: string
            hasFoodAllergies: boolean
            foodAllergiesOrIntolerances: string
            dailyWaterIntake: string
            dailyMeals: string
            eatingOutFrequency: string
            smokingStatus: "NEVER" | "IN THE PAST" | "CURRENTLY"
            smokingQuantityPerDay: string
            alcoholStatus: "NEVER" | "IN THE PAST" | "CURRENTLY"
            alcoholDrinksPerWeek: string
        physicalActivity/
            hasPreviousWorkoutExperience: boolean
            weeklyExerciseDuration: string
            preferredExerciseTypes: string[]
            currentActivityLevel: string
            usualWorkoutIntensity: string
            usualWorkoutDuration: string
            realisticExerciseDaysPerWeek: string
        commitment/
            commitmentLevel: string
            agreesToFollowPlan: boolean
        supplements/
            calcium: boolean
            antioxidant: boolean
            antiInflammatory: boolean
            jointPain: boolean
            wheyProtein: boolean
```

---

## 🔒 Firebase Security Rules (`database.rules.json`)

```json
{
  "rules": {
    "customers": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```
