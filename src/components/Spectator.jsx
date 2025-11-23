import React, { useEffect, useState } from 'react';
import firestoreSpectator from '../utils/firestoreSpectator.js';

export default function Spectator() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    let unsub = null;
    try {
      unsub = firestoreSpectator.subscribeLiveGames(list => setGames(list));
    } catch (err) {
      console.warn('Spectator subscription failed:', err.message);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return (
    <div className="spectator">
      <h2>İzleyici Modu</h2>
      <p>Canlı oyunları izlemek ve sonuçlarını takip etmek için burayı kullanın.</p>

      <section>
        <h3>🎮 Canlı Oyunlar</h3>
        {games.length === 0 ? (
          <div className="empty-state">
            <p>Şu an canlı oyun yok. Lütfen daha sonra tekrar deneyin.</p>
          </div>
        ) : (
          <ul className="game-list">
            {games.map(g => (
              <li key={g.id} className="game-item">
                <div className="game-item-info">
                  <strong>Oyun ID: {g.id}</strong>
                  <small>Durum: {g.status || 'Oyunda'}</small>
                  {g.players && (
                    <small>
                      {g.players.player1?.displayName || 'Oyuncu 1'} vs{' '}
                      {g.players.player2?.displayName || 'Beklemede'}
                    </small>
                  )}
                </div>
                <button onClick={() => alert('İzlemeye başla: ' + g.id)}>
                  İzle →
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
