import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Volume2, AlertTriangle, ArrowLeft, ChevronDown, ChevronUp, Mic } from 'lucide-react';
import { getEmergencyInstructions } from '../services/gemini';
import { speakText, stopSpeaking, startListening } from '../services/speech';

export default function DecisionTreeViewer({ 
  emergencyType, 
  voiceContext, 
  bystanderMode, 
  language,
  onBack 
}) {
  const [instructionData, setInstructionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSecondary, setShowSecondary] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimVoiceContext, setInterimVoiceContext] = useState("");
  const recognitionRef = useRef(null);

  const fetchInstructions = async (ctx = "") => {
    setLoading(true);
    const contextStr = [
      ctx ? `Recent update: "${ctx}"` : '',
      voiceContext ? `User context: "${voiceContext}"` : '',
      bystanderMode ? 'The user is a bystander helping someone else.' : 'The user is the victim.',
      `Target language: ${language === 'en' ? 'English' : 'Hindi'}.`
    ].filter(Boolean).join(' ');

    const data = await getEmergencyInstructions(emergencyType, contextStr);
    
    setInstructionData(data);
    setLoading(false);
    
    if (data && data.immediateActions) {
      const speakStr = [
        `Severity level: ${data.severity}.`,
        "Immediate actions:",
        ...data.immediateActions.slice(0, 3)
      ].join('. ');
      speakText(speakStr, language);
    }
  };

  useEffect(() => {
    fetchInstructions();
    return () => stopSpeaking();
  }, [emergencyType, bystanderMode, language]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognitionRef.current = startListening(
      (transcript) => {
        setIsListening(false);
        setInterimVoiceContext(transcript);
        fetchInstructions(transcript);
      },
      (error) => {
        console.error(error);
        setIsListening(false);
      },
      language
    );
  };

  return (
    <div className="decision-view">
      <div className="viewer-header">
        <button className="icon-btn back-btn" onClick={onBack} title="Go Back">
          <ArrowLeft size={20} />
        </button>
        <div className="header-text">
          <h2 className="title-emergency">
            {emergencyType} Assistance
          </h2>
          {instructionData && (
            <span className={`severity-badge ${instructionData.severity?.toLowerCase()}`}>
              {instructionData.severity} Severity
            </span>
          )}
        </div>
        <button 
          className={`mic-btn ${isListening ? 'listening' : ''}`} 
          onClick={toggleListening}
          title="Speak to update"
        >
          {isListening ? <Loader2 className="animate-spin" /> : <Mic size={20} />}
          {isListening && <span className="mic-status">Listening...</span>}
        </button>
      </div>

      {loading ? (
        <div className="ai-status">
          <Loader2 className="loading-spinner" size={32} />
          <span>Synchronizing with emergency response protocol...</span>
        </div>
      ) : (
        <div className="instructions-container">
          <div className="instruction-section">
            <div className="section-title-bar">
              <h3>Immediate Actions</h3>
              <button className="read-btn" onClick={() => speakText(instructionData?.immediateActions.join('. '), language)}>
                <Volume2 size={16} /> Read
              </button>
            </div>
            <div className="steps-grid">
              {instructionData?.immediateActions.map((step, idx) => (
                <div key={idx} className="step-card critical">
                  <div className="step-number">{idx + 1}</div>
                  <p className="step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {instructionData?.secondaryMeasures?.length > 0 && (
            <div className={`instruction-section secondary-section ${showSecondary ? 'expanded' : ''}`}>
              <button 
                className="expand-toggle" 
                onClick={() => setShowSecondary(!showSecondary)}
              >
                <span>Additional Safety Measures</span>
                {showSecondary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              {showSecondary && (
                <div className="steps-grid secondary-steps">
                  {instructionData.secondaryMeasures.map((measure, idx) => (
                    <div key={idx} className="step-card secondary">
                      <p className="step-text">{measure}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {instructionData?.followUpQuestions?.length > 0 && (
            <div className="follow-up-section">
              <p className="hint-text">Potential situational assessments:</p>
              <div className="questions-list">
                {instructionData.followUpQuestions.map((q, idx) => (
                  <div key={idx} className="question-tag">{q}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
