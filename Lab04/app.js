const form = document.querySelector('#todo-form');
const inputTitulo = document.querySelector('#todo-input');
const inputCurso = document.querySelector('#todo-course');
const inputFecha = document.querySelector('#todo-date');
const list = document.querySelector('#todo-list');
const alertContainer = document.querySelector('#alert-container');
const filterButtons = document.querySelector('#filter-buttons');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function showAlert(message) {
    alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>¡Atención!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

function clearAlert() {
    alertContainer.innerHTML = '';
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    list.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completada;
        if (currentFilter === 'completed') return task.completada;
        return true;
    });

    if (filteredTasks.length === 0) {
        list.innerHTML = `<li class="list-group-item text-center text-muted">No hay tareas para mostrar.</li>`;
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completada ? 'bg-light' : ''}`;
        
        const textStyle = task.completada ? 'text-decoration-line-through text-muted' : '';
        const badgeStyle = task.completada ? 'bg-secondary' : 'bg-info text-dark';

        li.innerHTML = `
            <div class="me-auto">
                <h6 class="mb-1 ${textStyle}">${task.titulo}</h6>
                <small class="text-muted">Curso: <strong>${task.curso}</strong> | Vence: ${task.fechaEntrega}</small>
            </div>
            <div class="d-flex align-items-center gap-2">
                <span class="badge ${badgeStyle}">${task.completada ? 'Completada' : 'Pendiente'}</span>
                <button class="btn btn-sm ${task.completada ? 'btn-warning' : 'btn-success'} toggle-btn" data-id="${task.id}">
                    ${task.completada ? 'Desmarcar' : 'Completar'}
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${task.id}">Eliminar</button>
            </div>
        `;
        list.appendChild(li);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAlert();

    const titulo = inputTitulo.value.trim();
    const curso = inputCurso.value.trim();
    const fechaEntrega = inputFecha.value;

    if (!titulo || !curso || !fechaEntrega) {
        showAlert('Todos los campos son obligatorios.');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (fechaEntrega < today) {
        showAlert('La fecha de entrega no puede ser anterior a la fecha actual.');
        return;
    }

    const newTask = {
        id: Date.now(),
        titulo,
        curso,
        fechaEntrega,
        completada: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    form.reset();
});

list.addEventListener('click', (e) => {
    const target = e.target;
    const id = Number(target.getAttribute('data-id'));

    if (!id) return;

    if (target.classList.contains('delete-btn')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    if (target.classList.contains('toggle-btn')) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completada = !task.completada;
            saveTasks();
            renderTasks();
        }
    }
});

filterButtons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {

        document.querySelectorAll('#filter-buttons button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    }
});

document.addEventListener('DOMContentLoaded', renderTasks);