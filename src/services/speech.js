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

export const startListening = (onResult, onError, language = 'en-US', continuous = false) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    if (onError) onError("Speech recognition not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
  recognition.continuous = continuous;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }
    if (transcript && onResult) onResult(transcript.trim());
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };

  try {
    recognition.start();
  } catch (e) {
    console.error("Recognition start error:", e);
  }
  
  return recognition;
};
