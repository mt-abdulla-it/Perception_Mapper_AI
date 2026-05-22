import { useState, useEffect, useCallback } from "react";
import { getMockSession, setMockSession, setMockAvatar, clearMockSession, validateAdminCredentials, MockUser, SubscriptionTier } from "../lib/auth";

export const useAuth = () => {
  const [mounted, setMounted] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);

  const syncSession = useCallback(() => {
    const session = getMockSession();
    setIsSignedIn(session.isSignedIn);
    setUser(session.user);
  }, []);

  useEffect(() => {
    setMounted(true);
    syncSession();
  }, [syncSession]);

  const signInUser = useCallback((email: string, name = "Standard User") => {
    setMockSession(email, "USER", name);
    syncSession();
    window.location.href = "/dashboard";
  }, [syncSession]);

  const signInAdmin = useCallback((email: string, pass: string): { success: boolean; error?: string } => {
    const check = validateAdminCredentials(email, pass);
    if (!check.success) {
      return { success: false, error: "Invalid administrative credentials." };
    }
    setMockSession(email, "ADMIN", check.name);
    syncSession();
    window.location.href = "/admin/dashboard";
    return { success: true };
  }, [syncSession]);

  const setRole = useCallback((newRole: "USER" | "ADMIN") => {
    if (!user) return;
    setMockSession(user.email, newRole, user.name, user.tier);
    syncSession();
  }, [user, syncSession]);

  const setTier = useCallback((newTier: SubscriptionTier) => {
    if (!user) return;
    setMockSession(user.email, user.role, user.name, newTier);
    syncSession();
  }, [user, syncSession]);

  const updateAvatar = useCallback((newAvatarUrl: string) => {
    if (!user) return;
    setMockAvatar(newAvatarUrl);
    syncSession();
  }, [user, syncSession]);

  const signOut = useCallback(() => {
    clearMockSession();
    setIsSignedIn(false);
    setUser(null);
    window.location.href = "/";
  }, []);

  return {
    isSignedIn: mounted ? isSignedIn : false,
    user: mounted ? user : null,
    mounted,
    signInUser,
    signInAdmin,
    signOut,
    setRole,
    setTier,
    updateAvatar,
  };
};
