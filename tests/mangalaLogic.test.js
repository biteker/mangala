/**
 * Mangala Oyunu - Unit Test Örnekleri
 * 
 * Bu dosya, mangalaLogic.js modülünün test edilebilir olduğunu ve
 * temel senaryoların validasyonunu gösterir.
 * 
 * Jest kurulması gerekiyor: npm install --save-dev jest
 * 
 * Çalıştırma: npm test
 */
import { describe, test, expect } from 'vitest';
import { calculateMove } from '../src/utils/mangalaLogic.js';
import { INITIAL_BOARD, PLAYERS } from '../src/utils/gameConstants.js';

describe('Mangala Oyunu - mangalaLogic.js', () => {
  
  // TEST HELPER: Başlangıç tahtası kopyası
  const getInitialBoard = () => ({ ...INITIAL_BOARD });

  describe('KURAL 1: Taş Dağıtma', () => {
    
    test('Kural 1a: Tek taş — başlangıç kuyusunu atlar', () => {
      const board = getInitialBoard();
      // p1_6'nın başında 4 taş var, 3'ünü çıkarıp 1 taş bırakalım
      board.p1_6 = 1;
      
      const result = calculateMove(board, PLAYERS.PLAYER1, 'p1_6');
      
      // 1 taş p1_6'dan alınır, başlangıç kuyusu (p1_6) atlanarak p1_treasure'a konur
      expect(result.newBoard.p1_6).toBe(0);
      expect(result.newBoard.p1_treasure).toBe(1);
      expect(result.newTurn).toBe(PLAYERS.PLAYER1);
    });

    test('Kural 1b: Çok taş — başlangıç kuyusundan başlar', () => {
      const board = getInitialBoard();
      
      const result = calculateMove(board, PLAYERS.PLAYER1, 'p1_1');
      
      // p1_1'den 4 taş: çok taş seçildiği için ilk taş tekrar başlangıç kuyusuna konur
      expect(result.newBoard.p1_1).toBe(1); // başlangıç kuyusuna 1 taş geri kondu
      expect(result.newBoard.p1_2).toBe(5); // 4 + 1
      expect(result.newBoard.p1_3).toBe(5); // 4 + 1
      expect(result.newBoard.p1_4).toBe(5); // 4 + 1
      expect(result.newBoard.p1_5).toBe(4); // başlangıç kuyusuna ilk taş tekrar kondu, p1_5 etkilenmedi
      expect(result.newTurn).toBe(PLAYERS.PLAYER2);
    });

  });

  describe('Extra Turn - Son taş hazinede', () => {
    
    test('Son taş hazinede denk gelirse tekrar oynama hakkı', () => {
      const board = getInitialBoard();
      // Tam olarak 7 taş p1_1'de, böylece son taş p1_treasure'a denk gelir
      board.p1_1 = 7;
      
      const result = calculateMove(board, PLAYERS.PLAYER1, 'p1_1');
      
      // Son taş p1_treasure'a denk gelir
      expect(result.newBoard.p1_treasure).toBe(1);
      // Sıra aynı oyuncuya geçer (extra turn)
      expect(result.newTurn).toBe(PLAYERS.PLAYER1);
    });

  });

  describe('KURAL 2: Rakip Kuyusunda Çift Taş', () => {
    
    test('Son taş rakibin kuyusunda çift sayıya denk gelirse al', () => {
      const board = getInitialBoard();
      // Set up a move so the last stone lands on opponent's pit p2_1
      // For P1 starting at p1_1 and placing first stone into start, setting 8 stones will land on p2_1
      // Make p2_1 have 3 so after +1 it becomes 4 (even) and should be captured
      board.p1_1 = 8;
      board.p2_1 = 3;

      const result = calculateMove(board, PLAYERS.PLAYER1, 'p1_1');

      // p2_1'deki taşlar (4) alınır (çift sayı)
      expect(result.newBoard.p2_1).toBe(0);
      // Distribution also added 1 to p1_treasure before capture, total 1 + 4 = 5
      expect(result.newBoard.p1_treasure).toBe(5);
      expect(result.newTurn).toBe(PLAYERS.PLAYER2); // sıra rakibe geçer
    });

    test('Rakip kuyusunda tek sayıda taş varsa almaz', () => {
      const board = getInitialBoard();
      // Make a move that lands on p2_1 but keep p2_1 odd after the landing
      board.p1_1 = 8;
      board.p2_1 = 4; // after +1 => 5 (odd) -> should NOT be captured

      const result = calculateMove(board, PLAYERS.PLAYER1, 'p1_1');

      // p2_1 should remain (5) and distribution added 1 to p1_treasure
      expect(result.newBoard.p2_1).toBe(5);
      expect(result.newBoard.p1_treasure).toBe(1); // dağıtım nedeniyle 1 taş eklendi
    });

  });

  describe('KURAL 3: Boş Kuya + Karşı Kuyu', () => {
    
    test('Boş kuyuda bitip karşı kuya taş varsa al', () => {
      const board = getInitialBoard();
      // p1_3'ü boş yap, p2_4'ünde (karşısında) 2 taş olsun
      board.p1_3 = 0;
      board.p2_4 = 2;
      // p1_1'den öyle çoklayalım ki p1_3'e denk gelsin
      board.p1_1 = 3; // p1_1 → p1_2 → p1_3
      
      const result = calculateMove(board, PLAYERS.PLAYER1, 'p1_1');
      
      // p1_3 boş idi, 1 taş kondu, karşı p2_4 taş var
      expect(result.newBoard.p1_3).toBe(0); // alındı
      expect(result.newBoard.p2_4).toBe(0); // alındı
      expect(result.newBoard.p1_treasure).toBe(3); // 2 (p2_4) + 1 (p1_3)
    });

  });

  describe('KURAL 4: Oyun Bitişi', () => {
    
    test('Bir taraf boşalırsa oyun biter', () => {
      const board = getInitialBoard();
      // Player 1'in tüm tarafını boş yap
      ['p1_1', 'p1_2', 'p1_3', 'p1_4', 'p1_5', 'p1_6'].forEach(pit => {
        board[pit] = 0;
      });
      // Player 2'de 1 taş bırak
      board.p2_1 = 1;
      
      const result = calculateMove(board, PLAYERS.PLAYER2, 'p2_1');
      
      // p2_1'den 1 taş çekilir, oyun biter
      expect(result.newStatus).toBe('finished');
      expect(result.newWinner).not.toBeNull();
    });

  });

  describe('Hata Kontrolleri', () => {
    
    test('Geçersiz oyuncu hata verir', () => {
      const board = getInitialBoard();
      expect(() => calculateMove(board, 'player3', 'p1_1')).toThrow();
    });

    test('Boş pit seçilirse hata verir', () => {
      const board = getInitialBoard();
      board.p1_1 = 0;
      expect(() => calculateMove(board, PLAYERS.PLAYER1, 'p1_1')).toThrow();
    });

    test('Rakibinin piti seçilirse hata verir', () => {
      const board = getInitialBoard();
      expect(() => calculateMove(board, PLAYERS.PLAYER1, 'p2_1')).toThrow();
    });

  });

});