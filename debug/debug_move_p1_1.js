import { calculateMove } from '../src/utils/mangalaLogic.js';
import { INITIAL_BOARD, PLAYERS } from '../src/utils/gameConstants.js';

const board = { ...INITIAL_BOARD };
console.log('before p1_1=', board.p1_1);
const result = calculateMove(board, PLAYERS.PLAYER1, 'p1_1');
console.log('after result.newBoard.p1_1=', result.newBoard.p1_1);
console.log('p1_2=', result.newBoard.p1_2);
console.log('p1_3=', result.newBoard.p1_3);
console.log('p1_4=', result.newBoard.p1_4);
console.log('p1_5=', result.newBoard.p1_5);
console.log('lastTurn=', result.newTurn);
console.log('lastPit=', result.newBoard);
