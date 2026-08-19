export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: string;
  tier: string;
  plan?: string;
  isBlocked: boolean;
  status?: string;
  analysesUsed: number;
  analysesLimit: number;
  lastLogin: string;
  totalAiRequests: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  activity: string;
  details: string;
  status: string;
  latencyMs: number;
  tokensCount: number;
  createdAt: string;
}

export interface GlobalStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  monthlyRevenue: number;
  totalAnalyses: number;
  reliabilityPercent: number;
}

export interface PolicySettings {
  textEnabled: boolean;
  voiceEnabled: boolean;
  imageEnabled: boolean;
  limitFree: number;
  limitPro: number;
  limitTeam: number;
  rateFree: number;
  ratePro: number;
  rateTeam: number;
  experimentalToggle: boolean;
  updatedAt: string;
}

export interface BiasPattern {
  quote: string;
  type: string;
  description: string;
  rephrase: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface CustomRule {
  id: string;
  pattern: string;
  type: string;
  category: string;
  rephrase: string;
}

export interface ToneInfo {
  name: string;
  score: number;
  color: string;
}

export interface AnalysisResult {
  success: boolean;
  source: string;
  language: string;
  scores: {
    sentiment: number;
    objectivity: number;
    biasIndex: number;
  };
  tones: ToneInfo[];
  biases: BiasPattern[];
}

export interface WorkspaceTeam {
  id: string;
  name: string;
  description?: string;
  leadId?: string;
  tier: string;
  maxMembers: number;
  status: string;
  createdAt?: string;
}

export interface HistoryEntry {
  id: string;
  inputText: string;
  detectedLanguage: string;
  sentimentScore: number;
  biasIndex: number;
  objectivity: number;
  tones: ToneInfo[];
  biases: BiasPattern[];
  createdAt: string;
}

export interface HistoryStats {
  totalAnalyses: number;
  avgBiasIndex: number;
  topBiasType: string;
  topBiasCount: number;
  languageDistribution: {
    name: string;
    count: number;
    percentage: number;
  }[];
}
