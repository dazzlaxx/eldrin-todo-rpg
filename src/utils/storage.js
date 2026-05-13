//Генерация уникального ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

//Получение задач пользователя
export const getUserTasks = (userId) => {
  const tasksStr = localStorage.getItem(`eldrin_tasks_${userId}`);
  return tasksStr ? JSON.parse(tasksStr) : [];
};

//Сохранение задач пользователя
export const saveUserTasks = (userId, tasks) => {
  localStorage.setItem(`eldrin_tasks_${userId}`, JSON.stringify(tasks));
};

//Получение выполненных задач
export const getUserCompletedTasks = (userId) => {
  const tasksStr = localStorage.getItem(`eldrin_tasks_${userId}`);
  const allTasks = tasksStr ? JSON.parse(tasksStr) : [];
  return allTasks.filter(t => t.completed === true);
};

//Сохранение выполненных задач
export const saveUserCompletedTasks = (userId, completedTasks) => {
  const tasksStr = localStorage.getItem(`eldrin_tasks_${userId}`);
  const allTasks = tasksStr ? JSON.parse(tasksStr) : [];
  const activeTasks = allTasks.filter(t => t.completed === false);
  const newAllTasks = [...activeTasks, ...completedTasks];
  localStorage.setItem(`eldrin_tasks_${userId}`, JSON.stringify(newAllTasks));
};

//Получение статистики пользователя
export const getUserStats = (userId) => {
  const statsStr = localStorage.getItem(`eldrin_stats_${userId}`);
  if (statsStr) {
    return JSON.parse(statsStr);
  }
  //Статистика по умолчанию
  return {
    userId: userId,
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
};

//Сохранение статистики пользователя
export const saveUserStats = (userId, stats) => {
  localStorage.setItem(`eldrin_stats_${userId}`, JSON.stringify(stats));
};

//Получение персонажа пользователя
export const getUserCharacter = (userId) => {
  const charStr = localStorage.getItem(`eldrin_character_${userId}`);
  return charStr || 'warrior';
};

//Сохранение персонажа пользователя
export const saveUserCharacter = (userId, character) => {
  localStorage.setItem(`eldrin_character_${userId}`, character);
};