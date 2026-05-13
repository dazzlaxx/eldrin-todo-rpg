import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Profile from './components/Profile';
import Auth from './components/Auth';
import ThemeToggle from './components/ThemeToggle';
import CompletedTasks from './components/CompletedTasks';
import CharacterSelect from './components/CharacterSelect';
import Toast from './components/Toast';
import { 
  getUserTasks, 
  saveUserTasks, 
  getUserStats, 
  saveUserStats,
  getUserCompletedTasks,
  saveUserCompletedTasks,
  getUserCharacter,
  saveUserCharacter,
  generateId 
} from './utils/storage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [character, setCharacter] = useState(null);
  const [toasts, setToasts] = useState([]);

  //Добавление уведомления
  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  //Применение темы
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.style.backgroundColor = theme === 'light' ? '#f5eaf3' : '#1a1a2e';
  localStorage.setItem('theme', theme);
}, [theme]);

  //Загрузка данных пользователя при входе
  useEffect(() => {
    if (user) {
      const userTasks = getUserTasks(user.id);
      const userCompleted = getUserCompletedTasks(user.id);
      const userStats = getUserStats(user.id);
      const userCharacter = getUserCharacter(user.id);
      setTasks(userTasks.filter(t => !t.completed));
      setCompletedTasks(userCompleted);
      setStats(userStats);
      setCharacter(userCharacter || 'warrior');
    } else {
      setTasks([]);
      setCompletedTasks([]);
      setStats(null);
      setCharacter(null);
    }
  }, [user]);

  const handleLogin = (email, password) => {
    const users = JSON.parse(localStorage.getItem('eldrin_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      addToast(`Добро пожаловать, ${foundUser.name}!`, 'success');
      return true;
    }
    addToast('Неверный email или пароль', 'error');
    return false;
  };

  const handleRegister = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('eldrin_users') || '[]');
    if (users.find(u => u.email === email)) {
      addToast('Пользователь с таким email уже существует', 'error');
      return false;
    }
    
    const newUser = {
      id: generateId(),
      name,
      email,
      password
    };
    
    users.push(newUser);
    localStorage.setItem('eldrin_users', JSON.stringify(users));
    
    const initialStats = {
      userId: newUser.id,
      totalXp: 0,
      totalLevel: 1,
      totalThreshold: 100,
      categories: {
        'Сила духа': { level: 1, xp: 0, threshold: 100 },
        'Сила тела': { level: 1, xp: 0, threshold: 100 },
        'Интеллект': { level: 1, xp: 0, threshold: 100 },
        'Мастер-горничная': { level: 1, xp: 0, threshold: 100 },
        'Шеф-повар': { level: 1, xp: 0, threshold: 100 }
      }
    };
    saveUserStats(newUser.id, initialStats);
    saveUserCharacter(newUser.id, 'warrior');
    
    setUser(newUser);
    addToast(`Регистрация успешна! Добро пожаловать, ${name}!`, 'success');
    return true;
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    setCompletedTasks([]);
    setStats(null);
    addToast('Вы вышли из системы', 'info');
  };

  const addTask = (taskData) => {
    const newTask = {
      id: generateId(),
      userId: user.id,
      title: taskData.title,
      category: taskData.category,
      difficulty: taskData.difficulty,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveUserTasks(user.id, [...updatedTasks, ...completedTasks]);
    addToast(`Задача "${taskData.title}" создана!`, 'success');
  };

  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const xpGained = 10 * task.difficulty;
    
    const updatedStats = { ...stats };
    const category = task.category;
    let categoryData = { ...updatedStats.categories[category] };
    let newXp = categoryData.xp + xpGained;
    let newLevel = categoryData.level;
    let newThreshold = categoryData.threshold;
    let levelUps = 0;
    
    while (newXp >= newThreshold) {
      newXp -= newThreshold;
      newLevel++;
      newThreshold = Math.floor(newThreshold * 1.5);
      levelUps++;
    }
    
    //Обновление общей статистики
    let newTotalXp = updatedStats.totalXp + xpGained;
    let newTotalLevel = updatedStats.totalLevel;
    let newTotalThreshold = updatedStats.totalThreshold;
    let totalLevelUps = 0;
    
    while (newTotalXp >= newTotalThreshold) {
      newTotalXp -= newTotalThreshold;
      newTotalLevel++;
      newTotalThreshold = Math.floor(newTotalThreshold * 1.5);
      totalLevelUps++;
    }
    
    categoryData.xp = newXp;
    categoryData.level = newLevel;
    categoryData.threshold = newThreshold;
    updatedStats.categories[category] = categoryData;
    updatedStats.totalXp = newTotalXp;
    updatedStats.totalLevel = newTotalLevel;
    updatedStats.totalThreshold = newTotalThreshold;
    
    setStats(updatedStats);
    saveUserStats(user.id, updatedStats);
    
    //Перемещаем задачу в выполненные
    const completedTask = { ...task, completed: true, completedAt: new Date().toISOString() };
    const newTasks = tasks.filter(t => t.id !== taskId);
    const newCompleted = [completedTask, ...completedTasks];
    
    setTasks(newTasks);
    setCompletedTasks(newCompleted);
    saveUserTasks(user.id, [...newTasks, ...newCompleted]);
    saveUserCompletedTasks(user.id, newCompleted);
    
    //Уведомление о получении опыта
    addToast(`+${xpGained} XP в категорию "${category}"!`, 'success');
    
    //Уведомление о повышении уровня категории
    if (levelUps > 0) {
      addToast(`🎉 Поздравляем! Уровень "${category}" повышен до ${newLevel}!`, 'levelup');
    }
    
    //Уведомление о повышении общего уровня персонажа
    if (totalLevelUps > 0) {
      addToast(`🌟 УРА! Общий уровень персонажа повышен до ${newTotalLevel}!`, 'levelup');
    }
  };

  const restoreTask = (taskId) => {
    const task = completedTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const restoredTask = { ...task, completed: false, completedAt: null };
    const newCompleted = completedTasks.filter(t => t.id !== taskId);
    const newTasks = [restoredTask, ...tasks];
    
    setTasks(newTasks);
    setCompletedTasks(newCompleted);
    saveUserTasks(user.id, [...newTasks, ...newCompleted]);
    saveUserCompletedTasks(user.id, newCompleted);
    addToast(`Задача "${task.title}" возвращена в активные`, 'info');
  };

  const deleteTask = (taskId, isCompleted = false) => {
    const task = isCompleted 
      ? completedTasks.find(t => t.id === taskId)
      : tasks.find(t => t.id === taskId);
      
    if (isCompleted) {
      const newCompleted = completedTasks.filter(t => t.id !== taskId);
      setCompletedTasks(newCompleted);
      saveUserCompletedTasks(user.id, newCompleted);
      saveUserTasks(user.id, [...tasks, ...newCompleted]);
    } else {
      const newTasks = tasks.filter(t => t.id !== taskId);
      setTasks(newTasks);
      saveUserTasks(user.id, [...newTasks, ...completedTasks]);
    }
    addToast(`Задача "${task?.title}" удалена`, 'info');
  };

  const changeCharacter = (charId) => {
    setCharacter(charId);
    if (user) {
      saveUserCharacter(user.id, charId);
    }
    setShowCharacterSelect(false);
    const charNames = {
      warrior: 'Воина', mage: 'Мага', rogue: 'Разбойника', healer: 'Целителя', archer: 'Лучника'
    };
    addToast(`Теперь вы ${charNames[charId]}!`, 'success');
  };

  const getCharacterEmoji = () => {
    const chars = {
      warrior: '⚔️',
      mage: '🔮',
      rogue: '🗡️',
      healer: '💚',
      archer: '🏹'
    };
    return chars[character] || '⚔️';
  };

  if (!user) {
    return (
      <div className="app-container" data-theme={theme}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <Auth onLogin={handleLogin} onRegister={handleRegister} />
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" data-theme={theme}>
      <ThemeToggle theme={theme} setTheme={setTheme} />
      
      <header className="app-header">
        <div className="header-left">
          <button 
            className="character-btn"
            onClick={() => setShowCharacterSelect(true)}
          >
            {getCharacterEmoji()}
          </button>
          <h1>Eldrin: To-Do RPG</h1>
        </div>
        <div className="user-info">
          <span>👤 {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Выйти</button>
        </div>
      </header>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📋 Задачи ({tasks.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          🎮 Профиль
        </button>
        <button 
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          ✅ Выполненные ({completedTasks.length})
        </button>
      </div>
      
      {activeTab === 'tasks' && (
        <div className="tasks-section">
          <TaskForm onAddTask={addTask} />
          <TaskList 
            tasks={tasks} 
            onComplete={completeTask}
            onDelete={(id) => deleteTask(id, false)}
          />
          {tasks.length === 0 && (
            <div className="empty-state">
              <p>✨ Нет активных задач</p>
              <p>Создайте новую задачу выше!</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'profile' && (
        <Profile stats={stats} character={character} />
      )}
      
      {activeTab === 'completed' && (
        <CompletedTasks 
          tasks={completedTasks}
          onRestore={restoreTask}
          onDelete={(id) => deleteTask(id, true)}
        />
      )}
      
      {showCharacterSelect && (
        <CharacterSelect 
          currentCharacter={character}
          onSelect={changeCharacter}
          onClose={() => setShowCharacterSelect(false)}
        />
      )}
      
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  );
}

export default App;