import React, { useState } from 'react';
import './TaskForm.css';

const CATEGORIES = ['Сила духа', 'Сила тела', 'Интеллект', 'Мастер-горничная', 'Шеф-повар'];

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Введите название задачи');
      return;
    }
    
    onAddTask({
      title: title.trim(),
      category,
      difficulty: parseInt(difficulty)
    });
    
    setTitle('');
    setDifficulty(3);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>📝 Создать новую задачу</h3>
      
      <div className="form-group">
        <input
          type="text"
          placeholder="Название задачи..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>🏷️ Категория</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>⭐ Сложность (1-5)</label>
          <div className="difficulty-selector">
            {[1, 2, 3, 4, 5].map(d => (
              <button
                key={d}
                type="button"
                className={`difficulty-btn ${difficulty === d ? 'active' : ''}`}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="xp-preview">
            Награда: +{10 * difficulty} XP
          </div>
        </div>
      </div>
      
      <button type="submit" className="submit-btn">
        ✨ Создать задачу
      </button>
    </form>
  );
}

export default TaskForm;