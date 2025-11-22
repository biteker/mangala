# Refactor Plan - Mangala (Summary)

(Özet: 8 fase, ~25 PR. Context API + custom hooks. PR-based workflow, her PR <200 satır.)

- Fase 0: Constants & Logic prep
- Fase 1: Context API (GameContext, FirebaseContext, TournamentContext, SpectatorContext)
- Fase 2: Hooks (useGame, useGameStatus, usePlayerRole, useGameLogic, useAuthUser)
- Fase 3: App.jsx refactor (providers)
- Fase 4: GameBoard component split (Pit, ScoreBoard, GameStatus)
- Fase 5: Tournament mode (Swiss matcher, Tournament UI)
- Fase 6: Spectator mode (read-only listeners)
- Fase 7: CSS & styling
- Fase 8: Tests & docs

PR workflow: each PR için amaç, değişiklikler, test adımları, checklist. Conventional commits (feat:, fix:, refactor:, docs:).

Timeline önerisi: Haftada 2-4 PR → toplam 6-8 hafta.

