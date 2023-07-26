const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('startDrawing', (data) => {
    console.log("un cliente empezo a dibujar");
    socket.broadcast.emit('startDrawing', data); // Emitir el evento de inicio de dibujo a todos los clientes, excepto al emisor
  });

  socket.on('drawing', (data) => {
    console.log("el cliente esta dibujando");
    socket.broadcast.emit('drawing', data); // Emitir el evento de dibujo a todos los clientes, excepto al emisor
  });

  socket.on('stopDrawing', () => {
    socket.broadcast.emit('stopDrawing'); // Emitir el evento de fin de dibujo a todos los clientes, excepto al emisor
  });

  socket.on('undo', () => {
    socket.broadcast.emit('undo'); // Emitir el evento de deshacer a todos los clientes, excepto al emisor
  });

  socket.on('redo', () => {
    socket.broadcast.emit('redo'); // Emitir el evento de rehacer a todos los clientes, excepto al emisor
  });

  socket.on('clearCanvas', () => {
    socket.broadcast.emit('clearCanvas'); // Emitir el evento de borrado del lienzo a todos los clientes, excepto al emisor
  });
});

// Manejador de ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Iniciar el servidor
http.listen(3000, () => {
  console.log(`Servidor en ejecución en el puerto: 3000`);
});
