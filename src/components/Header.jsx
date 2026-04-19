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
          className={`icon-btn ${bystanderMode ? 'active' : ''}`}
          onClick={() => setBystanderMode(!bystanderMode)}
          style={{ 
            borderColor: bystanderMode ? 'var(--color-success)' : 'var(--bg-tertiary)',
            color: bystanderMode ? 'var(--color-success)' : 'var(--text-primary)'
          }}
          title="Bystander Mode"
        >
          <Heart size={16} />
          {bystanderMode ? "Helping Others" : "Self"}
        </button>
      </div>
    </header>
  );
}
