"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export interface Settings {
  system?: {
    theme?: string;
    language?: string;
    uiAnimations?: boolean;
    maintenanceMode?: boolean;
    rateLimit?: number;
    signupEnabled?: boolean;
  };
  ai?: {
    toneAnalysis?: boolean;
    biasDetection?: boolean;
    voiceInput?: boolean;
    imageAnalysis?: boolean;
  };
  user?: {
    defaultDashboard?: string;
    notifications?: boolean;
    autoLogoutMinutes?: number;
  };
  admin?: {
    rateLimit?: number;
    signupEnabled?: boolean;
    maintenanceMode?: boolean;
  };
}

const useConfiguration = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/configuration");
      setSettings(res.data);
    } catch (e: any) {
      setError(e.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings: Settings) => {
    setLoading(true);
    try {
      const res = await axios.patch("/api/configuration", newSettings);
      setSettings(res.data);
    } catch (e: any) {
      setError(e.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, updateSettings, refresh: fetchSettings };
};

export default useConfiguration;
