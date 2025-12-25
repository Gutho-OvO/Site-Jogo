// ===== CAMERA =====
const camera = {
  x: 0,
  y: 0,
  width: 960,
  height: 540
};

const ZOOM = 2;


// Função resizeCanvas
function resizeCanvas() {
  canvas.width = window.innerWidth / ZOOM;
  canvas.height = window.innerHeight / ZOOM;
  camera.width = canvas.width;
  camera.height = canvas.height;
  ctx.imageSmoothingEnabled = false;
}

function updateCamera() {
  camera.x = player.x + player.width / 2 - camera.width / 2;
  camera.y = player.y + player.height / 2 - camera.height / 2;
  // Trava a câmera nas bordas do mapa (cityMap deve estar carregado)
  camera.x = Math.max(0, Math.min(camera.x, cityMap.width - camera.width));
  camera.y = Math.max(0, Math.min(camera.y, cityMap.height - camera.height));
}

// Só registra o evento
window.addEventListener("resize", resizeCanvas);

