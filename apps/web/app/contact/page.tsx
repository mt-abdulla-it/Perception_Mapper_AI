"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LandingLayout from "../../components/LandingLayout";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Shield, Globe, Cpu } from "lucide-react";

type InquiryType = "enterprise" | "bias" | "api" | "general";

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState<InquiryType>("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Identification signature required.";
    if (!formData.email.trim()) {
      newErrors.email = "Communication node address required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid communication node format.";
    }
    if (!formData.message.trim()) newErrors.message = "Transmission payload cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate premium quantum encryption & handshake
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <LandingLayout>
      <Navbar />
      
      <main className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient background styling */}
        <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full filter blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/5 rounded-full filter blur-[140px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 space-y-12">
          {/* Header Hero Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/20 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest">
              <Cpu className="h-3 w-3 animate-pulse" />
              <span>Secure Telemetry Uplink</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-400">
              Establish Connection
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
              Initiate a high-priority connection with the Perception Mapper AI engineering team. Our quantum channels are open for telemetry, integration reviews, and custom deployments.
            </p>
          </div>

          {/* Main Grid Content */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side info block */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel border border-slate-900 bg-slate-950/30 rounded-2xl p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold uppercase tracking-wider text-slate-200">
                  Node Information
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Use standard SMTP relays or direct routing coordinates below. All transmission packages are verified for schema integrity.
                </p>

                <div className="space-y-4 pt-2">
                  {/* Secure routing email */}
                  <div className="flex items-start space-x-4 group">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 group-hover:border-indigo-500/40 group-hover:text-indigo-300 transition duration-300">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Secure Relay</span>
                      <a href="mailto:uplink@perception-mapper.ai" className="text-slate-200 hover:text-indigo-400 text-sm font-semibold transition duration-200">
                        uplink@perception-mapper.ai
                      </a>
                    </div>
                  </div>

                  {/* Quantum Line */}
                  <div className="flex items-start space-x-4 group">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-pink-400 group-hover:border-pink-500/40 group-hover:text-pink-300 transition duration-300">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Quantum Bridge</span>
                      <a href="tel:+18005556277" className="text-slate-200 hover:text-pink-400 text-sm font-semibold transition duration-200">
                        +1 (800) 555-MAPP (6277)
                      </a>
                    </div>
                  </div>

                  {/* Virtual Coordinates */}
                  <div className="flex items-start space-x-4 group">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition duration-300">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Coordinates</span>
                      <span className="block text-slate-200 text-xs font-semibold leading-relaxed">
                        Orbital Node 742, Sector-9<br />
                        Tech Terminal, Austin, TX 78701
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-6">
                  <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>SSL/TLS Enforced Handshakes</span>
                  </div>
                </div>
              </div>

              {/* Status metrics widget */}
              <div className="glass-panel border border-slate-900/60 bg-slate-950/20 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gateway Status</span>
                  <span className="text-emerald-400 text-sm font-extrabold tracking-wider">OPERATIONAL</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400 text-[9px] font-extrabold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                  <span>99.99% Node Uptime</span>
                </div>
              </div>
            </div>

            {/* Right side interactive form */}
            <div className="lg:col-span-7">
              <div className="glass-panel border border-slate-900 bg-slate-950/30 rounded-2xl p-6 sm:p-8 relative">
                
                {isSuccess ? (
                  /* Stunning Success State */
                  <div className="py-12 px-4 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="mx-auto w-16 h-16 bg-indigo-950/50 border border-indigo-500/40 text-indigo-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                      <CheckCircle2 className="h-8 w-8 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">Transmission Acknowledged</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        Your secure message has bypassed firewall nodes and synced with the active engineering terminal queue. Expect response coordinates within 8 standard cycles.
                      </p>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 px-4 py-3.5 rounded-xl max-w-sm mx-auto text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
                      Receipt Code: PM-SEC-{Math.floor(100000 + Math.random() * 900000)}
                    </div>
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({ name: "", email: "", message: "" });
                      }}
                      className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition duration-300"
                    >
                      Establish New Downlink
                    </button>
                  </div>
                ) : (
                  /* Standard Input Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Choose Inquiry Channel
                      </label>
                      <div className="grid grid-cols-2 gap-3.5">
                        
                        {/* Channel Options */}
                        <button
                          type="button"
                          onClick={() => setInquiryType("general")}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition cursor-pointer select-none ${
                            inquiryType === "general"
                              ? "bg-indigo-950/15 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                              : "bg-slate-950/20 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <MessageSquare className={`h-4.5 w-4.5 mb-1.5 transition ${inquiryType === "general" ? "text-indigo-400" : ""}`} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">General Inquiries</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInquiryType("enterprise")}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition cursor-pointer select-none ${
                            inquiryType === "enterprise"
                              ? "bg-pink-950/15 border-pink-500/50 text-white shadow-[0_0_15px_rgba(236,72,153,0.1)]"
                              : "bg-slate-950/20 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Globe className={`h-4.5 w-4.5 mb-1.5 transition ${inquiryType === "enterprise" ? "text-pink-400" : ""}`} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Enterprise Mapping</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInquiryType("api")}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition cursor-pointer select-none ${
                            inquiryType === "api"
                              ? "bg-cyan-950/15 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                              : "bg-slate-950/20 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Cpu className={`h-4.5 w-4.5 mb-1.5 transition ${inquiryType === "api" ? "text-cyan-400" : ""}`} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">API Core Node</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInquiryType("bias")}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition cursor-pointer select-none ${
                            inquiryType === "bias"
                              ? "bg-amber-950/15 border-amber-500/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                              : "bg-slate-950/20 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Shield className={`h-4.5 w-4.5 mb-1.5 transition ${inquiryType === "bias" ? "text-amber-400" : ""}`} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Bias Calibration</span>
                        </button>

                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Name / Identifier
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: undefined });
                          }}
                          className={`w-full bg-slate-950/40 border ${
                            errors.name ? "border-rose-500/50 focus:border-rose-500/80" : "border-slate-900 focus:border-indigo-500/50"
                          } px-4 py-2.5 rounded-xl text-xs text-slate-200 outline-none transition`}
                          placeholder="e.g. Sentinel-1 or Alice Vance"
                        />
                        {errors.name && (
                          <span className="text-[9px] font-semibold text-rose-400 uppercase">{errors.name}</span>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Communication Address (Email)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          className={`w-full bg-slate-950/40 border ${
                            errors.email ? "border-rose-500/50 focus:border-rose-500/80" : "border-slate-900 focus:border-indigo-500/50"
                          } px-4 py-2.5 rounded-xl text-xs text-slate-200 outline-none transition`}
                          placeholder="e.g. telemetry@quantum-host.net"
                        />
                        {errors.email && (
                          <span className="text-[9px] font-semibold text-rose-400 uppercase">{errors.email}</span>
                        )}
                      </div>

                      {/* Message area */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Transmission Payload (Message)
                        </label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (errors.message) setErrors({ ...errors, message: undefined });
                          }}
                          className={`w-full bg-slate-950/40 border ${
                            errors.message ? "border-rose-500/50 focus:border-rose-500/80" : "border-slate-900 focus:border-indigo-500/50"
                          } px-4 py-2.5 rounded-xl text-xs text-slate-200 outline-none transition resize-none`}
                          placeholder="Describe the payload parameters, bias calibration coordinates, or custom query in detail..."
                        />
                        {errors.message && (
                          <span className="text-[9px] font-semibold text-rose-400 uppercase">{errors.message}</span>
                        )}
                      </div>
                    </div>

                    {/* Transmit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition duration-300 disabled:opacity-50 select-none shadow-[0_4px_15px_rgba(99,102,241,0.25)] border border-indigo-400/20 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                          <span>Encrypting Payload...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5 mr-0.5" />
                          <span>Transmit Secure Uplink</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </LandingLayout>
  );
}
