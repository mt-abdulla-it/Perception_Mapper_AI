import { TeamMember, CustomRule } from "../types";

export const VOICE_PRESETS = [
  {
    lang: "en",
    label: "English Case Study (Biased)",
    text: "Obviously, this disaster is a complete conspiracy. Everyone knows that the corporation is undeniably trying to cover up their horrible, catastrophic failure without a doubt."
  },
  {
    lang: "ta",
    label: "Tamil Speech (சந்தேகமற)",
    text: "எப்போதுமே எல்லாரும் சதி செய்கிறார்கள். வெளிப்படையாக இந்த பேரழிவு நிச்சயமாக அதிகாரிகளின் கவனக்குறைவால் ஏற்பட்டது."
  },
  {
    lang: "si",
    label: "Sinhala Speech (අතිශය)",
    text: "සෑමවිටම සැකයකින් තොරව කුමන්ත්‍රණය ක්‍රියාත්මකයි. පැහැදිලිවම මෙය ව්‍යසනයක් වන අතර කිසිවෙකුත් මෙයට වගකියන්නේ නැත."
  }
];

export const IMAGE_PRESETS = [
  {
    title: "Global Logistics Manifest OCR Scan",
    fileName: "freight_cargo_manifest_98h2.png",
    extractedText: "CARGO CLASSIFICATION: CRITICAL CONSPIRACY OR CRUDE FAILURE. Obviously, freight dispatch is completely disaster-stricken. Dispatchers are undeniably ignoring crucial warnings completely."
  },
  {
    title: "Sovereign Border Declaration Optical OCR Scan",
    fileName: "passport_declaration_ocr_v4.png",
    extractedText: "DECLARATION METRICS: Border safety is a catastrophic disaster. Everyone is clearly trying to circumvent the sovereign boundary lines without a doubt."
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  { id: "1", name: "Gabriel Thorne", email: "g.thorne@perception.ai", role: "ADMIN", status: "ACTIVE" },
  { id: "2", name: "Celeste Sterling", email: "c.sterling@perception.ai", role: "USER", status: "ACTIVE" }
];

export const INITIAL_CUSTOM_RULES: CustomRule[] = [
  { id: "1", pattern: "\\b(always|never)\\b", type: "Over-generalization", category: "Linguistic", rephrase: "often / occasionally" },
  { id: "2", pattern: "\\b(obviously)\\b", type: "Confirmation Bias", category: "Cognitive", rephrase: "it appears / evidence indicates" }
];
