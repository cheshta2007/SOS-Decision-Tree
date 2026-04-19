/* 
   Web Speech API Wrapper
   Assumes a modern browser with window.SpeechRecognition/webkitSpeechRecognition
   and window.speechSynthesis
*/

export const speakText = (text, language = 'en-US') => {
  if (!('speechSynthesis' in window)) return;
  
  // Stop any currently speaking voice first
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
  utterance.rate = 1.0; 
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const startListening = (onResult, onError, language = 'en-US') => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    if (onError) onError("Speech recognition not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult) onResult(transcript);
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };

  recognition.start();
  return recognition;
};
