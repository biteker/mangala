import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig.js';
import { collection, onSnapshot } from 'firebase/firestore';
import firestoreTournament from '../utils/firestoreTournament.js';

export default function Tournament() {
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(null);

  // Turnuvaları dinle
  useEffect(() => {
    if (!db) return;

    const col = collection(db, 'tournaments');
    const unsub = onSnapshot(
      col,
      snapshot => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setTournaments(items);
      },
      err => console.warn('Tournament subscription error:', err.message)
    );

    return () => unsub();
  }, []);

  // Seçilen turnuvanın oyuncularını dinle
  useEffect(() => {
    if (!db || !selected) return;

    const playersCol = collection(db, 'tournaments', selected, 'players');
    const unsub = onSnapshot(
      playersCol,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setPlayers(list);
      },
      err => console.warn('Players subscription error:', err.message)
    );

    return () => unsub();
  }, [selected]);

  return (
    <div className="tournament">
      <h2>Turnuva Modu</h2>
      <p>Turnuva plan ve eşleştirmeler burada gösterilecek.</p>

      {/* MEVCUT TURNUVALAR */}
      <section>
        <h3>Mevcut Turnuvalar</h3>
        {tournaments.length === 0 && <p>Henüz turnuva yok.</p>}
        <ul>
          {tournaments.map(t => (
            <li key={t.id}>
              <button onClick={() => setSelected(t.id)}>
                {t.name || t.id}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* YENİ TURNUVA OLUŞTUR */}
      <section>
        <h3>Yeni Turnuva Oluştur</h3>
        <CreateTournamentForm
          onCreate={async (id, name) => {
            try {
              if (!db) throw new Error('Firestore yok');
              await firestoreTournament.createTournament(id, { name });
              setSelected(id);
            } catch (err) {
              alert('Turnuva oluşturulamadı: ' + err.message);
            }
          }}
        />
      </section>

      {/* OYUNCULAR */}
      {selected && (
        <section>
          <h3>Oyuncular ({selected})</h3>

          {players.length === 0 && <p>Oyuncu yok.</p>}

          <ul>
            {players.map(p => (
              <li key={p.id}>
                {p.name || p.id} — {p.score ?? 0} puan
              </li>
            ))}
          </ul>

          <AddPlayerForm
            tournamentId={selected}
            onAdd={async player => {
              try {
                if (!db) throw new Error('Firestore yok');
                await firestoreTournament.addPlayer(selected, player);
              } catch (err) {
                alert('Oyuncu eklenemedi: ' + err.message);
              }
            }}
          />
        </section>
      )}
    </div>
  );
}

/* -----------------------------
   CREATE TOURNAMENT FORM
-------------------------------- */
function CreateTournamentForm({ onCreate }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (id) onCreate(id.trim(), name.trim());
      }}
    >
      <input
        placeholder="Turnuva ID"
        value={id}
        onChange={e => setId(e.target.value)}
      />
      <input
        placeholder="Turnuva adı (opsiyonel)"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button type="submit">Oluştur</button>
    </form>
  );
}

/* -----------------------------
   ADD PLAYER FORM
-------------------------------- */
function AddPlayerForm({ onAdd }) {
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (name) {
          onAdd({ name: name.trim(), score: 0 });
          setName('');
        }
      }}
    >
      <input
        placeholder="Oyuncu adı"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button type="submit">Ekle</button>
    </form>
  );
}
