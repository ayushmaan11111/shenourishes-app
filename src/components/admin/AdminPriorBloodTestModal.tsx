import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  X, 
  Upload, 
  HeartPulse, 
  Plus, 
  Trash2,
  Download
} from 'lucide-react';
import { database, isFirebaseConfigured } from '../../services/firebase';
import { ref, get, set, remove } from 'firebase/database';
import type { PriorBloodTestRecord, LipidProfileValues } from '../../types/counselling';

interface AdminPriorBloodTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

const STORAGE_PRIOR_PREFIX = 'she_nourishes_prior_blood_tests_';

export const AdminPriorBloodTestModal: React.FC<AdminPriorBloodTestModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
}) => {
  const [records, setRecords] = useState<PriorBloodTestRecord[]>([]);
  const [testTitle, setTestTitle] = useState('Baseline Comprehensive Lipid & Metabolic Panel');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'Lipid Profile' | 'HbA1c / Glycemic' | 'Vitamin Profile' | 'Comprehensive Panel'>('Lipid Profile');
  
  // Lipid Profile specific values
  const [totalCholesterol, setTotalCholesterol] = useState('185');
  const [triglycerides, setTriglycerides] = useState('120');
  const [hdl, setHdl] = useState('54');
  const [ldl, setLdl] = useState('102');
  const [vldl, setVldl] = useState('24');
  
  // Glycemic & Vitamins
  const [hba1c, setHba1c] = useState('5.4');
  const [fastingGlucose, setFastingGlucose] = useState('92');
  const [vitD, setVitD] = useState('24');
  const [vitB12, setVitB12] = useState('360');
  const [lpa, setLpa] = useState('18');

  // Report & Remarks
  const [reportPdfUrl, setReportPdfUrl] = useState('https://example.com/reports/prior_lipid_panel.pdf');
  const [reportFileName, setReportFileName] = useState('Metropolis_Diagnostic_Panel.pdf');
  const [doctorRemarks, setDoctorRemarks] = useState('Lipid profile within favorable ranges. Recommended optimizing HDL with Omega-3 and Vitamin D3 supplementation.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPriorTests = async () => {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, `customers/${clientId}/priorBloodTests`));
        if (snap.exists()) {
          const arr = Object.values(snap.val()) as PriorBloodTestRecord[];
          arr.sort((a, b) => b.uploadedAt - a.uploadedAt);
          setRecords(arr);
          return;
        }
      } catch (e) {}
    }

    try {
      const raw = localStorage.getItem(`${STORAGE_PRIOR_PREFIX}${clientId}`);
      if (raw) {
        setRecords(JSON.parse(raw));
        return;
      }
    } catch {}

    // Initial default seed test for display
    const seed: PriorBloodTestRecord = {
      id: 'prior_test_1',
      clientId,
      testDate: '2026-09-10',
      testTitle: 'Prior Fasting Lipid Profile & HbA1c Baseline',
      category: 'Lipid Profile',
      lipidValues: {
        totalCholesterol: 185,
        triglycerides: 120,
        hdl: 54,
        ldl: 102,
        vldl: 24,
        cholesterolHdlRatio: 3.42,
      },
      hba1cValue: 5.4,
      fastingGlucose: 92,
      vitaminDValue: 24,
      vitaminB12Value: 360,
      reportPdfUrl: 'https://example.com/reports/prior_lipid_panel.pdf',
      reportFileName: 'Metropolis_Diagnostic_Panel.pdf',
      doctorRemarks: 'Lipid profile within favorable ranges. Recommended optimizing HDL with Omega-3 and Vitamin D3 supplementation.',
      uploadedAt: Date.now() - 86400000 * 20,
    };
    setRecords([seed]);
  };

  useEffect(() => {
    if (clientId) {
      loadPriorTests();
    }
  }, [clientId]);

  if (!isOpen) return null;

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const lipidVals: LipidProfileValues = {
        totalCholesterol: totalCholesterol ? parseFloat(totalCholesterol) : undefined,
        triglycerides: triglycerides ? parseFloat(triglycerides) : undefined,
        hdl: hdl ? parseFloat(hdl) : undefined,
        ldl: ldl ? parseFloat(ldl) : undefined,
        vldl: vldl ? parseFloat(vldl) : undefined,
        cholesterolHdlRatio: (totalCholesterol && hdl) ? parseFloat((parseFloat(totalCholesterol) / parseFloat(hdl)).toFixed(2)) : undefined,
      };

      const newRec: PriorBloodTestRecord = {
        id: `prior_${Date.now()}`,
        clientId,
        testDate,
        testTitle: testTitle.trim() || 'Prior Blood Test Panel',
        category,
        lipidValues: lipidVals,
        hba1cValue: hba1c ? parseFloat(hba1c) : undefined,
        fastingGlucose: fastingGlucose ? parseFloat(fastingGlucose) : undefined,
        vitaminDValue: vitD ? parseFloat(vitD) : undefined,
        vitaminB12Value: vitB12 ? parseFloat(vitB12) : undefined,
        lpaValue: lpa ? parseFloat(lpa) : undefined,
        reportPdfUrl: reportPdfUrl.trim() || undefined,
        reportFileName: reportFileName.trim() || 'Prior_Diagnostic_Report.pdf',
        doctorRemarks: doctorRemarks.trim() || undefined,
        uploadedAt: Date.now(),
      };

      const updated = [newRec, ...records];
      setRecords(updated);

      try {
        localStorage.setItem(`${STORAGE_PRIOR_PREFIX}${clientId}`, JSON.stringify(updated));
      } catch {}

      if (isFirebaseConfigured && database) {
        try {
          await set(ref(database, `customers/${clientId}/priorBloodTests/${newRec.id}`), newRec);
        } catch (err) {
          console.warn(err);
        }
      }

      window.dispatchEvent(new CustomEvent('prior_blood_test_added', { detail: newRec }));
      setDoctorRemarks('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (testId: string) => {
    if (window.confirm('Delete this prior test record?')) {
      const updated = records.filter(r => r.id !== testId);
      setRecords(updated);
      try {
        localStorage.setItem(`${STORAGE_PRIOR_PREFIX}${clientId}`, JSON.stringify(updated));
      } catch {}
      if (isFirebaseConfigured && database) {
        try {
          await remove(ref(database, `customers/${clientId}/priorBloodTests/${testId}`));
        } catch (e) {}
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.72)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '16px',
      }}
    >
      <div
        className="wellness-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '92vh',
          backgroundColor: '#FFFDF9',
          borderRadius: '20px',
          border: '2px solid #0A1C44',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.22)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(232, 202, 86, 0.2)',
                color: '#E8CA56',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TestTube size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ADMIN CLINICAL DIAGNOSTICS
              </span>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Attach Prior Blood Tests & Separate Lipid Profile
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Client Banner */}
        <div style={{ padding: '10px 20px', backgroundColor: '#FAF8F0', borderBottom: '1px solid #ECEAE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#242820' }}>
            Attaching to Client: <strong style={{ color: '#0A1C44' }}>{clientName}</strong>
          </span>
          <span style={{ fontSize: '11px', color: '#047857', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: '4px' }}>
            ● Uploads will appear directly in Client Home Page & Long Term Support
          </span>
        </div>

        {/* Scrollable Form & History */}
        <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* New Test Upload Form */}
          <form onSubmit={handleAddRecord} style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #D9D8CC', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} color="#0A1C44" />
                <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                  Upload Prior Test & Calibrate Lipid Profile Values
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Cardiovascular & Metabolic Markers</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Test Panel Name</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '11.5px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Test Collection Date</label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '11.5px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="form-select"
                  style={{ fontSize: '11.5px' }}
                >
                  <option value="Lipid Profile">Lipid Profile (Dedicated)</option>
                  <option value="HbA1c / Glycemic">HbA1c / Fasting Sugar</option>
                  <option value="Vitamin Profile">Vitamin Profile (D & B12)</option>
                  <option value="Comprehensive Panel">Comprehensive 5-Panel</option>
                </select>
              </div>
            </div>

            {/* Dedicated Lipid Profile Section */}
            <div style={{ padding: '12px', backgroundColor: '#F8FCF5', borderRadius: '10px', border: '1px solid #B8D4A8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <HeartPulse size={15} color="#38571A" />
                <strong style={{ fontSize: '12px', color: '#38571A', textTransform: 'uppercase' }}>
                  🧪 Dedicated Lipid Profile Breakdown (mg/dL)
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Total Cholesterol</label>
                  <input
                    type="number"
                    value={totalCholesterol}
                    onChange={(e) => setTotalCholesterol(e.target.value)}
                    placeholder="185"
                    className="form-input"
                    style={{ fontSize: '11.5px', padding: '4px 6px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Triglycerides</label>
                  <input
                    type="number"
                    value={triglycerides}
                    onChange={(e) => setTriglycerides(e.target.value)}
                    placeholder="120"
                    className="form-input"
                    style={{ fontSize: '11.5px', padding: '4px 6px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>HDL (Good)</label>
                  <input
                    type="number"
                    value={hdl}
                    onChange={(e) => setHdl(e.target.value)}
                    placeholder="54"
                    className="form-input"
                    style={{ fontSize: '11.5px', padding: '4px 6px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>LDL (Bad)</label>
                  <input
                    type="number"
                    value={ldl}
                    onChange={(e) => setLdl(e.target.value)}
                    placeholder="102"
                    className="form-input"
                    style={{ fontSize: '11.5px', padding: '4px 6px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>VLDL</label>
                  <input
                    type="number"
                    value={vldl}
                    onChange={(e) => setVldl(e.target.value)}
                    placeholder="24"
                    className="form-input"
                    style={{ fontSize: '11.5px', padding: '4px 6px' }}
                  />
                </div>
              </div>
            </div>

            {/* Other Biomarkers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '10.5px' }}>HbA1c (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={hba1c}
                  onChange={(e) => setHba1c(e.target.value)}
                  placeholder="5.4"
                  className="form-input"
                  style={{ fontSize: '11.5px', padding: '4px 6px' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '10.5px' }}>Fasting Glucose</label>
                <input
                  type="number"
                  value={fastingGlucose}
                  onChange={(e) => setFastingGlucose(e.target.value)}
                  placeholder="92"
                  className="form-input"
                  style={{ fontSize: '11.5px', padding: '4px 6px' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '10.5px' }}>Vit D (ng/mL)</label>
                <input
                  type="number"
                  value={vitD}
                  onChange={(e) => setVitD(e.target.value)}
                  placeholder="24"
                  className="form-input"
                  style={{ fontSize: '11.5px', padding: '4px 6px' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '10.5px' }}>Vit B12 (pg/mL)</label>
                <input
                  type="number"
                  value={vitB12}
                  onChange={(e) => setVitB12(e.target.value)}
                  placeholder="360"
                  className="form-input"
                  style={{ fontSize: '11.5px', padding: '4px 6px' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '10.5px' }}>Lp(a)</label>
                <input
                  type="number"
                  value={lpa}
                  onChange={(e) => setLpa(e.target.value)}
                  placeholder="18"
                  className="form-input"
                  style={{ fontSize: '11.5px', padding: '4px 6px' }}
                />
              </div>
            </div>

            {/* PDF Report Link & Remarks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>PDF File Link / Google Drive URL</label>
                <input
                  type="url"
                  value={reportPdfUrl}
                  onChange={(e) => setReportPdfUrl(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '11.5px' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>PDF File Display Name</label>
                <input
                  type="text"
                  value={reportFileName}
                  onChange={(e) => setReportFileName(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '11.5px' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '11px' }}>Doctor & Clinical Nutritionist Remarks</label>
              <textarea
                rows={2}
                value={doctorRemarks}
                onChange={(e) => setDoctorRemarks(e.target.value)}
                className="form-input"
                style={{ fontSize: '11.5px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={13} />
                <span>{isSubmitting ? 'Attaching...' : 'Attach & Publish to Client Account'}</span>
              </button>
            </div>
          </form>

          {/* Existing Prior Test Records */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
              Attached Prior Blood Test Records ({records.length})
            </h4>

            {records.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #D9D8CC',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#1E293B' }}>{r.testTitle}</strong>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Date: {r.testDate} • Category: <strong>{r.category}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#38571A', fontSize: '10.5px', fontWeight: 800 }}>
                      ✓ Published to Client
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                      title="Delete test"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Lipid Details Box if present */}
                {r.lipidValues && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '8px 10px', backgroundColor: '#F8FCF5', borderRadius: '8px', border: '1px solid #D1E7DD' }}>
                    <span style={{ fontSize: '11px', color: '#134E4A' }}>
                      Total Chol: <strong>{r.lipidValues.totalCholesterol} mg/dL</strong>
                    </span>
                    <span style={{ fontSize: '11px', color: '#134E4A' }}>
                      HDL: <strong>{r.lipidValues.hdl} mg/dL</strong>
                    </span>
                    <span style={{ fontSize: '11px', color: '#134E4A' }}>
                      LDL: <strong>{r.lipidValues.ldl} mg/dL</strong>
                    </span>
                    <span style={{ fontSize: '11px', color: '#134E4A' }}>
                      Triglycerides: <strong>{r.lipidValues.triglycerides} mg/dL</strong>
                    </span>
                    {r.lipidValues.cholesterolHdlRatio && (
                      <span style={{ fontSize: '11px', color: '#134E4A' }}>
                        Ratio: <strong>{r.lipidValues.cholesterolHdlRatio}</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Other metrics */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '11.5px', color: '#475569' }}>
                  {r.hba1cValue && <span>HbA1c: <strong>{r.hba1cValue}%</strong></span>}
                  {r.fastingGlucose && <span>Fasting Glucose: <strong>{r.fastingGlucose} mg/dL</strong></span>}
                  {r.vitaminDValue && <span>Vit D: <strong>{r.vitaminDValue} ng/mL</strong></span>}
                  {r.vitaminB12Value && <span>Vit B12: <strong>{r.vitaminB12Value} pg/mL</strong></span>}
                </div>

                {r.doctorRemarks && (
                  <p style={{ fontSize: '11px', color: '#334155', margin: '2px 0 0', fontStyle: 'italic' }}>
                    Remarks: "{r.doctorRemarks}"
                  </p>
                )}

                {r.reportPdfUrl && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                    <a
                      href={r.reportPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#0A1C44',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Download size={11} />
                      <span>{r.reportFileName || 'View Lab PDF'}</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', backgroundColor: '#FAF8F0', borderTop: '1px solid #ECEAE0', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn-primary" style={{ fontSize: '12px' }}>
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
};
