import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, onSnapshot } from 'firebase/firestore';

/**
 * GameViewer Component
 * 
 * Belirli bir oyunun canlı izlenmesini sağlar.
 * Oyunun tahtası, oyuncu bilgileri ve tur geçmişini gösterir.
 */
export default function GameViewer({ gameId, onClose }) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db || !gameId) {
      setError('Oyun kimliği yok veya Firestore yok');
      setLoading(false);
      return;
    }

    setLoading(true);
    const gameRef = doc(db, 'games', gameId);
    
    const unsub = onSnapshot(
      gameRef,
      snapshot => {
        if (snapshot.exists()) {
          setGame({ id: snapshot.id, ...snapshot.data() });
          setError(null);
        } else {
          setError('Oyun bulunamadı');
        }
        setLoading(false);
      },
      err => {
        console.warn('Game subscription error:', err.message);
        setError('Oyun verisi alınamadı');
        setLoading(false);
      }
    );

    return () => unsub();
  }, [gameId]);

  if (loading) {
    return (
      <div className="game-viewer">
        <div className="viewer-header">
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="viewer-loading">Oyun yükleniyor...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="game-viewer">
        <div className="viewer-header">
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="viewer-error">{error || 'Oyun yüklenemedi'}</div>
      </div>
    );
  }

  return (
    <div className="game-viewer">
      <div className="viewer-header">
        <h2>Oyun #{game.id}</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="viewer-info">
        <div className="player-block">
          <div className="player-name">{game.players?.player1?.displayName || 'Oyuncu 1'}</div>
          <div className="player-score">{game.board?.p1_treasure ?? 0} puan</div>
          <div className="player-status">
            {game.turn === 'player1' ? '🔄 Sırası' : '⏳ Beklemede'}
          </div>
        </div>

        <div className="vs-divider">VS</div>

        <div className="player-block">
          <div className="player-name">{game.players?.player2?.displayName || 'Oyuncu 2'}</div>
          <div className="player-score">{game.board?.p2_treasure ?? 0} puan</div>
          <div className="player-status">
            {game.turn === 'player2' ? '🔄 Sırası' : '⏳ Beklemede'}
          </div>
        </div>
      </div>

      <div className="viewer-board">
        <div className="board-info">
          <span className="game-status">
            {game.status === 'finished' ? '✅ Oyun Bitti' : '🎮 Oyunda'}
          </span>
          {game.winner && (
            <span className="game-winner">
              🏆 Kazanan: {game.winner}
            </span>
          )}
        </div>

        {/* Mini tahta gösterimi */}
        <div className="board-grid">
          <div className="board-pit">P1: {game.board?.p1_1 ?? 0}</div>
          <div className="board-pit">P1: {game.board?.p1_2 ?? 0}</div>
          <div className="board-pit">P1: {game.board?.p1_3 ?? 0}</div>
          <div className="board-pit">P1: {game.board?.p1_4 ?? 0}</div>
          <div className="board-pit">P1: {game.board?.p1_5 ?? 0}</div>
          <div className="board-pit">P1: {game.board?.p1_6 ?? 0}</div>
          
          <div className="board-pit">P2: {game.board?.p2_1 ?? 0}</div>
          <div className="board-pit">P2: {game.board?.p2_2 ?? 0}</div>
          <div className="board-pit">P2: {game.board?.p2_3 ?? 0}</div>
          <div className="board-pit">P2: {game.board?.p2_4 ?? 0}</div>
          <div className="board-pit">P2: {game.board?.p2_5 ?? 0}</div>
          <div className="board-pit">P2: {game.board?.p2_6 ?? 0}</div>
        </div>
      </div>

      <div className="viewer-moves">
        <h3>Son Hamle</h3>
        {game.lastMove ? (
          <div className="move-info">
            <span>{game.lastMove.player} oyuncusu</span>
            <span>Kuyu {game.lastMove.pitId}</span>
          </div>
        ) : (
          <p>Henüz hamle yok</p>
        )}
      </div>
    </div>
  );
}
