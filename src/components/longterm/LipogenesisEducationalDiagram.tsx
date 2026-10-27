import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert
} from 'lucide-react';

export const LipogenesisEducationalDiagram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lipogenesis' | 'fatprotein'>('lipogenesis');
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);

  const lipogenesisSteps = [
    {
      step: 1,
      tag: 'INGESTION',
      title: 'High-Carbohydrate Meal Ingestion',
      subtitle: 'Poha, Upma, Parathas, Biscuits, Sugars & Refined Grains',
      desc: 'Digestive salivary and pancreatic amylase rapidly break down starches into monomeric glucose within 15–30 minutes.',
      metric: 'Glycemic Load: VERY HIGH',
      color: '#C85A48',
    },
    {
      step: 2,
      tag: 'GLYCEMIA',
      title: 'Acute Circulating Glucose Surge',
      subtitle: 'Blood sugar spikes above 160–180 mg/dL',
      desc: 'Rapid influx of glucose into the portal vein triggers an emergency physiological state in the bloodstream.',
      metric: 'Blood Glucose: > 160 mg/dL',
      color: '#C85A48',
    },
    {
      step: 3,
      tag: 'HORMONAL LOCK',
      title: 'Pancreatic Beta-Cell Hyper-Insulinemia',
      subtitle: 'Massive Insulin secretion floods tissues',
      desc: 'High insulin completely deactivates Hormone-Sensitive Lipase (HSL), locking fat cells and preventing all fat burning.',
      metric: 'Insulin Surge: +400% baseline',
      color: '#9B2C2C',
    },
    {
      step: 4,
      tag: 'SATURATION',
      title: 'Muscle & Liver Glycogen Full',
      subtitle: 'Storage capacity capped at ~400–500g',
      desc: 'Once glycogen tanks in muscles and hepatic tissue are 100% full, the body cannot store glucose as carbohydrate any longer.',
      metric: 'Glycogen Tanks: 100% Saturated',
      color: '#9B2C2C',
    },
    {
      step: 5,
      tag: 'CONVERSION',
      title: 'Hepatic De Novo Lipogenesis (DNL)',
      subtitle: 'Surplus Acetyl-CoA converted into Fat',
      desc: 'Through ChREBP and SREBP-1c biochemical activation, liver enzymes convert excess glucose into Palmitic Acid and Triglycerides.',
      metric: 'DNL Activity: Activated in Liver',
      color: '#7B1113',
    },
    {
      step: 6,
      tag: 'STORAGE',
      title: 'VLDL & Visceral Adipose Deposition',
      subtitle: 'Fat shipped into abdominal fat cells & liver',
      desc: 'VLDL particles transport newly synthesized triglycerides into visceral fat depots around organs and under the skin.',
      metric: 'Visceral Fat: Accumulating',
      color: '#7B1113',
    },
    {
      step: 7,
      tag: 'CRASH & CRAVING',
      title: 'Reactive Hypoglycemia & Craving Loop',
      subtitle: 'Sugar crashes below baseline after 2 hours',
      desc: 'Because insulin remains high, blood sugar plunges rapidly, causing intense brain fog, mid-day fatigue, and irresistible sugar cravings.',
      metric: 'Crash: Cravings repeat every 2h',
      color: '#9B2C2C',
    },
  ];

  const fatProteinSteps = [
    {
      step: 1,
      tag: 'CLEAN FUEL',
      title: 'Healthy Cooking Fats + High BV Protein',
      subtitle: 'Pure Ghee, Coconut Oil, Butter, Paneer, Whey, Eggs, Chicken',
      desc: 'Medium-chain triglycerides (MCTs) and bioavailable amino acids require no rapid insulin for cellular uptake.',
      metric: 'Glycemic Load: NEAR ZERO',
      color: '#38571A',
    },
    {
      step: 2,
      tag: 'STABILITY',
      title: 'Flat, Controlled Glycemic Baseline',
      subtitle: 'Blood glucose remains steady at 85–95 mg/dL',
      desc: 'Fat and protein slow down gastric emptying, preventing sharp glucose spikes and eliminating sugar peaks entirely.',
      metric: 'Blood Glucose: 85-95 mg/dL (FLAT)',
      color: '#38571A',
    },
    {
      step: 3,
      tag: 'LOW INSULIN',
      title: 'Basal Resting Insulin Environment',
      subtitle: 'Zero hyper-insulinemic surges',
      desc: 'Low resting insulin signals the body that energy is stable, keeping cellular gates open for fat burning.',
      metric: 'Basal Insulin: Optimal Baseline',
      color: '#2B4214',
    },
    {
      step: 4,
      tag: 'LIPOLYSIS',
      title: 'Hormone-Sensitive Lipase (HSL) Active',
      subtitle: '24/7 Cellular Fat Burning Mode',
      desc: 'With insulin low, HSL actively hydrolyzes stored visceral and subcutaneous fat into free fatty acids for fuel.',
      metric: 'Lipolysis: 24/7 Fat Oxidation',
      color: '#2B4214',
    },
    {
      step: 5,
      tag: 'ATP MITOCHONDRIA',
      title: 'Mitochondrial Ketone & Fatty Acid Drive',
      subtitle: 'Steady clean energy for Brain & Muscle',
      desc: 'Fatty acids enter the Krebs cycle cleanly, providing 9 kcal/g of steady energy without afternoon crashes.',
      metric: 'Mental Energy: 100% Unbroken',
      color: '#1E3A0E',
    },
    {
      step: 6,
      tag: 'HYPERTROPHY',
      title: 'Lean Muscle Protein Synthesis (MPS)',
      subtitle: 'Tissue Preservation & Cellular Recovery',
      desc: 'High biological value protein stimulates mTOR and maintains firm muscle tone while excess body fat dissolves.',
      metric: 'Body Composition: Tight & Lean',
      color: '#1E3A0E',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '2px solid #0A1C44',
        overflow: 'hidden',
        boxShadow: '0 8px 28px rgba(10, 28, 68, 0.12)',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: '#0A1C44',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#E8CA56',
              color: '#0A1C44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CLINICAL BIOCHEMISTRY VISUALIZER
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              De Novo Lipogenesis (DNL) & Fat Storage Pathway
            </h3>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '8px', padding: '3px' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('lipogenesis');
              setSelectedNodeIndex(null);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: 800,
              backgroundColor: activeTab === 'lipogenesis' ? '#C85A48' : 'transparent',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldAlert size={14} />
            <span>⚠️ High-Carb Lipogenesis Cycle</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('fatprotein');
              setSelectedNodeIndex(null);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: 800,
              backgroundColor: activeTab === 'fatprotein' ? '#38571A' : 'transparent',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} />
            <span>✨ She Nourishes Protocol</span>
          </button>
        </div>
      </div>

      {/* Diagram Body */}
      <div style={{ padding: '20px 18px', backgroundColor: '#FAF8F0' }}>
        {activeTab === 'lipogenesis' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Scientific Explanation Banner */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: '#FFF5F5',
                border: '1.5px solid #FED7D7',
                color: '#9B2C2C',
                fontSize: '13px',
                lineHeight: 1.55,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontWeight: 800 }}>
                <AlertTriangle size={17} color="#C85A48" />
                <span>The Biological Trap of High-Carbohydrate Meals:</span>
              </div>
              When you consume traditional high-carb meals (Poha, Upma, Parathas, Biscuits, Sugars), blood glucose spikes rapidly. The pancreas releases high insulin, which completely <strong>locks your body fat</strong> and activates <strong>De Novo Lipogenesis (DNL)</strong> in the liver to convert excess sugar directly into visceral belly fat.
            </div>

            {/* Interactive Visual Flowchart Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lipogenesisSteps.map((s, idx) => {
                const isSelected = selectedNodeIndex === idx;
                return (
                  <div
                    key={s.step}
                    onClick={() => setSelectedNodeIndex(isSelected ? null : idx)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#FFEBEB' : '#FFFFFF',
                      border: isSelected ? '2px solid #C85A48' : '1.5px solid #E8E5DA',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(200, 90, 72, 0.15)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: s.color,
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {s.step}
                        </div>
                        <div>
                          <div style={{ fontSize: '10.5px', fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            STAGE {s.step} • {s.tag}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44' }}>
                            {s.title}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px',
                          backgroundColor: '#FFF0F0',
                          color: s.color,
                          border: '1px solid #FFD0D0',
                        }}
                      >
                        {s.metric}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#4F5C38', marginTop: '8px', lineHeight: 1.45, paddingLeft: '38px' }}>
                      <strong>{s.subtitle}</strong> — {s.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Scientific Explanation Banner */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: '#F0FFF4',
                border: '1.5px solid #C6F6D5',
                color: '#22543D',
                fontSize: '13px',
                lineHeight: 1.55,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontWeight: 800 }}>
                <CheckCircle2 size={17} color="#38571A" />
                <span>The She Nourishes Clinical Solution:</span>
              </div>
              By prioritizing therapeutic healthy cooking fats (Desi Ghee, Extra Virgin Coconut Oil, Grass-Fed Butter) paired with complete biological proteins (Paneer, Whey Isolate, Eggs, Chicken, Fish), your blood glucose remains completely flat. Insulin stays at basal levels, allowing <strong>Hormone-Sensitive Lipase (HSL)</strong> to burn stored body fat 24 hours a day without energy crashes.
            </div>

            {/* Interactive Visual Flowchart Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {fatProteinSteps.map((s, idx) => {
                const isSelected = selectedNodeIndex === idx;
                return (
                  <div
                    key={s.step}
                    onClick={() => setSelectedNodeIndex(isSelected ? null : idx)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#EAF7E3' : '#FFFFFF',
                      border: isSelected ? '2px solid #38571A' : '1.5px solid #E8E5DA',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(56, 87, 26, 0.15)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: s.color,
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {s.step}
                        </div>
                        <div>
                          <div style={{ fontSize: '10.5px', fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            STAGE {s.step} • {s.tag}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44' }}>
                            {s.title}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px',
                          backgroundColor: '#EEF8EB',
                          color: s.color,
                          border: '1px solid #C4E3BC',
                        }}
                      >
                        {s.metric}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#4F5C38', marginTop: '8px', lineHeight: 1.45, paddingLeft: '38px' }}>
                      <strong>{s.subtitle}</strong> — {s.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
