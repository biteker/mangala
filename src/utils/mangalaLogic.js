// ...existing code...
/**
 * Mangala mantığı - temizlenmiş ve kurallara uygun implementasyon.
 * Kurallar (kısa):
 * - Tek taş: alınan kuyuyu atla, bir sonraki kuyuya koy.
 * - Çok taş: alınan kuyudan başla (ilk taş alındığı kuyuda konur).
 * - Son taş hazinede biterse tekrar oynar.
 * - Son taş rakip kuyusunda ve oradaki taş sayısını çift yapıyorsa o taşlar hazineye alınır.
 * - Son taş kendi tarafında boş kuyuda bitip karşı kuyu doluysa karşı kuyu + o tek taş hazineye alınır.
 * - Bir tarafın tüm küçük kuyuları boşalırsa oyun biter; taşı biten oyuncu rakibin küçük kuyularındaki taşları hazinesine ekler.
 */

const P1_PATH = [
  'p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6',
  'p1_treasure',
  'p2_1', 'p2_2', 'p2_3', 'p2_4', 'p2_5', 'p2_6'
];

const P2_PATH = [
  'p2_1', 'p2_2', 'p2_3', 'p2_4', 'p2_5', 'p2_6',
  'p2_treasure',
  'p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6'
];

const OPPOSITE_PITS = {
  p1_1: 'p2_6', p1_2: 'p2_5', p1_3: 'p2_4', p1_4: 'p2_3', p1_5: 'p2_2', p1_6: 'p2_1',
  p2_1: 'p1_6', p2_2: 'p1_5', p2_3: 'p1_4', p2_4: 'p1_3', p2_5: 'p1_2', p2_6: 'p1_1'
};

/** Yardımcı: oyuncu bilgilerini döndür */
function getPlayerInfo(player) {
  if (player !== 'player1' && player !== 'player2') throw new Error('Invalid player');
  return {
    path: player === 'player1' ? P1_PATH : P2_PATH,
    treasureId: player === 'player1' ? 'p1_treasure' : 'p2_treasure',
    prefix: player === 'player1' ? 'p1' : 'p2',
    opponentPrefix: player === 'player1' ? 'p2' : 'p1'
  };
}

/** Yardımcı: oyuncu alanındaki küçük kuyuları döndür */
function getSmallPits(path) {
  return path.slice(0, 6);
}

/** Bir taraftaki taş sayısını hesapla */
function sideStonesCount(board, path) {
  return getSmallPits(path).reduce((s, id) => s + (board[id] || 0), 0);
}

/**
 * Taş dağıtımı
 * - Eğer stonesInHand === 1 => başlangıç kuyusunu atla, bir sonraki kuyuyu kullan.
 * - Eğer stonesInHand > 1 => başlangıç kuyusundan başla (ilk taş alındığı kuyuda konur).
 * board objesini doğrudan günceller; son taşın konduğu pitId döner.
 */
function distributeStones(board, path, startIndex, stonesInHand) {
  if (stonesInHand <= 0) return { lastPitId: null };

  // Tek taş durumunda başlangıç kuyusunu atla
  if (stonesInHand === 1) {
    const idx = (startIndex + 1) % path.length;
    const pitId = path[idx];
    board[pitId] = (board[pitId] || 0) + 1;
    return { lastPitId: pitId, lastIndex: idx };
  }

  // Çok taş: alınan kuyudan başlayarak sırayla koy
  let lastIndex = startIndex;
  for (let i = 0; i < stonesInHand; i++) {
    const idx = (startIndex + i) % path.length;
    const pitId = path[idx];
    board[pitId] = (board[pitId] || 0) + 1;
    lastIndex = idx;
  }

  return { lastPitId: path[lastIndex], lastIndex };
}

/** Kural 2: Son taş rakibin küçük kuyularında bitmiş ve o kuyunun taşı çifte denk gelmiş mi? */
function tryCaptureOpponentEven(board, lastPitId, playerInfo) {
  if (!lastPitId) return false;
  const isOpponentSmallPit = lastPitId.startsWith(playerInfo.opponentPrefix) && !lastPitId.includes('treasure');
  if (!isOpponentSmallPit) return false;

  const count = board[lastPitId] || 0;
  if (count > 0 && count % 2 === 0) {
    board[playerInfo.treasureId] = (board[playerInfo.treasureId] || 0) + count;
    board[lastPitId] = 0;
    return true;
  }
  return false;
}

/** Kural 3: Son taş kendi tarafında boş bir kuyuda bitmişse ve karşısında rakip taşı varsa, kap */
function tryCaptureOpposite(board, lastPitId, playerInfo) {
  if (!lastPitId) return false;
  const isOwnSmallPit = lastPitId.startsWith(playerInfo.prefix) && !lastPitId.includes('treasure');
  if (!isOwnSmallPit) return false;

  // Kuyunun şu an 1 olması, önceden boş olduğu anlamına gelir (çünkü biz önce kuyuyu sıfırladık)
  if ((board[lastPitId] || 0) !== 1) return false;

  const opposite = OPPOSITE_PITS[lastPitId];
  const oppCount = board[opposite] || 0;
  if (oppCount > 0) {
    // Karşıdakileri ve kendi bıraktığın tek taşı hazinene al
    board[playerInfo.treasureId] = (board[playerInfo.treasureId] || 0) + oppCount + 1;
    board[opposite] = 0;
    board[lastPitId] = 0;
    return true;
  }

  return false;
}

/** Oyun bitiş kontrolü ve kalan taşların toplanması */
function checkGameEnd(board) {
  const p1Side = sideStonesCount(board, P1_PATH);
  const p2Side = sideStonesCount(board, P2_PATH);

  if (p1Side === 0 || p2Side === 0) {
    if (p1Side === 0) {
      // p1 side boş -> p1 hazinesine p2 küçük kuyularının taşları eklenir
      board.p1_treasure = (board.p1_treasure || 0) + p2Side;
      getSmallPits(P2_PATH).forEach(id => board[id] = 0);
    } else {
      board.p2_treasure = (board.p2_treasure || 0) + p1Side;
      getSmallPits(P1_PATH).forEach(id => board[id] = 0);
    }

    const p1Total = board.p1_treasure || 0;
    const p2Total = board.p2_treasure || 0;
    const winner = p1Total > p2Total ? 'player1' : p2Total > p1Total ? 'player2' : 'draw';
    return { status: 'finished', winner };
  }

  return { status: 'playing', winner: null };
}

/**
 * Hamle hesaplama ana fonksiyonu
 * @param {Object} currentBoard - mevcut tahta (anahtar: pitId, değer: taş sayısı)
 * @param {'player1'|'player2'} currentTurn
 * @param {string} pitId - oynanan kuyu id
 * @returns {{ newBoard: Object, newTurn: string, newStatus: string, newWinner: string|null }}
 */
export function calculateMove(currentBoard, currentTurn, pitId) {
  // Kopya oluştur (immutable-ish)
  const board = { ...currentBoard };
  const playerInfo = getPlayerInfo(currentTurn);
  const opponent = currentTurn === 'player1' ? 'player2' : 'player1';

  // Geçerlilik kontrolleri
  const startIndex = playerInfo.path.indexOf(pitId);
  if (startIndex === -1) throw new Error('Invalid move: pit does not belong to player path or invalid id');
  const stonesInHand = board[pitId] || 0;
  if (stonesInHand <= 0) throw new Error('Invalid move: selected pit is empty');

  // Taşları al
  board[pitId] = 0;

  // Taşları dağıt
  const { lastPitId } = distributeStones(board, playerInfo.path, startIndex, stonesInHand);

  // Hamle sırasını varsayılan rakibe geçir
  let newTurn = opponent;

  // Kural: son taş hazinede ise tekrar oynama hakkı
  if (lastPitId === playerInfo.treasureId) {
    newTurn = currentTurn;
  } else {
    // Kural 2: rakip kuyusunda çift olma durumu
    const captured = tryCaptureOpponentEven(board, lastPitId, playerInfo);
    if (!captured) {
      // Kural 3: kendi boş kuyusunda bitirme ve karşıyı alma
      tryCaptureOpposite(board, lastPitId, playerInfo);
    }
  }

  // Oyun bitiş kontrolü
  const end = checkGameEnd(board);

  return {
    newBoard: board,
    newTurn,
    newStatus: end.status,
    newWinner: end.winner
  };
}
// ...existing code...