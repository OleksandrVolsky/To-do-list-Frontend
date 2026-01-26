/* GPT зробив */
// ===== Отримуємо елементи =====
const form = document.getElementById('task-form');
const taskInput = document.getElementById('task');
const dateInput = document.getElementById('date');
const taskList = document.querySelector('.task-list');
const filterButtons = document.querySelectorAll('.nav .btn');

// ===== Завантажуємо задачі з localStorage при старті =====
let tasksData = JSON.parse(localStorage.getItem('tasks')) || [];

tasksData.forEach(task => createTaskElement(task));
applyFilter('All tasks'); // показує всі на старті

// ===== Додавання задачі =====
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;

    if (taskText === '') return;

    const taskObj = {
        text: taskText,
        date: taskDate || '',
        completed: false
    };

    tasksData.push(taskObj);
    saveTasks();

    createTaskElement(taskObj);

    taskInput.value = '';
    dateInput.value = '';
});

// ===== Функція створення li =====
function createTaskElement(taskObj) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (taskObj.completed) li.classList.add('completed');

    if (taskObj.date) li.dataset.date = taskObj.date;

    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${taskObj.completed ? 'checked' : ''}>
        <span class="task-text">${taskObj.text}</span>
        <span class="task-date">${taskObj.date}</span>
        <button class="task-delete">✕</button>
    `;

    taskList.appendChild(li);
}

// ===== Checkbox + delete =====
taskList.addEventListener('click', function (e) {
    const li = e.target.closest('.task-item');
    if (!li) return;

    const index = Array.from(taskList.children).indexOf(li);

    // Видалення
    if (e.target.classList.contains('task-delete')) {
        tasksData.splice(index, 1);
        saveTasks();
        li.remove();
        return;
    }

    // Виконано
    if (e.target.classList.contains('task-checkbox')) {
        li.classList.toggle('completed');
        tasksData[index].completed = li.classList.contains('completed');
        saveTasks();
    }
});

// ===== Фільтри =====
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.textContent.trim();
        applyFilter(filter);
    });
});

function applyFilter(filter) {
    const tasks = document.querySelectorAll('.task-item');
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        const taskDate = task.dataset.date || '';

        let show = false;

        switch (filter) {
            case 'All tasks':
                show = true;
                break;

            case 'Today':
                show = taskDate === today;
                break;

            case 'Completed':
                show = isCompleted;
                break;

            case 'Overdue':
                show = taskDate !== '' && taskDate < today && !isCompleted;
                break;
        }

        task.style.display = show ? 'flex' : 'none';
    });
}

// ===== Збереження в localStorage =====
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasksData));
}

self.addEventListener("fetch", () => {});

