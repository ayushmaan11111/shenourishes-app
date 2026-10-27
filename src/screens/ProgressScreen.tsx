import React, { useState } from 'react';
import { 
  TrendingUp, 
  Scale, 
  Ruler, 
  MessageSquare, 
  Check, 
  Plus, 
  Send, 
  X, 
  ShieldCheck, 
  Activity, 
  Apple, 
  Home as HomeIcon, 
  User as UserIcon,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProgressScreenProps {
  onNavigateTab: (tab: 'home' | 'nutrition' | 'activity' | 'progress' | 'profile') => void;
}

interface WeightEntry {
  id: string;
  weightKg: number;
  date: string;
  note?: string;
}

interface MeasurementEntry {
  id: string;
  date: string;
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  armsCm?: number;
  thighsCm?: number;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ onNavigateTab }) => {
  const { customerRecord } = useAuth();

  const rawWeight = customerRecord?.personalDetails?.weight;
  const parsedWeight = typeof rawWeight === 'number' ? rawWeight : parseFloat(String(rawWeight || '68')) || 68;
  const startingWeight = parsedWeight;
  const targetWeight = Number((parsedWeight - 5).toFixed(1));

  // Weight entries state
  const [weightLogs, setWeightLogs] = useState<WeightEntry[]>([
    { id: 'w1', weightKg: startingWeight, date: 'Week 1 (Baseline)', note: 'Starting Weight' },
    { id: 'w2', weightKg: Number((startingWeight - 0.8).toFixed(1)), date: 'Week 2', note: 'Energy stable' },
    { id: 'w3', weightKg: Number((startingWeight - 1.6).toFixed(1)), date: 'Today', note: 'Feeling lighter' },
  ]);
  const [newWeight, setNewWeight] = useState<string>('');
  const [newWeightNote, setNewWeightNote] = useState<string>('');
  const [showAddWeight, setShowAddWeight] = useState<boolean>(false);

  // Measurements State
  const [measurements, setMeasurements] = useState<MeasurementEntry[]>([
    { id: 'm1', date: 'Initial Baseline', waistCm: 82, chestCm: 94, hipsCm: 98, armsCm: 30, thighsCm: 56 },
    { id: 'm2', date: 'Current Check-in', waistCm: 79.5, chestCm: 93, hipsCm: 96.5, armsCm: 29.5, thighsCm: 55 },
  ]);
  const [showAddMeasurements, setShowAddMeasurements] = useState<boolean>(false);
  const [waistVal, setWaistVal] = useState<string>('');
  const [chestVal, setChestVal] = useState<string>('');
  const [hipsVal, setHipsVal] = useState<string>('');

  // Ask for Support Modal State
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [supportCategory, setSupportCategory] = useState<string>('Diet & Food Substitutions');
  const [supportMessage, setSupportMessage] = useState<string>('');
  const [supportSubmitted, setSupportSubmitted] = useState<boolean>(false);

  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weightKg : startingWeight;
  const weightLost = Number((startingWeight - currentWeight).toFixed(1));

  const handleAddWeight = () => {
    if (!newWeight || isNaN(Number(newWeight))) return;
    const entry: WeightEntry = {
      id: 'w_' + Date.now(),
      weightKg: Number(Number(newWeight).toFixed(1)),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      note: newWeightNote.trim() || undefined,
    };
    setWeightLogs([...weightLogs, entry]);
    setNewWeight('');
    setNewWeightNote('');
    setShowAddWeight(false);
  };

  const handleAddMeasurement = () => {
    const entry: MeasurementEntry = {
      id: 'm_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      waistCm: waistVal ? Number(waistVal) : undefined,
      chestCm: chestVal ? Number(chestVal) : undefined,
      hipsCm: hipsVal ? Number(hipsVal) : undefined,
    };
    setMeasurements([...measurements, entry]);
    setWaistVal('');
    setChestVal('');
    setHipsVal('');
    setShowAddMeasurements(false);
  };

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportSubmitted(false);
      setShowSupportModal(false);
      setSupportMessage('');
    }, 1500);
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
      {/* Header */}
      <div
        style={{
          padding: '20px 18px 14px',
          backgroundColor: '#FFFDF8',
          borderBottom: '1px solid #D9D8CC',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#66734A', fontWeight: 700, textTransform: 'uppercase' }}>
            <TrendingUp size={14} />
            <span>Progress & Support Desk</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, color: '#242820', margin: 0 }}>
            Biometric Progress
          </h1>
        </div>

        {/* Ask for Support Button */}
        <button
          type="button"
          onClick={() => setShowSupportModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '9999px',
            backgroundColor: '#4F5C38',
            color: '#FFFDF8',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(79, 92, 56, 0.15)',
          }}
        >
          <MessageSquare size={14} />
          <span>Ask for Support</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* KPI Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div className="wellness-card" style={{ padding: '12px', backgroundColor: '#FFFDF8', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 600 }}>Current Weight</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#242820', marginTop: '2px' }}>
              {currentWeight} <span style={{ fontSize: '12px', fontWeight: 500 }}>kg</span>
            </div>
          </div>

          <div className="wellness-card" style={{ padding: '12px', backgroundColor: '#FFFDF8', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 600 }}>Change</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: weightLost >= 0 ? '#38571A' : '#C85A48', marginTop: '2px' }}>
              {weightLost >= 0 ? `-${weightLost}` : `+${Math.abs(weightLost)}`} <span style={{ fontSize: '12px', fontWeight: 500 }}>kg</span>
            </div>
          </div>

          <div className="wellness-card" style={{ padding: '12px', backgroundColor: '#FFFDF8', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#6B7063', fontWeight: 600 }}>Target</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#4F5C38', marginTop: '2px' }}>
              {targetWeight} <span style={{ fontSize: '12px', fontWeight: 500 }}>kg</span>
            </div>
          </div>
        </div>

        {/* Weight Tracker Section */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={18} color="#66734A" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#242820', margin: 0 }}>Weight History</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddWeight(true)}
              style={{ fontSize: '12px', fontWeight: 600, color: '#66734A', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} />
              <span>Log Weight</span>
            </button>
          </div>

          {/* Add Weight Form */}
          {showAddWeight && (
            <div className="animate-fade-in" style={{ padding: '12px', backgroundColor: '#FAF8F0', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 67.2"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  placeholder="Optional Note (e.g. Fasted)"
                  value={newWeightNote}
                  onChange={(e) => setNewWeightNote(e.target.value)}
                  className="form-input"
                  style={{ flex: 2 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddWeight(false)}
                  style={{ fontSize: '12px', padding: '6px 12px', background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddWeight}
                  style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '8px', backgroundColor: '#66734A', color: '#FFFDF8', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Entry
                </button>
              </div>
            </div>
          )}

          {/* Weight Log Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {weightLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF8F0',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} color="#8A9568" />
                  <span style={{ fontWeight: 600, color: '#242820' }}>{log.date}</span>
                  {log.note && <span style={{ fontSize: '11px', color: '#6B7063' }}>• {log.note}</span>}
                </div>
                <strong style={{ color: '#4F5C38' }}>{log.weightKg} kg</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Body Measurements Section */}
        <div className="wellness-card" style={{ padding: '16px', backgroundColor: '#FFFDF8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ruler size={18} color="#66734A" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#242820', margin: 0 }}>Circumference Measurements</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddMeasurements(true)}
              style={{ fontSize: '12px', fontWeight: 600, color: '#66734A', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} />
              <span>Log Measurements</span>
            </button>
          </div>

          {/* Add Measurements Form */}
          {showAddMeasurements && (
            <div className="animate-fade-in" style={{ padding: '12px', backgroundColor: '#FAF8F0', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#6B7063' }}>Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="79"
                    value={waistVal}
                    onChange={(e) => setWaistVal(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#6B7063' }}>Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="93"
                    value={chestVal}
                    onChange={(e) => setChestVal(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#6B7063' }}>Hips (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="96"
                    value={hipsVal}
                    onChange={(e) => setHipsVal(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddMeasurements(false)}
                  style={{ fontSize: '12px', padding: '6px 12px', background: 'none', border: 'none', color: '#6B7063', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMeasurement}
                  style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '8px', backgroundColor: '#66734A', color: '#FFFDF8', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Entry
                </button>
              </div>
            </div>
          )}

          {/* Measurements Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {measurements.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF8F0',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <strong style={{ color: '#242820' }}>{m.date}</strong>
                <div style={{ display: 'flex', gap: '14px', color: '#4F5C38', fontWeight: 600 }}>
                  {m.waistCm && <span>Waist: {m.waistCm}cm</span>}
                  {m.chestCm && <span>Chest: {m.chestCm}cm</span>}
                  {m.hipsCm && <span>Hips: {m.hipsCm}cm</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ask for Support Modal */}
      {showSupportModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(36, 40, 32, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div className="wellness-card animate-scale-up" style={{ width: '100%', maxWidth: '420px', backgroundColor: '#FFFDF8', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#66734A', fontWeight: 700, textTransform: 'uppercase' }}>
                  <ShieldCheck size={14} />
                  <span>Clinical Nutritionist Hotline</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#242820', margin: '2px 0 0' }}>
                  Ask Your Nutritionist
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                style={{ padding: '4px', color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {supportSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '9999px', backgroundColor: '#EEF4E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={24} color="#3B6E22" strokeWidth={3} />
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#242820', margin: 0 }}>Inquiry Received</h4>
                <p style={{ fontSize: '12px', color: '#6B7063', margin: 0 }}>
                  Your assigned nutritionist will review your query and reply directly to your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitSupport} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Query Topic</label>
                  <select
                    value={supportCategory}
                    onChange={(e) => setSupportCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="Diet & Food Substitutions">Diet & Food Substitutions</option>
                    <option value="Supplement Timing & Dosage">Supplement Timing & Dosage</option>
                    <option value="Workout & Energy Adjustments">Workout & Energy Adjustments</option>
                    <option value="Digestive Comfort / Bloating">Digestive Comfort / Bloating</option>
                    <option value="Other Nutrition Questions">Other Nutrition Questions</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">How can we support you today?</label>
                  <textarea
                    rows={4}
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="e.g. Can I replace brown rice with sweet potatoes in Meal 4? Or how should I space out my magnesium before sleep?"
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowSupportModal(false)}
                    style={{ flex: 1, padding: '10px', borderRadius: '10px', backgroundColor: '#EBE9DC', color: '#242820', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 2, padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Send size={15} />
                    <span>Send to Nutritionist</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          type="button"
          onClick={() => onNavigateTab('home')}
          className="nav-item"
        >
          <HomeIcon size={20} />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('nutrition')}
          className="nav-item"
        >
          <Apple size={20} />
          <span>Nutrition</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('activity')}
          className="nav-item"
        >
          <Activity size={20} />
          <span>Activity</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('progress')}
          className="nav-item is-active"
        >
          <TrendingUp size={20} />
          <span>Progress</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('profile')}
          className="nav-item"
        >
          <UserIcon size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
