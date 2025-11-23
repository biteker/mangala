import { describe, test, expect } from 'vitest';
import { swissPairings, updateStandings } from '../src/utils/tournament.js';

describe('Tournament utils', () => {
  test('swissPairings pairs even number of players', () => {
    const players = [
      { id: 'a', name: 'A', score: 2 },
      { id: 'b', name: 'B', score: 1 },
      { id: 'c', name: 'C', score: 1 },
      { id: 'd', name: 'D', score: 0 }
    ];
    const pairs = swissPairings(players);
    expect(pairs.length).toBe(2);
    // top scorer should be in first pair
    expect(pairs[0][0].id).toBe('a');
  });

  test('swissPairings handles odd number (last paired with null)', () => {
    const players = [
      { id: 'a', name: 'A', score: 2 },
      { id: 'b', name: 'B', score: 1 },
      { id: 'c', name: 'C', score: 1 }
    ];
    const pairs = swissPairings(players);
    expect(pairs.length).toBe(2);
    expect(pairs[1][1]).toBeNull();
  });

  test('updateStandings increments winner and handles draw', () => {
    const standings = [
      { id: 'a', score: 0 },
      { id: 'b', score: 0 }
    ];

    const afterWin = updateStandings(standings, { winnerId: 'a', loserId: 'b', draw: false });
    const a = afterWin.find(s => s.id === 'a');
    const b = afterWin.find(s => s.id === 'b');
    expect(a.score).toBe(1);
    expect(b.score).toBe(0);

    const afterDraw = updateStandings(standings, { winnerId: 'a', loserId: 'b', draw: true });
    const a2 = afterDraw.find(s => s.id === 'a');
    const b2 = afterDraw.find(s => s.id === 'b');
    expect(a2.score).toBe(0.5);
    expect(b2.score).toBe(0.5);
  });
});
