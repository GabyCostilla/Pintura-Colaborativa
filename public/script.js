const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurar el tamaño del lienzo
canvas.width = 800;
canvas.height = 600;

let isDrawing = false;

// Función para iniciar un trazo
function startDrawing(event) {
  isDrawing = true;
  draw(event);
}

// Función para dibujar en el lienzo
function draw(event) {
  if (!isDrawing) return;

  const x = event.offsetX;
  const y = event.offsetY;

  ctx.lineTo(x, y);
  ctx.stroke();

  // Enviar el trazo al servidor usando Socket.IO
  const trazo = { x, y };
  socket.emit('dibujo', trazo);
}

// Función para detener el trazo
function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

// Agregar eventos de mouse al lienzo
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Establecer conexión con el servidor Socket.IO
const socket = io();

// Manejar evento de dibujo en el cliente
canvas.addEventListener('mousemove', (event) => {
  if (event.buttons !== 1) return; // Solo dibujar cuando se mantiene presionado el botón del mouse
  const trazo = { x: event.offsetX, y: event.offsetY };
  socket.emit('dibujo', trazo); // Enviar el trazo al servidor
});
