import React from 'react';
import { Phone, Shield, Flame } from 'lucide-react';

export default function StickyFooter() {
  return (
    <div className="sticky-footer">
      <div className="footer-inner">
        <button 
          className="action-btn btn-ambulance"
          onClick={() => window.location.href = 'tel:108'}
        >
          <Phone />
          Ambulance
        </button>
        <button 
          className="action-btn btn-police"
          onClick={() => window.location.href = 'tel:100'}
        >
          <Shield />
          Police
        </button>
        <button 
          className="action-btn btn-fire"
          onClick={() => window.location.href = 'tel:101'}
        >
          <Flame />
          Fire
        </button>
      </div>
    </div>
  );
}
