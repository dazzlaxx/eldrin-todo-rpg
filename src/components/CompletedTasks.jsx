import React from 'react';
import './CompletedTasks.css';

function CompletedTasks({ tasks, onRestore, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="completed-empty">
        <p>📭 Нет выполненных задач</p>
        <p>Выполните задачу, чтобы она появилась здесь</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const getDifficultyStars = (difficulty) => {
    return '⭐'.repeat(difficulty);
  };

  return (
    <div className="completed-container">
      <h3>✅ Выполненные задачи</h3>
      <div className="completed-list">
        {tasks.map(task => (
          <div key={task.id} className="completed-card">
            <div className="completed-content">
              <h4>{task.title}</h4>
              <div className="completed-meta">
                <span className="completed-category">{task.category}</span>
                <span className="completed-difficulty">{getDifficultyStars(task.difficulty)}</span>
                <span className="completed-xp">+{10 * task.difficulty} XP</span>
              </div>
              <div className="completed-date">
                📅 Выполнено: {formatDate(task.completedAt)}
              </div>
            </div>
            <div className="completed-actions">
              <button 
                onClick={() => onRestore(task.id)}
                className="restore-btn"
                title="Вернуть в активные"
              >
                🔄 Вернуть
              </button>
              <button 
                onClick={() => onDelete(task.id)}
                className="delete-btn"
                title="Удалить навсегда"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompletedTasks;