/**
 * Mangala Oyunu - Validasyon Fonksiyonları
 * 
 * Bu dosya, hamle geçerliliği, tahta durumu ve oyun mantığı validasyonlarını içerir.
 * Tüm validasyonlar Mangala kurallarına uygundur.
 */

import { P1_PATH, P2_PATH, PLAYERS, ERROR_MESSAGES } from './gameConstants.js';

/**
 * Oyuncu parametresinin geçerli olup olmadığını kontrol et
 * @param {string} player - 'player1' veya 'player2'
 * @returns {boolean}
 * @throws {Error} Geçersiz oyuncu
 */
export function isValidPlayer(player) {
  if (player !== PLAYERS.PLAYER1 && player !== PLAYERS.PLAYER2) {
    throw new Error(ERROR_MESSAGES.INVALID_PLAYER);
  }
  return true;
}

/**
 * Pit ID'nin geçerli bir format'ta olup olmadığını kontrol et
 * Geçerli format: p1_1 ... p1_6, p1_treasure, p2_1 ... p2_6, p2_treasure
 * @param {string} pitId - Pit ID
 * @returns {boolean}
 */
export function isValidPitId(pitId) {
  if (typeof pitId !== 'string') return false;
  
  const validPits = [
    ...P1_PATH,
    ...P2_PATH
  ];
  
  return validPits.includes(pitId);
}

/**
 * Pit'in belirli bir oyuncuya ait olup olmadığını kontrol et
 * @param {string} pitId - Pit ID
 * @param {string} player - 'player1' veya 'player2'
 * @returns {boolean}
 */
export function pitBelongsToPlayer(pitId, player) {
  isValidPlayer(player);
  
  const playerPath = player === PLAYERS.PLAYER1 ? P1_PATH : P2_PATH;
  return playerPath.includes(pitId);
}

/**
 * Pit'in hazine kuyu olup olmadığını kontrol et
 * @param {string} pitId - Pit ID
 * @returns {boolean}
 */
export function isTreasurePit(pitId) {
  return pitId.includes('treasure');
}

/**
 * Pit'in küçük kuyu (hazine dışı) olup olmadığını kontrol et
 * @param {string} pitId - Pit ID
 * @returns {boolean}
 */
export function isSmallPit(pitId) {
  return isValidPitId(pitId) && !isTreasurePit(pitId);
}

/**
 * Tahta objesinin geçerli bir format'ta olup olmadığını kontrol et
 * Her pit'te bir sayı (taş sayısı) bulunmalı
 * @param {Object} board - Tahta objesi
 * @returns {boolean}
 */
export function isBoardValid(board) {
  if (typeof board !== 'object' || board === null) return false;
  
  const validPits = [...P1_PATH, ...P2_PATH];
  
  for (const pit of validPits) {
    if (!(pit in board)) return false;
    if (typeof board[pit] !== 'number' || board[pit] < 0) return false;
  }
  
  return true;
}

/**
 * Bir oyuncunun belirli bir kuyu'yu oyunabilmesinin geçerli olup olmadığını kontrol et
 * - Pit oyuncuya ait olmalı
 * - Pit boş olmamalı (en az 1 taş)
 * - Pit hazine olmamalı (sadece küçük kuyular oynanabilir)
 * 
 * @param {Object} board - Tahta objesi
 * @param {string} pitId - Oynanan pit ID
 * @param {string} player - Oynayan oyuncu
 * @returns {boolean}
 * @throws {Error} Geçersiz hamle
 */
export function isValidMove(board, pitId, player) {
  // Oyuncu geçerli mi?
  isValidPlayer(player);
  
  // Pit ID geçerli mi?
  if (!isValidPitId(pitId)) {
    throw new Error(ERROR_MESSAGES.INVALID_PIT_ID);
  }
  
  // Pit oyuncuya ait mi?
  if (!pitBelongsToPlayer(pitId, player)) {
    throw new Error(ERROR_MESSAGES.PIT_NOT_FOUND);
  }
  
  // Pit hazine mi? (hazine oynanamaz)
  if (isTreasurePit(pitId)) {
    throw new Error('Cannot play from treasure pit');
  }
  
  // Pit boş mu?
  const stoneCount = board[pitId] || 0;
  if (stoneCount <= 0) {
    throw new Error(ERROR_MESSAGES.PIT_EMPTY);
  }
  
  return true;
}

/**
 * Oyuncunun tarafında taş kalıp kalmadığını kontrol et
 * Kural 4'ü destekler: oyun bitişi kontrolü
 * 
 * @param {Object} board - Tahta objesi
 * @param {string} player - Kontrol edilecek oyuncu
 * @returns {number} Taş sayısı (0 = tarafı boş, > 0 = hala taş var)
 */
export function getPlayerSideStoneCount(board, player) {
  isValidPlayer(player);
  
  const playerPath = player === PLAYERS.PLAYER1 ? P1_PATH : P2_PATH;
  const smallPits = playerPath.slice(0, 6); // İlk 6 pit = küçük kuyular
  
  return smallPits.reduce((sum, pitId) => sum + (board[pitId] || 0), 0);
}

/**
 * Oyunun bitip bitmediğini kontrol et
 * Kural 4: Bir tarafın tüm küçük kuyuları boşalırsa oyun biter
 * 
 * @param {Object} board - Tahta objesi
 * @returns {boolean} True = oyun bitti, False = oyun devam ediyor
 */
export function isGameOver(board) {
  if (!isBoardValid(board)) return false;
  
  const p1Stones = getPlayerSideStoneCount(board, PLAYERS.PLAYER1);
  const p2Stones = getPlayerSideStoneCount(board, PLAYERS.PLAYER2);
  
  return p1Stones === 0 || p2Stones === 0;
}

/**
 * Tahta durumunun mantıklı olup olmadığını kontrol et
 * - Toplam taş sayısı 48 olmalı
 * - Hiçbir pit negatif olamaz
 * 
 * @param {Object} board - Tahta objesi
 * @returns {boolean}
 */
export function isBoardStateConsistent(board) {
  if (!isBoardValid(board)) return false;
  
  const allPits = [...P1_PATH, ...P2_PATH];
  const totalStones = allPits.reduce((sum, pit) => sum + (board[pit] || 0), 0);
  
  // Total taş sayısı 48 olmalı (4 taş * 6 pit * 2 oyuncu)
  return totalStones === 48;
}

/**
 * Pit'in oyuncuya ait olup olmadığını kontrol et (opponent perspective)
 * @param {string} pitId - Pit ID
 * @param {string} player - Oyuncu
 * @returns {boolean} True = rakibin pit'i, False = oyuncunun pit'i
 */
export function isOpponentPit(pitId, player) {
  isValidPlayer(player);
  
  if (!isValidPitId(pitId)) return false;
  
  const isPlayerPit = pitBelongsToPlayer(pitId, player);
  return !isPlayerPit && !isTreasurePit(pitId);
}

/**
 * Kullanıcı tarafından uyarı cezasının ne kadar olduğunu kontrol et
 * Kural: 3. uyarı = tur kaybı
 * 
 * @param {number} warningCount - Uyarı sayısı
 * @returns {boolean} True = tur kaybedildi, False = devam edebilir
 */
export function didPlayerLoseTurn(warningCount) {
  return warningCount >= 3;
}