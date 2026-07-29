export interface PricingPlan {
  id: 'free' | 'basic' | 'pro';
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  description: string;
  ctaLabel: string;
  badge?: string;
  accentColor: string;
  iconName: 'Sparkles' | 'Layers' | 'Zap';
  features: {
    [key: string]: boolean | string;
  };
}

export interface FeatureDefinition {
  key: string;
  label: string;
  category: 'Linguistic Scopes' | 'Capabilities' | 'Integrations & Telemetry';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export const featureDefinitions: FeatureDefinition[] = [
  { key: 'languages', label: 'Supported Languages', category: 'Linguistic Scopes' },
  { key: 'analyses', label: 'Analyses / Month', category: 'Linguistic Scopes' },
  { key: 'toneBreakdown', label: 'Tone Breakdown', category: 'Linguistic Scopes' },
  { key: 'cognitiveBiases', label: 'Cognitive Bias Types', category: 'Capabilities' },
  { key: 'rephrasing', label: 'Objective Rephrasing', category: 'Capabilities' },
  { key: 'export', label: 'CSV + PDF Export', category: 'Capabilities' },
  { key: 'apiKey', label: 'API Access + X-API-Key', category: 'Integrations & Telemetry' },
  { key: 'workspace', label: 'Team Workspace', category: 'Integrations & Telemetry' },
  { key: 'telemetry', label: 'Admin Telemetry Dashboard', category: 'Integrations & Telemetry' },
  { key: 'webhooks', label: 'Webhook + curl Automation', category: 'Integrations & Telemetry' },
  { key: 'support', label: 'Dedicated Support', category: 'Integrations & Telemetry' },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceAnnually: 0,
    description: 'Perfect for casual writers and individual linguistic testing.',
    ctaLabel: 'Get started free',
    accentColor: 'border-slate-800 text-slate-400 bg-slate-900/40 hover:border-slate-700',
    iconName: 'Sparkles',
    features: {
      languages: 'English only',
      analyses: '50 / mo',
      toneBreakdown: 'Partial analysis',
      cognitiveBiases: '3 core types only',
      rephrasing: false,
      export: false,
      apiKey: false,
      workspace: false,
      telemetry: false,
      webhooks: false,
      support: false,
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    priceMonthly: 19,
    priceAnnually: 15, // ~20% discount (19 * 0.8 = 15.2 -> $15/mo billed annually)
    description: 'Empowers publishers and professionals with multi-locale analysis.',
    ctaLabel: 'Get Basic',
    badge: 'Most popular',
    accentColor: 'border-blue-500/50 text-blue-400 bg-blue-950/20 hover:border-blue-400',
    iconName: 'Layers',
    features: {
      languages: 'EN + Tamil + Sinhala',
      analyses: '500 / mo',
      toneBreakdown: 'Full tone assessment',
      cognitiveBiases: 'All classification categories',
      rephrasing: true,
      export: true,
      apiKey: false,
      workspace: false,
      telemetry: false,
      webhooks: false,
      support: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 59,
    priceAnnually: 47, // ~20% discount (59 * 0.8 = 47.2 -> $47/mo billed annually)
    description: 'Full-scale workspace pipeline built for agile editing groups.',
    ctaLabel: 'Get Pro',
    accentColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20 hover:border-emerald-400',
    iconName: 'Zap',
    features: {
      languages: 'EN + Tamil + Sinhala',
      analyses: 'Unlimited',
      toneBreakdown: 'Full tone assessment',
      cognitiveBiases: 'All classification categories',
      rephrasing: true,
      export: true,
      apiKey: true,
      workspace: 'Up to 20 members',
      telemetry: true,
      webhooks: true,
      support: true,
    },
  },
];

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Can I switch plans later?',
    answer: 'Yes. You can upgrade, downgrade, or cancel your active subscription plan directly from your billing profile dashboard. Upgrades take effect immediately with pro-rated billing, while downgrades apply at the start of your next billing cycle.',
  },
  {
    id: 'faq-2',
    question: 'Is there a free trial on paid plans?',
    answer: 'Yes. Every new Basic or Pro plan includes a 14-day risk-free evaluation period. If you decide the plan is not suitable for your needs, you can cancel before the trial concludes and you will not be charged.',
  },
  {
    id: 'faq-3',
    question: 'What languages are supported?',
    answer: 'Perception Mapper AI fully supports English, Tamil (தமிழ்), and Sinhala (සිංහල). The Free plan restricts usage to English analysis only, while the Basic and Pro plans provide full multi-locale analysis capabilities.',
  },
  {
    id: 'faq-4',
    question: 'How does the API key work?',
    answer: 'Pro plan subscribers can generate a secure, authenticated `X-API-Key` directly from their developer console. You can use this token to execute automated pipeline perception audits using simple curl triggers or custom integrations.',
  },
  {
    id: 'faq-5',
    question: 'Is my text data stored?',
    answer: 'Your privacy is our core operational priority. All text payloads processed via the API or frontend sidecar are analyzed in-memory and are never stored on persistent storage disks, unless you explicitly save an audit log report to your account history.',
  },
  {
    id: 'faq-6',
    question: 'What payment methods are accepted?',
    answer: 'We securely accept all major global credit card networks (Visa, Mastercard, American Express, Discover), PayPal accounts, and bank wire transfers for enterprise corporate billing contracts.',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    quote: 'Perception Mapper has transformed our editorial workflow. Flagging loaded emotional terms and over-generalizations in Sinhala articles takes seconds instead of hours of proofing.',
    author: 'Nimalka Perera',
    role: 'Senior Editor, Daily Mirror Sri Lanka',
    rating: 5,
  },
  {
    id: 't-2',
    quote: 'The developer console and X-API-Key automation are flawless. We integrated the objectivity audits directly into our publishing queue, auditing thousands of updates weekly.',
    author: 'Marcus Vance',
    role: 'Product Lead, TechCorp International',
    rating: 5,
  },
  {
    id: 't-3',
    quote: 'Having reliable, automated bias classification for both Tamil and English content is incredibly helpful. The glassmorphic interface is visually clean and accessible.',
    author: 'Arul Ramanathan',
    role: 'Linguistic Researcher, Global Press Collective',
    rating: 5,
  },
];
