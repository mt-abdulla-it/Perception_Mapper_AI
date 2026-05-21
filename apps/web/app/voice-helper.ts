/*
  voice-helper.ts
  Utility functions for handling speech-to-text and text-to-speech using the Web Speech API.
  This module abstracts the browser-specific APIs and provides a simple interface for the UI.
*/

export type SpeechRecognitionResult = {
  transcript: string;
  confidence: number;
};

export type SpeechRecognitionCallback = (result: SpeechRecognitionResult) => void;

let recognition: any = null;
let isListening = false;

/**
 * Initialize the SpeechRecognition object if supported.
 */
export function initSpeechRecognition(onResult: SpeechRecognitionCallback): void {
  if (typeof window === "undefined") return;
  const SpeechRecognitionConstructor =
    // @ts-ignore – vendor-prefixed constructors
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionConstructor) {
    console.warn("Web Speech API (SpeechRecognition) is not supported in this browser.");
    return;
  }
  recognition = new SpeechRecognitionConstructor();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US"; // default, can be overridden by UI

  recognition.onresult = (event: any) => {
    const last = event.results.length - 1;
    const result = event.results[last][0];
    onResult({ transcript: result.transcript.trim(), confidence: result.confidence });
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    isListening = false;
  };
}

/** Start listening for speech input. */
export function startListening(): void {
  if (!recognition) return;
  if (isListening) return;
  try {
    recognition.start();
    isListening = true;
  } catch (e) {
    console.error("Failed to start speech recognition:", e);
  }
}

/** Stop listening. */
export function stopListening(): void {
  if (!recognition) return;
  if (!isListening) return;
  recognition.stop();
  isListening = false;
}

/**
 * Speak a given text using the SpeechSynthesis API.
 * @param text The string to vocalize.
 * @param lang Optional BCP‑47 language tag (defaults to "en-US").
 */
export function speakText(text: string, lang: string = "en-US"): void {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) {
    console.warn("SpeechSynthesis API is not supported in this browser.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  // Choose a pleasant voice if available.
  const voice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang.startsWith(lang)) || null;
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

/**
 * Toggle voice mode (used by UI). Returns the new listening state.
 */
export function toggleListening(onResult: SpeechRecognitionCallback): boolean {
  if (!recognition) {
    initSpeechRecognition(onResult);
  }
  if (isListening) {
    stopListening();
    return false;
  } else {
    startListening();
    return true;
  }
}
