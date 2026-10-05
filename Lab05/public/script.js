const studentForm = document.querySelector('#student-form');
const inputNombre = document.querySelector('#nombre');
const inputCurso = document.querySelector('#curso');
const inputCui = document.querySelector('#cui');
const studentList = document.querySelector('#student-list');
const btnReload = document.querySelector('#btn-reload');
const alertContainer = document.querySelector('#alert-container');

function showAlert(message, type = 'danger') {
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

function clearAlert() {
    alertContainer.innerHTML = '';
}

async function fetchEstudiantes() {
    try {
        const response = await fetch('/api/estudiantes');
        if (!response.ok) throw new Error('Error al obtener los datos');
        
        const data = await response.json();
        renderEstudiantes(data);
    } catch (error) {
        studentList.innerHTML = `<li class="list-group-item text-center text-danger">Error al cargar la lista de estudiantes.</li>`;
    }
}

function renderEstudiantes(estudiantes) {
    studentList.innerHTML = '';

    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
        studentList.innerHTML = `<li class="list-group-item text-center text-muted">No hay estudiantes registrados.</li>`;
        return;
    }

    estudiantes.forEach(est => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <strong>${est.nombre}</strong>
                <div class="text-muted small">Asignatura: ${est.curso} ${est.cui ? '| CUI: ' + est.cui : ''}</div>
            </div>
            <span class="badge bg-secondary">ID: ${est.id}</span>
        `;
        studentList.appendChild(li);
    });
}

studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const nombre = inputNombre.value.trim();
    const curso = inputCurso.value.trim();
    const cui = inputCui.value.trim();

    if (!nombre || !curso) {
        showAlert('Los campos Apellidos y Nombres y Asignatura son obligatorios.');
        return;
    }

    const newStudent = { nombre, curso, cui };

    try {
        const response = await fetch('/api/estudiantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStudent)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Error al guardar');
        }

        showAlert('Estudiante registrado exitosamente.', 'success');
        studentForm.reset();
        fetchEstudiantes();
    } catch (error) {
        showAlert(error.message);
    }
});

btnReload.addEventListener('click', fetchEstudiantes);

document.addEventListener('DOMContentLoaded', fetchEstudiantes);