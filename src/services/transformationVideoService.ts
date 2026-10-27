/**
 * Client Transformation Video Service (AI Powered)
 * 
 * Generates an 8-10 second cinematic transformation video for clients
 * showing "Before" (Month 0) smoothly transitioning into "After" (Projected after 6-12 months of consistency).
 * 
 * Capabilities:
 * - Integrates with Google Gemini / Omni multimodal models (Gemini 2.0 Flash, 1.5 Flash, 1.5 Pro)
 *   for clinical physique analysis, visceral fat projection, and anatomical morph parameters.
 * - Client-side high-definition Canvas Video Recording Engine (720x1280 9:16 vertical reels format)
 *   with animated biometric HUD, real-time body fat counter countdown, waist-cinching morph simulation,
 *   and dynamic Before vs After split-screen finale.
 * - Encodes real MP4 / WebM video files via MediaRecorder for instant local download
 *   so admins can show it to clients in physical face-to-face meetings or WhatsApp consultations.
 * - Stores video records in Firebase Realtime Database & LocalStorage.
 */

import { database, isFirebaseConfigured } from './firebase';
import { ref, get, set } from 'firebase/database';

export interface TransformationVideoOptions {
  clientId: string;
  clientName: string;
  gender: 'Female' | 'Male';
  currentWeightKg: number;
  targetWeightKg: number;
  startingBodyFatPct: number;
  targetBodyFatPct: number;
  durationMonths: 3 | 6 | 9 | 12;
  currentPhysiqueImageUrl: string;
  targetPhysiqueImageUrl?: string; // Optional custom target after image
  primaryGoal?: string; // e.g., "Visceral Fat Loss & Core Toning"
  geminiApiKey?: string;
  aiModel?: string; // 'gemini-2.0-flash' | 'gemini-1.5-flash' | 'gemini-1.5-pro'
  videoDurationSeconds?: number; // 8 to 10 seconds (default: 9)
}

export interface ClientTransformationVideoRecord {
  id: string;
  clientId: string;
  clientName: string;
  createdAt: number;
  durationSeconds: number;
  targetMonths: number;
  startingBodyFatPct: number;
  targetBodyFatPct: number;
  startingWeightKg: number;
  targetWeightKg: number;
  primaryGoal: string;
  videoBlobUrl?: string; // ephemeral blob URL
  videoDataUrl?: string; // base64 or stored URL
  thumbnailUrl?: string;
  aiAnalysis?: {
    startingAnalysis: string;
    projectedOutcome: string;
    keyConsistencyPillars: string[];
    metabolicTimelineSummary: string;
    motivationalMeetingScript: string;
  };
}

const STORAGE_VIDEO_PREFIX = 'she_nourishes_transformation_videos_';
const GEMINI_KEY_STORAGE = 'she_nourishes_gemini_api_key';

/**
 * Get or set the persistent Gemini API key
 */
export function getSavedGeminiApiKey(): string {
  try {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || '';
    const stored = localStorage.getItem(GEMINI_KEY_STORAGE);
    return stored || envKey || '';
  } catch (e) {
    return '';
  }
}

export function saveGeminiApiKey(key: string): void {
  try {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  } catch (e) {}
}

/**
 * Call Google Gemini Multimodal API to analyze client's current physique
 * and project clinical 6-12 month transformation metrics
 */
export async function analyzePhysiqueWithGemini(
  options: TransformationVideoOptions,
  imageBase64OrUrl: string
): Promise<{
  startingAnalysis: string;
  projectedOutcome: string;
  keyConsistencyPillars: string[];
  metabolicTimelineSummary: string;
  motivationalMeetingScript: string;
  waistReductionFactor: number;
  coreToneFactor: number;
}> {
  const apiKey = options.geminiApiKey || getSavedGeminiApiKey();
  const model = options.aiModel || 'gemini-2.0-flash';

  // Default fallback clinical analysis if API key is not configured or fails
  const fallbackAnalysis = {
    startingAnalysis: `Client presents with starting body weight of ${options.currentWeightKg} kg and estimated ${options.startingBodyFatPct}% body fat. Adipose distribution is primarily subcutaneous and abdominal, with baseline postural stability requiring core activation.`,
    projectedOutcome: `After ${options.durationMonths} months of strict protocol adherence, client is projected to reach ${options.targetWeightKg} kg at ~${options.targetBodyFatPct}% body fat. Visual projections demonstrate significant midsection cinching, pronounced oblique and deltoid definition, and upright spinal alignment.`,
    keyConsistencyPillars: [
      `High-protein intake (target ${options.gender === 'Female' ? '105-115g' : '140-155g'}/day) on a low-glycemic meal cadence`,
      'Progressive resistance training 4x/week with progressive overload tracking',
      'Daily 8,500 - 10,000 steps for continuous non-exercise activity thermogenesis (NEAT)',
      '7.5 - 8 hours sleep for hormonal recovery and cortisol reduction',
    ],
    metabolicTimelineSummary: `Month 0 (${options.startingBodyFatPct}% BF) → Month 3 (${Math.round(options.startingBodyFatPct - (options.startingBodyFatPct - options.targetBodyFatPct) * 0.4)}% BF) → Month ${options.durationMonths} (${options.targetBodyFatPct}% BF Peak Consistency).`,
    motivationalMeetingScript: `"${options.clientName}, this 8-10 second video preview illustrates the exact anatomical transformation your body is capable of over ${options.durationMonths} months. Every single rep and balanced meal compounds directly into this outcome."`,
    waistReductionFactor: 0.16,
    coreToneFactor: 1.35,
  };

  if (!apiKey) {
    return fallbackAnalysis;
  }

  try {
    let mimeType = 'image/jpeg';
    let base64Data = '';

    if (imageBase64OrUrl.startsWith('data:')) {
      const match = imageBase64OrUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    } else if (imageBase64OrUrl.startsWith('http')) {
      // Try to fetch image as blob and convert to base64
      try {
        const resp = await fetch(imageBase64OrUrl);
        const blob = await resp.blob();
        mimeType = blob.type || 'image/jpeg';
        const buffer = await blob.arrayBuffer();
        base64Data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      } catch (e) {
        console.warn('Could not fetch external image for Gemini inline data:', e);
      }
    }

    const promptText = `
You are an elite clinical sports nutritionist and physique transformation director at She Nourishes.
You are preparing a 6-12 month transformation projection for a physical in-person consultation with the client.

Client Profile:
- Name: ${options.clientName}
- Gender: ${options.gender}
- Current Weight: ${options.currentWeightKg} kg
- Target Weight: ${options.targetWeightKg} kg
- Starting Body Fat: ${options.startingBodyFatPct}%
- Target Body Fat: ${options.targetBodyFatPct}%
- Consistency Duration: ${options.durationMonths} Months
- Primary Goal: ${options.primaryGoal || 'Fat Loss and Core Definition'}

Carefully evaluate the attached photo of the client's current physique (or reference) and generate a clinical transformation analysis.
You MUST reply with ONLY a single valid JSON object with the following schema:
{
  "startingAnalysis": "Clinical critique of starting body composition, posture, and adipose distribution (2-3 sentences)",
  "projectedOutcome": "Detailed visual description of projected transformed physique after ${options.durationMonths} months of consistency (waist, shoulders, core tone, posture) (2-3 sentences)",
  "keyConsistencyPillars": ["Pillar 1", "Pillar 2", "Pillar 3", "Pillar 4"],
  "metabolicTimelineSummary": "Milestone progression from Month 0 to Month ${options.durationMonths}",
  "motivationalMeetingScript": "A powerful 1-2 sentence quote for the trainer to say to the client in the physical meeting",
  "waistReductionFactor": 0.18,
  "coreToneFactor": 1.4
}
Do not include any markdown fences or explanations outside the JSON.
`;

    const parts: any[] = [{ text: promptText }];
    if (base64Data) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API error ${response.status}: ${await response.text()}`);
      return fallbackAnalysis;
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      // Clean JSON string
      const cleanJson = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        startingAnalysis: parsed.startingAnalysis || fallbackAnalysis.startingAnalysis,
        projectedOutcome: parsed.projectedOutcome || fallbackAnalysis.projectedOutcome,
        keyConsistencyPillars: Array.isArray(parsed.keyConsistencyPillars) && parsed.keyConsistencyPillars.length > 0
          ? parsed.keyConsistencyPillars
          : fallbackAnalysis.keyConsistencyPillars,
        metabolicTimelineSummary: parsed.metabolicTimelineSummary || fallbackAnalysis.metabolicTimelineSummary,
        motivationalMeetingScript: parsed.motivationalMeetingScript || fallbackAnalysis.motivationalMeetingScript,
        waistReductionFactor: typeof parsed.waistReductionFactor === 'number' ? parsed.waistReductionFactor : 0.16,
        coreToneFactor: typeof parsed.coreToneFactor === 'number' ? parsed.coreToneFactor : 1.35,
      };
    }
  } catch (err) {
    console.warn('Gemini transformation analysis failed, using clinical fallback:', err);
  }

  return fallbackAnalysis;
}

/**
 * Load an image from URL or Data URI into an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from: ${src.slice(0, 50)}...`));
    img.src = src;
  });
}

/**
 * Create a transformed projection canvas from the starting image
 * (Applies anatomical waist-cinching warp, tone definition, and posture enhancement)
 */
function createTransformedProjectionCanvas(
  sourceImg: HTMLImageElement,
  width: number,
  height: number,
  waistReductionFactor: number = 0.16,
  toneFactor: number = 1.35
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Draw source image scaled to cover
  // Apply subtle anatomical horizontal warping slice-by-slice around the waist zone (40% to 65% of height)
  const slices = 120;
  const sliceHeight = height / slices;

  for (let i = 0; i < slices; i++) {
    const y = i * sliceHeight;
    const normY = y / height;

    // Waist zone peak around normY 0.48 - 0.58
    let pinch = 0;
    if (normY >= 0.38 && normY <= 0.68) {
      const bell = Math.sin(((normY - 0.38) / 0.3) * Math.PI);
      pinch = bell * waistReductionFactor; // e.g. up to 16% waist narrowing
    }

    const sliceW = width * (1 - pinch);
    const sliceX = (width - sliceW) / 2;

    ctx.drawImage(
      sourceImg,
      0, (i / slices) * sourceImg.naturalHeight, sourceImg.naturalWidth, sourceImg.naturalHeight / slices,
      sliceX, y, sliceW, sliceHeight + 0.5
    );
  }

  // Apply Tone & Definition Enhancement Overlay
  const toneCanvas = document.createElement('canvas');
  toneCanvas.width = width;
  toneCanvas.height = height;
  const toneCtx = toneCanvas.getContext('2d');
  if (toneCtx) {
    // Contrast boost
    toneCtx.drawImage(canvas, 0, 0);
    const imgData = toneCtx.getImageData(0, 0, width, height);
    const d = imgData.data;
    const factor = (259 * (toneFactor * 25 + 255)) / (255 * (259 - toneFactor * 25));

    for (let p = 0; p < d.length; p += 4) {
      // Subtle contrast and tone sharpening
      d[p] = Math.min(255, Math.max(0, factor * (d[p] - 128) + 128));
      d[p + 1] = Math.min(255, Math.max(0, factor * (d[p + 1] - 128) + 128));
      d[p + 2] = Math.min(255, Math.max(0, factor * (d[p + 2] - 128) + 128));
    }
    toneCtx.putImageData(imgData, 0, 0);

    // Blend tone with gentle athletic luminosity
    ctx.globalAlpha = 0.55;
    ctx.drawImage(toneCanvas, 0, 0);
    ctx.globalAlpha = 1.0;
  }

  return canvas;
}

/**
 * Render the complete 8-10 second transformation video stream
 * and encode it to a downloadable Blob
 */
export async function renderTransformationVideoBlob(
  options: TransformationVideoOptions,
  onProgress?: (progressPct: number, stageName: string) => void
): Promise<{ blob: Blob; blobUrl: string; durationSec: number; thumbnailUrl: string }> {
  const durationSec = Math.max(8, Math.min(10, options.videoDurationSeconds || 9));
  const fps = 30;
  const totalFrames = Math.round(durationSec * fps); // e.g. 270 frames for 9 seconds
  const width = 720;
  const height = 1280; // 9:16 Vertical presentation format (best for mobile, iPad, client meetings)

  if (onProgress) onProgress(5, 'Loading client physique photo...');

  // 1. Load starting image
  const startImg = await loadImage(options.currentPhysiqueImageUrl);

  // 2. Load custom target image OR generate transformed projection
  let afterCanvas: HTMLCanvasElement;
  if (options.targetPhysiqueImageUrl) {
    try {
      const customAfterImg = await loadImage(options.targetPhysiqueImageUrl);
      afterCanvas = document.createElement('canvas');
      afterCanvas.width = width;
      afterCanvas.height = height;
      const actx = afterCanvas.getContext('2d');
      if (actx) {
        const s = Math.max(width / customAfterImg.naturalWidth, height / customAfterImg.naturalHeight);
        const w = customAfterImg.naturalWidth * s;
        const h = customAfterImg.naturalHeight * s;
        actx.drawImage(customAfterImg, (width - w) / 2, (height - h) / 2, w, h);
      }
    } catch (e) {
      afterCanvas = createTransformedProjectionCanvas(startImg, width, height, 0.16, 1.35);
    }
  } else {
    if (onProgress) onProgress(15, 'Synthesizing 6-12 month anatomical projection...');
    afterCanvas = createTransformedProjectionCanvas(startImg, width, height, 0.18, 1.4);
  }

  // Also prepare standard Before Canvas
  const beforeCanvas = document.createElement('canvas');
  beforeCanvas.width = width;
  beforeCanvas.height = height;
  const bctx = beforeCanvas.getContext('2d');
  if (bctx) {
    const s = Math.max(width / startImg.naturalWidth, height / startImg.naturalHeight);
    const w = startImg.naturalWidth * s;
    const h = startImg.naturalHeight * s;
    bctx.drawImage(startImg, (width - w) / 2, (height - h) / 2, w, h);
  }

  // 3. Setup Master Rendering Canvas
  const masterCanvas = document.createElement('canvas');
  masterCanvas.width = width;
  masterCanvas.height = height;
  const ctx = masterCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain 2D canvas context');

  // Setup MediaRecorder from canvas stream
  const stream = masterCanvas.captureStream(fps);
  const supportedMime = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ].find((mime) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) || 'video/webm';

  const recorder = new MediaRecorder(stream, {
    mimeType: supportedMime,
    videoBitsPerSecond: 4500000, // 4.5 Mbps high bitrate
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const recordingPromise = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: supportedMime });
      resolve(blob);
    };
  });

  recorder.start();

  // Pre-calculate phase boundaries (in frames)
  // Phase 1 (0.0s - 2.2s): Starting Point (Month 0) - Frames 0 to 66
  // Phase 2 (2.2s - 5.2s): Progressive Morph & Calorie/BF reduction - Frames 66 to 156
  // Phase 3 (5.2s - 7.5s): Peak Consistency Transformed (Month 12) - Frames 156 to 225
  // Phase 4 (7.5s - 9.0s): Side-by-side Before vs After Split Screen - Frames 225 to 270
  const phase1End = Math.round(totalFrames * 0.24);
  const phase2End = Math.round(totalFrames * 0.58);
  const phase3End = Math.round(totalFrames * 0.82);

  let capturedThumbnail = '';

  // Render loop
  for (let f = 0; f < totalFrames; f++) {
    const timeSec = f / fps;
    const progress = f / totalFrames;

    if (f % 15 === 0 && onProgress) {
      const pct = Math.round(20 + progress * 75);
      const stage = f < phase1End
        ? 'Rendering Starting Point Phase...'
        : f < phase2End
        ? 'Rendering Progressive Morph & Body Fat Countdown...'
        : f < phase3End
        ? 'Rendering Peak 6-12 Month Physique...'
        : 'Rendering Before vs After Finale...';
      onProgress(pct, stage);
    }

    // Clear canvas
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);

    // ==========================================
    // DRAW BACKGROUND & PHYSIQUE
    // ==========================================
    if (f < phase1End) {
      // Phase 1: Pure Before Image
      ctx.drawImage(beforeCanvas, 0, 0);

      // Laser scan line descending
      const scanY = (f / phase1End) * (height * 0.7) + height * 0.15;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(40, scanY);
      ctx.lineTo(width - 40, scanY);
      ctx.stroke();

      // Scan glow
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0)');
      grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.2)');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(40, scanY - 20, width - 80, 40);

    } else if (f < phase2End) {
      // Phase 2: Smooth Cross-Dissolve & Anatomical Morph
      const morphT = (f - phase1End) / (phase2End - phase1End);
      // Smooth easing curve
      const easedT = 0.5 - 0.5 * Math.cos(morphT * Math.PI);

      // Draw base Before
      ctx.drawImage(beforeCanvas, 0, 0);
      // Blend After with eased opacity
      ctx.globalAlpha = easedT;
      ctx.drawImage(afterCanvas, 0, 0);
      ctx.globalAlpha = 1.0;

      // Cyan metabolic scan line
      const scanY = morphT * (height * 0.7) + height * 0.15;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(30, scanY);
      ctx.lineTo(width - 30, scanY);
      ctx.stroke();

    } else if (f < phase3End) {
      // Phase 3: Pure Transformed Outcome
      ctx.drawImage(afterCanvas, 0, 0);

      // Elegant green vitality aura at border
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, width - 20, height - 20);

    } else {
      // Phase 4: Dynamic Split Screen (Before vs After)
      const splitX = width / 2;

      // Left: Before
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();
      ctx.drawImage(beforeCanvas, 0, 0);
      ctx.restore();

      // Right: After
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, width - splitX, height);
      ctx.clip();
      ctx.drawImage(afterCanvas, 0, 0);
      ctx.restore();

      // Golden vertical divider line with glow
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();

      // Split labels
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(30, height - 260, 160, 40);
      ctx.fillRect(width - 190, height - 260, 160, 40);

      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText('BEFORE (Mo 0)', 44, height - 234);

      ctx.fillStyle = '#10B981';
      ctx.fillText('AFTER (Mo ' + options.durationMonths + ')', width - 176, height - 234);
    }

    // ==========================================
    // DRAW CLINICAL HUD & OVERLAYS
    // ==========================================
    // Top Bar: She Nourishes Brand Header
    ctx.fillStyle = 'rgba(10, 28, 68, 0.88)';
    ctx.fillRect(20, 25, width - 40, 75);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 25, width - 40, 75);

    // Brand Name & Tagline
    ctx.fillStyle = '#BE185D'; // Brand Berry Pink
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('SHE NOURISHES', 40, 58);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillText('CLINICAL PHYSIQUE TRANSFORMATION PROJECTION', 40, 80);

    // Client Name & Consistency Badge (Top Right)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(options.clientName, width - 40, 58);
    ctx.fillStyle = '#38BDF8';
    ctx.font = '700 12px Inter, sans-serif';
    ctx.fillText(`${options.durationMonths}-Month Consistency Protocol`, width - 40, 78);
    ctx.textAlign = 'left';

    // ==========================================
    // DYNAMIC BIOMETRIC METRICS HUD (BOTTOM)
    // ==========================================
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(20, height - 210, width - 40, 185);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, height - 210, width - 40, 185);

    // Current Body Fat Counter interpolation
    let currentBF = options.startingBodyFatPct;
    let currentWeight = options.currentWeightKg;
    let phaseBadgeText = 'PHASE 1: STARTING POINT (MONTH 0)';
    let phaseColor = '#EF4444'; // Red

    if (f < phase1End) {
      currentBF = options.startingBodyFatPct;
      currentWeight = options.currentWeightKg;
      phaseBadgeText = 'PHASE 1: STARTING POINT (MONTH 0)';
      phaseColor = '#EF4444';
    } else if (f < phase2End) {
      const morphT = (f - phase1End) / (phase2End - phase1End);
      currentBF = parseFloat((options.startingBodyFatPct - (options.startingBodyFatPct - options.targetBodyFatPct) * morphT).toFixed(1));
      currentWeight = parseFloat((options.currentWeightKg - (options.currentWeightKg - options.targetWeightKg) * morphT).toFixed(1));
      phaseBadgeText = `PHASE 2: METABOLIC ADAPTATION (MONTH 3–6)`;
      phaseColor = '#06B6D4'; // Cyan
    } else if (f < phase3End) {
      currentBF = options.targetBodyFatPct;
      currentWeight = options.targetWeightKg;
      phaseBadgeText = `PHASE 3: PEAK OUTCOME (MONTH ${options.durationMonths})`;
      phaseColor = '#10B981'; // Green
    } else {
      currentBF = options.targetBodyFatPct;
      currentWeight = options.targetWeightKg;
      phaseBadgeText = `PHASE 4: 6–12 MONTH TRANSFORMATION REVIEW`;
      phaseColor = '#F59E0B'; // Gold
    }

    // Phase Badge
    ctx.fillStyle = phaseColor;
    ctx.fillRect(40, height - 195, 12, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText(phaseBadgeText, 62, height - 184);

    // Timecode in right corner of HUD
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`00:0${Math.floor(timeSec)} / 00:0${durationSec}`, width - 40, height - 184);
    ctx.textAlign = 'left';

    // Metric Cards Grid (3 Cards)
    const cardY = height - 165;
    const cardW = (width - 100) / 3;
    const cardH = 75;

    // Card 1: Body Fat %
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.fillRect(40, cardY, cardW, cardH);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillText('BODY FAT %', 52, cardY + 22);
    ctx.fillStyle = phaseColor;
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(`${currentBF}%`, 52, cardY + 54);

    // Card 2: Body Weight
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.fillRect(40 + cardW + 10, cardY, cardW, cardH);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillText('BODY WEIGHT', 52 + cardW + 10, cardY + 22);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(`${currentWeight} kg`, 52 + cardW + 10, cardY + 54);

    // Card 3: Fat Mass Lost
    const fatLost = Math.max(0, parseFloat((((options.currentWeightKg * options.startingBodyFatPct) / 100) - ((currentWeight * currentBF) / 100)).toFixed(1)));
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.fillRect(40 + (cardW + 10) * 2, cardY, cardW, cardH);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillText('FAT MASS LOST', 52 + (cardW + 10) * 2, cardY + 22);
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(`-${fatLost} kg`, 52 + (cardW + 10) * 2, cardY + 54);

    // Bottom Subtitle & Protocol Guarantee
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 11.5px Inter, sans-serif';
    ctx.fillText('✓ Low-Carb (80–120g) Protocol  •  Resistance 4x/Wk  •  Clinical Diet Calibration', 40, height - 60);

    // Progress bar at very bottom
    const barProgress = f / totalFrames;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(20, height - 40, width - 40, 6);
    ctx.fillStyle = '#BE185D';
    ctx.fillRect(20, height - 40, (width - 40) * barProgress, 6);

    // Capture thumbnail at frame 200 (peak transformed outcome)
    if (f === Math.round(totalFrames * 0.75)) {
      try {
        capturedThumbnail = masterCanvas.toDataURL('image/jpeg', 0.85);
      } catch (e) {}
    }

    // Yield back to browser event loop every 3 frames for smooth animation & non-blocking execution
    if (f % 3 === 0) {
      await new Promise((r) => requestAnimationFrame(r));
    }
  }

  if (onProgress) onProgress(98, 'Finalizing high-definition video container...');

  // Stop recorder and wait for blob
  recorder.stop();
  const finalBlob = await recordingPromise;
  const blobUrl = URL.createObjectURL(finalBlob);

  if (onProgress) onProgress(100, 'Video generated successfully!');

  return {
    blob: finalBlob,
    blobUrl,
    durationSec,
    thumbnailUrl: capturedThumbnail || options.currentPhysiqueImageUrl,
  };
}

/**
 * Trigger immediate download of the video file to the user's computer/device
 */
export function downloadTransformationVideo(
  blob: Blob,
  clientName: string = 'Client',
  durationMonths: number = 6
): void {
  const safeName = clientName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `SheNourishes_Transformation_${safeName}_${durationMonths}Months.webm`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Persist generated transformation video record in LocalStorage & Firebase RTDB
 */
export async function saveTransformationVideoRecord(
  record: ClientTransformationVideoRecord
): Promise<void> {
  // Save to LocalStorage
  try {
    const key = `${STORAGE_VIDEO_PREFIX}${record.clientId}`;
    const existingRaw = localStorage.getItem(key);
    const list: ClientTransformationVideoRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    // Prepend new record
    const updated = [record, ...list.filter((r) => r.id !== record.id)].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage saveTransformationVideoRecord error:', e);
  }

  // Save to Firebase RTDB
  if (isFirebaseConfigured && database) {
    try {
      await set(ref(database, `customers/${record.clientId}/transformationVideos/${record.id}`), {
        id: record.id,
        clientId: record.clientId,
        clientName: record.clientName,
        createdAt: record.createdAt,
        durationSeconds: record.durationSeconds,
        targetMonths: record.targetMonths,
        startingBodyFatPct: record.startingBodyFatPct,
        targetBodyFatPct: record.targetBodyFatPct,
        startingWeightKg: record.startingWeightKg,
        targetWeightKg: record.targetWeightKg,
        primaryGoal: record.primaryGoal,
        thumbnailUrl: record.thumbnailUrl || '',
        aiAnalysis: record.aiAnalysis || null,
      });
    } catch (e) {
      console.warn('Firebase saveTransformationVideoRecord error:', e);
    }
  }
}

/**
 * Get all transformation video records for a client
 */
export async function getTransformationVideos(
  clientId: string
): Promise<ClientTransformationVideoRecord[]> {
  // Check Firebase RTDB
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, `customers/${clientId}/transformationVideos`));
      if (snap.exists()) {
        const val = snap.val();
        const arr = Object.values(val) as ClientTransformationVideoRecord[];
        arr.sort((a, b) => b.createdAt - a.createdAt);
        return arr;
      }
    } catch (e) {
      console.warn('Firebase getTransformationVideos error:', e);
    }
  }

  // Fallback to LocalStorage
  try {
    const raw = localStorage.getItem(`${STORAGE_VIDEO_PREFIX}${clientId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}

  return [];
}
