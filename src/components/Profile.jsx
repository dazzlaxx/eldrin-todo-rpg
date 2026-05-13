import React from 'react';
import './Profile.css';

function Profile({ stats, character }) {
  //Проверка наличия данных
  if (!stats) {
    return <div className="profile-loading">Загрузка профиля...</div>;
  }

  const categories = stats.categories || {
    'Сила духа': { level: 1, xp: 0, threshold: 100 },
    'Сила тела': { level: 1, xp: 0, threshold: 100 },
    'Интеллект': { level: 1, xp: 0, threshold: 100 },
    'Мастер-горничная': { level: 1, xp: 0, threshold: 100 },
    'Шеф-повар': { level: 1, xp: 0, threshold: 100 }
  };
  
  const categoryNames = Object.keys(categories);
  
  const getProgressPercent = (category) => {
    const data = categories[category];
    if (!data || data.threshold === 0) return 0;
    return (data.xp / data.threshold) * 100;
  };

  //Общий прогресс персонажа
  const totalXp = stats.totalXp || 0;
  const totalThreshold = stats.totalThreshold || 100;
  const totalLevel = stats.totalLevel || 1;
  const totalProgressPercent = totalThreshold > 0 ? (totalXp / totalThreshold) * 100 : 0;

  const getCategoryIcon = (name) => {
    const icons = {
      'Сила духа': '🧠',
      'Сила тела': '💪',
      'Интеллект': '📚',
      'Мастер-горничная': '🧹',
      'Шеф-повар': '🍳'
    };
    return icons[name] || '✨';
  };

  const getCharacterName = () => {
    const names = {
      warrior: 'Воин ⚔️',
      mage: 'Маг 🔮',
      rogue: 'Разбойник 🗡️',
      healer: 'Целитель 💚',
      archer: 'Лучник 🏹'
    };
    return names[character] || 'Воин ⚔️';
  };

  const getCharacterAvatar = () => {
    const avatars = {
      warrior: '⚔️',
      mage: '🔮',
      rogue: '🗡️',
      healer: '💚',
      archer: '🏹'
    };
    return avatars[character] || '⚔️';
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar">
          {getCharacterAvatar()}
        </div>
        <div className="profile-title">
          <h2>{getCharacterName()}</h2>
          <p>Общий уровень: {totalLevel}</p>
        </div>
      </div>
      
      {/* Общая шкала опыта */}
      <div className="total-xp-section">
        <div className="total-xp-header">
          <span>🌟 Общий прогресс персонажа</span>
          <span>Ур. {totalLevel} → {totalLevel + 1}</span>
        </div>
        <div className="total-progress-bar-container">
          <div 
            className="total-progress-bar" 
            style={{ width: `${Math.min(totalProgressPercent, 100)}%` }}
          />
        </div>
        <div className="total-xp-stats">
          <span>Опыт: {totalXp} / {totalThreshold}</span>
          <span>{Math.floor(totalProgressPercent)}%</span>
        </div>
      </div>
      
      <h3 className="categories-title">📊 Категории развития</h3>
      
      <div className="categories-grid">
        {categoryNames.map(catName => {
          const cat = categories[catName];
          const percent = getProgressPercent(catName);
          return (
            <div key={catName} className="category-card">
              <div className="category-header">
                <span className="category-icon">{getCategoryIcon(catName)}</span>
                <span className="category-name">{catName}</span>
                <span className="category-level">Ур. {cat?.level || 1}</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
              <div className="category-stats">
                <span>Опыт: {cat?.xp || 0} / {cat?.threshold || 100}</span>
                <span>{Math.floor(percent)}%</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="profile-info">
        <h3>📖 Как работает прокачка?</h3>
        <ul>
          <li>Каждая задача даёт <strong>10 XP × сложность</strong> в выбранную категорию</li>
          <li>При достижении порога уровень повышается</li>
          <li>Порог следующего уровня увеличивается на 50%</li>
          <li>Остаток опыта переносится на следующий уровень</li>
          <li>Общий уровень персонажа — сумма всех уровней категорий</li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;