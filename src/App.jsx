// src/App.jsx

import { useState, useEffect } from 'react';
import './App.css'; 

// Bileşenler
import Header from './components/Header';
import Footer from './components/Footer';
import GameBoard from './components/GameBoard';
import Home from './components/Home';
import ModeSelector from './components/ModeSelector.jsx';
import Tournament from './components/Tournament.jsx';
import Spectator from './components/Spectator.jsx';

// Firebase
import { auth, db } from './firebaseConfig'; 
import { signInAnonymously } from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';

// --- YENİ: Oyun Mantığımızı import ediyoruz ---
import { calculateMove } from './utils/mangalaLogic';
import { publishLiveGame } from './utils/firestoreSpectator.js';


function App() {
  
  // Ana State'ler (Değişiklik yok)
  const [roomData, setRoomData] = useState(null); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('game'); // 'game' | 'tournament' | 'spectator'

  // Partikül Efekti (Değişiklik yok)
  useEffect(() => {
    // ... (kod aynı)
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer.childElementCount > 0) return; 
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      particlesContainer.appendChild(particle);
    }
  }, []); 

  // Firebase Dinleyicisi (Değişiklik yok)
  useEffect(() => {
    // ... (kod aynı)
    if (!roomData?.roomId) return;
    const roomRef = doc(db, "rooms", roomData.roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log("Firebase'den oda verisi güncellendi:", docSnapshot.data());
        setRoomData(docSnapshot.data());
      } else {
        setError("Oda bulunamadı veya silindi.");
        setRoomData(null); 
      }
    });
    return () => unsubscribe();
  }, [roomData?.roomId]); 


  // Firebase Fonksiyonları (createRoom, joinRoom, getAnonUser)
  // ... (kod aynı, burada göstermeye gerek yok)
  const getAnonUser = async () => { /* ... (öncekiyle aynı) ... */ 
    if (user) return user;
    try {
      const userCredential = await signInAnonymously(auth);
      const anonUser = userCredential.user;
      setUser(anonUser);
      console.log("Misafir kullanıcı giriş yaptı:", anonUser.uid);
      return anonUser;
    } catch (error) {
      console.error("Misafir girişi hatası:", error);
      setError("Giriş yapılırken bir hata oluştu.");
      return null;
    }
  };
  const createRoom = async () => { /* ... (öncekiyle aynı) ... */ 
    setLoading(true);
    setError(null);
    try {
      const currentUser = await getAnonUser();
      if (!currentUser) return;
      const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
      const newRoomData = {
        roomId: roomId, status: "waiting", createdAt: serverTimestamp(),
        players: {
          player1: { uid: currentUser.uid, displayName: "Misafir 1" },
          player2: { uid: null, displayName: null }
        },
        turn: "player1",
        board: { 
          p1_1: 4, p1_2: 4, p1_3: 4, p1_4: 4, p1_5: 4, p1_6: 4, p1_treasure: 0,
          p2_1: 4, p2_2: 4, p2_3: 4, p2_4: 4, p2_5: 4, p2_6: 4, p2_treasure: 0
        },
        winner: null, lastMove: null
      };
      const roomRef = doc(db, "rooms", roomId);
      await setDoc(roomRef, newRoomData);
      
      // Spectator'a da yayınla
      try {
        await publishLiveGame(roomId, newRoomData);
      } catch (err) {
        console.warn('Live game publish failed:', err.message);
      }
      
      setRoomData(newRoomData); 
    } catch (error) {
      console.error("Oda kurulurken hata oluştu:", error);
      setError("Oda kurulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  const joinRoom = async (roomIdToJoin) => { /* ... (öncekiyle aynı) ... */ 
    if (!roomIdToJoin || roomIdToJoin.length < 5) {
      setError("Geçerli bir Oda Kodu girmelisiniz (5 karakter).");
      return;
    }
    setLoading(true);
    setError(null);
    const roomId = roomIdToJoin.toUpperCase();
    try {
      const roomRef = doc(db, "rooms", roomId);
      const roomSnapshot = await getDoc(roomRef);
      if (!roomSnapshot.exists()) {
        setError("Oda bulunamadı. Kodu kontrol edin.");
        setLoading(false); return;
      }
      const currentRoomData = roomSnapshot.data();
      if (currentRoomData.status !== 'waiting') {
        setError("Bu oda şu anda dolu veya oyun çoktan başladı.");
        setLoading(false); return;
      }
      const currentUser = await getAnonUser();
      if (!currentUser) return;
      if (currentRoomData.players.player1.uid === currentUser.uid) {
         setRoomData(currentRoomData); 
         setLoading(false); return;
      }
      const player2Data = { uid: currentUser.uid, displayName: "Misafir 2" };
      await updateDoc(roomRef, {
        'players.player2': player2Data, 'status': 'playing'
      });
      const updatedRoomData = {
        ...currentRoomData, status: 'playing',
        players: { ...currentRoomData.players, player2: player2Data }
      };
      
      // Spectator'a da yayınla (oyun başladı)
      try {
        await publishLiveGame(roomId, updatedRoomData);
      } catch (err) {
        console.warn('Live game publish failed:', err.message);
      }
      
      setRoomData(updatedRoomData); 
    } catch (error) {
      console.error("Odaya katılırken hata oluştu:", error);
      setError("Odaya katılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // --- HAMLE YAPMA FONKSİYONU (GÜNCELLENDİ) ---
  const handleMove = async (pitId) => {
    // 0. Çifte tıklamayı veya sıra dışı hamleyi engelle
    // (GameBoard'da zaten kontrol var ama bu ekstra güvenlik)
    const myRole = (user.uid === roomData.players.player1.uid) ? 'player1' : 'player2';
    if (loading || roomData.turn !== myRole || roomData.status !== 'playing') {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. OYUN MANTIĞINI (İSTEMCİDE) HESAPLA
      // (Daha sonra bu mantığı Cloud Function'a taşıyabiliriz)
      const { newBoard, newTurn, newStatus, newWinner } = calculateMove(
        roomData.board, 
        roomData.turn, 
        pitId
      );
      
      // 2. YENİ DURUMU FIREBASE'E GÖNDER
      const roomRef = doc(db, "rooms", roomData.roomId);
      const updatePayload = {
        board: newBoard,
        turn: newTurn,
        status: newStatus,
        winner: newWinner,
        lastMove: { // Sadece debug/izleme için
          player: myRole,
          pitId: pitId
        }
      };
      await updateDoc(roomRef, updatePayload);
      
      // Spectator'a da yayınla (oyun güncellendi)
      try {
        await publishLiveGame(roomData.roomId, { ...roomData, ...updatePayload });
      } catch (err) {
        console.warn('Live game update failed:', err.message);
      }
      
      // 3. EKRAN GÜNCELLEMESİ
      // Biz hiçbir şey yapmıyoruz! 'onSnapshot' dinleyicimiz (yukarıda)
      // bu 'updateDoc' komutunu algılayacak ve 'roomData' state'ini
      // *her iki oyuncu için de* otomatik olarak güncelleyecek.
      
    } catch (err) {
      console.error("Hamle yapılırken hata:", err);
      setError("Hamle yapılamadı. Bağlantıyı kontrol edin.");
    } finally {
      // 'onSnapshot' veriyi güncelledikten sonra 'loading'i false yapmak
      // daha iyi olabilir, ancak şimdilik hız için 'finally' yeterli.
      setLoading(false); 
    }
  };


  // --- RENDER (GÖRÜNÜM) (Değişiklik yok) ---
  return (
    <>
      <div className="particles" id="particles"></div>
      
      <Header />

      <main>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <ModeSelector currentMode={mode} onModeChange={setMode} />
        </div>

        {mode === 'game' && (
          !roomData ? (
            <Home 
              createRoom={createRoom}
              joinRoom={joinRoom}
              loading={loading}
              error={error}
            />
          ) : (
            <GameBoard 
              roomData={roomData}
              currentUser={user}
              onPitClick={handleMove}
            />
          )
        )}

        {mode === 'tournament' && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Tournament />
          </div>
        )}

        {mode === 'spectator' && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Spectator />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;