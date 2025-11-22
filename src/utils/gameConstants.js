/**
 * Mangala Oyunu - Sabit Değerler (Constants)
 * Kaynağı: Mangalarules.instructions.md
 * 
 * Oyun seti üzerinde karşılıklı 6'şar adet olmak üzere 12 küçük kuyu ve
 * her oyuncunun taşlarını toplayacağı birer büyük hazine bulunmaktadır.
 */

// ===== PIT PATHS (Oyuncu alanları ve sırası) =====
/**
 * Player 1'in taş dağıtım yolu (counter-clockwise)
 * Kendi 6 kuyası → Hazinesi → Rakibin 6 kuyası
 */
export const P1_PATH = [
  'p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6',
  'p1_treasure',
  'p2_1', 'p2_2', 'p2_3', 'p2_4', 'p2_5', 'p2_6'
];

/**
 * Player 2'nin taş dağıtım yolu (counter-clockwise)
 * Kendi 6 kuyası → Hazinesi → Rakibin 6 kuyası
 */
export const P2_PATH = [
  'p2_1', 'p2_2', 'p2_3', 'p2_4', 'p2_5', 'p2_6',
  'p2_treasure',
  'p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6'
];

// ===== OPPOSITE PITS (Karşılıklı kuyu eşlemesi - Kural 3 için) =====
/**
 * Kural 3 (Boş kuyu + Karşı kuyu kapma) için kullanılır
 * Her pit için karşısında hangi pit'in olduğunu belirtir
 */
export const OPPOSITE_PITS = {
  p1_1: 'p2_6', p1_2: 'p2_5', p1_3: 'p2_4', p1_4: 'p2_3', p1_5: 'p2_2', p1_6: 'p2_1',
  p2_1: 'p1_6', p2_2: 'p1_5', p2_3: 'p1_4', p2_4: 'p1_3', p2_5: 'p1_2', p2_6: 'p1_1'
};

// ===== INITIAL BOARD STATE =====
/**
 * Oyun başında tahta durumu
 * Her küçük kuya 4 taş, hazineler boş
 * Toplam: 4 taş × 6 kuya × 2 oyuncu = 48 taş
 */
export const INITIAL_BOARD = {
  // Player 1: 6 küçük kuyu + 1 hazine
  p1_1: 4, p1_2: 4, p1_3: 4, p1_4: 4, p1_5: 4, p1_6: 4,
  p1_treasure: 0,
  
  // Player 2: 6 küçük kuyu + 1 hazine
  p2_1: 4, p2_2: 4, p2_3: 4, p2_4: 4, p2_5: 4, p2_6: 4,
  p2_treasure: 0
};

// ===== PIT PREFIXES =====
export const PIT_PREFIXES = {
  PLAYER1: 'p1',
  PLAYER2: 'p2'
};

export const TREASURE_SUFFIX = 'treasure';

// ===== PLAYER CONSTANTS =====
export const PLAYERS = {
  PLAYER1: 'player1',
  PLAYER2: 'player2'
};

// ===== SMALL PITS COUNT PER PLAYER =====
export const SMALL_PITS_COUNT = 6;

// ===== INITIAL STONES PER PIT =====
export const INITIAL_STONES_PER_PIT = 4;

// ===== TOTAL STONES IN GAME =====
export const TOTAL_STONES = SMALL_PITS_COUNT * 2 * INITIAL_STONES_PER_PIT; // 48 taş