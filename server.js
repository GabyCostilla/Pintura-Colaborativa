const express = require('express');
const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('dibujo', (trazo) => {
    io.emit('dibujo', trazo); // Emitir el trazo a todos los clientes, incluyendo el emisor
  });
});

// Manejador de ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Iniciar el servidor
http.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto: ${port}`);
});
