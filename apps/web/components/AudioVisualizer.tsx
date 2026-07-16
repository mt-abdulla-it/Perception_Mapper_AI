"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Square, Radio } from "lucide-react";

interface AudioVisualizerProps {
  onStop: (blobUrl: string) => void;
}

export default function AudioVisualizer({ onStop }: AudioVisualizerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        onStop(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      drawVisuals();
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsRecording(false);
  };

  const drawVisuals = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvas || !analyserRef.current || !ctx) return;
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(15, 23, 42, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const height = canvas.height * percent * 0.7;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, "rgba(99, 102, 241, 0.15)");
        grad.addColorStop(0.5, "rgba(168, 85, 247, 0.6)");
        grad.addColorStop(1, "rgba(6, 182, 212, 0.95)");

        ctx.fillStyle = grad;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(6, 182, 212, 0.4)";
        ctx.fillRect(x, canvas.height - height, barWidth - 2, height);
        x += barWidth;
      }
    };
    draw();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-900 bg-slate-950/60 rounded-xl space-y-4 font-sans select-none relative overflow-hidden h-40">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      {isRecording && (
        <span className="absolute top-3 left-4 flex items-center text-[9px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/20 rounded px-2 py-0.5 uppercase tracking-widest">
          <Radio className="h-2.5 w-2.5 mr-1 animate-pulse" /> LIVE STREAM
        </span>
      )}
      <canvas ref={canvasRef} width={380} height={70} className="w-full h-[70px] rounded-lg border border-slate-900/60 bg-slate-950" />
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition duration-300 border ${
          isRecording
            ? "bg-rose-950/40 hover:bg-rose-900/60 border-rose-500/30 text-rose-400 hover:text-white"
            : "bg-indigo-950/40 hover:bg-indigo-900/60 border-indigo-500/30 text-indigo-400 hover:text-white"
        }`}
      >
        {isRecording ? (
          <>
            <Square className="h-3.5 w-3.5 fill-rose-400" />
            <span>Terminate Acoustic Feed</span>
          </>
        ) : (
          <>
            <Mic className="h-3.5 w-3.5" />
            <span>Connect Live Acoustic Feed</span>
          </>
        )}
      </button>
    </div>
  );
}
