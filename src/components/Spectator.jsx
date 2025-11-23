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
      <p>Canlı oyunları izlemek için burayı kullanın.</p>

      <section>
        <h3>Canlı Oyunlar</h3>
        {games.length === 0 && <p>Şu an canlı oyun yok.</p>}
        <ul>
          {games.map(g => (
            <li key={g.id}>{g.id} — {g.status || 'playing'}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
