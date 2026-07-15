"use client";

import React, { useState } from "react";
import { FolderUp, FileText, CheckCircle, RefreshCw, FileDown } from "lucide-react";
import { exportToCSV } from "../../lib/csvExporter";

interface QueuedFile { id: string; name: string; size: string; status: "idle" | "running" | "done"; progress: number }

export default function BatchProcessor() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const added: QueuedFile[] = Array.from(e.dataTransfer.files).map((f) => ({
      id: Math.random().toString(36).substring(2, 7),
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      status: "idle",
      progress: 0
    }));
    setFiles((prev) => [...prev, ...added]);
  };

  const triggerBatchProcessing = () => {
    if (files.length === 0 || isProcessing) return;
    setIsProcessing(true);

    files.forEach((file, index) => {
      let currentProgress = 0;
      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: "running" } : f)));

      const interval = setInterval(() => {
        currentProgress += 20;
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress: currentProgress } : f))
        );

        if (currentProgress >= 100) {
          clearInterval(interval);
          setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: "done" } : f)));
          
          if (index === files.length - 1) {
            setIsProcessing(false);
          }
        }
      }, 300);
    });
  };

  const handleExport = () => {
    const mockReportData = files.map((f, idx) => ({
      timestamp: new Date().toISOString(),
      originalText: `Batch processed input from document: ${f.name}`,
      detectedLanguage: "en",
      sentimentScore: 0.75 + idx * 0.05,
      objectiveRephrasing: `Neutralized batch statement index ${idx + 1}`
    }));
    exportToCSV(mockReportData, "batch_perception_audit.csv");
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 relative select-none font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <FolderUp className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Batch Document Processor</h3>
        </div>
        {files.some((f) => f.status === "done") && (
          <button onClick={handleExport} className="flex items-center space-x-1.5 px-3 py-1 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 text-purple-400 hover:text-white rounded-lg text-[9px] font-bold transition">
            <FileDown className="h-3 w-3" />
            <span>Export Audit Trail</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="border border-dashed border-slate-800 hover:border-purple-500/40 bg-slate-950/40 hover:bg-slate-950/80 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition select-none min-h-[160px]"
        >
          <FolderUp className="h-7 w-7 text-purple-400/80 mb-3 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Drag document logs here</span>
          <span className="text-[8px] text-slate-500 font-semibold uppercase mt-1">Supports TXT, CSV, or manifest scans</span>
        </div>

        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col justify-between min-h-[160px]">
          <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
            {files.length === 0 ? (
              <div className="text-center py-8 text-[9px] font-bold uppercase tracking-wider text-slate-600">No documents in queue</div>
            ) : (
              files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-900/60 bg-slate-950/50 text-[10px]">
                  <div className="flex items-center space-x-2.5 max-w-[70%]">
                    <FileText className="h-4 w-4 text-purple-400 shrink-0" />
                    <div className="truncate text-left">
                      <span className="block font-bold text-slate-200 truncate">{file.name}</span>
                      <span className="block text-[8px] text-slate-500 font-bold uppercase">{file.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {file.status === "running" && <RefreshCw className="h-3.5 w-3.5 text-purple-400 animate-spin" />}
                    {file.status === "done" && <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />}
                    {file.status === "idle" && <span className="text-[8px] font-extrabold text-slate-600 uppercase">QUEUED</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {files.length > 0 && (
            <button
              onClick={triggerBatchProcessing}
              disabled={isProcessing}
              className="w-full mt-4 py-2.5 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition duration-300 disabled:opacity-40"
            >
              {isProcessing ? "Processing batch queue..." : "Start Batch Analysis"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
