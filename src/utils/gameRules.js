/**
 * Mangala Oyunu Kuralları
 * Kaynağı: /home/biteker/Documents/mangala/.github/instructions/Mangalarules.instructions.md
 * 
 * Oyun seti üzerinde karşılıklı 6'şar adet olmak üzere 12 küçük kuyu ve
 * her oyuncunun taşlarını toplayacağı birer büyük hazine bulunmaktadır.
 */

// ===== TEMEL KURAL 1: Taş Dağıtma =====
/**
 * TEMEL KURAL 1: Taş Dağıtma (Taş Alma ve Yayma)
 * 
 * Başlama hakkı kazanan oyuncu kendi bölgesinde istediği kuyudan taşları alır.
 * - Eğer 1 taş varsa: başlangıç kuyusunu atlar, bir sonrakine koyar
 * - Eğer 2+ taş varsa: başlangıç kuyusundan başlayarak koyar
 * - Taşlar saatin tersi yönünde (sağa doğru) dağıtılır
 * - Son taş hazinesine denk gelirse: oyuncu tekrar oynama hakkı kazanır
 * 
 * Referans: Mangalarules.instructions.md - "1.TEMEL KURAL"
 */
export const RULE_1_SINGLE_STONE = 'rule_1_single_stone';
export const RULE_1_MULTIPLE_STONES = 'rule_1_multiple_stones';
export const EXTRA_TURN = 'extra_turn';

// ===== TEMEL KURAL 2: Rakip Kuyusunda Çift Taş =====
/**
 * TEMEL KURAL 2: Rakip Kuyusunda Çift Taş Bulma (Capture Rule)
 * 
 * Son taş rakibinin bölgesindeki bir kuyuya denk geldiğinde,
 * o kuyudaki taş sayısı çift sayı ise (2, 4, 6, 8 vs.),
 * o kuyada yer alan tüm taşları ve son taşını alır.
 * Alınan taşlar oyuncunun hazinesine konur.
 * Hamle sırası rakibine geçer.
 * 
 * Referans: Mangalarules.instructions.md - "2.TEMEL KURAL"
 */
export const RULE_2_CAPTURE_OPPONENT_EVEN = 'rule_2_capture_opponent_even';

// ===== TEMEL KURAL 3: Kendi Boş Kuyuda Bitme =====
/**
 * TEMEL KURAL 3: Kendi Boş Kuyunda Bitme ve Karşı Kuyu Alma (Opposite Capture)
 * 
 * Son taş oyuncunun kendi bölgesindeki boş bir kuyuya denk gelirse,
 * o boş kuyunun karşısındaki (rakibinin) kuyuda taş varsa:
 * - Hem rakibinin kuyusundaki taşları alır
 * - Hem de kendi bıraktığı tek taşı hazinesine koyar
 * 
 * Eğer karşısında taş yoksa: tek taşı almaz, hamle sırası rakibine geçer.
 * 
 * Referans: Mangalarules.instructions.md - "3.TEMEL KURAL"
 */
export const RULE_3_CAPTURE_OPPOSITE = 'rule_3_capture_opposite';

// ===== TEMEL KURAL 4: Oyun Bitişi =====
/**
 * TEMEL KURAL 4: Oyun Bitişi ve Taş Toplama
 * 
 * Oyunculardan herhangi birinin bölgesindeki taşlar bittiğinde oyun seti biter.
 * Taşı ilk biten oyuncu, rakibinin bölgesinde bulunan tüm taşları da alıp hazinesine koyar.
 * Hakem oyuncuların hazinelerindeki taşları sayar.
 * En fazla taşı hazinesine toplayan oyuncu oyun setini kazanmıştır.
 * 
 * Referans: Mangalarules.instructions.md - "4.TEMEL KURAL"
 */
export const RULE_4_GAME_END = 'rule_4_game_end';

// ===== TURNUVA KURALARI =====
/**
 * TURNUVA KURALARI (3 Set Best-Of)
 * 
 * - Oyun 3 set üzerinden oynanır
 * - 2 seti kazanan oyuncu turu kazanmış olur
 * - Set sonuçlarında beraberlik halinde her iki tarafa 0.5 puan verilir
 * - Kazanana "1" puan, kaybedene "0" puan verilir
 * 
 * İsviçre Eşlendirmesi:
 * - Oyuncuların başlangıç sıralaması soyadına göre alfabetik
 * - 1. Turun eşlendirmesi kura çekilerek belirlenir
 * - Sonraki tüm oyun başlama sırası eşlendirme programı tarafından otomatik verilir
 * 
 * Referans: Mangalarules.instructions.md - Turnuva Kuralları
 */
export const TOURNAMENT_SET_COUNT = 3;
export const TOURNAMENT_MIN_WINS = 2;
export const TOURNAMENT_WIN_POINTS = 1;
export const TOURNAMENT_LOSS_POINTS = 0;
export const TOURNAMENT_DRAW_POINTS = 0.5;

// ===== SPECIAL RULES =====
/**
 * Dikkat Edilmesi Gereken Kurallar
 * 
 * a) Oyuncu kendi kuyusundaki ve rakip kuyudaki taşları sayamaz
 * b) Gözle sayılamayacak çoklu gruplarda, hakem taşların sayılmasını talep eder
 * c) Hamle yapılırken taşlar bir avuç içinde alınır
 * d) Oyuncu taşlardan birine dokunduğunda o kuyudaki taşları oynamak zorundadır (Touch Move Rule)
 * e) Oyun 3 set üzerinden oynanır, uzatma seti oynanmaz
 * f) Geçmiş hamlelerde yaşanan problemler için yapılacak itirazlar kabul edilmez
 * g) Oyuncu uyarı cezası alırsa: 1. uyarı = uyarı, 3. uyarı = tur kaybı
 * h) Zamanlayıcı kullanıldığında: süresi biten oyuncu 24+ taş = berabere, < 24 = kayıp
 * 
 * Referans: Mangalarules.instructions.md - "Dikkat edilmesi gereken kurallar"
 */
export const SPECIAL_RULES = {
  CANNOT_COUNT_STONES: 'a',
  REFEREE_COUNT_STONES: 'b',
  MUST_HOLD_IN_HAND: 'c',
  TOUCH_MOVE_RULE: 'd',
  NO_OVERTIME: 'e',
  NO_PAST_DISPUTES: 'f',
  WARNING_PENALTIES: 'g',
  TIME_LIMIT: 'h'
};

// ===== ERROR CONSTANTS =====
export const ERROR_MESSAGES = {
  INVALID_PLAYER: 'Invalid player: must be "player1" or "player2"',
  PIT_NOT_FOUND: 'Pit ID does not belong to player path',
  PIT_EMPTY: 'Selected pit is empty',
  INVALID_PIT_ID: 'Invalid pit ID',
  GAME_ALREADY_FINISHED: 'Game has already finished',
  NOT_PLAYER_TURN: 'It is not this player\'s turn'
};

// ===== GAME STATUS CONSTANTS =====
export const GAME_STATUS = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished'
};

// ===== WINNER CONSTANTS =====
export const WINNER = {
  PLAYER1: 'player1',
  PLAYER2: 'player2',
  DRAW: 'draw',
  NONE: null
};