/* Спрощена версія, щоб було легше для початківця */

// --- Селектори DOM ---
const form = document.getElementById('task-form');
const taskInput = document.getElementById('task');
const dateInput = document.getElementById('date');
const taskList = document.querySelector('.task-list');
const filterButtons = document.querySelectorAll('nav .btn');

// --- Стейт додатка ---
let tasks = loadTasks(); // масив задач: { id, text, date, completed }
saveTasks(); // оновлюємо localStorage щоб старі задачі отримали id
let activeFilter = 'All tasks';

// --- Ініціалізація ---
init();

function init() {
  renderTasks();
  form.addEventListener('submit', onFormSubmit);
  taskList.addEventListener('click', onTaskListClick);
  filterButtons.forEach(btn => btn.addEventListener('click', onFilterClick));
}

// --- Зберігання даних ---
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const raw = JSON.parse(localStorage.getItem('tasks')) || [];
  // Додаємо унікальні id, якщо їх немає (щоб старі записи працювали)
  return raw.map(t => {
    if (!t.id) t.id = Date.now().toString() + Math.random().toString(36).slice(2, 8);
    return t;
  });
}

// --- Обробники подій ---
function onFormSubmit(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  const date = dateInput.value;

  if (!text) return; // нічого не робимо, якщо пусто

  addTask({
    id: Date.now().toString(),
    text,
    date: date || '',
    completed: false
  });

  taskInput.value = '';
  dateInput.value = '';
}

function onTaskListClick(e) {
  const li = e.target.closest('.task-item');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains('task-delete')) {
    deleteTask(id);
    return;
  }

  if (e.target.classList.contains('task-checkbox')) {
    toggleTaskCompleted(id);
    return;
  }
}

function onFilterClick(e) {
  activeFilter = e.target.textContent.trim();
  renderTasks();
}

// --- Операції над задачами ---
function addTask(task) {
  tasks.push(task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTaskCompleted(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  t.completed = !t.completed;
  saveTasks();
  renderTasks();
}

// --- Рендеринг ---
function renderTasks() {
  taskList.innerHTML = '';
  const today = new Date().toISOString().split('T')[0];

  tasks.forEach(task => {
    if (!shouldShowTask(task, activeFilter, today)) return;
    taskList.appendChild(createTaskElement(task));
  });
}

function shouldShowTask(task, filter, today) {
  const isCompleted = task.completed;
  const taskDate = task.date || '';

  switch (filter) {
    case 'All tasks': return true;
    case 'Today': return taskDate === today;
    case 'Completed': return isCompleted;
    case 'Overdue': return taskDate !== '' && taskDate < today && !isCompleted;
    default: return true;
  }
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = task.id;

  if (task.completed) li.classList.add('completed');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', 'Позначити як виконане');

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = task.text;

  const dateSpan = document.createElement('span');
  dateSpan.className = 'task-date';
  dateSpan.textContent = task.date || '';

  const delBtn = document.createElement('button');
  delBtn.className = 'task-delete';
  delBtn.textContent = '✕';
  delBtn.setAttribute('aria-label', 'Видалити задачу');

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(dateSpan);
  li.appendChild(delBtn);

  return li;
}



