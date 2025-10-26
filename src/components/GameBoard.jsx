// src/components/GameBoard.jsx

import React from 'react';

// Bileşen artık 'roomData' (odanın tüm verisi), 'currentUser' (ben kimim?)
// ve 'onPitClick' (hamle fonksiyonu) prop'larını alıyor.
function GameBoard({ roomData, currentUser, onPitClick }) {
  
  const board = roomData.board; // Tahta durumu (p1_1: 4, ...)
  const players = roomData.players;
  const currentTurnPlayerId = roomData.turn; // 'player1' veya 'player2'

  // "Ben" (bu tarayıcıdaki kullanıcı) Player 1 miyim yoksa Player 2 mi?
  let myPlayerRole = null;
  if (currentUser?.uid === players.player1.uid) {
    myPlayerRole = 'player1';
  } else if (currentUser?.uid === players.player2.uid) {
    myPlayerRole = 'player2';
  }

  // --- Deklaratif Taş Render Etme ---
  const renderStones = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={index} className="stone"></div>
    ));
  };

  // --- Tıklama Yöneticisi ---
  const handlePitClick = (pitIndex, pitOwnerRole) => {
    // 1. Sıra bende mi? (Rolüm, sıradaki rolle eşleşiyor mu?)
    if (myPlayerRole !== currentTurnPlayerId) return;

    // 2. Kendi kuyuma mı tıkladım?
    if (myPlayerRole !== pitOwnerRole) return;

    // 3. Kuyu boş mu?
    if (board[pitIndex] === 0) return;

    // Kontroller tamamsa, App.jsx'e hamleyi bildir
    onPitClick(pitIndex);
  };

  // --- Aktif/İnaktif Kuyu Stili ---
  const getPitClassName = (pitIndex, pitOwnerRole) => {
    const isMyTurn = myPlayerRole === currentTurnPlayerId;
    const isMyPit = myPlayerRole === pitOwnerRole;
    const hasStones = board[pitIndex] > 0;

    let pitClasses = 'pit';
    
    // CSS Grid (sizin tasarımınız) için sıra sınıfları
    if (pitOwnerRole === 'player2') pitClasses += ' top-row';
    if (pitOwnerRole === 'player1') pitClasses += ' bottom-row';

    // Tıklanabilirlik
    if (isMyTurn && isMyPit && hasStones) {
      pitClasses += ' active';
    } else {
      pitClasses += ' inactive';
    }

    return pitClasses;
  };

  // --- Sıra Göstergesi Metni ---
  let turnText, turnStyle;
  if (roomData.status === 'finished') {
    // Kazananı belirle
    const winnerRole = roomData.winner;
    let winnerName = "Berabere!";
    if (winnerRole) {
      const winnerUID = players[winnerRole].uid;
      winnerName = (winnerUID === currentUser?.uid) ? "Siz Kazandınız!" : "Rakip Kazandı!";
    }
    turnText = `Oyun Bitti: ${winnerName}`;
    turnStyle = { background: 'rgba(255, 193, 7, 0.3)' };

  } else if (currentTurnPlayerId === myPlayerRole) {
    turnText = 'Sıra Sizde!';
    turnStyle = { background: 'rgba(76, 175, 80, 0.3)' };
  } else {
    turnText = 'Rakibin Sırası Bekleniyor...';
    turnStyle = { background: 'rgba(33, 150, 243, 0.3)' };
  }


  return (
    <div className="game-preview">
      {/* Sıra Göstergesi */}
      <div className="turn-indicator" style={turnStyle}>
        {turnText}
      </div>
      
      {/* Oyun Tahtası */}
      <div className="mangala-board" id="board">
        {/* Hazine (P2 / Rakip) */}
        <div className="treasure treasure-left" data-index="p2_treasure">
          {renderStones(board.p2_treasure)}
        </div>
        
        {/* Üst Sıra (P2 Kuyuları: p2_6'dan p2_1'e TERS) */}
        {['p2_6', 'p2_5', 'p2_4', 'p2_3', 'p2_2', 'p2_1'].map((pitId) => (
          <div 
            key={pitId} 
            className={getPitClassName(pitId, 'player2')}
            data-index={pitId}
            onClick={() => handlePitClick(pitId, 'player2')}
          >
            {renderStones(board[pitId])}
          </div>
        ))}
        
        {/* Hazine (P1 / Ben) */}
        <div className="treasure treasure-right" data-index="p1_treasure">
          {renderStones(board.p1_treasure)}
        </div>
        
        {/* Alt Sıra (P1 Kuyuları: p1_1'den p1_6'ya) */}
        {['p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6'].map((pitId) => (
          <div 
            key={pitId} 
            className={getPitClassName(pitId, 'player1')}
            data-index={pitId}
            onClick={() => handlePitClick(pitId, 'player1')}
          >
            {renderStones(board[pitId])}
          </div>
        ))}
      </div>
      
      <p style={{ textAlign: 'center', opacity: 0.9, fontSize: '1.1rem' }}>
        Oda Kodu: <strong style={{color: '#fff', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px'}}>{roomData.roomId}</strong>
      </p>
    </div>
  );
}

export default GameBoard;