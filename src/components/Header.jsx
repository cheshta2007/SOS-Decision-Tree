import React from 'react';
import { Heart, Globe2 } from 'lucide-react';

export default function Header({ language, setLanguage, bystanderMode, setBystanderMode }) {
  return (
    <header className="app-header">
      <h1 className="app-title">SOS Assistant</h1>
      
      <div className="header-actions">
        <button 
          className="icon-btn" 
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          title="Toggle Language"
        >
          <Globe2 size={16} />
          {language === 'en' ? 'EN' : 'HI'}
        </button>
        
        <button 
          className={`icon-btn bystander-toggle ${bystanderMode ? 'active' : ''}`}
          onClick={() => setBystanderMode(!bystanderMode)}
          title="Bystander Mode"
        >
          <Heart size={16} fill={bystanderMode ? "currentColor" : "none"} />
          <span>{bystanderMode ? "Helper" : "Self"}</span>
        </button>
      </div>
    </header>
  );
}
