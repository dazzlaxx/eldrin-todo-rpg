import React from 'react';
import './CharacterSelect.css';

const CHARACTERS = [
  { id: 'warrior', name: 'Воин', emoji: '⚔️', description: 'Сила и стойкость' },
  { id: 'mage', name: 'Маг', emoji: '🔮', description: 'Мудрость и знания' },
  { id: 'rogue', name: 'Разбойник', emoji: '🗡️', description: 'Ловкость и хитрость' },
  { id: 'healer', name: 'Целитель', emoji: '💚', description: 'Доброта и поддержка' },
  { id: 'archer', name: 'Лучник', emoji: '🏹', description: 'Меткость и терпение' }
];

function CharacterSelect({ currentCharacter, onSelect, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Выберите персонажа</h2>
        <p className="modal-subtitle">Кто вы в этом приключении?</p>
        
        <div className="characters-grid">
          {CHARACTERS.map(char => (
            <button
              key={char.id}
              className={`character-option ${currentCharacter === char.id ? 'selected' : ''}`}
              onClick={() => onSelect(char.id)}
            >
              <div className="character-emoji">{char.emoji}</div>
              <div className="character-name">{char.name}</div>
              <div className="character-desc">{char.description}</div>
              {currentCharacter === char.id && (
                <div className="selected-badge">✓ Выбран</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CharacterSelect;