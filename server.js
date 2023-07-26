const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('startDrawing', (data) => {
    console.log("un cliente empezo a dibujar");
    socket.broadcast.emit('startDrawing', data); // mandarle el inicio del evento dibujo a todos, excepto a quien lo envio
  });

  socket.on('drawing', (data) => {
    console.log("el cliente esta dibujando");
    socket.broadcast.emit('drawing', data); // dibujar el evento dibujo en todos, excepto quien lo dibujo  
  });

  socket.on('stopDrawing', () => {
    socket.broadcast.emit('stopDrawing'); //dejar de dibujar a todos
  });

  socket.on('undo', () => {
    socket.broadcast.emit('undo'); // enviar un deshacer a todos, excepto a quien lo envio
  });

  socket.on('redo', () => {
    socket.broadcast.emit('redo'); // enviar un rehacer a todos, excepto a quien lo envio
  });

  socket.on('clearCanvas', () => {
    socket.broadcast.emit('clearCanvas'); // borrarle todo a todos
  });
});

// manejar rutas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Iniciar el servidor
http.listen(3000, () => {
  console.log(`Servidor en ejecución en el puerto: 3000`);
});
