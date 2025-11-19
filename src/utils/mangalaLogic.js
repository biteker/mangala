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

  // Hangi yolu kullanacağımızı ve kendi hazinemizin ID'sini belirle
  const path = (currentTurn === 'player1') ? P1_PATH : P2_PATH;
  const myTreasureId = (currentTurn === 'player1') ? 'p1_treasure' : 'p2_treasure';
  const myPrefix = (currentTurn === 'player1') ? 'p1' : 'p2';
  
  // Oynanan kuyunun yoldaki index'ini bul
  let currentIndex = path.indexOf(pitId);
  
  // 1. OYNANAN KUYUDAN TAŞLARI AL
  let stonesInHand = newBoard[pitId];
  newBoard[pitId] = 0; // Oynanan kuyuyu tamamen boşalt
  
  let lastPitId = pitId; // Son taşın bırakıldığı kuyuyu takip et
  
  // 2. TAŞLARI DAĞIT
  // ÖZEL DURUM: Tek taş varsa sadece sağındaki kuyuya taşı
  if (stonesInHand === 1) {
    currentIndex = (currentIndex + 1) % path.length;
    lastPitId = path[currentIndex];
    newBoard[lastPitId]++;
    stonesInHand = 0;
  } else {
    // Birden fazla taş varsa: İlk taşı aldığın kuyuya bırak, sonra devam et
    newBoard[pitId] = 1; // İlk taşı geri koy
    stonesInHand--; // Elde kalan taş sayısını azalt
    
    while (stonesInHand > 0) {
      // Yolda bir sonraki kuyuya geç
      currentIndex = (currentIndex + 1) % path.length; 
      lastPitId = path[currentIndex];
      
      // Taşı bırak
      newBoard[lastPitId]++;
      stonesInHand--;
    }
  }

  // 3. DAĞITIM SONRASI KURALLARI KONTROL ET
  
  // KURAL 1: Son taş kendi hazinene denk geldi mi?
  if (lastPitId === myTreasureId) {
    newTurn = currentTurn; // Sıra TEKRAR sende!
  
  // KURAL 2: Son taş, RAKİP tarafındaki bir kuyuya denk geldi ve o kuyuyu ÇİFT yaptı mı?
  } else if (
    lastPitId.startsWith(myPrefix === 'p1' ? 'p2' : 'p1') && // Rakibin tarafında mı?
    !lastPitId.includes('treasure') && // Hazine değil mi?
    newBoard[lastPitId] % 2 === 0 && // Çift sayı mı oldu?
    newBoard[lastPitId] > 0 // Taş var mı?
  ) {
    // O kuyudaki TÜM taşları kap!
    const capturedStones = newBoard[lastPitId];
    newBoard[myTreasureId] += capturedStones;
    newBoard[lastPitId] = 0;
    // Sıra değişir (varsayılan 'newTurn' geçerli)
  
  // KURAL 3: Son taş, KENDİ tarafındaki BOŞ bir kuyuya denk geldi mi?
  } else if (
    lastPitId.startsWith(myPrefix) && // Kendi tarafımda mı?
    !lastPitId.includes('treasure') && // Hazine değil mi?
    newBoard[lastPitId] === 1 // Son taşı koyunca '1' mi oldu (yani önceden boştu)?
  ) {
    // Karşıdaki kuyunun taşlarını kontrol et
    const oppositePitId = OPPOSITE_PITS[lastPitId];
    const capturedStones = newBoard[oppositePitId];
    
    // Sadece karşıda taş varsa taşları al
    if (capturedStones > 0) {
      // Karşıdaki taşları hazinene ekle
      newBoard[myTreasureId] += capturedStones;
      newBoard[oppositePitId] = 0;
      
      // Kendi boş kuyuna bıraktığın son taşı da hazinene ekle
      newBoard[myTreasureId] += newBoard[lastPitId];
      newBoard[lastPitId] = 0;
    }
    // Eğer karşı kuyu boşsa, taşın yerinde kalır
  }
  
  // 4. OYUN BİTİŞ KONTROLÜ
  // Bir oyuncunun tarafındaki tüm kuyular boşaldı mı?
  
  let p1SideStones = 0;
  for (let i = 0; i < 6; i++) { 
    p1SideStones += newBoard[P1_PATH[i]]; 
  }
  
  let p2SideStones = 0;
  for (let i = 0; i < 6; i++) { 
    p2SideStones += newBoard[P2_PATH[i]]; 
  }
  
  if (p1SideStones === 0 || p2SideStones === 0) {
    newStatus = 'finished'; // Oyun bitti!
    
    // KURAL 4: Taşları ilk biten oyuncu, rakibinin kalan taşlarını alır
    if (p1SideStones === 0) {
      // Player 1'in taşları bitti, Player 1 rakibin taşlarını alır
      newBoard['p1_treasure'] += p2SideStones;
      for (let i = 0; i < 6; i++) { 
        newBoard[P2_PATH[i]] = 0; 
      }
    } else {
      // Player 2'nin taşları bitti, Player 2 rakibin taşlarını alır
      newBoard['p2_treasure'] += p1SideStones;
      for (let i = 0; i < 6; i++) { 
        newBoard[P1_PATH[i]] = 0; 
      }
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