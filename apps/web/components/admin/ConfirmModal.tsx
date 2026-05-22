"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  isDestructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen, title, message, confirmText, isDestructive = false, onClose, onConfirm
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative p-6 rounded-2xl border border-slate-900 bg-slate-950/90 backdrop-blur-2xl max-w-md w-full space-y-6 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <div className="flex items-start space-x-3 text-xs text-slate-300">
          <div className={`p-2 rounded-full border ${isDestructive ? "bg-rose-950/40 border-rose-500/30 text-rose-500 animate-bounce" : "bg-purple-950/40 border-purple-500/30 text-purple-400"}`}>
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold tracking-wide text-white">{title}</h2>
            <p className="leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex space-x-3 text-xs font-bold select-none uppercase tracking-wide">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-900 border border-slate-800 hover:text-white rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-3 text-white rounded-xl transition ${isDestructive ? "bg-rose-600 hover:bg-rose-500" : "bg-indigo-600 hover:bg-indigo-500"}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
