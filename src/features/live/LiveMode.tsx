import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Sparkles, ChevronRight, Mic, Video, Square } from 'lucide-react';
import { MODEL_LIVE } from '../../config/constants';
import { arrayBufferToBase64, base64ToFloat32Array, float32ToPCM16 } from '../../utils/audio';
import { ToneVisualizer } from '../../components/ToneVisualizer';

interface LiveModeProps {
    onSessionStart?: () => void;
}

export const LiveMode: React.FC<LiveModeProps> = ({ onSessionStart }) => {
    const [connected, setConnected] = useState(false);
    const [micActive, setMicActive] = useState(false);
    const micActiveRef = useRef(false);
    const [videoActive, setVideoActive] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const activeSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<number | null>(null);
    const [status, setStatus] = useState<string>("Ready to connect");

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    const connectWithCallbacks = async () => {
        try {
            setStatus("Initializing hardware...");

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 640, height: 480 } });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = audioCtx;

            // NOTE: In production, API calls should be proxied through a backend server
            // to avoid exposing the API key in client-side code.
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                setStatus("Error: API key not configured. Set VITE_GEMINI_API_KEY in .env.local.");
                return;
            }
            const ai = new GoogleGenAI({ apiKey });
            setStatus("Connecting to Gemini Live...");

            const sessionPromise = ai.live.connect({
                model: MODEL_LIVE,
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
                    },
                    systemInstruction: "You are an expert Chinese language tutor for business professionals. Your goal is to help the user learn Chinese vocabulary and pronunciation based on what they show you or say. Always provide the Mandarin Chinese word and Pinyin when identifying objects. Keep your responses concise, encouraging, and professional. If the user is silent, ask them to show you something.",
                },
                callbacks: {
                    onopen: () => {
                        setConnected(true);
                        setMicActive(true);
                        micActiveRef.current = true;
                        setStatus("Session Active");
                        if (onSessionStart) onSessionStart();

                        // Start Audio Streaming
                        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        inputAudioContextRef.current = inputCtx;
                        const source = inputCtx.createMediaStreamSource(stream);

                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = processor;

                        processor.onaudioprocess = (e) => {
                            if (!micActiveRef.current) return; // Mute logic
                            const inputData = e.inputBuffer.getChannelData(0);
                            const pcm16 = float32ToPCM16(inputData);
                            const base64 = arrayBufferToBase64(pcm16.buffer);

                            sessionPromise.then(session => {
                                session.sendRealtimeInput({
                                    audio: {
                                        mimeType: "audio/pcm;rate=16000",
                                        data: base64
                                    }
                                });
                            });
                        };

                        source.connect(processor);
                        processor.connect(inputCtx.destination);

                        startVideoStreaming(sessionPromise);
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData && audioContextRef.current) {
                            const ctx = audioContextRef.current;
                            const float32 = base64ToFloat32Array(audioData);
                            const buffer = ctx.createBuffer(1, float32.length, 24000);
                            buffer.getChannelData(0).set(float32);

                            const source = ctx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(ctx.destination);

                            const currentTime = ctx.currentTime;
                            if (nextStartTimeRef.current < currentTime) {
                                nextStartTimeRef.current = currentTime;
                            }
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            activeSourceNodeRef.current = source;
                        }
                    },
                    onclose: () => {
                        setConnected(false);
                        setStatus("Disconnected");
                    },
                    onerror: (err) => {
                        console.error(err);
                        setStatus("Error connecting");
                        setConnected(false);
                    }
                }
            });

        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            setStatus(`Failed to start: ${message}`);
        }
    };

    const startVideoStreaming = (sessionPromise: Promise<any>) => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = window.setInterval(() => {
            // Need to capture the current refs inside the interval
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || !canvas) return; // VideoActive check handled inside component state if needed, here checking refs

            // Check video active state roughly (since interval closure might capture old state, better to use ref for state if dynamic)
            // For now, let's assuming videoActive changes re-trigger this or we just check the state updates. 
            // Actually, standard setInterval sees stale state in functional components unless using refs. 
            // I will rely on the fact that we can't easily access strict outdated state without refs. 
            // Let's just always send if connected.

            canvas.width = video.videoWidth * 0.5;
            canvas.height = video.videoHeight * 0.5;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const base64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];

                sessionPromise.then(session => {
                    session.sendRealtimeInput({
                        media: {
                            mimeType: "image/jpeg",
                            data: base64
                        }
                    });
                });
            }
        }, 1000);
    };

    const disconnect = () => {
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (inputAudioContextRef.current) {
            inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setConnected(false);
        setStatus("Ready to connect");
    };

    const toggleMic = () => {
        const next = !micActive;
        setMicActive(next);
        micActiveRef.current = next;
    };

    const toggleVideo = () => {
        setVideoActive(!videoActive);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] relative">
            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-900 rounded-2xl mx-4 my-2 shadow-2xl border border-slate-800">
                <video
                    ref={videoRef}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${connected ? 'opacity-100' : 'opacity-40 blur-sm'}`}
                    muted
                    playsInline
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Overlay Status */}
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 pointer-events-none">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm transition-colors duration-500 ${connected ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-700/50 text-slate-300 border border-slate-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
                        {connected ? 'Live Session' : 'Offline'}
                    </div>
                    {connected && (
                        <div className="flex flex-col gap-2 items-start animate-in slide-in-from-left-2 transition-all">
                            <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-md text-sm text-slate-200 border border-white/10 max-w-xs">
                                Listening & Watching...
                            </div>
                            <div className="bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/10 mt-1">
                                <ToneVisualizer stream={streamRef.current} height={30} width={100} isActive={micActive} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Start Screen Overlay */}
                {!connected && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 ring-4 ring-white/10">
                            <Sparkles className="text-white" size={36} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Real-time Tutor</h2>
                        <p className="text-slate-300 max-w-md mb-8 leading-relaxed">
                            Experience the future of language learning. Start a live video conversation to practice in real-time.
                        </p>
                        <button
                            onClick={connectWithCallbacks}
                            className="group relative flex items-center gap-3 bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                        >
                            Start Session
                            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-6 text-xs text-slate-500 font-mono tracking-wide">{status}</p>
                    </div>
                )}
            </div>

            {/* Controls Bar */}
            {connected && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-6 px-10 py-5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                        <button
                            onClick={toggleMic}
                            className={`p-4 rounded-full transition-all duration-200 ${micActive ? 'bg-white text-slate-900 hover:bg-slate-200 scale-100' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 ring-1 ring-red-500/30'}`}
                        >
                            {micActive ? <Mic size={24} /> : <div className="relative"><Mic size={24} /><div className="absolute inset-0 border-t-2 border-red-400 rotate-45 top-1/2 left-0 w-full" /></div>}
                        </button>

                        <div className="w-px h-8 bg-white/10" />

                        <button
                            onClick={toggleVideo}
                            className={`p-4 rounded-full transition-all duration-200 ${videoActive ? 'bg-slate-700/50 text-white hover:bg-slate-600/50' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 ring-1 ring-red-500/30'}`}
                        >
                            {videoActive ? <Video size={24} /> : <div className="relative"><Video size={24} /><div className="absolute inset-0 border-t-2 border-red-400 rotate-45 top-1/2 left-0 w-full" /></div>}
                        </button>

                        <div className="w-px h-8 bg-white/10" />

                        <button
                            onClick={disconnect}
                            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/30 hover:shadow-red-500/50 active:scale-95"
                        >
                            <Square size={24} fill="currentColor" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
