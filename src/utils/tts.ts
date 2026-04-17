/**
 * Shared Chinese TTS utility using the Web Speech API.
 *
 * NOTE: In production, consider a server-side TTS service for
 * higher quality and consistent cross-browser pronunciation.
 */

export function playChineseTTS(text: string): void {
  if (!('speechSynthesis' in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  window.speechSynthesis.speak(utterance);
}
