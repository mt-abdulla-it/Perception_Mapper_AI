import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * Hook to protect routes.
 * @param requiredRole Optional role ("ADMIN") required to access the page.
 */
export function useRequireAuth(requiredRole?: "ADMIN") {
  const { isSignedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      // Redirect unauthenticated users to sign‑in page preserving locale
      router.replace(`/sign-in`);
    } else if (requiredRole && user?.role !== requiredRole) {
      // Redirect users without proper role to dashboard (or home)
      router.replace(`/dashboard`);
    }
  }, [isSignedIn, user, requiredRole, router]);
}
