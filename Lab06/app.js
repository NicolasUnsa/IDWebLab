const express = require('express');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();

// 1. Middleware global incorporado para JSON parser
app.use(express.json());

// 2. Middleware personalizado de Auditoría (Logger) midiendo el tiempo de respuesta
app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
    console.log(`[${new Date().toISOString()}] Método: ${req.method} | URL: ${req.originalUrl} | Estado: ${res.statusCode} | Tiempo: ${timeInMs} ms`);
  });

  next();
});

// 3. Montaje de rutas
app.use('/api/cursos', cursoRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenido a la API RESTful del Laboratorio 06 - Cursos Académicos' });
});

// 4. Middleware global de Manejo de Errores (HTTP 500)
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno en el servidor',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
});

module.exports = app;