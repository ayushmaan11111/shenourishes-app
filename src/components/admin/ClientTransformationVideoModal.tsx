import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Download,
  Play,
  Pause,
  RotateCcw,
  Upload,
  Key,
  Film
} from 'lucide-react';
import {
  analyzePhysiqueWithGemini,
  renderTransformationVideoBlob,
  downloadTransformationVideo,
  saveTransformationVideoRecord,
  getTransformationVideos,
  getSavedGeminiApiKey,
  saveGeminiApiKey,
  type TransformationVideoOptions,
  type ClientTransformationVideoRecord,
} from '../../services/transformationVideoService';
import { getProgressPhotos } from '../../services/clientProgressPhotoService';
import type { CustomerRecord } from '../../types/customer';

interface ClientTransformationVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: CustomerRecord[];
  initialClientId?: string;
  initialImageUrl?: string;
}

export const ClientTransformationVideoModal: React.FC<ClientTransformationVideoModalProps> = ({
  isOpen,
  onClose,
  clients,
  initialClientId = '',
  initialImageUrl = '',
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || (clients[0]?.uid || ''));
  const currentClient = clients.find((c) => c.uid === selectedClientId) || clients[0];

  // Physique image state
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    initialImageUrl || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'
  );
  const [customTargetImageUrl, setCustomTargetImageUrl] = useState<string>('');
  const [existingPhotos, setExistingPhotos] = useState<any[]>([]);

  // Transformation options
  const [durationMonths, setDurationMonths] = useState<3 | 6 | 9 | 12>(6);
  const [startingWeightKg, setStartingWeightKg] = useState<number>(68);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(58);
  const [startingBodyFatPct, setStartingBodyFatPct] = useState<number>(30);
  const [targetBodyFatPct, setTargetBodyFatPct] = useState<number>(20);
  const [primaryGoal, setPrimaryGoal] = useState<string>('Fat Loss & Lean Waist Cinching');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');

  // Gemini API Settings
  const [showApiSettings, setShowApiSettings] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [aiModel, setAiModel] = useState<string>('gemini-2.0-flash');
  const [keySavedMessage, setKeySavedMessage] = useState<boolean>(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [generatedVideo, setGeneratedVideo] = useState<{
    blob: Blob | null;
    blobUrl: string;
    durationSec: number;
    thumbnailUrl: string;
    aiAnalysis?: any;
  } | null>(null);

  // Video playback
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);

  // Past videos history
  const [videoHistory, setVideoHistory] = useState<ClientTransformationVideoRecord[]>([]);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize client details
  useEffect(() => {
    if (currentClient) {
      const g = currentClient.personalDetails?.gender === 'Male' ? 'Male' : 'Female';
      setGender(g);
      const w = currentClient.personalDetails?.weight || (g === 'Male' ? 78 : 68);
      setStartingWeightKg(w);
      setTargetWeightKg(Math.round(w * 0.85)); // 15% reduction default
      const bf = currentClient.personalDetails?.bodyFatPercentage || (g === 'Male' ? 24 : 32);
      setStartingBodyFatPct(bf);
      setTargetBodyFatPct(Math.max(g === 'Male' ? 12 : 18, Math.round(bf - 10)));
    }
  }, [currentClient]);

  // Load existing photos and past videos when client changes
  useEffect(() => {
    if (selectedClientId) {
      getProgressPhotos(selectedClientId).then((photos) => {
        setExistingPhotos(photos);
        if (photos.length > 0 && !initialImageUrl) {
          setCurrentImageUrl(photos[0].imageUrl);
        }
      });
      getTransformationVideos(selectedClientId).then((hist) => {
        setVideoHistory(hist);
      });
    }
  }, [selectedClientId, initialImageUrl]);

  // Load saved Gemini API Key
  useEffect(() => {
    setGeminiApiKey(getSavedGeminiApiKey());
  }, []);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    saveGeminiApiKey(geminiApiKey);
    setKeySavedMessage(true);
    setTimeout(() => setKeySavedMessage(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isTarget: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (isTarget) {
        setCustomTargetImageUrl(result);
      } else {
        setCurrentImageUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async () => {
    if (!currentImageUrl) {
      alert('Please provide a current physique photo to generate the transformation video.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(5);
    setGenerationStage('Connecting to Clinical AI Transformation Engine...');
    setGeneratedVideo(null);

    try {
      const clientName = currentClient?.personalDetails?.fullName || 'Client';
      const options: TransformationVideoOptions = {
        clientId: selectedClientId,
        clientName,
        gender,
        currentWeightKg: startingWeightKg,
        targetWeightKg,
        startingBodyFatPct,
        targetBodyFatPct,
        durationMonths,
        currentPhysiqueImageUrl: currentImageUrl,
        targetPhysiqueImageUrl: customTargetImageUrl || undefined,
        primaryGoal,
        geminiApiKey: geminiApiKey || undefined,
        aiModel,
        videoDurationSeconds: 9,
      };

      // 1. Analyze with Gemini Multimodal
      setGenerationStage('Consulting Google Gemini AI for anatomical projection & body composition analysis...');
      setGenerationProgress(12);
      const aiAnalysis = await analyzePhysiqueWithGemini(options, currentImageUrl);

      // 2. Render 8-10 second video
      const result = await renderTransformationVideoBlob(options, (pct, stage) => {
        setGenerationProgress(pct);
        setGenerationStage(stage);
      });

      const videoData = {
        ...result,
        aiAnalysis,
      };

      setGeneratedVideo(videoData);

      // 3. Persist record to history
      const newRecord: ClientTransformationVideoRecord = {
        id: `trans_vid_${Date.now()}`,
        clientId: selectedClientId,
        clientName,
        createdAt: Date.now(),
        durationSeconds: result.durationSec,
        targetMonths: durationMonths,
        startingBodyFatPct,
        targetBodyFatPct,
        startingWeightKg,
        targetWeightKg,
        primaryGoal,
        videoBlobUrl: result.blobUrl,
        thumbnailUrl: result.thumbnailUrl,
        aiAnalysis,
      };

      await saveTransformationVideoRecord(newRecord);
      const updatedHistory = await getTransformationVideos(selectedClientId);
      setVideoHistory(updatedHistory);

    } catch (err: any) {
      console.error('Error generating transformation video:', err);
      alert(`Could not generate transformation video: ${err.message || err}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStage('');
    }
  };

  const handleDownload = () => {
    if (!generatedVideo?.blob) return;
    const clientName = currentClient?.personalDetails?.fullName || 'Client';
    downloadTransformationVideo(generatedVideo.blob, clientName, durationMonths);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '1240px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1.5px solid #CBD5E1',
          overflow: 'hidden',
        }}
      >
        {/* ================= MODAL HEADER ================= */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(190, 24, 93, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #BE185D',
              }}
            >
              <Film size={22} color="#F472B6" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
                  Client Transformation Video Generator
                </h3>
                <span
                  style={{
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={12} /> AI Omni / Gemini 2.0
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '3px 0 0 0' }}>
                Generate an 8–10s Before vs Projected After video (3–12 months consistency) to download and present in client meetings or consultations.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Client Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Client:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              >
                {clients.map((c) => (
                  <option key={c.uid} value={c.uid} style={{ color: '#0A1C44' }}>
                    {c.personalDetails?.fullName || 'Client'} ({c.personalDetails?.mobileNumber || c.uid.slice(0, 8)})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ================= MODAL BODY ================= */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            backgroundColor: '#F8FAFC',
            display: 'grid',
            gridTemplateColumns: 'minmax(420px, 1fr) minmax(460px, 1.15fr)',
            gap: '24px',
          }}
        >
          {/* ================= LEFT COLUMN: INPUTS & SETTINGS ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Step 1: Physique Photo Upload */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '16px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#BE185D',
                      color: '#FFF',
                      fontSize: '13px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    1
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                    Client's Current Physique Photo (Before)
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#FFF1F2',
                    border: '1px solid #FECDD3',
                    color: '#BE185D',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} /> Upload Device Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, false)}
                />
              </div>

              {/* Photo Preview and URL Input */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '120px',
                    height: '160px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid #CBD5E1',
                    backgroundColor: '#0F172A',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <img
                    src={currentImageUrl}
                    alt="Current Physique"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      color: '#FFF',
                      fontSize: '10px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '2px 0',
                      borderRadius: '4px',
                    }}
                  >
                    MONTH 0
                  </span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Image URL or Base64:
                    </label>
                    <input
                      type="text"
                      value={currentImageUrl.startsWith('data:') ? 'Custom uploaded image (data URI)' : currentImageUrl}
                      onChange={(e) => setCurrentImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '12px',
                        color: '#1E293B',
                      }}
                    />
                  </div>

                  {/* Pick from existing client progress photos */}
                  {existingPhotos.length > 0 && (
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>
                        Or select from client's uploaded progress photos:
                      </span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {existingPhotos.map((p, idx) => (
                          <div
                            key={p.id || idx}
                            onClick={() => setCurrentImageUrl(p.imageUrl)}
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: currentImageUrl === p.imageUrl ? '2px solid #BE185D' : '1px solid #CBD5E1',
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                          >
                            <img src={p.imageUrl} alt={p.photoType} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Target Consistency Duration & Biometrics */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '16px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#BE185D',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  2
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                  Consistency Timeline & Projected Biometrics
                </h4>
              </div>

              {/* Duration Buttons */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Target Consistency Duration:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[3, 6, 9, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDurationMonths(m as any)}
                      style={{
                        padding: '9px 0',
                        borderRadius: '10px',
                        border: durationMonths === m ? '2px solid #BE185D' : '1px solid #CBD5E1',
                        backgroundColor: durationMonths === m ? '#FFF1F2' : '#F8FAFC',
                        color: durationMonths === m ? '#BE185D' : '#475569',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Biometrics 2x2 Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Starting Body Fat %:
                  </label>
                  <input
                    type="number"
                    value={startingBodyFatPct}
                    onChange={(e) => setStartingBodyFatPct(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#EF4444',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Projected Body Fat %:
                  </label>
                  <input
                    type="number"
                    value={targetBodyFatPct}
                    onChange={(e) => setTargetBodyFatPct(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#10B981',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Starting Weight (kg):
                  </label>
                  <input
                    type="number"
                    value={startingWeightKg}
                    onChange={(e) => setStartingWeightKg(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#1E293B',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Projected Weight (kg):
                  </label>
                  <input
                    type="number"
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#059669',
                    }}
                  />
                </div>
              </div>

              {/* Primary Focus */}
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  Primary Focus / Transformation Archetype:
                </label>
                <select
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0A1C44',
                  }}
                >
                  <option value="Fat Loss & Lean Waist Cinching">Fat Loss & Lean Waist Cinching (Low-Carb 80–120g)</option>
                  <option value="Athletic Tone & Core Sculpting">Athletic Tone & Core Sculpting (4x Resistance)</option>
                  <option value="Glute & Lower Body Definition">Glute & Lower Body Definition (Hypertrophy Focus)</option>
                  <option value="Hormonal & Metabolic Reset">Hormonal & Metabolic Reset (Cortisol & Thyroid Optimization)</option>
                  <option value="Postpartum Abdominal Recovery">Postpartum Abdominal Recovery & Posture Elevation</option>
                </select>
              </div>
            </div>

            {/* Step 3: Google Gemini / Omni AI API Settings */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #E2E8F0',
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => setShowApiSettings(!showApiSettings)}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: showApiSettings ? '#F1F5F9' : '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={16} color="#0284C7" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                    AI Engine: Google Gemini 2.0 / Omni Settings
                  </span>
                  {geminiApiKey ? (
                    <span style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      Key Active
                    </span>
                  ) : (
                    <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      Using Built-in Clinical Engine
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
                  {showApiSettings ? '▲ Hide' : '▼ Configure'}
                </span>
              </div>

              {showApiSettings && (
                <div style={{ padding: '16px 18px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Google Gemini API Key:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="password"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="AIzaSy... (free key from Google AI Studio)"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleSaveApiKey}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#0284C7',
                          color: '#FFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Save
                      </button>
                    </div>
                    {keySavedMessage && (
                      <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                        ✓ Gemini API Key saved locally!
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Model:
                    </label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended, Ultra Fast Multimodal)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Clinical Reasoning)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: isGenerating ? '#94A3B8' : '#BE185D',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 800,
                border: 'none',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                boxShadow: isGenerating ? 'none' : '0 8px 24px rgba(190, 24, 93, 0.35)',
                transition: 'all 0.2s',
              }}
            >
              <Sparkles size={18} />
              <span>
                {isGenerating
                  ? `Generating Video (${generationProgress}%)...`
                  : `Generate ${durationMonths}-Month Transformation Video (8–10s)`}
              </span>
            </button>

            {/* Live Progress Indicator */}
            {isGenerating && (
              <div
                style={{
                  backgroundColor: '#FFF1F2',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid #FECDD3',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#BE185D', marginBottom: '6px' }}>
                  <span>{generationStage}</span>
                  <span>{generationProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#FFE4E6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${generationProgress}%`,
                      height: '100%',
                      backgroundColor: '#BE185D',
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: VIDEO PLAYER & PRESENTATION VIEW ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '16px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film size={18} color="#BE185D" />
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                    Transformation Video Preview (8–10s HD)
                  </h4>
                </div>

                {generatedVideo && (
                  <button
                    type="button"
                    onClick={handleDownload}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#059669',
                      color: '#FFF',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                    }}
                  >
                    <Download size={15} /> Download Video (.webm)
                  </button>
                )}
              </div>

              {/* Video Player Display Container */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  height: '520px',
                  backgroundColor: '#0F172A',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                  border: '2px solid #334155',
                }}
              >
                {generatedVideo?.blobUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      src={generatedVideo.blobUrl}
                      loop
                      playsInline
                      autoPlay
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={() => {
                        if (videoRef.current) {
                          setVideoCurrentTime(videoRef.current.currentTime);
                        }
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Floating Video Overlay Controls */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        right: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(6px)',
                        padding: '6px 12px',
                        borderRadius: '10px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={togglePlay}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#FFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>

                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, fontFamily: 'monospace' }}>
                        00:0{Math.floor(videoCurrentTime)} / 00:0{generatedVideo.durationSec}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play();
                          }
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#FFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '24px',
                      color: '#94A3B8',
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '14px',
                      }}
                    >
                      <Film size={32} color="#64748B" />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                      No Video Generated Yet
                    </span>
                    <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '240px', margin: 0 }}>
                      Select a physique photo on the left and click "Generate Video" to create an 8–10 second transformation presentation.
                    </p>
                  </div>
                )}
              </div>

              {/* Big Download Button Under Video */}
              {generatedVideo && (
                <div style={{ width: '100%', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={handleDownload}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '13px',
                      borderRadius: '12px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                    }}
                  >
                    <Download size={18} />
                    <span>Download Transformation Video (.webm / .mp4)</span>
                  </button>
                  <p style={{ fontSize: '11.5px', color: '#64748B', textAlign: 'center', margin: '6px 0 0 0' }}>
                    Save to iPad, laptop, or smartphone to show to client during physical meetings or WhatsApp review.
                  </p>
                </div>
              )}
            </div>

            {/* Clinical Meeting Script & AI Analysis Card */}
            {generatedVideo?.aiAnalysis && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sparkles size={17} color="#BE185D" />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                    Clinical Consultation Script (For Physical Meeting)
                  </h4>
                </div>

                <div
                  style={{
                    backgroundColor: '#FFF1F2',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #FECDD3',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#BE185D', display: 'block', marginBottom: '4px' }}>
                    RECOMMENDED VERBAL SCRIPT FOR CLIENT:
                  </span>
                  <p style={{ fontSize: '12.5px', color: '#881337', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                    {generatedVideo.aiAnalysis.motivationalMeetingScript}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155' }}>
                  <div>
                    <strong style={{ color: '#0F172A' }}>Starting Physique: </strong>
                    <span>{generatedVideo.aiAnalysis.startingAnalysis}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#0F172A' }}>Projected Consistency Outcome: </strong>
                    <span>{generatedVideo.aiAnalysis.projectedOutcome}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#0F172A' }}>Key Consistency Pillars:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                      {generatedVideo.aiAnalysis.keyConsistencyPillars.map((p: string, idx: number) => (
                        <li key={idx} style={{ marginBottom: '2px' }}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Past Videos History for this Client */}
            {videoHistory.length > 0 && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '18px',
                  borderRadius: '16px',
                  border: '1.5px solid #E2E8F0',
                }}
              >
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A1C44', margin: '0 0 10px 0' }}>
                  Saved Transformation Videos ({videoHistory.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {videoHistory.map((v) => (
                    <div
                      key={v.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#BE185D',
                            color: '#FFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Film size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A1C44' }}>
                            {v.targetMonths}-Month Projection ({v.startingBodyFatPct}% → {v.targetBodyFatPct}% BF)
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>
                            {new Date(v.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {v.durationSeconds}s Video
                          </span>
                        </div>
                      </div>

                      {v.videoBlobUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setGeneratedVideo({
                              blob: null,
                              blobUrl: v.videoBlobUrl!,
                              durationSec: v.durationSeconds,
                              thumbnailUrl: v.thumbnailUrl || '',
                              aiAnalysis: v.aiAnalysis,
                            });
                          }}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#0A1C44',
                            color: '#FFF',
                            fontSize: '11px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          View
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
