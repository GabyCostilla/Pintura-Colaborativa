// Establecer conexión con el servidor Socket.IO
const socket = io();

// Manejar evento de dibujo en el cliente
canvas.addEventListener('mousemove', (event) => {
  if (event.buttons !== 1) return; // Solo dibujar cuando se mantiene presionado el botón del mouse
  const trazo = { x: event.clientX, y: event.clientY };
  socket.emit('dibujo', trazo); // Enviar el trazo al servidor
});
