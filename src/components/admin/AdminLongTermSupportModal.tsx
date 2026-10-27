import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Pill, 
  Sparkles, 
  Scale, 
  Utensils
} from 'lucide-react';
import { 
  getLongTermSupportRecord, 
  saveLongTermSupportRecord,
  DEFAULT_PACKAGES 
} from '../../services/longTermSupportService';
import { publishClientDietChart, resolveCustomizedDietChart } from '../../services/clinicalDietTemplates';
import type { LongTermSupportSessionRecord } from '../../types/longTermSupport';

interface AdminLongTermSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
}

export const AdminLongTermSupportModal: React.FC<AdminLongTermSupportModalProps> = ({
  isOpen,
  onClose,
  clientId = 'default',
  clientName = 'Client',
  clientEmail = '',
}) => {
  const [record, setRecord] = useState<LongTermSupportSessionRecord | null>(null);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('pkg_3months');
  const [customPaymentLink, setCustomPaymentLink] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (isOpen && clientId) {
      getLongTermSupportRecord(clientId).then((res) => {
        setRecord(res);
        setSelectedPkgId(res.assignedPlanId || res.package.id || 'pkg_3months');
        setCustomPaymentLink(res.package.paymentLink || '');
        setAdminNote(res.adminRecommendationNote || '');
      });
    }
  }, [isOpen, clientId]);

  if (!isOpen || !record) return null;

  const handlePrescribePlan = async () => {
    const chosenPkg = DEFAULT_PACKAGES.find(p => p.id === selectedPkgId) || record.package;
    const updated: LongTermSupportSessionRecord = {
      ...record,
      package: {
        ...chosenPkg,
        paymentLink: customPaymentLink.trim() || chosenPkg.paymentLink,
        paymentStatus: customPaymentLink.trim() ? 'Payment Link Sent' : 'Pending Admin Link',
        paymentLinkSentAt: Date.now(),
      },
      isPlanAssignedByAdmin: true,
      assignedPlanId: chosenPkg.id,
      assignedPlanName: chosenPkg.name,
      assignedPlanPrice: chosenPkg.priceInr,
      adminAssignedAt: Date.now(),
      adminRecommendationNote: adminNote.trim() || 'Prescribed by Sneha Dey based on clinical assessment.',
    };
    await saveLongTermSupportRecord(updated);
    setRecord(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleAutoPublishChart = () => {
    setIsPublishing(true);
    const foodCategories = [
      record.dietaryOrientation.dietType,
      ...record.recipePreferences.proteinSources,
      ...record.recipePreferences.cookingFats,
    ];
    const customizedChart = resolveCustomizedDietChart(
      record.biometrics.mealsCount || 4,
      foodCategories,
      clientId
    );

    // Apply supplement preference
    if (!record.goalsAndSupplements.openToSupplements) {
      customizedChart.preMealSupplementsHeader = 'WHOLE FOOD NOURISHMENT PROTOCOL:';
      customizedChart.preMealMicronutrientsHeader = 'WHOLE FOOD NUTRIENT DENSE STRATEGY:';
      customizedChart.meals = customizedChart.meals.map((m) => ({
        ...m,
        preMealSupplement: undefined,
        postMealSupplement: undefined,
      }));
    }

    publishClientDietChart(customizedChart, clientEmail, clientName);
    setIsPublishing(false);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1150,
        padding: '12px',
      }}
    >
      <div
        className="animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #0A1C44',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', backgroundColor: '#0A1C44', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase' }}>
              <ShieldCheck size={14} />
              <span>Admin Long-Term Program Desk</span>
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0' }}>
              Patient Dossier: {clientName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#FAF8F0' }}>
          
          {isSaved && (
            <div style={{ padding: '10px 14px', backgroundColor: '#EEF4E8', borderRadius: '8px', border: '1.5px solid #38571A', display: 'flex', alignItems: 'center', gap: '8px', color: '#2B4214', fontSize: '13px', fontWeight: 700 }}>
              <CheckCircle2 size={18} color="#38571A" />
              <span>Action Successfully Saved & Synced with Client Portal!</span>
            </div>
          )}

          {/* 1. Prescribe Specific Package & Send Payment Link */}
          <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '2px solid #0A1C44' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#0A1C44" />
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0A1C44', margin: 0 }}>
                1. Prescribe Specific Long-Term Plan & Dispatch Link
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#4F5C38', margin: '0 0 12px' }}>
              Clinical Exclusivity: Only the specific package you prescribe below will unlock in the client’s portal for agreement signing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#111827', display: 'block', marginBottom: '4px' }}>
                  Select Package to Prescribe *
                </label>
                <select
                  value={selectedPkgId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedPkgId(id);
                    const p = DEFAULT_PACKAGES.find(x => x.id === id);
                    if (p?.paymentLink) setCustomPaymentLink(p.paymentLink);
                  }}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #0A1C44', fontSize: '13px', fontWeight: 700, backgroundColor: '#FFFFFF', color: '#0A1C44' }}
                >
                  {DEFAULT_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — ₹{pkg.priceInr.toLocaleString('en-IN')} ({pkg.durationMonths} Month{pkg.durationMonths > 1 ? 's' : ''}, {pkg.followUpDays} Follow-ups)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#111827', display: 'block', marginBottom: '4px' }}>
                  Client Payment / Gateway URL
                </label>
                <input
                  type="text"
                  value={customPaymentLink}
                  onChange={(e) => setCustomPaymentLink(e.target.value)}
                  placeholder="Paste Razorpay / Stripe / UPI Payment URL here..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D9D8CC',
                    fontSize: '12.5px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#111827', display: 'block', marginBottom: '4px' }}>
                  Clinical Note / Rationale for Client
                </label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Prescribed for steady fat loss and lean muscle retention."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D9D8CC',
                    fontSize: '12.5px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handlePrescribePlan}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#0A1C44',
                    color: '#E8CA56',
                    fontWeight: 900,
                    fontSize: '12.5px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Send size={14} /> Prescribe & Send Plan to Client
                </button>
              </div>
            </div>
          </div>

          {/* 2. Client Profile & Program Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {/* Supplement Preference */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#66734A' }}>
                <Pill size={15} />
                <span>SUPPLEMENT PREFERENCE</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: record.goalsAndSupplements.openToSupplements ? '#38571A' : '#C85A48', marginTop: '4px' }}>
                {record.goalsAndSupplements.openToSupplements ? '✅ YES, Open to Supplements' : '🍃 NO, Whole Foods Only'}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7063', marginTop: '2px' }}>
                {record.goalsAndSupplements.openToSupplements ? 'Diet chart will include pre/post micronutrients' : 'Supplements omitted from meal chart'}
              </div>
            </div>

            {/* Biometrics & Calculated LBM */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#66734A' }}>
                <Scale size={15} />
                <span>CALCULATED MACRO METRICS</span>
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A1C44', marginTop: '4px' }}>
                Weight: {record.biometrics.currentWeightKg} kg • LBM: {record.biometrics.leanBodyMassKg} kg
              </div>
              <div style={{ fontSize: '11px', color: '#4F5C38', marginTop: '2px' }}>
                Target: {record.biometrics.proteinGramsTarget}g Protein • {record.biometrics.fatGramsTarget}g Fat • {record.biometrics.dailyCalorieTarget} kcal
              </div>
            </div>

            {/* Dietary Preference & Cooking Fats */}
            <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#66734A' }}>
                <Utensils size={15} />
                <span>DIET & COOKING FATS</span>
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A1C44', marginTop: '4px' }}>
                {record.dietaryOrientation.dietType} ({record.biometrics.mealsCount} Meals/Day)
              </div>
              <div style={{ fontSize: '11px', color: '#4F5C38', marginTop: '2px' }}>
                Fats: {record.recipePreferences.cookingFats.join(', ') || 'Coconut Oil, Ghee'}
              </div>
            </div>
          </div>

          {/* 3. Agreement & PAR-Q Status */}
          <div style={{ padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #D9D8CC' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#66734A', textTransform: 'uppercase' }}>
              CLINICAL COMPLIANCE & SAFETY
            </span>
            <table style={{ width: '100%', fontSize: '12.5px', marginTop: '8px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F1EEDF' }}>
                  <td style={{ padding: '4px 0', fontWeight: 700, width: '140px' }}>Agreement:</td>
                  <td style={{ padding: '4px 0' }}>{record.agreement.isAccepted ? `Signed on ${record.agreement.startDate}` : 'Pending signature'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1EEDF' }}>
                  <td style={{ padding: '4px 0', fontWeight: 700 }}>PAR-Q Clearance:</td>
                  <td style={{ padding: '4px 0' }}>{record.parq.hasHeartCondition || record.parq.hasDizziness ? '⚠️ High Attention Flagged' : '✓ Cleared for Physical Activity'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', fontWeight: 700 }}>Welcome Gift:</td>
                  <td style={{ padding: '4px 0' }}>{record.gift.giftTitle}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Action: Auto-Customize and Publish Diet Chart */}
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <button
              type="button"
              onClick={handleAutoPublishChart}
              disabled={isPublishing}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: '#0A1C44',
                color: '#E8CA56',
                fontWeight: 900,
                fontSize: '13.5px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={16} />
              <span>{isPublishing ? 'Prescribing...' : `Publish Customized Diet Chart for ${clientName}`}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
