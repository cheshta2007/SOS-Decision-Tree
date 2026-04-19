import React, { useState } from 'react';
import Header from './components/Header';
import EmergencySelector from './components/EmergencySelector';
import DecisionTreeViewer from './components/DecisionTreeViewer';
import MapPreview from './components/MapPreview';
import StickyFooter from './components/StickyFooter';
import './App.css'; // Just in case, empty

export default function App() {
  const [language, setLanguage] = useState('en');
  const [bystanderMode, setBystanderMode] = useState(false);
  
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [voiceContext, setVoiceContext] = useState("");

  const handleEmergencySelect = (type, context = "") => {
    setActiveEmergency(type);
    setVoiceContext(context);
    // Ideally we'd log this via firebase.js `logEmergencyInteraction` here too
    // logEmergencyInteraction(type, context, null); 
  };

  const handleBack = () => {
    setActiveEmergency(null);
    setVoiceContext("");
  };

  return (
    <div className="app-container">
      <Header 
        language={language}
        setLanguage={setLanguage}
        bystanderMode={bystanderMode}
        setBystanderMode={setBystanderMode}
      />

      <main>
        {!activeEmergency ? (
          <EmergencySelector 
            onSelect={handleEmergencySelect} 
            language={language} 
          />
        ) : (
          <DecisionTreeViewer 
            emergencyType={activeEmergency} 
            voiceContext={voiceContext}
            bystanderMode={bystanderMode}
            language={language}
            onBack={handleBack}
          />
        )}

        {/* Location should always be visible or at least readily accessible */}
        <MapPreview />
      </main>

      <StickyFooter />
    </div>
  );
}
