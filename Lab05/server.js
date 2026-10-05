const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'estudiantes.json');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
    console.log(`Petición recibida: ${req.method} ${req.url}`);

    if (req.method === 'GET' && req.url === '/api/estudiantes') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error al leer la base de datos' }));
            }
            const content = data.trim() === '' ? '[]' : data;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(content);
        });
        return;
    }

    if (req.method === 'POST' && req.url === '/api/estudiantes') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newStudent = JSON.parse(body);

                if (!newStudent.nombre || !newStudent.curso) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Nombre y curso son obligatorios' }));
                }

                fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                    let estudiantes = [];
                    if (!err && data && data.trim() !== '') {
                        try {
                            estudiantes = JSON.parse(data);
                        } catch (e) {
                            estudiantes = [];
                        }
                    }

                    newStudent.id = Date.now();
                    estudiantes.push(newStudent);

                    fs.writeFile(DATA_FILE, JSON.stringify(estudiantes, null, 2), err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ message: 'Error al guardar el archivo' }));
                        }

                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(newStudent));
                    });
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'JSON malformado recibido' }));
            }
        });
        return;
    }

    if (req.method === 'GET' && req.url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'OK', uptime: process.uptime() }));
        return;
    }

    if (req.method === 'GET') {
        let filePath = req.url === '/' ? '/index.html' : req.url;
        const fullPath = path.join(__dirname, 'public', filePath);
        const ext = path.extname(fullPath);
        const contentType = MIME_TYPES[ext] || 'text/plain';

        fs.readFile(fullPath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Ruta no encontrada' }));
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});