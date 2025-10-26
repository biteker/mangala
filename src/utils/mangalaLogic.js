// src/utils/mangalaLogic.js

// --- YARDIMCI SABİTLER (CONSTANTS) ---

// Player 1'in taş dağıtma yolu (Rakibin hazinesini atlar)
const P1_PATH = [
  'p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6', 
  'p1_treasure', // Kendi hazinesi
  'p2_1', 'p2_2', 'p2_3', 'p2_4', 'p2_5', 'p2_6'
  // p2_treasure'ı atlar
];

// Player 2'nin taş dağıtma yolu (Rakibin hazinesini atlar)
const P2_PATH = [
  'p2_1', 'p2_2', 'p2_3', 'p2_4', 'p2_5', 'p2_6',
  'p2_treasure', // Kendi hazinesi
  'p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6'
  // p1_treasure'ı atlar
];

// Hangi kuyunun karşısında hangi kuyu var? (Taş kapma kuralı için)
// ÖNEMLİ: Mangala'da p1_1'in karşılığı p2_6'dır (ters).
const OPPOSITE_PITS = {
  'p1_1': 'p2_6', 'p1_2': 'p2_5', 'p1_3': 'p2_4', 'p1_4': 'p2_3', 'p1_5': 'p2_2', 'p1_6': 'p2_1',
  'p2_1': 'p1_6', 'p2_2': 'p1_5', 'p2_3': 'p1_4', 'p2_4': 'p1_3', 'p2_5': 'p1_2', 'p2_6': 'p1_1',
};

// --- ANA HESAPLAMA FONKSİYONU ---

/**
 * Bir hamlenin sonucunu hesaplar.
 * @param {object} currentBoard - Mevcut tahta durumu (örn: {p1_1: 4, ...})
 * @param {'player1' | 'player2'} currentTurn - Sıranın kimde olduğu
 * @param {string} pitId - Oynanan kuyunun ID'si (örn: "p1_3")
 * @returns {object} { newBoard, newTurn, newStatus, newWinner }
 */
export function calculateMove(currentBoard, currentTurn, pitId) {
  // Değişiklik yapacağımız için mevcut tahtanın bir KOPYASINI alıyoruz
  const newBoard = { ...currentBoard };
  
  // Varsayılan olarak sıra değişecek, ancak kurallar bunu geçersiz kılabilir
  let newTurn = (currentTurn === 'player1') ? 'player2' : 'player1';
  let newStatus = 'playing';
  let newWinner = null;

  // 1. OYNANAN KUYUDAN TAŞLARI AL
  let stonesInHand = newBoard[pitId];
  newBoard[pitId] = 0; // Oynanan kuyuyu boşalt

  // 2. TAŞLARI DAĞIT
  
  // Hangi yolu kullanacağımızı ve kendi hazinemizin ID'sini belirle
  const path = (currentTurn === 'player1') ? P1_PATH : P2_PATH;
  const myTreasureId = (currentTurn === 'player1') ? 'p1_treasure' : 'p2_treasure';
  
  // Oynanan kuyunun yoldaki index'ini bul
  let currentIndex = path.indexOf(pitId);
  let lastPitId = pitId; // Son taşın bırakıldığı kuyuyu takip et

  while (stonesInHand > 0) {
    // Yolda bir sonraki kuyuya geç
    currentIndex = (currentIndex + 1) % path.length; 
    lastPitId = path[currentIndex];
    
    // Taşı bırak
    newBoard[lastPitId]++;
    stonesInHand--;
  }

  // 3. DAĞITIM SONRASI KURALLARI KONTROL ET

  // Kural 1: Son taş kendi hazinene denk geldi.
  if (lastPitId === myTreasureId) {
    newTurn = currentTurn; // Sıra TEKRAR sende!
  
  // Kural 2: Son taş, KENDİ tarafındaki BOŞ bir kuyuya denk geldi.
  } else if (
    OPPOSITE_PITS[lastPitId] && // Hazine değil, normal bir kuyu mu?
    path.includes(lastPitId) && // Benim tarafımda mı? (Hazine değilse ve path'teyse öyledir)
    currentTurn === lastPitId.substring(0, 2) && // 'p1' veya 'p2' ID'si benimle aynı mı?
    newBoard[lastPitId] === 1 // O kuyuya son taşı koyunca '1' mi oldu (yani boştu)?
  ) {
    // Karşıdaki kuyunun taşlarını kap!
    const oppositePitId = OPPOSITE_PITS[lastPitId];
    const capturedStones = newBoard[oppositePitId];
    
    if (capturedStones > 0) {
      newBoard[myTreasureId] += capturedStones; // Karşıdaki taşları hazinene ekle
      newBoard[oppositePitId] = 0; // Karşıyı boşalt
      
      // Kendi son taşını da hazinene ekle
      newBoard[myTreasureId] += 1; 
      newBoard[lastPitId] = 0;
    }
    // Sıra değişir (varsayılan 'newTurn' geçerli)
    
  // Kural 3: Son taş, RAKİP tarafındaki bir kuyuya denk geldi ve o kuyuyu ÇİFT yaptı.
  } else if (
    OPPOSITE_PITS[lastPitId] && // Hazine değil, normal bir kuyu mu?
    currentTurn !== lastPitId.substring(0, 2) // Rakibin tarafında mı?
  ) {
    if (newBoard[lastPitId] % 2 === 0) { // O kuyudaki taş sayısı çift mi oldu?
      // O kuyudaki TÜM taşları kap!
      const capturedStones = newBoard[lastPitId];
      newBoard[myTreasureId] += capturedStones;
      newBoard[lastPitId] = 0;
    }
    // Sıra değişir (varsayılan 'newTurn' geçerli)
    
  }
  // Kural 4: (Diğer tüm durumlar) - Son taş kendi tarafında dolu bir kuyuya denk geldi.
  // Hiçbir şey yapma, sıra değişir (varsayılan 'newTurn' geçerli).


  // 4. OYUN BİTİŞ KONTROLÜ
  // Bir oyuncunun tarafındaki tüm kuyular boşaldı mı?
  
  let p1SideStones = 0;
  for (let i = 0; i < 6; i++) { p1SideStones += newBoard[P1_PATH[i]]; } // p1_1'den p1_6'ya

  let p2SideStones = 0;
  for (let i = 0; i < 6; i++) { p2SideStones += newBoard[P2_PATH[i]]; } // p2_1'den p2_6'ya

  if (p1SideStones === 0 || p2SideStones === 0) {
    newStatus = 'finished'; // Oyun bitti!

    // Kalan tüm taşlar rakibin hazinesine gider.
    if (p1SideStones === 0) {
      // P2'nin kalan taşlarını P2'nin hazinesine taşı
      newBoard['p2_treasure'] += p2SideStones;
      for (let i = 0; i < 6; i++) { newBoard[P2_PATH[i]] = 0; }
    } else {
      // P1'in kalan taşlarını P1'in hazinesine taşı
      newBoard['p1_treasure'] += p1SideStones;
      for (let i = 0; i < 6; i++) { newBoard[P1_PATH[i]] = 0; }
    }
    
    // Kazananı belirle
    if (newBoard['p1_treasure'] > newBoard['p2_treasure']) {
      newWinner = 'player1';
    } else if (newBoard['p2_treasure'] > newBoard['p1_treasure']) {
      newWinner = 'player2';
    } else {
      newWinner = 'draw'; // Berabere
    }
  }

  // 5. YENİ DURUMU DÖNDÜR
  return { newBoard, newTurn, newStatus, newWinner };
}