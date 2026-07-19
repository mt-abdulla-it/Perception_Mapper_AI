"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Contact", href: "/contact" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  const social = [
    { name: "GitHub", href: "https://github.com/mt-abdulla-it/Perception_Mapper_AI", icon: <Github className="h-4 w-4" />, label: "View source on GitHub" },
    { name: "Twitter", href: "#", icon: <Twitter className="h-4 w-4" />, label: "Follow us on Twitter" },
    { name: "LinkedIn", href: "#", icon: <Linkedin className="h-4 w-4" />, label: "Connect on LinkedIn" },
  ];

  return (
    <footer className="w-full glass-panel border-t border-white/5 relative select-none">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <span className="text-sm font-extrabold text-white tracking-widest uppercase">
              Perception Mapper AI
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Multilingual cognitive bias detection, tone analysis, and objective rephrasing for content teams.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Navigation
            </span>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-[11px] text-slate-500 hover:text-white transition font-medium"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Legal
            </span>
            <ul className="space-y-2">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[11px] text-slate-500 hover:text-white transition font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Connect
            </span>
            <div className="flex items-center space-x-3">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="p-2 rounded-lg border border-slate-800/60 bg-slate-950/40 text-slate-500 hover:text-white hover:border-slate-700 transition"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <a
              href="mailto:support@perceptionmapper.ai"
              className="flex items-center space-x-1.5 text-[11px] text-slate-500 hover:text-indigo-400 transition font-medium"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>support@perceptionmapper.ai</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-[10px] text-slate-600 font-medium">
            © {currentYear} Perception Mapper AI. All rights reserved.
          </span>
          <span className="text-[10px] text-slate-700 font-medium">
            Built by{" "}
            <a
              href="https://github.com/mt-abdulla-it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-indigo-400 transition"
            >
              Abdulla Thaslim
            </a>
            {" & "}
            <a
              href="https://github.com/Suwedha-Sivakumar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-indigo-400 transition"
            >
              Suwedha Sivakumar
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
