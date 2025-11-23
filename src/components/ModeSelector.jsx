import React from 'react';

/**
 * ModeSelector Component
 * 
 * Kullanıcının 3 mod arasında seçim yapmasını sağlar:
 * - Game: Canlı oyun (2 oyunculu)
 * - Tournament: Turnuva yönetimi
 * - Spectator: Canlı oyunları izleme
 */
export default function ModeSelector({ currentMode, onModeChange }) {
  const modes = [
    {
      id: 'game',
      label: '🎮 Oyun',
      description: 'Canlı oyun oyna'
    },
    {
      id: 'tournament',
      label: '🏆 Turnuva',
      description: 'Turnuva yönet'
    },
    {
      id: 'spectator',
      label: '👁️ İzle',
      description: 'Oyunları izle'
    }
  ];

  return (
    <div className="mode-selector">
      <nav className="mode-nav">
        {modes.map(mode => (
          <button
            key={mode.id}
            className={`mode-btn ${currentMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
            title={mode.description}
          >
            {mode.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
