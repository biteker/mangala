// src/components/LandingPage.jsx

import React from 'react';

function LandingPage() {
  return (
    // 'features' div'i tüm kartları sarmalı
    <div className="features">
      <div className="feature-card">
        <div className="feature-icon">🌐</div>
        <h3>Online Çok Oyunculu</h3>
        <p>Arkadaşlarınla veya dünyanın her yerinden oyuncularla gerçek zamanlı oyna</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🤖</div>
        <h3>Yapay Zeka Rakip</h3>
        <p>Farklı zorluk seviyelerinde AI ile pratik yap ve stratejini geliştir</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">📱</div>
        <h3>Her Cihazda Çalışır</h3>
        <p>Telefon, tablet veya bilgisayardan sorunsuz oyun deneyimi</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🏆</div>
        <h3>Sıralama Sistemi</h3>
        <p>Küresel lider tablosunda yüksel ve en iyi oyuncular arasına katıl</p>
      </div>
      
      {/* "Yakında Yayında" butonu buradan kaldırıldı. */}
    </div>
  );
}

export default LandingPage;