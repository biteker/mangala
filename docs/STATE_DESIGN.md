# State Design (Summary)

Context hierarchy:
- SpectatorProvider
- TournamentProvider
- FirebaseProvider
- GameProvider (innermost)

GameContext state:
- board, currentTurn, gameStatus, winner, currentMove, gameHistory
- actions: moveStone, resetGame, displayWinner, undoMove

FirebaseContext:
- uid, roomId, isOwner, loading, error
- actions: createRoom, joinRoom, watchRoom, updateRoomState

TournamentContext:
- matches[], standings[], currentMatch
- swiss matching & best-of-3 logic

SpectatorContext:
- isSpectating, spectatedRoomId, spectatedMatch, realTimeUpdates
- actions: startSpectating, stopSpectating

Firestore schema (rooms/{roomId}) brief:
- ownerId, player1Uid, player2Uid, board, currentTurn, gameStatus, winner, createdAt, moves[]

