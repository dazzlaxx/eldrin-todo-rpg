import React from 'react';
import './TaskList.css';

function TaskList({ tasks, onComplete, onDelete }) {
  if (tasks.length === 0) {
    return null;
  }

  const getDifficultyStars = (difficulty) => {
    return '⭐'.repeat(difficulty);
  };

  return (
    <div className="task-list">
      <h3>📋 Активные задачи</h3>
      <div className="tasks-container">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div className="task-content">
              <h4>{task.title}</h4>
              <div className="task-meta">
                <span className="task-category">{task.category}</span>
                <span className="task-difficulty">{getDifficultyStars(task.difficulty)}</span>
                <span className="task-xp">+{10 * task.difficulty} XP</span>
              </div>
            </div>
            <div className="task-actions">
              <button 
                onClick={() => onComplete(task.id)}
                className="complete-btn"
                title="Выполнить"
              >
                ✅
              </button>
              <button 
                onClick={() => onDelete(task.id)}
                className="delete-btn"
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;