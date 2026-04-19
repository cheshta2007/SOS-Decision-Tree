import React, { useState } from 'react';
import { Flame, HeartPulse, Car, Waves, ShieldAlert, Mic } from 'lucide-react';
import { startListening, stopSpeaking } from '../services/speech';

const emergencies = [
  { id: 'fire', label: 'Fire', icon: Flame, className: 'fire' },
  { id: 'medical', label: 'Medical', icon: HeartPulse, className: 'medical' },
  { id: 'accident', label: 'Accident', icon: Car, className: 'accident' },
  { id: 'flood', label: 'Flood', icon: Waves, className: 'flood' },
  { id: 'crime', label: 'Crime / Threat', icon: ShieldAlert, className: 'crime' },
];

export default function EmergencySelector({ onSelect, language }) {
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState("");

  const handleVoiceInput = () => {
    if (isRecording) {
      stopSpeaking(); // stop any audio just in case
      return;
    }
    
    setIsRecording(true);
    setSpeechError("");

    startListening(
      (transcript) => {
        setIsRecording(false);
        // We received transcript. Trigger search/AI.
        onSelect("Voice Input", transcript);
      },
      (error) => {
        setIsRecording(false);
        setSpeechError(`Microphone error: ${error}`);
      },
      language
    );
  };

  return (
    <>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>What is your emergency?</h2>
      
      <div className="emergency-grid">
        {emergencies.map((em) => {
          const Icon = em.icon;
          return (
            <button
              key={em.id}
              className={`emergency-card ${em.className}`}
              onClick={() => onSelect(em.label)}
            >
              <Icon />
              <span>{em.label}</span>
            </button>
          );
        })}

        <button 
          className={`emergency-card voice-card ${isRecording ? 'recording' : ''}`}
          onClick={handleVoiceInput}
        >
          {isRecording ? (
            <div className="voice-indicator">
              <Mic /> Listening...
            </div>
          ) : (
            <>
              <Mic />
              <span>Tap to Speak</span>
            </>
          )}
        </button>
      </div>

      {speechError && (
        <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          {speechError}
        </p>
      )}
    </>
  );
}
