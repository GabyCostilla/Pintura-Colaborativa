const express = require('express');
const app = express();
const port = 2500;
const http = require('http').createServer(app);
const io = require('socket.io')(http);


app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
  
    // Manejar evento de dibujo
    socket.on('dibujo', (trazo) => {
      // Emitir el trazo a todos los clientes, incluyendo el emisor
      io.emit('dibujo', trazo);
    });
  });
  

// Manejador de ruta para la página principal
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Iniciar el servidor
http.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto: ${port}`);
  });
  