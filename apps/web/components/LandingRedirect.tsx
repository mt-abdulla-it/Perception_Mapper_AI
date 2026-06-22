"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function LandingRedirect() {
  const router = useRouter();
  const { isSignedIn, user, mounted } = useAuth();

  useEffect(() => {
    if (mounted && isSignedIn && user) {
      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [mounted, isSignedIn, user, router]);

  return null;
}
