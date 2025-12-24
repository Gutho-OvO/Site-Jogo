const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// ===== IMAGENS =====
const cityMap = new Image();
cityMap.src = "assets/city_back.png";

const playerImg = new Image();
playerImg.src = "assets/player.gif";

const cityFront = new Image();
cityFront.src = "assets/city_front.png";

const telescopeViewImg = new Image();
telescopeViewImg.src = "assets/telescopio_visao.png"; // Altere para o seu caminho

// ===== CAMERA =====
const camera = {
  x: 0,
  y: 0,
  width: 960,
  height: 540
};

const cityFrontOffset = {
  x: 0, // positivo = direita | negativo = esquerda
  y: 0    // positivo = baixo | negativo = cima
};

// ===== PLAYER =====
const player = {
  x: 0,
  y: 0,
  width: 32,
  height: 32,
  speed: 0.5
};

const spawnPoint = {
  x: 520,
  y: 964
};

const telescopeObj = { x: 1409, y: 682, width: 15, height: 16 };
let isTelescopeOpen = false;

// ===== CONTROLES =====
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

window.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "e") {
        // Se estiver aberto, fecha
        if (isTelescopeOpen) {
            isTelescopeOpen = false;
        } else {
            // Se estiver fechado, verifica se o player está perto
            if (isPlayerNear(player, telescopeObj)) {
                isTelescopeOpen = true;
            }
        }
    }
    // Mantém sua lógica de movimentação
    keys[e.key] = true;
});

const ZOOM = 2; // Ajuste este número! (2 = dobro do tamanho, 3 = triplo, etc.)

function resizeCanvas() {
    // O tamanho visual continua sendo a janela toda (CSS cuida disso)
    // Mas a resolução INTERNA do canvas será menor, criando o efeito de zoom
    canvas.width = window.innerWidth / ZOOM;
    canvas.height = window.innerHeight / ZOOM;

    // A câmera agora segue o tamanho reduzido do canvas
    camera.width = canvas.width;
    camera.height = canvas.height;

    // Importante: Desativar a suavização SEMPRE após mudar o tamanho do canvas
    ctx.imageSmoothingEnabled = false;
}

// Faz o jogo se ajustar se você girar o celular ou mudar o tamanho da janela
window.addEventListener("resize", resizeCanvas);

// Função para checar proximidade (ajuste o 'dist' se precisar de mais alcance)
function isPlayerNear(p, obj) {
    const dist = 20; 
    return (
        p.x < obj.x + obj.width + dist &&
        p.x + p.width > obj.x - dist &&
        p.y < obj.y + obj.height + dist &&
        p.y + p.height > obj.y - dist
    );
}

// ===== INICIAR JOGO =====
let assetsLoaded = 0;
const TOTAL_ASSETS = 4;
telescopeViewImg.onload = assetLoaded;

function assetLoaded() {
    assetsLoaded++;

    if (assetsLoaded === TOTAL_ASSETS) {
        // EM VEZ DE: canvas.width = camera.width...
        // USE ISSO:
        resizeCanvas(); 

        player.x = spawnPoint.x;
        player.y = spawnPoint.y;

        requestAnimationFrame(loop);
    }
}

// registrar carregamento dos assets (FORA da função)
cityMap.onload = assetLoaded;
playerImg.onload = assetLoaded;
cityFront.onload = assetLoaded;

// ===== BARREIRAS =====
const barriers = [
  //ponte
  { x: 0, y: 0, width: 300, height: 1600 },
  { x: 300, y: 834, width: 1092, height: 40 },
  { x: 300, y: 1107, width: 1109, height: 48 },
  //barreiras
  { x: 1391, y: 644, width: 18, height: 214 },
  { x: 1409, y: 644, width: 384, height: 22 },
  { x: 1775, y: 430, width: 18, height: 214 },
  { x: 1295, y: 1147, width: 18, height: 350 },
  //barreira policia
  { x: 2913, y: 714, width: 18, height: 448 },
  //objetos do mapa
  { x: 1793, y: 548, width: 112, height: 21 },
  //predio
  { x: 1904, y: 346, width: 16, height: 400 },
  { x: 1920, y: 727, width: 208, height: 16 },
  { x: 2128, y: 680, width: 16, height: 66 },
  { x: 2320, y: 680, width: 16, height: 66 },
  { x: 2336, y: 727, width: 208, height: 16 },
  { x: 2544, y: 650, width: 16, height: 96 },
  { x: 2560, y: 650, width: 63, height: 16 },
  { x: 2623, y: 346, width: 16, height: 322 },
  //entrada do predio
  { x: 2144, y: 650, width: 176, height: 16 },
  //detalhes entrada meio
  { x: 2190, y: 666, width: 84, height: 1 },
  { x: 2191, y: 667, width: 82, height: 1 },
  { x: 2192, y: 668, width: 80, height: 1 },
  { x: 2193, y: 669, width: 78, height: 1 },
  { x: 2194, y: 670, width: 76, height: 1 },
  { x: 2196, y: 671, width: 72, height: 1 },
  { x: 2197, y: 672, width: 70, height: 1 },
  { x: 2199, y: 673, width: 66, height: 1 },
  { x: 2201, y: 674, width: 62, height: 1 },
  { x: 2203, y: 675, width: 58, height: 1 },
  { x: 2206, y: 676, width: 52, height: 1 },
  { x: 2209, y: 677, width: 46, height: 1 },
  { x: 2212, y: 678, width: 40, height: 1 },
  { x: 2215, y: 679, width: 34, height: 1 },
  { x: 2221, y: 680, width: 22, height: 1 },
  { x: 2227, y: 681, width: 10, height: 1 },
  //detalhes entrada esq
  { x: 2144, y: 666, width: 12, height: 3 },
  { x: 2144, y: 669, width: 11, height: 2 },
  { x: 2144, y: 671, width: 10, height: 2 },
  { x: 2144, y: 673, width: 9, height: 2 },
  { x: 2144, y: 675, width: 8, height: 1 },
  { x: 2144, y: 676, width: 7, height: 1 },
  { x: 2144, y: 677, width: 6, height: 1 },
  { x: 2144, y: 678, width: 5, height: 1 },
  { x: 2144, y: 679, width: 3, height: 1 },
  { x: 2144, y: 680, width: 1, height: 1 },
  //detalhes entrada dir
  { x: 2308, y: 666, width: 12, height: 3 },
  { x: 2309, y: 669, width: 11, height: 2 },
  { x: 2310, y: 671, width: 10, height: 2 },
  { x: 2311, y: 673, width: 9, height: 2 },
  { x: 2312, y: 675, width: 8, height: 1 },
  { x: 2313, y: 676, width: 7, height: 1 },
  { x: 2314, y: 677, width: 6, height: 1 },
  { x: 2315, y: 678, width: 5, height: 1 },
  { x: 2317, y: 679, width: 3, height: 1 },
  { x: 2319, y: 680, width: 1, height: 1 },

  { x: 1409, y: 682, width: 15, height: 16 },
];

const foregroundObjects = [
  {
    x: 1760,
    y: 640,
    width: 400,
    height: 0,
    img: new Image(),
    offsetY: 220
  }
];

foregroundObjects[0].img.src = "assets/city_front.png";

const cityFrontAreas = [
  {
    x: 1623,
    y: 940,
    width: 1300,
    height: 340
  },
  {
    x: 2144,
    y: 670,
    width: 176,
    height: 25
  }
];

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function isPlayerBehindAnyBuilding(player, areas) {
  for (const area of areas) {
    if (
      player.x + player.width > area.x &&
      player.x < area.x + area.width &&
      player.y + player.height > area.y &&
      player.y < area.y + area.height
    ) {
      return true;
    }
  }
  return false;
}

function update() {
  if (isTelescopeOpen) return; 

  let nextX = player.x;
  let nextY = player.y;

  if (keys["ArrowUp"] || keys["w"]) nextY -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) nextY += player.speed;
  if (keys["ArrowLeft"] || keys["a"]) nextX -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) nextX += player.speed;

  // Hitbox nos pés
  const hitHeight = 15;
  const hitWidth = 18; 
  const xOffset = (player.width - hitWidth) / 2; 
  const yOffset = player.height - hitHeight; 

  const futureHitbox = {
    x: nextX + xOffset,
    y: nextY + yOffset,
    width: hitWidth,
    height: hitHeight
  };

  let collided = false;
  for (const barrier of barriers) {
    if (isColliding(futureHitbox, barrier)) {
      collided = true;
      break;
    }
  }

  if (!collided) {
    player.x = nextX;
    player.y = nextY;
  }

  camera.x = player.x + player.width / 2 - camera.width / 2;
  camera.y = player.y + player.height / 2 - camera.height / 2;

  camera.x = Math.max(0, Math.min(camera.x, cityMap.width - camera.width));
  camera.y = Math.max(0, Math.min(camera.y, cityMap.height - camera.height));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Forçar suavização desligada a cada frame (garante o pixel art)
  ctx.imageSmoothingEnabled = false;

  const camX = Math.floor(camera.x);
  const camY = Math.floor(camera.y);

  // 1. FUNDO (Destino deve ser o tamanho do canvas atual)
  ctx.drawImage(
    cityMap, 
    camX, camY, camera.width, camera.height, // Corte (Source)
    0, 0, canvas.width, canvas.height       // Destino (Canvas)
  );

  // 2. PLAYER
  ctx.drawImage(
    playerImg, 
    Math.floor(player.x - camX), 
    Math.floor(player.y - camY), 
    player.width, player.height
  );

  // 3. FRENTE DO MAPA (PRÉDIOS)
  const behindBuilding = isPlayerBehindAnyBuilding(player, cityFrontAreas);
  ctx.save();
  ctx.globalAlpha = behindBuilding ? 0.4 : 1;
  ctx.drawImage(
    cityFront, 
    Math.max(0, camX), Math.max(0, camY), camera.width, camera.height, 
    0, 0, canvas.width, canvas.height
  );
  ctx.restore();

  // 4. INTERAÇÃO E OVERLAY
  if (isTelescopeOpen) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let scale = Math.floor(canvas.height / telescopeViewImg.height);
    if (scale < 1) scale = 1;

    const imgW = telescopeViewImg.width * scale;
    const imgH = telescopeViewImg.height * scale;

    ctx.drawImage(
        telescopeViewImg,
        Math.floor(canvas.width / 2 - imgW / 2),
        Math.floor(canvas.height / 2 - imgH / 2),
        imgW,
        imgH
    );

    ctx.fillStyle = "white";
    ctx.font = "12px 'Courier New', monospace"; // Fonte menor porque o canvas interno é pequeno
    ctx.textAlign = "center";
    ctx.fillText("Pressione [E] para sair", canvas.width / 2, (canvas.height / 2 + imgH / 2) + 15);
  } else {
    // Texto de "Interagir" quando perto
    if (isPlayerNear(player, telescopeObj)) {
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("[E]", (player.x + player.width / 2) - camX, (player.y - 5) - camY);
    }
  }

  
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}