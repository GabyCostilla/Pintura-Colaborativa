const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorSelector = document.getElementById('color-selector');
const brushOptions = document.querySelectorAll('.brush-option');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');
let undoStack = []; // Pila para almacenar los trazos deshechos
let redoStack = []; // Pila para almacenar los trazos rehechos
let isDrawing = false;

// Configurar el tamaño del lienzo
canvas.width = 800;
canvas.height = 600;

colorSelector.addEventListener('input', handleColorSelection);

brushOptions.forEach(option => {
  option.addEventListener('click', handleBrushSelection);
});

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);

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

function startDrawing(event) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}

function draw(event) {
  if (!isDrawing) return;

  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
}

function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    ctx.closePath();

    // Guardar el trazo realizado en la pila de deshacer
    const trazo = {
      color: ctx.strokeStyle,
      brushSize: ctx.lineWidth,
      points: []
    };

    undoStack.push(trazo);
    redoStack = []; // Limpiar la pila de rehacer
  }
}

function undo() {
  if (undoStack.length === 0) return; // No hay trazos para deshacer

  const trazo = undoStack.pop();
  redoStack.push(trazo);

  redrawCanvas(); // Volver a dibujar todos los trazos
}

function redo() {
  if (redoStack.length === 0) return; // No hay trazos para rehacer

  const trazo = redoStack.pop();
  undoStack.push(trazo);

  redrawCanvas(); // Volver a dibujar todos los trazos
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
      ctx.stroke();
    }
  });
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
