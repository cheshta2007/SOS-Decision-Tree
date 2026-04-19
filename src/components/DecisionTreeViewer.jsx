import React, { useEffect, useState } from 'react';
import { Loader2, Volume2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { getEmergencyInstructions } from '../services/gemini';
import { speakText, stopSpeaking } from '../services/speech';

export default function DecisionTreeViewer({ 
  emergencyType, 
  voiceContext, 
  bystanderMode, 
  language,
  onBack 
}) {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    
    const fetchInstructions = async () => {
      setLoading(true);
      // form a context string indicating bystander and languages
      const contextStr = [
        voiceContext ? `User said: "${voiceContext}"` : '',
        bystanderMode ? 'The user is a bystander helping someone else.' : 'The user is the victim.',
        `Please respond in ${language === 'en' ? 'English' : 'Hindi'} language.`
      ].filter(Boolean).join(' ');

      const responseSteps = await getEmergencyInstructions(emergencyType, contextStr);
      
      if (active) {
        setSteps(responseSteps);
        setLoading(false);
        
        // Auto-read the critical first steps!
        if (responseSteps && responseSteps.length > 0) {
          const speakStr = responseSteps.join('. ');
          speakText(speakStr, language);
        }
      }
    };

    fetchInstructions();

    return () => {
      active = false;
      stopSpeaking();
    };
  }, [emergencyType, voiceContext, bystanderMode, language]);

  return (
    <div className="decision-view">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="icon-btn" onClick={onBack} title="Go Back">
          <ArrowLeft size={18} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle />
          Critical First 60 Seconds
        </h2>
      </div>

      {loading ? (
        <div className="ai-status">
          <Loader2 size={24} />
          <span>Analyzing situation and generating steps...</span>
        </div>
      ) : (
        <div className="critical-steps">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {emergencyType} {voiceContext ? `(${voiceContext})` : ''}
            </span>
            <button className="icon-btn" onClick={() => speakText(steps.join('. '), language)}>
              <Volume2 size={16} /> Read Aloud
            </button>
          </div>

          {steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>{idx + 1}.</span>
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
