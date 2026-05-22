import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { PasswordInput } from './PasswordInput';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        if (!signInLoaded) { setError('Auth not ready'); setLoading(false); return; }
        await signIn.create({ identifier: email, password });
        onSuccess?.();
      } else {
        if (!signUpLoaded) { setError('Auth not ready'); setLoading(false); return; }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await signUp.create({ emailAddress: email, password });
        await signUp.update({ firstName: name });
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        // verification flow handled by Clerk UI; placeholder omitted
        onSuccess?.();
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Unexpected error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-200 dark:text-slate-300">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800/40 text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 px-3 py-2 text-sm"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-200 dark:text-slate-300">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800/40 text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 px-3 py-2 text-sm"
        />
      </div>
      <PasswordInput
        id="password"
        label="Password"
        value={password}
        setValue={setPassword}
      />
      {mode === 'signup' && (
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
        />
      )}
      {mode === 'login' && (
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-600 text-purple-600 focus:ring-purple-500" />
            <span className="ml-2 text-sm text-slate-300">Remember me</span>
          </label>
          <a href="#" className="text-sm text-purple-400 hover:underline">Forgot password?</a>
        </div>
      )}
      {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        ) : mode === 'login' ? 'Login' : 'Create Account'}
      </button>
    </form>
  );
};
