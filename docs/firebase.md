```
// Doküman ID: "AB12C" (Oda Kodu)
{
  // --- Temel Oda Bilgileri ---
  "roomId": "AB12C",
  "status": "waiting", 
  // Olası durumlar: 
  // "waiting" -> 1. oyuncu katıldı, 2. oyuncu bekleniyor
  // "playing" -> Oyun başladı, 2 oyuncu da odada
  // "finished" -> Oyun bitti

  "createdAt": "2025-10-23T18:00:00Z", // Odanın ne zaman oluşturulduğu (Firestore Timestamp)
  
  // --- Oyuncu Bilgileri ---
  "players": {
    "player1": {
      "uid": "anon_user_uid_123",  // Firebase Auth'tan gelen anonim kullanıcı ID'si
      "displayName": "Misafir 1"
    },
    "player2": {
      "uid": null, // 2. oyuncu henüz katılmadı
      "displayName": null
    }
  },

  // --- Oyunun Durumu (Game State) ---
  "turn": "player1", // Sıranın kimde olduğunu belirtir ("player1" veya "player2")

  "board": {
    // Mangala tahtasının durumu. 
    // player1'in kuyuları (p1_1, p1_2 ... p1_6)
    // player1'in hazinesi (p1_treasure)
    // player2'nin kuyuları (p2_1, p2_2 ... p2_6)
    // player2'nin hazinesi (p2_treasure)
    "p1_1": 4,
    "p1_2": 4,
    "p1_3": 4,
    "p1_4": 4,
    "p1_5": 4,
    "p1_6": 4,
    "p1_treasure": 0,
    
    "p2_1": 4,
    "p2_2": 4,
    "p2_3": 4,
    "p2_4": 4,
    "p2_5": 4,
    "p2_6": 4,
    "p2_treasure": 0
  },

  // --- Oyun Sonucu (Oyun bitince doldurulur) ---
  "winner": null // "player1", "player2" veya "draw" (berabere)
}
```