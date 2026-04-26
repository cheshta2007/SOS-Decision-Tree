import React from 'react';
import { Phone, Shield, Flame } from 'lucide-react';

export default function StickyFooter() {
  return (
    <div className="sticky-footer">
      <div className="footer-inner glass">
        <button 
          className="action-btn ambulance"
          onClick={() => window.location.href = 'tel:108'}
        >
          <Phone size={20} />
          <span>Ambulance</span>
        </button>
        <button 
          className="action-btn police"
          onClick={() => window.location.href = 'tel:100'}
        >
          <Shield size={20} />
          <span>Police</span>
        </button>
        <button 
          className="action-btn fire"
          onClick={() => window.location.href = 'tel:101'}
        >
          <Flame size={20} />
          <span>Fire</span>
        </button>
      </div>
    </div>
  );
}
