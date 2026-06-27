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
}
