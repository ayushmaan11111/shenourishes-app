import React, { useState } from 'react';
import { X, Target, Pill, GitBranch, Plus, Check, Edit2, ShieldAlert, Palette, Search } from 'lucide-react';
import {
  getAllGoalDefinitions,
  saveGoalDefinition,
  getAllSupplementEntities,
  saveSupplementEntity,
  getAllRecommendationRules,
  saveRecommendationRule,
} from '../../services/recommendationEngine';
import { renderGoalVectorIcon, GOAL_VECTOR_ICON_REGISTRY } from '../icons/GoalVectorIcons';
import { renderSupplementVectorIcon } from '../icons/SupplementVectorIcons';
import type {
  GoalDefinition,
  SupplementEntity,
  RecommendationRule,
  RecommendationType,
} from '../../types/recommendations';

interface GoalRecommendationManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_GOAL_ICON_KEYS = Object.keys(GOAL_VECTOR_ICON_REGISTRY).filter((k) => k.startsWith('icon_'));

export const GoalRecommendationManagerModal: React.FC<GoalRecommendationManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'goals' | 'supplements' | 'rules' | 'icons'>('goals');
  const [iconSearchQuery, setIconSearchQuery] = useState('');

  // Goals State
  const [goals, setGoals] = useState<GoalDefinition[]>(getAllGoalDefinitions());
  const [editingGoal, setEditingGoal] = useState<GoalDefinition | null>(null);

  // Supplements State
  const [supplements, setSupplements] = useState<SupplementEntity[]>(getAllSupplementEntities());
  const [editingSupplement, setEditingSupplement] = useState<SupplementEntity | null>(null);

  // Rules State
  const [rules, setRules] = useState<RecommendationRule[]>(getAllRecommendationRules());
  const [editingRule, setEditingRule] = useState<RecommendationRule | null>(null);

  if (!isOpen) return null;

  // --- Handlers for Goals ---
  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;
    saveGoalDefinition(editingGoal);
    setGoals(getAllGoalDefinitions());
    setEditingGoal(null);
  };

  const handleToggleGoalActive = (goal: GoalDefinition) => {
    const updated = { ...goal, isActive: !goal.isActive };
    saveGoalDefinition(updated);
    setGoals(getAllGoalDefinitions());
  };

  // --- Handlers for Supplements ---
  const handleSaveSupplement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplement) return;
    saveSupplementEntity(editingSupplement);
    setSupplements(getAllSupplementEntities());
    setEditingSupplement(null);
  };

  // --- Handlers for Rules ---
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    saveRecommendationRule(editingRule);
    setRules(getAllRecommendationRules());
    setEditingRule(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(36, 40, 32, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '16px',
      }}
    >
      <div
        className="wellness-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#FFFDF8',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#66734A', fontWeight: 700, textTransform: 'uppercase' }}>
              <ShieldAlert size={14} />
              <span>Nutritionist & Admin Portal</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#242820', marginTop: '2px', margin: 0 }}>
              Goal & Recommendation Manager
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '6px', color: '#6B7063', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #D9D8CC', paddingBottom: '10px', marginBottom: '16px', overflowX: 'auto' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('goals'); setEditingGoal(null); }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'goals' ? '#66734A' : '#F1EEDF',
              color: activeTab === 'goals' ? '#FFFDF8' : '#4F5C38',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Target size={14} />
            <span>Goals ({goals.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('supplements'); setEditingSupplement(null); }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'supplements' ? '#66734A' : '#F1EEDF',
              color: activeTab === 'supplements' ? '#FFFDF8' : '#4F5C38',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Pill size={14} />
            <span>Supplements ({supplements.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('rules'); setEditingRule(null); }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'rules' ? '#66734A' : '#F1EEDF',
              color: activeTab === 'rules' ? '#FFFDF8' : '#4F5C38',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <GitBranch size={14} />
            <span>Rules ({rules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('icons')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'icons' ? '#66734A' : '#F1EEDF',
              color: activeTab === 'icons' ? '#FFFDF8' : '#4F5C38',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Palette size={14} />
            <span>Icon Library ({AVAILABLE_GOAL_ICON_KEYS.length})</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {/* TAB 1: GOALS */}
          {activeTab === 'goals' && (
            <div>
              {!editingGoal ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingGoal({
                        id: 'goal_' + Math.random().toString(36).substring(2, 9),
                        name: '',
                        description: '',
                        category: 'GENERAL WELLNESS',
                        icon: 'icon_muscle_gain',
                        iconType: 'vector',
                        priority: goals.length + 1,
                        isActive: true,
                      })
                    }
                    className="btn-primary"
                    style={{ padding: '10px', fontSize: '13px', marginBottom: '8px' }}
                  >
                    <Plus size={16} />
                    <span>+ Create New Goal</span>
                  </button>

                  {goals.map((g) => (
                    <div
                      key={g.id}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: g.isActive ? '#FFFDF8' : '#F5F4EE',
                        border: '1px solid #D9D8CC',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flexShrink: 0 }}>
                          {renderGoalVectorIcon(g.icon || g.name, 40)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ fontSize: '13px', color: '#242820' }}>{g.name}</strong>
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#4F5C38', fontWeight: 600 }}>
                              {g.category}
                            </span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#6B7063', marginTop: '2px', margin: 0 }}>{g.description}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => handleToggleGoalActive(g)}
                          style={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: g.isActive ? '#E2EDDA' : '#EAE8DE',
                            color: g.isActive ? '#3B6E22' : '#8A887E',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {g.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingGoal(g)}
                          style={{ padding: '6px', color: '#66734A', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Edit2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSaveGoal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#FAF8F0', borderRadius: '12px' }}>
                    <div style={{ flexShrink: 0 }}>
                      {renderGoalVectorIcon(editingGoal.icon || 'icon_custom_goal', 52)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Edit Goal Definition</h3>
                      <span style={{ fontSize: '11px', color: '#8A9568' }}>Assigned Vector Icon: {editingGoal.icon || 'icon_custom_goal'}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Goal Name</label>
                    <input
                      type="text"
                      required
                      value={editingGoal.name}
                      onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Vector Icon</label>
                    <select
                      value={editingGoal.icon || 'icon_muscle_gain'}
                      onChange={(e) => setEditingGoal({ ...editingGoal, icon: e.target.value })}
                      className="form-select"
                    >
                      {AVAILABLE_GOAL_ICON_KEYS.map((k) => (
                        <option key={k} value={k}>{k.replace('icon_', '').replace(/_/g, ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={editingGoal.category}
                      onChange={(e) => setEditingGoal({ ...editingGoal, category: e.target.value as any })}
                      className="form-select"
                    >
                      <option value="HIGH INTENSITY / PERFORMANCE">HIGH INTENSITY / PERFORMANCE</option>
                      <option value="BEGINNER — SEDENTARY & LIGHTLY ACTIVE">BEGINNER — SEDENTARY & LIGHTLY ACTIVE</option>
                      <option value="GENERAL WELLNESS">GENERAL WELLNESS</option>
                      <option value="CLINICAL NUTRITION">CLINICAL NUTRITION</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={2}
                      required
                      value={editingGoal.description}
                      onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                      className="form-textarea"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      <Check size={16} />
                      <span>Save Goal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingGoal(null)}
                      style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#EBE9DC', color: '#242820', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: SUPPLEMENTS */}
          {activeTab === 'supplements' && (
            <div>
              {!editingSupplement ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingSupplement({
                        id: 'supp_' + Math.random().toString(36).substring(2, 9),
                        name: '',
                        category: 'Bone Health',
                        description: '',
                        icon: 'supp_calcium_citrate_malate',
                        iconType: 'vector',
                        active: true,
                        standardDosage: '',
                        timing: '',
                      })
                    }
                    className="btn-primary"
                    style={{ padding: '10px', fontSize: '13px', marginBottom: '8px' }}
                  >
                    <Plus size={16} />
                    <span>+ Add Supplement</span>
                  </button>

                  {supplements.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: '#FFFDF8',
                        border: '1px solid #D9D8CC',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flexShrink: 0 }}>
                          {renderSupplementVectorIcon(s.name, 40)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ fontSize: '13px', color: '#242820' }}>{s.name}</strong>
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F3EFE0', color: '#4F5C38', fontWeight: 600 }}>
                              {s.category}
                            </span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#6B7063', marginTop: '2px', margin: 0 }}>{s.description}</p>
                          {s.standardDosage && (
                            <div style={{ fontSize: '11px', color: '#66734A', marginTop: '2px', fontWeight: 500 }}>
                              Dose: {s.standardDosage} {s.timing ? `• Timing: ${s.timing}` : ''}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingSupplement(s)}
                        style={{ padding: '6px', color: '#66734A', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Edit2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSaveSupplement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#FAF8F0', borderRadius: '12px' }}>
                    <div style={{ flexShrink: 0 }}>
                      {renderSupplementVectorIcon(editingSupplement.name || 'calcium citrate malate', 52)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Edit Supplement Entity</h3>
                      <span style={{ fontSize: '11px', color: '#8A9568' }}>Dedicated Vector Asset</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Supplement Name</label>
                    <input
                      type="text"
                      required
                      value={editingSupplement.name}
                      onChange={(e) => setEditingSupplement({ ...editingSupplement, name: e.target.value })}
                      placeholder="e.g. Calcium Citrate Malate, Vitamin K2 MK-7..."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      required
                      value={editingSupplement.category}
                      onChange={(e) => setEditingSupplement({ ...editingSupplement, category: e.target.value })}
                      placeholder="e.g. Bone Health, Sleep, Recovery..."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Standard Dosage</label>
                    <input
                      type="text"
                      value={editingSupplement.standardDosage || ''}
                      onChange={(e) => setEditingSupplement({ ...editingSupplement, standardDosage: e.target.value })}
                      placeholder="e.g. 500mg CCM + 55mcg K2..."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Timing</label>
                    <input
                      type="text"
                      value={editingSupplement.timing || ''}
                      onChange={(e) => setEditingSupplement({ ...editingSupplement, timing: e.target.value })}
                      placeholder="e.g. With meals..."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description / Clinical Purpose</label>
                    <textarea
                      rows={2}
                      required
                      value={editingSupplement.description}
                      onChange={(e) => setEditingSupplement({ ...editingSupplement, description: e.target.value })}
                      className="form-textarea"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      <Check size={16} />
                      <span>Save Supplement</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSupplement(null)}
                      style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#EBE9DC', color: '#242820', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: RULES */}
          {activeTab === 'rules' && (
            <div>
              {!editingRule ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingRule({
                        id: 'rule_' + Math.random().toString(36).substring(2, 9),
                        goalIdOrName: goals[0]?.name || 'Better Sleep',
                        recommendationName: '',
                        recommendationType: 'SUPPLEMENT',
                        category: 'Clinical Strategy',
                        description: '',
                        dosageOrProtocol: '',
                        timing: '',
                      })
                    }
                    className="btn-primary"
                    style={{ padding: '10px', fontSize: '13px', marginBottom: '8px' }}
                  >
                    <Plus size={16} />
                    <span>+ Add Recommendation Rule</span>
                  </button>

                  {rules.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: '#FFFDF8',
                        border: '1px solid #D9D8CC',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '11px', color: '#6B7063', fontWeight: 600 }}>
                          IF Goal = <strong style={{ color: '#4F5C38' }}>"{r.goalIdOrName}"</strong>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#242820', marginTop: '2px' }}>
                          THEN Recommend: {r.recommendationName}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EEF4E8', color: '#4F5C38', fontWeight: 700 }}>
                            {r.recommendationType}
                          </span>
                          {r.conditionDietPreference && (
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FDF0EE', color: '#C85A48', fontWeight: 600 }}>
                              {r.conditionDietPreference} Only
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingRule(r)}
                        style={{ padding: '6px', color: '#66734A', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Edit2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSaveRule} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Edit Recommendation Rule</h3>

                  <div className="form-group">
                    <label className="form-label">Trigger Goal</label>
                    <input
                      type="text"
                      required
                      value={editingRule.goalIdOrName}
                      onChange={(e) => setEditingRule({ ...editingRule, goalIdOrName: e.target.value })}
                      placeholder="e.g. Better Sleep, Bone Health Support..."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Recommendation Name</label>
                    <input
                      type="text"
                      required
                      value={editingRule.recommendationName}
                      onChange={(e) => setEditingRule({ ...editingRule, recommendationName: e.target.value })}
                      placeholder="e.g. Magnesium Glycinate, Calcium Citrate Malate..."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Recommendation Type</label>
                    <select
                      value={editingRule.recommendationType}
                      onChange={(e) => setEditingRule({ ...editingRule, recommendationType: e.target.value as RecommendationType })}
                      className="form-select"
                    >
                      <option value="SUPPLEMENT">SUPPLEMENT</option>
                      <option value="DIET STRATEGY">DIET STRATEGY</option>
                      <option value="NUTRITION STRATEGY">NUTRITION STRATEGY</option>
                      <option value="LIFESTYLE">LIFESTYLE</option>
                      <option value="HYDRATION">HYDRATION</option>
                      <option value="FOOD">FOOD</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dietary Condition (Optional)</label>
                    <select
                      value={editingRule.conditionDietPreference || 'ANY'}
                      onChange={(e) => setEditingRule({ ...editingRule, conditionDietPreference: e.target.value as any })}
                      className="form-select"
                    >
                      <option value="ANY">Any Diet Preference</option>
                      <option value="VEGETARIAN">Vegetarian Only (e.g. Algal DHA)</option>
                      <option value="NON-VEGETARIAN">Non-Vegetarian Only (e.g. Fish EPA)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description / Rationale</label>
                    <textarea
                      rows={2}
                      required
                      value={editingRule.description}
                      onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                      className="form-textarea"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      <Check size={16} />
                      <span>Save Rule</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRule(null)}
                      style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#EBE9DC', color: '#242820', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: ICON LIBRARY */}
          {activeTab === 'icons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#6B7063" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search vector icon library..."
                  value={iconSearchQuery}
                  onChange={(e) => setIconSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {AVAILABLE_GOAL_ICON_KEYS
                  .filter((key) => key.toLowerCase().includes(iconSearchQuery.toLowerCase()))
                  .map((key) => {
                    const label = key.replace('icon_', '').replace(/_/g, ' ');
                    return (
                      <div
                        key={key}
                        className="wellness-card"
                        style={{
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          gap: '8px',
                          backgroundColor: '#FFFDF8',
                        }}
                      >
                        {renderGoalVectorIcon(key, 48)}
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#242820', textTransform: 'capitalize' }}>
                          {label}
                        </span>
                        <span style={{ fontSize: '9.5px', color: '#8A9568', fontFamily: 'monospace' }}>
                          {key}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
