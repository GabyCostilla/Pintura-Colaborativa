const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorSelector = document.getElementById('color-selector');
const brushOptions = document.querySelectorAll('.brush-option');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');
const eraseButton = document.getElementById('erase-button');
const clearButton = document.getElementById('clear-button');
const saveButton = document.getElementById('save-button');
let undoStack = []; // Pila para almacenar los trazos deshechos
let redoStack = []; // Pila para almacenar los trazos rehechos
let isDrawing = false;
let currentPath = []; // Almacena los puntos del trazo actual
let isErasing = false;

// Configurar el tamaño del lienzo
canvas.width = 800;
canvas.height = 600;

// Configurar conexión con el servidor Socket.IO
const socket = io.connect('http://localhost:3000');


colorSelector.addEventListener('input', handleColorSelection);
brushOptions.forEach(option => {
  option.addEventListener('click', handleBrushSelection);
});
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
eraseButton.addEventListener('click', toggleErasing);
clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvas);

function handleColorSelection() {
  const selectedColor = colorSelector.value;
  ctx.strokeStyle = selectedColor;
}

function handleBrushSelection(event) {
  const selectedBrush = event.target.dataset.brush;

  if (selectedBrush === 'small') {
    ctx.lineWidth = 2;
  } else if (selectedBrush === 'medium') {
    ctx.lineWidth = 5;
  } else if (selectedBrush === 'large') {
    ctx.lineWidth = 10;
  }
}

function toggleErasing() {
  isErasing = !isErasing;

  if (isErasing) {
    eraseButton.classList.add('active');
  } else {
    eraseButton.classList.remove('active');
  }
}

function startDrawing(event) {
  console.log("dibujando");
  isDrawing = true;
  currentPath = [];
  currentPath.push({ x: event.offsetX, y: event.offsetY });

  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);

  // Emitir el evento de inicio de dibujo al servidor
  socket.emit('startDrawing', { x: event.offsetX, y: event.offsetY });
}

function draw(event) {
  if (!isDrawing || isErasing) return;

  const x = event.offsetX;
  const y = event.offsetY;

  currentPath.push({ x, y });

  ctx.lineTo(x, y);
  ctx.stroke();

  // Emitir el evento de dibujo al servidor
  socket.emit('drawing', { x, y });
}

function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;

    // Guardar el trazo realizado en la pila de deshacer
    undoStack.push({
      color: ctx.strokeStyle,
      brushSize: ctx.lineWidth,
      points: [...currentPath]
    });
    currentPath = [];

    // Emitir el evento de fin de dibujo al servidor
    socket.emit('stopDrawing');
  }
}

function undo() {
  if (undoStack.length === 0) return; // No hay trazos para deshacer

  const trazo = undoStack.pop();
  redoStack.push(trazo);

  redrawCanvas(); // Volver a dibujar todos los trazos

  // Emitir el evento de deshacer al servidor
  socket.emit('undo');
}

function redo() {
  if (redoStack.length === 0) return; // No hay trazos para rehacer

  const trazo = redoStack.pop();
  undoStack.push(trazo);

  redrawCanvas(); // Volver a dibujar todos los trazos

  // Emitir el evento de rehacer al servidor
  socket.emit('redo');
}

function redrawCanvas() {
  // Limpiar el lienzo
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Volver a dibujar todos los trazos almacenados en undoStack
  undoStack.forEach(trazo => {
    ctx.strokeStyle = trazo.color;
    ctx.lineWidth = trazo.brushSize;

    ctx.beginPath();
    ctx.moveTo(trazo.points[0].x, trazo.points[0].y);

    for (let i = 1; i < trazo.points.length; i++) {
      ctx.lineTo(trazo.points[i].x, trazo.points[i].y);
    }

    ctx.stroke();
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Borra todo el contenido del lienzo
  undoStack = []; // Reinicia la pila de deshacer
  redoStack = []; // Reinicia la pila de rehacer

  // Emitir el evento de borrado al servidor
  socket.emit('clearCanvas');
}

function saveCanvas() {
  const dataURL = canvas.toDataURL(); // Obtiene la imagen del lienzo en formato base64
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'lienzo.png'; // Establece el nombre de descarga del archivo
  link.click(); // Simula un clic en el enlace para iniciar la descarga
}

// Manejar eventos del servidor

socket.on('startDrawing', (data) => {
  isDrawing = true;
  currentPath = [];
  currentPath.push(data);
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
});

socket.on('drawing', (data) => {
  if (!isDrawing || isErasing) return;
  currentPath.push(data);
  ctx.lineTo(data.x, data.y);
  ctx.stroke();
});

socket.on('stopDrawing', () => {
  isDrawing = false;
});

socket.on('undo', () => {
  if (undoStack.length === 0) return;
  const trazo = undoStack.pop();
  redoStack.push(trazo);
  redrawCanvas();
});

socket.on('redo', () => {
  if (redoStack.length === 0) return;
  const trazo = redoStack.pop();
  undoStack.push(trazo);
  redrawCanvas();
});

socket.on('clearCanvas', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = [];
  redoStack = [];
});
