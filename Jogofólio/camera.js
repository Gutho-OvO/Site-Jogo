// ===== CAMERA =====
const camera = {
  x: 0,
  y: 0,
  width: 960,
  height: 540
};

const ZOOM = 4;


// Função resizeCanvas
function resizeCanvas() {
  canvas.width = window.innerWidth / ZOOM;
  canvas.height = window.innerHeight / ZOOM;
  camera.width = canvas.width;
  camera.height = canvas.height;
  ctx.imageSmoothingEnabled = false;
}

window.updateCamera = function() {
  camera.x = player.x + player.width / 2 - camera.width / 2;
  camera.y = player.y + player.height / 2 - camera.height / 2;

  const mapWidth  = currentMap === "city" ? cityMap.width  : buildingMap.width;
  const mapHeight = currentMap === "city" ? cityMap.height : buildingMap.height;

  camera.x = Math.max(0, Math.min(camera.x, mapWidth - camera.width));
  camera.y = Math.max(0, Math.min(camera.y, mapHeight - camera.height));
}

window.addEventListener("resize", resizeCanvas);

