import React, { useState } from 'react';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  setValue: (val: string) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ id, label, value, setValue }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-200 dark:text-slate-300">{label}</label>
      <div className="relative mt-1">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className="w-full rounded-md border border-slate-700 bg-slate-800/40 text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );
};
