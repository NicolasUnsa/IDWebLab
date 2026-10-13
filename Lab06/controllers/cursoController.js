const cursos = require('../data/cursosData');

// GET /api/cursos (permite filtrar opcionalmente por nombre ej: ?nombre=Web)
exports.getAllCursos = (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (nombre) {
      const cursosFiltrados = cursos.filter(c => 
        c.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
      return res.status(200).json({ status: 'success', results: cursosFiltrados.length, data: cursosFiltrados });
    }
    res.status(200).json({ status: 'success', results: cursos.length, data: cursos });
  } catch (error) {
    next(error);
  }
};

// GET /api/cursos/:id
exports.getCursoById = (req, res, next) => {
  try {
    const cursoId = parseInt(req.params.id);
    const curso = cursos.find(c => c.id === cursoId);

    if (!curso) {
      return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
    }

    res.status(200).json({ status: 'success', data: curso });
  } catch (error) {
    next(error);
  }
};

// POST /api/cursos
exports.createCurso = (req, res, next) => {
  try {
    const { nombre, codigo, creditos } = req.body;

    if (!nombre || !codigo || !creditos) {
      return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios (nombre, codigo, creditos)' });
    }

    const nuevoCurso = {
      id: cursos.length > 0 ? cursos[cursos.length - 1].id + 1 : 1,
      nombre,
      codigo,
      creditos: parseInt(creditos)
    };

    cursos.push(nuevoCurso);
    res.status(201).json({ status: 'success', data: nuevoCurso });
  } catch (error) {
    next(error);
  }
};

// PUT /api/cursos/:id
exports.updateCurso = (req, res, next) => {
  try {
    const cursoId = parseInt(req.params.id);
    const cursoIndex = cursos.findIndex(c => c.id === cursoId);

    if (cursoIndex === -1) {
      return res.status(404).json({ status: 'fail', message: 'Curso no encontrado para actualizar' });
    }

    const { nombre, codigo, creditos } = req.body;
    
    cursos[cursoIndex] = {
      id: cursoId,
      nombre: nombre || cursos[cursoIndex].nombre,
      codigo: codigo || cursos[cursoIndex].codigo,
      creditos: creditos ? parseInt(creditos) : cursos[cursoIndex].creditos
    };

    res.status(200).json({ status: 'success', data: cursos[cursoIndex] });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cursos/:id
exports.deleteCurso = (req, res, next) => {
  try {
    const cursoId = parseInt(req.params.id);
    const cursoIndex = cursos.findIndex(c => c.id === cursoId);

    if (cursoIndex === -1) {
      return res.status(404).json({ status: 'fail', message: 'Curso no encontrado para eliminar' });
    }

    cursos.splice(cursoIndex, 1);
    res.status(200).json({ status: 'success', message: 'Curso eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};