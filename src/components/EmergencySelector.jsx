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
      return;
    }
    
    setIsRecording(true);
    setSpeechError("");

    startListening(
      (transcript) => {
        setIsRecording(false);
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
    <div className="selector-view">
      <div className="selector-header">
        <h2 className="section-title">Emergency Response</h2>
        <p className="subtitle">Select incident type or describe the situation</p>
      </div>
      
      <div className="emergency-grid">
        {emergencies.map((em) => {
          const Icon = em.icon;
          return (
            <button
              key={em.id}
              className={`emergency-card ${em.className}`}
              onClick={() => onSelect(em.label)}
            >
              <div className="icon-wrapper">
                <Icon size={32} />
              </div>
              <span className="card-label">{em.label}</span>
            </button>
          );
        })}

        <button 
          className={`emergency-card voice-card ${isRecording ? 'recording listening' : ''}`}
          onClick={handleVoiceInput}
        >
          <div className="icon-wrapper">
            <Mic size={32} />
          </div>
          <span className="card-label">
            {isRecording ? "Listening..." : "Describe Situation"}
          </span>
          {isRecording && <div className="voice-wave"></div>}
        </button>
      </div>

      {speechError && (
        <div className="error-toast">
          <ShieldAlert size={16} />
          <span>{speechError}</span>
        </div>
      )}
    </div>
  );
}
