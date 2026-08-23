"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { User, ChevronDown, Upload, Check, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user, signOut, updateAvatar, mounted } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const presets = [
    "https://api.dicebear.com/7.x/bottts/svg?seed=neutral",
    "https://api.dicebear.com/7.x/bottts/svg?seed=apex",
    "https://api.dicebear.com/7.x/bottts/svg?seed=cypher",
    "https://api.dicebear.com/7.x/bottts/svg?seed=titan"
  ];

  const homeHref = isSignedIn ? (user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard") : "/";
  const navItems = user?.role === "ADMIN"
    ? [{ name: "Admin Panel", href: "/admin/dashboard" }]
    : isSignedIn
      ? [
          { name: "Dashboard", href: "/dashboard" },
          { name: "History", href: "/dashboard/history" },
        ]
      : [];

  const landingNavItems = [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Showcase", href: "/#showcase" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Contact", href: "/contact" }
  ];

  if (!mounted) return <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900/60 h-16" />;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 shadow-2xl shadow-indigo-500/5 select-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={homeHref} className="text-white font-extrabold text-sm tracking-widest uppercase hover:text-indigo-400 transition select-none">
            Perception Mapper AI
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-400">
            {!isSignedIn && landingNavItems.map((item) => (
              <a key={item.name} href={item.href} className="relative group transition hover:text-white px-2 py-1">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className={`relative group px-2 py-1 transition ${pathname === item.href ? "text-indigo-400" : "hover:text-white"}`}>
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-400 rounded-full transition-all duration-300 ${pathname === item.href ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div ref={menuRef} className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 p-1 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 transition duration-300 cursor-pointer">
                  <div className={`w-8 h-8 rounded-full border overflow-hidden bg-slate-900 flex items-center justify-center shrink-0 ${
                    user?.tier === "PRO" ? "border-pink-500/40" : user?.tier === "BASIC" ? "border-purple-500/40" : "border-cyan-500/40"
                  }`}>
                    {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" /> : <User className="h-4 w-4 text-slate-500" />}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>

                <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-72 glass-panel border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 p-4 space-y-4 z-50 text-left"
                  >
                    <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-slate-500 m-auto mt-2" />
                        )}
                      </div>
                      <div className="truncate leading-tight flex-grow">
                        <span className="block text-xs font-bold text-slate-200 truncate">{user?.name}</span>
                        <span className="block text-[8px] text-slate-500 font-bold truncate mt-0.5">{user?.email}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                      <div className="flex justify-between"><span>Role:</span><span className="text-indigo-400">{user?.role}</span></div>
                      <div className="flex justify-between"><span>Scope:</span><span className={user?.tier === "PRO" ? "text-pink-400" : user?.tier === "BASIC" ? "text-purple-400" : "text-cyan-400"}>{user?.tier} Plan</span></div>
                    </div>

                    {/* Customize Avatar Section inside dropdown */}
                    <div className="border-t border-slate-900 pt-3 space-y-2">
                      <button 
                        onClick={() => setShowAvatarEdit(!showAvatarEdit)} 
                        className="flex items-center justify-between w-full text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider transition cursor-pointer"
                      >
                        <span>Customize Avatar</span>
                        <Edit2 className="h-3 w-3 text-slate-500" />
                      </button>

                      <AnimatePresence>
                      {showAvatarEdit && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-3 pt-2 overflow-hidden"
                        >
                          {/* File Uploader */}
                          <label className="flex items-center justify-center space-x-2 w-full py-1.5 rounded-lg border border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/20 hover:bg-indigo-950/10 cursor-pointer transition text-[9px] font-bold text-slate-400 hover:text-white uppercase">
                            <Upload className="h-3 w-3 text-indigo-400" />
                            <span>Upload Image</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => {
                                if (!e.target.files || e.target.files.length === 0) return;
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === "string" && updateAvatar) {
                                    updateAvatar(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }} 
                              className="hidden" 
                            />
                          </label>

                          {/* Presets */}
                          <div className="space-y-1.5">
                            <span className="block text-[8px] font-extrabold text-slate-600 uppercase tracking-widest">Presets</span>
                            <div className="grid grid-cols-4 gap-2">
                              {presets.map((p, idx) => {
                                const isActive = user?.avatarUrl === p;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => updateAvatar && updateAvatar(p)}
                                    className={`relative w-10 h-10 rounded-lg border bg-slate-950/60 overflow-hidden flex items-center justify-center transition hover:border-slate-800 cursor-pointer ${
                                      isActive ? "border-indigo-500" : "border-slate-900"
                                    }`}
                                  >
                                    <img src={p} alt={`Preset ${idx}`} className="w-8 h-8" />
                                    {isActive && (
                                      <span className="absolute bottom-0.5 right-0.5 bg-indigo-500 rounded-full p-0.5">
                                        <Check className="h-1.5 w-1.5 text-white" />
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      </AnimatePresence>
                    </div>

                    <button onClick={signOut} className="w-full py-2 bg-slate-900/50 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wide text-center cursor-pointer">
                      Sign Out
                    </button>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in"><button className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition">Sign In</button></Link>
                <Link href="/sign-up"><button className="px-4 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 rounded-xl transition duration-300 shadow-md">Sign Up</button></Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900/50 transition" aria-label="Toggle menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
      {mobileOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden glass-panel border-t border-white/10 px-4 pb-4 pt-3 space-y-3.5 select-none text-left overflow-hidden"
        >
          {isSignedIn && user ? (
            <div className="space-y-4 px-3 py-2 border border-slate-900 bg-slate-950/40 rounded-xl">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-900/80">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-slate-500 m-auto mt-2" />
                  )}
                </div>
                <div className="truncate leading-tight flex-grow">
                  <span className="block text-xs font-bold text-slate-200 truncate">{user.name}</span>
                  <span className="block text-[8px] text-slate-500 font-bold truncate mt-0.5">{user.email}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                <div className="flex justify-between"><span>Role:</span><span className="text-indigo-400">{user.role}</span></div>
                <div className="flex justify-between"><span>Scope:</span><span className={user.tier === "PRO" ? "text-pink-400" : user.tier === "BASIC" ? "text-purple-400" : "text-cyan-400"}>{user.tier} Plan</span></div>
              </div>

              {/* Customize Avatar Section inside mobile menu */}
              <div className="border-t border-slate-900/80 pt-3 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Customize Avatar</span>
                
                {/* File Uploader */}
                <label className="flex items-center justify-center space-x-2 w-full py-1.5 rounded-lg border border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/20 hover:bg-indigo-950/10 cursor-pointer transition text-[9px] font-bold text-slate-400 hover:text-white uppercase">
                  <Upload className="h-3 w-3 text-indigo-400" />
                  <span>Upload Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (!e.target.files || e.target.files.length === 0) return;
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string" && updateAvatar) {
                          updateAvatar(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }} 
                    className="hidden" 
                  />
                </label>

                {/* Presets */}
                <div className="space-y-1.5">
                  <span className="block text-[8px] font-extrabold text-slate-600 uppercase tracking-widest">Presets</span>
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((p, idx) => {
                      const isActive = user.avatarUrl === p;
                      return (
                        <button
                          key={idx}
                          onClick={() => updateAvatar && updateAvatar(p)}
                          className={`relative w-10 h-10 rounded-lg border bg-slate-950/60 overflow-hidden flex items-center justify-center transition hover:border-slate-800 cursor-pointer ${
                            isActive ? "border-indigo-500" : "border-slate-900"
                          }`}
                        >
                          <img src={p} alt={`Preset ${idx}`} className="w-8 h-8" />
                          {isActive && (
                            <span className="absolute bottom-0.5 right-0.5 bg-indigo-500 rounded-full p-0.5">
                              <Check className="h-1.5 w-1.5 text-white" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button onClick={signOut} className="w-full py-2 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/25 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-bold transition uppercase tracking-wide text-center cursor-pointer">
                Sign Out
              </button>
            </div>
          ) : null}

          {!isSignedIn && landingNavItems.map((item) => (
            <a key={item.name} href={item.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900/50 transition">{item.name}</a>
          ))}
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900/50 transition">{item.name}</Link>
          ))}
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
}
