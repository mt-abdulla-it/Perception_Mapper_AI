"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { UserPlus, RefreshCw, Mail, Lock, User } from "lucide-react";
import Preloader from "../../components/Preloader";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import GoogleButton from "../../components/auth/GoogleButton";
import GitHubButton from "../../components/auth/GitHubButton";

export default function SignUpPage() {
  const router = useRouter();
  const { isSignedIn, signInUser, mounted } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    if (mounted && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [mounted, isSignedIn, router]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const errs: typeof errors = {};
    if (name.trim().length < 3) errs.name = "Name must span at least 3 characters.";
    if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Please specify a valid email address.";
    if (password.length < 6) errs.password = "Password must span at least 6 characters.";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";

    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const users = JSON.parse(localStorage.getItem("pm_mock_users") || "[]");
      if (!users.some((u: any) => u.email === cleanEmail)) {
        users.push({ email: cleanEmail, password, name: name.trim(), tier: "FREE" });
        localStorage.setItem("pm_mock_users", JSON.stringify(users));
      }
      router.push(`/sign-in?registered=true&email=${encodeURIComponent(cleanEmail)}`);
    }, 700);
  };

  const handleOAuth = (provider: string) => {
    setLoading(true);
    setTimeout(() => signInUser(`oauth-${provider.toLowerCase()}@perception.ai`, `${provider} User`), 600);
  };

  if (!mounted || isSignedIn) return <Preloader message="CONNECTING TO SECURE AUTH GATEWAY..." />;

  return (
    <AuthCard title="Create Account" description="Deploy a modern NLP mapping node and setup workspace access.">
      <form onSubmit={handleSignUp} className="space-y-3.5">
        <AuthInput label="Full Name" id="name" type="text" icon={User} value={name} onChange={(e) => setName(e.target.value)} placeholder="Astraea Vance" error={errors.name} required />
        <AuthInput label="Email" id="email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@perception.ai" error={errors.email} required />
        <AuthInput label="Password" id="pass" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" error={errors.password} required />
        <AuthInput label="Confirm Password" id="conf" type="password" icon={Lock} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" error={errors.confirmPassword} required />
        
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold border border-indigo-400/20 shadow-md transition flex items-center justify-center disabled:opacity-50 select-none uppercase tracking-wider font-sans">
          {loading ? <><RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />Generating Core Nodes...</> : <><UserPlus className="h-3.5 w-3.5 mr-2" />Create Account</>}
        </button>
      </form>

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800/80" /></div>
        <span className="relative bg-[#090d16] px-3.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-500 select-none">or continue with</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <GoogleButton onClick={() => handleOAuth("Google")} disabled={loading} />
        <GitHubButton onClick={() => handleOAuth("GitHub")} disabled={loading} />
      </div>

      <div className="mt-4 text-center text-[10px] text-slate-400 font-semibold">
        Already registered? <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">Sign In here</Link>
      </div>
    </AuthCard>
  );
}

export const dynamic = "force-dynamic";
