// src/components/GameBoard.jsx

import React from 'react';

// Taşları render etme fonksiyonu (Aynen kalıyor)
const renderStones = (count) => {
  return Array.from({ length: count }).map((_, index) => (
    <div key={index} className="stone"></div>
  ));
};

function GameBoard({ roomData, currentUser, onPitClick }) {
  
  const { board, players, turn, status } = roomData;

  // --- Aktif Kuyu Stili (Aynen kalıyor) ---
  const getPitClassName = (pitIndex, pitOwnerRole, myPlayerRole) => {
    const isMyTurn = myPlayerRole === turn;
    const isMyPit = myPlayerRole === pitOwnerRole;
    const hasStones = board[pitIndex] > 0;

    let pitClasses = 'pit';
    
    if (isMyTurn && isMyPit && hasStones) {
      pitClasses += ' active';
    } else {
      pitClasses += ' inactive';
    }
    return pitClasses;
  };

  // --- Tıklama Yöneticisi (Aynen kalıyor) ---
  const handlePitClick = (pitIndex, pitOwnerRole, myPlayerRole) => {
    if (myPlayerRole !== turn) return;
    if (myPlayerRole !== pitOwnerRole) return;
    if (board[pitIndex] === 0) return;
    onPitClick(pitIndex);
  };

  // --- YENİ: Skor tablosu için mantık ---
  let myPlayerRole = null;
  let myName = "Siz";
  let opponentName = "Rakip";
  
  if (currentUser?.uid === players.player1.uid) {
    myPlayerRole = 'player1';
    myName = "Siz (Oyuncu 1)";
    opponentName = "Rakip (Oyuncu 2)";
  } else if (currentUser?.uid === players.player2.uid) {
    myPlayerRole = 'player2';
    myName = "Siz (Oyuncu 2)";
    opponentName = "Rakip (Oyuncu 1)";
  }

  // Durum Metni
  let statusText = '';
  if (status === 'finished') {
    const winnerRole = roomData.winner;
    let winnerName = "Berabere!";
    if (winnerRole) {
      const winnerUID = players[winnerRole].uid;
      winnerName = (winnerUID === currentUser?.uid) ? "Siz Kazandınız!" : "Rakip Kazandı!";
    }
    statusText = `Oyun Bitti: ${winnerName}`;
  } else {
    statusText = (myPlayerRole === turn) ? 'Sıra Sizde!' : 'Rakibin Sırası Bekleniyor...';
  }

  // Skorları ve isimleri rollere göre ayarla
  const P1_Info = {
    name: (myPlayerRole === 'player1') ? myName : opponentName,
    score: board.p1_treasure
  };
  const P2_Info = {
    name: (myPlayerRole === 'player2') ? myName : opponentName,
    score: board.p2_treasure
  };


  return (
    // YENİ: Referans HTML'e göre tam yapı
    <div className="game-container">
      
      {/* YENİ: Skor Tablosu */}
      <div className="game-info">
        <div className={`player-info ${turn === 'player2' ? 'active' : ''}`}>
          <div className="player-name">{P2_Info.name}</div>
          <div className="player-score">{P2_Info.score}</div>
        </div>
        
        <div className="game-status">{statusText}</div>
        
        <div className={`player-info ${turn === 'player1' ? 'active' : ''}`}>
          <div className="player-name">{P1_Info.name}</div>
          <div className="player-score">{P1_Info.score}</div>
        </div>
      </div>
      
      {/* YENİ: Oyun Tahtası Yapısı */}
      <div className="mangala-board" id="board">
        
        {/* Hazine (P2 / Rakip) - (Referans yapı: .treasure-stones ve .treasure-label) */}
        <div className="treasure treasure-left" data-index="p2_treasure">
          <div className="treasure-stones">
            {renderStones(board.p2_treasure)}
          </div>
          <div className="treasure-label">{board.p2_treasure}</div>
        </div>
        
        {/* Üst Sıra (P2 Kuyuları) - (Referans yapı: .pit-container) */}
        {['p2_6', 'p2_5', 'p2_4', 'p2_3', 'p2_2', 'p2_1'].map((pitId) => (
          <div key={pitId} className="pit-container top-row">
            <div className="pit-count">{board[pitId]}</div>
            <div 
              className={getPitClassName(pitId, 'player2', myPlayerRole)}
              data-index={pitId}
              onClick={() => handlePitClick(pitId, 'player2', myPlayerRole)}
            >
              {renderStones(board[pitId])}
            </div>
          </div>
        ))}
        
        {/* Hazine (P1 / Ben) */}
        <div className="treasure treasure-right" data-index="p1_treasure">
          <div className="treasure-stones">
            {renderStones(board.p1_treasure)}
          </div>
          <div className="treasure-label">{board.p1_treasure}</div>
        </div>
        
        {/* Alt Sıra (P1 Kuyuları) */}
        {['p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6'].map((pitId) => (
          <div key={pitId} className="pit-container bottom-row">
            <div className="pit-count">{board[pitId]}</div>
            <div 
              className={getPitClassName(pitId, 'player1', myPlayerRole)}
              data-index={pitId}
              onClick={() => handlePitClick(pitId, 'player1', myPlayerRole)}
            >
              {renderStones(board[pitId])}
            </div>
          </div>
        ))}
      </div>
      
      {/* Oda Kodunu koruyalım (estetik için) */}
      <p style={{ textAlign: 'center', opacity: 0.9, fontSize: '1.1rem', marginTop: '1.5rem' }}>
        Oda Kodu: <strong style={{color: '#fff', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px'}}>{roomData.roomId}</strong>
      </p>
    </div>
  );
}

export default GameBoard;