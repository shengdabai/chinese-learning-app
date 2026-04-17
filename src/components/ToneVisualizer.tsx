import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ToneVisualizerProps {
  readonly stream: MediaStream | null;
  readonly height?: number;
  readonly width?: number;
  readonly isActive?: boolean;
  readonly targetTone?: number; // 1-4, the standard tone to compare against
}

/**
 * Standard Mandarin tone contour curves (normalized 0-1 range over time).
 * These represent the canonical pitch patterns for each tone.
 */
const TONE_CURVES: Record<number, readonly number[]> = {
  1: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8],   // High level
  2: [0.3, 0.35, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8],   // Rising
  3: [0.5, 0.4, 0.3, 0.25, 0.2, 0.25, 0.4, 0.55],  // Dipping
  4: [0.8, 0.75, 0.65, 0.55, 0.4, 0.3, 0.2, 0.15], // Falling
};

type ToneRating = 'Good' | 'Fair' | 'Try Again' | null;

/**
 * Simple autocorrelation-based pitch detection.
 * Returns estimated frequency in Hz, or 0 if no clear pitch detected.
 */
function detectPitch(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let foundGoodCorrelation = false;
  const correlationThreshold = 0.2;

  // Check if the signal has enough energy
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return 0; // Too quiet

  for (let offset = 20; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;

    if (correlation > correlationThreshold && correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
      foundGoodCorrelation = true;
    }
  }

  if (!foundGoodCorrelation || bestOffset === -1) return 0;
  return sampleRate / bestOffset;
}

/**
 * Compare user pitch contour against the target tone curve.
 * Returns a score from 0 to 1.
 */
function computeToneScore(
  userPitches: readonly number[],
  targetTone: number
): number {
  const curve = TONE_CURVES[targetTone];
  if (!curve || userPitches.length < 3) return 0;

  // Normalize user pitches to 0-1 range
  const validPitches = userPitches.filter(p => p > 50 && p < 600);
  if (validPitches.length < 3) return 0;

  const minP = Math.min(...validPitches);
  const maxP = Math.max(...validPitches);
  const range = maxP - minP;

  const normalized = validPitches.map(p =>
    range > 10 ? (p - minP) / range : 0.5
  );

  // Resample to match curve length
  const resampled = curve.map((_, i) => {
    const idx = (i / (curve.length - 1)) * (normalized.length - 1);
    const lower = Math.floor(idx);
    const upper = Math.min(lower + 1, normalized.length - 1);
    const frac = idx - lower;
    return normalized[lower] * (1 - frac) + normalized[upper] * frac;
  });

  // Compute correlation
  let sumDiff = 0;
  for (let i = 0; i < curve.length; i++) {
    sumDiff += Math.abs(resampled[i] - curve[i]);
  }
  const avgDiff = sumDiff / curve.length;

  return Math.max(0, 1 - avgDiff * 2);
}

function getRating(score: number): ToneRating {
  if (score >= 0.7) return 'Good';
  if (score >= 0.4) return 'Fair';
  return 'Try Again';
}

function getRatingColor(rating: ToneRating): string {
  switch (rating) {
    case 'Good': return '#22c55e';
    case 'Fair': return '#f59e0b';
    case 'Try Again': return '#ef4444';
    default: return '#60A5FA';
  }
}

export const ToneVisualizer: React.FC<ToneVisualizerProps> = ({
  stream,
  height = 100,
  width = 300,
  isActive = true,
  targetTone,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pitchHistoryRef = useRef<number[]>([]);
  const ratingRef = useRef<ToneRating>(null);
  const frameCounterRef = useRef(0);
  const [rating, setRating] = useState<ToneRating>(null);
  const [score, setScore] = useState(0);

  const drawToneCurve = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, tone: number, color: string, label: string) => {
      const curve = TONE_CURVES[tone];
      if (!curve) return;

      const padding = 10;
      const drawW = w - padding * 2;
      const drawH = h - padding * 2;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();

      for (let i = 0; i < curve.length; i++) {
        const x = padding + (i / (curve.length - 1)) * drawW;
        const y = padding + (1 - curve[i]) * drawH;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = color;
      ctx.font = '9px monospace';
      ctx.fillText(label, padding + 2, padding + 10);
    },
    []
  );

  useEffect(() => {
    if (!stream || !isActive) return;

    let isMounted = true;

    const setupAudio = () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioCtx = audioContextRef.current;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;

        pitchHistoryRef.current = [];
        setRating(null);
        setScore(0);

        const floatBuffer = new Float32Array(analyser.fftSize);
        const timeDomainData = new Uint8Array(analyser.frequencyBinCount);

        const draw = () => {
          if (!isMounted || !canvasRef.current || !analyserRef.current) return;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const w = canvas.width;
          const h = canvas.height;

          animationFrameRef.current = requestAnimationFrame(draw);

          // Get time domain data for waveform
          analyserRef.current.getByteTimeDomainData(timeDomainData);

          // Throttle pitch detection: only run every 4 frames to reduce CPU load
          frameCounterRef.current += 1;
          if (frameCounterRef.current % 4 === 0) {
            // Get float data for pitch detection
            analyserRef.current.getFloatTimeDomainData(floatBuffer);
            const pitch = detectPitch(floatBuffer, audioCtx.sampleRate);

            if (pitch > 50 && pitch < 600) {
              pitchHistoryRef.current = [...pitchHistoryRef.current.slice(-49), pitch];

              // Update score if we have a target tone and enough data
              if (targetTone && pitchHistoryRef.current.length >= 5) {
                const newScore = computeToneScore(pitchHistoryRef.current, targetTone);
                setScore(newScore);
                const newRating = getRating(newScore);
                ratingRef.current = newRating;
                setRating(newRating);
              }
            }
          }

          // Clear
          ctx.fillStyle = 'rgb(20, 20, 30)';
          ctx.fillRect(0, 0, w, h);

          // Draw target tone curve if specified
          if (targetTone) {
            drawToneCurve(ctx, w, h, targetTone, 'rgba(96, 165, 250, 0.4)', `T${targetTone} Target`);
          }

          // Draw user pitch contour
          const pitches = pitchHistoryRef.current;
          if (pitches.length > 1) {
            const validPitches = pitches.filter(p => p > 50);
            if (validPitches.length > 1) {
              const minP = Math.min(...validPitches);
              const maxP = Math.max(...validPitches);
              const range = maxP - minP;
              const padding = 10;
              const drawW = w - padding * 2;
              const drawH = h - padding * 2;

              const ratingColor = getRatingColor(ratingRef.current);
              ctx.strokeStyle = ratingColor;
              ctx.lineWidth = 2.5;
              ctx.beginPath();

              for (let i = 0; i < pitches.length; i++) {
                if (pitches[i] < 50) continue;
                const x = padding + (i / (pitches.length - 1)) * drawW;
                const normalized = range > 10
                  ? (pitches[i] - minP) / range
                  : 0.5;
                const y = padding + (1 - normalized) * drawH;

                if (i === 0 || pitches[i - 1] < 50) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              }
              ctx.stroke();

              // Label
              ctx.fillStyle = ratingColor;
              ctx.font = '9px monospace';
              ctx.fillText('Your pitch', padding + 2, h - 4);
            }
          }

          // Draw waveform (subtle overlay)
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          const sliceWidth = w / timeDomainData.length;
          let x = 0;
          for (let i = 0; i < timeDomainData.length; i++) {
            const v = timeDomainData[i] / 128.0;
            const y = v * h / 2;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.stroke();
        };

        draw();
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error setting up audio visualizer:', err.message);
        }
      }
    };

    setupAudio();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stream, isActive, targetTone, drawToneCurve]);

  return (
    <div className="rounded-xl overflow-hidden shadow-inner border border-slate-700 bg-slate-900">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block w-full h-full"
      />
      {targetTone && rating && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80">
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: getRatingColor(rating) }}
          >
            {rating}
          </span>
          <span className="text-[10px] text-slate-400">
            Match: {Math.round(score * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};
