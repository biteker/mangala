// src/components/Home.jsx

import React, { useState } from 'react';
import LandingPage from './LandingPage'; // Özellik kartlarını da göstereceğiz

// Bu bileşen, tüm fonksiyonları (props) App.jsx'ten alır
function Home({ createRoom, joinRoom, loading, error }) {
  
  // Odaya katılma input'u için kendi lokal state'ini yönetir
  const [joinRoomId, setJoinRoomId] = useState('');

  // Form submit edildiğinde çalışır
  const handleJoinSubmit = (e) => {
    e.preventDefault();
    joinRoom(joinRoomId); // App.jsx'teki fonksiyonu çağırır
  };

  return (
    <>
      {/* Oda Kurma ve Katılma Bölümü (mevcut 'game-preview' stilini kullanıyoruz) */}
      <div className="game-preview" style={{ padding: '2rem', marginBottom: '3rem' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Oyuna Başla</h2>
        
        <p style={{ textAlign: 'center', opacity: 0.9, marginBottom: '2rem' }}>
          Hızlıca bir oda kur veya arkadaşının odasına katıl.
        </p>
        
        {/* Yeni Oda Kur Butonu (mevcut 'cta-button' stilini kullanıyor) */}
        <button 
          className="cta-button" 
          style={{ width: '100%', marginBottom: '1.5rem' }}
          onClick={createRoom} 
          disabled={loading}
        >
          {loading ? "Oda Kuruluyor..." : "Yeni Oda Kur"}
        </button>

        {/* Odaya Katılma Formu (mevcut 'join-room-form' stilini kullanıyor) */}
        <form 
          onSubmit={handleJoinSubmit} 
          className="join-room-form" 
          style={{ justifyContent: 'center' }} // Formu ortalamak için
        >
          <input 
            type="text" 
            placeholder="Oda Kodu (5 Hane)" 
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
            maxLength={5}
            className="room-input" // App.css'den gelen stil
          />
          <button 
            type="submit" 
            className="cta-button" 
            style={{ margin: 0, fontSize: '1rem', padding: '0.8rem 1.5rem' }}
            disabled={loading}
          >
            {loading ? "..." : "Katıl"}
          </button>
        </form>
        
        {/* Hata Mesajı (mevcut 'error-message' stilini kullanıyor) */}
        {error && (
          <p 
            className="error-message" 
            style={{textAlign: 'center', marginTop: '1rem'}}
          >
            {error}
          </p>
        )}
      </div>

      {/* Özellik Kartları (Artık butonsuz) */}
      <LandingPage />
    </>
  );
}

export default Home;