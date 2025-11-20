// src/components/Home.jsx

import React, { useState } from 'react';
import LandingPage from './LandingPage'; // Özellik kartlarını da göstereceğiz

function Home({ createRoom, joinRoom, loading, error }) {
  
  const [joinRoomId, setJoinRoomId] = useState('');

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    joinRoom(joinRoomId);
  };

  return (
    <>
      {/* YENİ: .game-preview yerine .game-container kullanılıyor */}
      <div className="game-container" style={{ padding: '2rem', marginBottom: '3rem' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Oyuna Başla</h2>
        
        <p style={{ textAlign: 'center', opacity: 0.9, marginBottom: '2rem' }}>
          Hızlıca bir oda kur veya arkadaşının odasına katıl.
        </p>
        
        {/* YENİ: .cta-button yerine .btn kullanılıyor */}
        <button 
          className="btn" 
          style={{ width: '100%', marginBottom: '1.5rem', marginTop: 0 }}
          onClick={createRoom} 
          disabled={loading}
        >
          {loading ? "Oda Kuruluyor..." : "Yeni Oda Kur"}
        </button>

        <form 
          onSubmit={handleJoinSubmit} 
          className="join-room-form"
        >
          <input 
            type="text" 
            placeholder="Oda Kodu (5 Hane)" 
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
            maxLength={5}
            className="room-input"
          />
          {/* YENİ: .cta-button yerine .btn kullanılıyor */}
          <button 
            type="submit" 
            className="btn" 
            style={{ margin: 0, fontSize: '1rem', padding: '0.8rem 1.5rem' }}
            disabled={loading}
          >
            {loading ? "..." : "Katıl"}
          </button>
        </form>
        
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}
      </div>

      {/* Özellik Kartları (App.css'te stilleri korundu) */}
      <LandingPage />
    </>
  );
}

export default Home;