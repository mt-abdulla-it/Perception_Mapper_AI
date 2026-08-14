"use client";
/**
 * Clerk Compatibility Layer
 * 
 * Provides Clerk-API-compatible components (ClerkProvider, SignedIn, SignedOut,
 * SignInButton, UserButton) and hooks (useAuth, useRequireAuth) that delegate
 * to the canonical auth implementation in hooks/useAuth.ts and lib/auth.ts.
 * 
 * When real Clerk is integrated, replace this file with actual Clerk imports.
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useCanonicalAuth } from '../hooks/useAuth';
import { getMockSession } from '../lib/auth';

// Re-export the canonical useAuth hook under the Clerk-compatible name
export const useAuth = () => {
  const auth = useCanonicalAuth();
  // Map the canonical interface to Clerk-style interface
  return {
    isSignedIn: auth.isSignedIn,
    user: auth.user ? {
      id: auth.user.id,
      role: auth.user.role,
      emailAddress: auth.user.email,
      email: auth.user.email,
      adminSession: auth.user.role === 'ADMIN',
      avatarUrl: auth.user.avatarUrl,
      name: auth.user.name,
    } : null,
    signOut: auth.signOut,
    setRole: auth.setRole,
  };
};

// ClerkProvider — passthrough wrapper (no-op until real Clerk is wired)
export const ClerkProvider = ({ children, publishableKey }: { children: React.ReactNode; publishableKey: string }) => {
  return <>{children}</>;
};

// Conditional rendering components matching Clerk API surface
export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useCanonicalAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted || !isSignedIn) return null;
  return <>{children}</>;
};

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useCanonicalAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted || isSignedIn) return null;
  return <>{children}</>;
};

export const SignInButton = ({ children, mode, ...rest }: { children?: React.ReactNode; mode?: string; [key: string]: any }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/sign-in');
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        handleClick();
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      }
    });
  }
  return <button onClick={handleClick} {...rest}>{children}</button>;
};

export const UserButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement> & { afterSignOutUrl?: string }) => {
  const { signOut } = useCanonicalAuth();
  const { afterSignOutUrl, ...buttonProps } = props;
  return (
    <button type="button" {...buttonProps} onClick={() => signOut()}>
      User
    </button>
  );
};

// Re-export useRequireAuth from its canonical location
export { useRequireAuth } from '../hooks/useRequireAuth';
