/**
 * Mangala Oyunu - Temel Oyun Mantığı
 * 
 * Bu modül, Mangala oyununun 4 temel kuralını uygulamaktadır:
 * 1. Taş dağıtma (Kural 1)
 * 2. Rakip kuyusunda çift taş bulma ve alma (Kural 2)
 * 3. Kendi boş kuyuda bitme ve karşı kuyu alma (Kural 3)
 * 4. Oyun bitişi ve kalan taşları alma (Kural 4)
 * 
 * Kaynağı: /home/biteker/Documents/mangala/.github/instructions/Mangalarules.instructions.md
 * 
 * İçeri aktarılan sabitler: gameConstants.js'den
 * - P1_PATH: Player 1'in taş dağıtım yolu
 * - P2_PATH: Player 2'nin taş dağıtım yolu
 * - OPPOSITE_PITS: Karşılıklı kuyu eşlemesi
 */

// Constants import (PR 0.1'de oluşturulmuş)
import { P1_PATH, P2_PATH, OPPOSITE_PITS } from './gameConstants.js';

/**
 * Oyuncuya ait olan path ve hazine bilgilerini döndür
 * 
 * @param {string} player - 'player1' veya 'player2'
 * @returns {{
 *   path: string[],
 *   treasureId: string,
 *   prefix: string,
 *   opponentPrefix: string
 * }} Oyuncu bilgileri
 * 
 * @throws {Error} Geçersiz oyuncu parametresi
 * 
 * @example
 * const info = getPlayerInfo('player1');
 * // returns { path: P1_PATH, treasureId: 'p1_treasure', prefix: 'p1', opponentPrefix: 'p2' }
 */
function getPlayerInfo(player) {
  if (player !== 'player1' && player !== 'player2') {
    throw new Error('Invalid player: must be "player1" or "player2"');
  }
  return {
    path: player === 'player1' ? P1_PATH : P2_PATH,
    treasureId: player === 'player1' ? 'p1_treasure' : 'p2_treasure',
    prefix: player === 'player1' ? 'p1' : 'p2',
    opponentPrefix: player === 'player1' ? 'p2' : 'p1'
  };
}

/**
 * Verilen path'ten küçük kuyuları (ilk 6) döndür
 * 
 * Mangala oyununda her oyuncunun 6 küçük kuyusu ve 1 hazinesi vardır.
 * Bu fonksiyon sadece küçük kuyuları extrac eder.
 * 
 * @param {string[]} path - Oyuncunun tam path'i (6 küçük kuyu + hazine + rakip 6 kuyu)
 * @returns {string[]} İlk 6 pit ID'si (küçük kuyular)
 * 
 * @example
 * const smallPits = getSmallPits(P1_PATH);
 * // returns ['p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6']
 */
function getSmallPits(path) {
  return path.slice(0, 6);
}

/**
 * Belirli bir path'teki tüm küçük kuyulardaki taş sayısını hesapla
 * 
 * Kural 4'ü destekler: oyun bitişi kontrolü için kullanılır.
 * Eğer sonuç 0 ise, o oyuncunun tarafı boştur ve oyun biter.
 * 
 * @param {Object} board - Tahta objesi { pitId: stoneCount }
 * @param {string[]} path - Oyuncunun path'i
 * @returns {number} Küçük kuyulardaki toplam taş sayısı
 * 
 * @example
 * sideStonesCount(board, P1_PATH) // returns 5 (örneğin p1 tarafında 5 taş kaldı)
 */
function sideStonesCount(board, path) {
  return getSmallPits(path).reduce((sum, pitId) => sum + (board[pitId] || 0), 0);
}

/**
 * Taşları oyuncu path'i boyunca dağıt (KURAL 1)
 * 
 * Mangala'nın 1. temel kuralını uygular:
 * - Tek taş: başlangıç kuyusunu atlar, bir sonraki kuyudan başlar
 * - Çok taş: başlangıç kuyusundan başlayarak her kuyuya birer birer koyar
 * 
 * UYARI: Bu fonksiyon tahta objesi'ni doğrudan modifiye eder (in-place mutation).
 * 
 * @param {Object} board - Tahta objesi (doğrudan modifiye edilir)
 * @param {string[]} path - Dağıtımın yapılacağı path
 * @param {number} startIndex - Başlangıç kuyusunun path'teki indeksi
 * @param {number} stonesInHand - Dağıtılacak taş sayısı
 * 
 * @returns {{
 *   lastPitId: string|null,
 *   lastIndex: number
 * }} Son taşın konduğu pit'in ID'si ve indeksi
 * 
 * @example
 * // 4 taş p1_1'den başlayarak dağıt
 * const result = distributeStones(board, P1_PATH, 0, 4);
 * // p1_1 (index 0) → p1_2 (index 1) → p1_3 (index 2) → p1_4 (index 3)
 * // result.lastPitId = 'p1_4', result.lastIndex = 3
 */
function distributeStones(board, path, startIndex, stonesInHand) {
  if (stonesInHand <= 0) return { lastPitId: null };

  // Tek taş durumunda başlangıç kuyusunu atla (KURAL 1 — tek taş kaidesi)
  if (stonesInHand === 1) {
    const idx = (startIndex + 1) % path.length;
    const pitId = path[idx];
    board[pitId] = (board[pitId] || 0) + 1;
    return { lastPitId: pitId, lastIndex: idx };
  }

  // Çok taş: alınan kuyudan başlayarak sırayla koy (KURAL 1 — çok taş kaidesi)
  // Davranış: eğer birden fazla taş varsa, ilk taş alınan kuyunun
  // kendisine geri koyulur (startIndex). Bu, bazı Mangala varyantlarında
  // beklenen davranıştır.
  let lastIndex = startIndex;
  for (let i = 0; i < stonesInHand; i++) {
    const idx = (startIndex + i) % path.length;
    const pitId = path[idx];
    board[pitId] = (board[pitId] || 0) + 1;
    lastIndex = idx;
  }

  return { lastPitId: path[lastIndex], lastIndex };
}

/**
 * Kural 2: Rakip kuyusunda çift taş bulma
 * 
 * Son taş rakibinin bölgesinde bir kuyuya denk gelirse ve o kuyudaki
 * taş sayısı çift ise (2, 4, 6, 8 vb.), tüm taşları ve son taşı alır.
 * 
 * Kaynağı: Mangalarules.instructions.md - "2.TEMEL KURAL"
 * 
 * @param {Object} board - Tahta objesi (modifiye edilir)
 * @param {string} lastPitId - Son taşın konduğu pit'in ID'si
 * @param {Object} playerInfo - getPlayerInfo()'den dönen oyuncu bilgileri
 * 
 * @returns {boolean} Taş alıp almadığı (true = başarılı capture, false = capture olmadı)
 * 
 * @example
 * // Rakip p2_3'ünde 4 taş varsa, tümünü al
 * const captured = tryCaptureOpponentEven(board, 'p2_3', playerInfo);
 * // captured = true, p2_3'ü sıfırla, p1_treasure'a 4 taş ekle
 */
function tryCaptureOpponentEven(board, lastPitId, playerInfo) {
  if (!lastPitId) return false;
  
  // Son taş rakibin küçük kuyasında (hazine değil) mı?
  const isOpponentSmallPit = lastPitId.startsWith(playerInfo.opponentPrefix) && 
                             !lastPitId.includes('treasure');
  if (!isOpponentSmallPit) return false;

  // O kuyudaki taş sayısı çift mi?
  const count = board[lastPitId] || 0;
  if (count > 0 && count % 2 === 0) {
    // Taşları al
    board[playerInfo.treasureId] = (board[playerInfo.treasureId] || 0) + count;
    board[lastPitId] = 0;
    return true;
  }
  
  return false;
}

/**
 * Kural 3: Kendi boş kuyuda bitme ve karşı kuyu alma
 * 
 * Son taş oyuncunun kendi tarafında boş bir kuyuya denk gelir ve
 * karşısındaki (rakibinin) kuyuda taş varsa:
 * - Rakibinin kuyusundaki taşları alır
 * - Kendi bıraktığı tek taşı da hazinesine koyar
 * 
 * Eğer karşı kuya boş ise: hiçbir şey almaz, hamle sırası rakibine geçer.
 * 
 * Kaynağı: Mangalarules.instructions.md - "3.TEMEL KURAL"
 * 
 * @param {Object} board - Tahta objesi (modifiye edilir)
 * @param {string} lastPitId - Son taşın konduğu pit'in ID'si
 * @param {Object} playerInfo - getPlayerInfo()'den dönen oyuncu bilgileri
 * 
 * @returns {boolean} Taş alıp almadığı (true = başarılı opposite capture)
 * 
 * @example
 * // p1_3 boş ve karşısı p2_4'ünde 3 taş varsa
 * const captured = tryCaptureOpposite(board, 'p1_3', playerInfo);
 * // p1_3 = 0, p2_4 = 0, p1_treasure += 4 (3 + 1)
 */
function tryCaptureOpposite(board, lastPitId, playerInfo) {
  if (!lastPitId) return false;
  
  // Son taş kendi tarafında küçük kuya mı?
  const isOwnSmallPit = lastPitId.startsWith(playerInfo.prefix) && 
                        !lastPitId.includes('treasure');
  if (!isOwnSmallPit) return false;

  // Kuyu boş mu (şu an 1 taş = yeni konulan taş)?
  if ((board[lastPitId] || 0) !== 1) return false;

  // Karşı kuya var mı ve taş mı var?
  const opposite = OPPOSITE_PITS[lastPitId];
  const oppCount = board[opposite] || 0;
  
  if (oppCount > 0) {
    // Karşıdaki taşları + kendi taşını hazinesine al
    board[playerInfo.treasureId] = (board[playerInfo.treasureId] || 0) + oppCount + 1;
    board[opposite] = 0;
    board[lastPitId] = 0;
    return true;
  }

  return false;
}

/**
 * Kural 4: Oyun bitişi kontrolü ve kalan taşları toplama
 * 
 * Oyunculardan herhangi birinin bölgesindeki tüm küçük kuyuları boşalırsa
 * oyun biter. Taşı ilk biten oyuncu, rakibinin bölgesinde bulunan tüm taşları
 * da alıp hazinesine koyar.
 * 
 * Kaynağı: Mangalarules.instructions.md - "4.TEMEL KURAL"
 * 
 * @param {Object} board - Tahta objesi (modifiye edilir)
 * 
 * @returns {{
 *   status: string,
 *   winner: string|null
 * }} Oyun durumu ('playing' veya 'finished') ve kazanan ('player1', 'player2', 'draw', null)
 * 
 * @example
 * const end = checkGameEnd(board);
 * // { status: 'finished', winner: 'player1' } // player1 kazandı
 */
function checkGameEnd(board) {
  const p1Side = sideStonesCount(board, P1_PATH);
  const p2Side = sideStonesCount(board, P2_PATH);

  // Herhangi bir taraf boş mu?
  if (p1Side === 0 || p2Side === 0) {
    if (p1Side === 0) {
      // Player 1'in tarafı boş → Player 2'nin kalan taşlarını Player 1'e koy
      board.p1_treasure = (board.p1_treasure || 0) + p2Side;
      getSmallPits(P2_PATH).forEach(id => board[id] = 0);
    } else {
      // Player 2'nin tarafı boş → Player 1'in kalan taşlarını Player 2'ye koy
      board.p2_treasure = (board.p2_treasure || 0) + p1Side;
      getSmallPits(P1_PATH).forEach(id => board[id] = 0);
    }

    // Kazananı belirle
    const p1Total = board.p1_treasure || 0;
    const p2Total = board.p2_treasure || 0;
    const winner = p1Total > p2Total ? 'player1' : p2Total > p1Total ? 'player2' : 'draw';
    
    return { status: 'finished', winner };
  }

  return { status: 'playing', winner: null };
}

/**
 * Hamle Hesaplama - ANA FONKSİYON
 * 
 * Verilen tahta durumunda, belirtilen oyuncunun belirtilen kuyudan
 * taş çekerek oyunun 4 temel kuralını uygular ve yeni tahta durumunu döner.
 * 
 * Bu fonksiyon:
 * ✓ Kural 1: Taş dağıtımı (tek/çok taş)
 * ✓ Kural 2: Rakip kuyusunda çift taş alma
 * ✓ Kural 3: Kendi boş kuyuda bitme ve karşı kuyu alma
 * ✓ Kural 4: Oyun bitişi kontrolü
 * ✓ Extra turn: Son taş hazinede denk gelirse tekrar oynama hakkı
 * 
 * Kaynağı: Mangalarules.instructions.md - Tüm 4 temel kural
 * 
 * @param {Object} currentBoard - Mevcut tahta durumu { pitId: stoneCount }
 * @param {string} currentTurn - Oynayan oyuncu ('player1' veya 'player2')
 * @param {string} pitId - Oynanan pit ID (örn: 'p1_1')
 * 
 * @returns {{
 *   newBoard: Object,
 *   newTurn: string,
 *   newStatus: string,
 *   newWinner: string|null
 * }} Yeni tahta, sıra, durum, kazanan
 * 
 * @throws {Error} Geçersiz hamle (pit not found, pit empty, invalid player)
 * 
 * @example
 * const board = { p1_1: 4, p1_2: 4, ..., p1_treasure: 0, p2_treasure: 0 };
 * const result = calculateMove(board, 'player1', 'p1_1');
 * // returns {
 * //   newBoard: { p1_1: 0, p1_2: 5, p1_3: 5, p1_4: 5, p1_5: 5, ...},
 * //   newTurn: 'player2',
 * //   newStatus: 'playing',
 * //   newWinner: null
 * // }
 */
export function calculateMove(currentBoard, currentTurn, pitId) {
  // Tahta kopyasını oluştur (mutasyon için)
  const board = { ...currentBoard };
  const playerInfo = getPlayerInfo(currentTurn);
  const opponent = currentTurn === 'player1' ? 'player2' : 'player1';

  // Sadece oyuncunun KÜÇÜK KUYULARI oynanabilir: **Eklenen kısım
  const smallPits = getSmallPits(playerInfo.path);
  if (!smallPits.includes(pitId)) {
    throw new Error('Invalid move: pit does not belong to current player');
  }

  // Geçerlilik kontrolleri
  const startIndex = playerInfo.path.indexOf(pitId);
  if (startIndex === -1) {
    throw new Error(`Invalid move: pit "${pitId}" does not belong to player "${currentTurn}" path`);
  }
  
  const stonesInHand = board[pitId] || 0;
  if (stonesInHand <= 0) {
    throw new Error(`Invalid move: selected pit "${pitId}" is empty`);
  }

  // Taşları al
  board[pitId] = 0;

  // Taşları dağıt (KURAL 1)
  const { lastPitId } = distributeStones(board, playerInfo.path, startIndex, stonesInHand);

  // Hamle sırasını varsayılan rakibe geçir
  let newTurn = opponent;

  // Son taş hazinede denk geldiyse: tekrar oynama hakkı (EXTRA TURN)
  if (lastPitId === playerInfo.treasureId) {
    newTurn = currentTurn;
  } else {
    // KURAL 2: Rakip kuyusunda çift taş
    const captured = tryCaptureOpponentEven(board, lastPitId, playerInfo);
    if (!captured) {
      // KURAL 3: Kendi boş kuyuda bitme ve karşı kuyu alma
      tryCaptureOpposite(board, lastPitId, playerInfo);
    }
  }

  // KURAL 4: Oyun bitişi kontrolü
  const end = checkGameEnd(board);

  return {
    newBoard: board,
    newTurn,
    newStatus: end.status,
    newWinner: end.winner
  };
}