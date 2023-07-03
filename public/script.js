const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorSelector = document.getElementById('color-selector');
const brushOptions = document.querySelectorAll('.brush-option');

// Configurar el tamaño del lienzo
canvas.width = 800;
canvas.height = 600;

colorSelector.addEventListener('input', handleColorSelection);

brushOptions.forEach(option => {
  option.addEventListener('click', handleBrushSelection);
});

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

let isDrawing = false;

function startDrawing(event) {
  isDrawing = true;
  draw(event);
}

function draw(event) {
  if (!isDrawing) return;

  const x = event.offsetX;
  const y = event.offsetY;

  ctx.lineTo(x, y);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
