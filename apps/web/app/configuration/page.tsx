"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Preloader from "../../components/Preloader";

export default function ConfigurationRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return <Preloader message="REDIRECTING TO USER DASHBOARD..." />;
}
export const dynamic = "force-dynamic";
