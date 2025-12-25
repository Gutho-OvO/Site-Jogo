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

const cloudsImg = new Image();
cloudsImg.src = "assets/clouds.png";

const objectsImg = new Image();
objectsImg.src = "assets/objects.png";

const npc1Img = new Image(); 
npc1Img.src = "assets/npc_moeda.png"; 

const npc2Img = new Image(); 
npc2Img.src = "assets/npc_fixo1.png";

const npc3Img = new Image(); 
npc3Img.src = "assets/npc_fixo2.png";

const npc4FrontImg = new Image(); 
npc4FrontImg.src = "assets/npc_pose_frente.png";

const npc4DiagImg = new Image(); 
npc4DiagImg.src = "assets/npc_pose_diag.png";

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

let teleportFading = false;
let teleportFadeOpacity = 0;
let teleportStep = ""; // "out" | "in"
let teleportWaitTime = 0; // contador de espera

const spawnPoint = {
  x: 520,
  y: 964
};

const telescopeObj = { x: 1409, y: 682, width: 15, height: 16 };
let isTelescopeOpen = false;

const npcs = [
  { 
    id: "moeda", x: 2640, y: 342, width: 32, height: 32, img: npc1Img, 
    dialogue: ["New..", "N-NEWT!!!!! A QUANTO TEMPO QUE EU NÃO TE VEJO", "Pera, que?", "E tu nem me avisou nada?", "Simples assim?", "Beleza viu.", "Faz tanto tempo que eu queria te ver mas tu me aparece justo quando eu to ocupado cara.", "Quer saber, tu deveria dar uma olhada nesse predio grande a sua esquerda.", "Pelo visto tem umas parada interessante lá.", "Bom, nois se ve por ai :)", "A, quase esqueci, pega essa moeda aqui, sei la vai que tu precisa."] 
  },
  { id: "fixo1", x: 298, y: 900, width: 32, height: 32, img: npc2Img, dialogue: ["Atenção cidadão.", "Essa area se encontra indisponivel no momento."] },
  { id: "fixo2", x: 298, y: 1025, width: 32, height: 32, img: npc3Img, dialogue: ["O telescópio é incrível."] },
  { 
    id: "dinamico", x: 1480, y: 655, width: 32, height: 32, 
    imgFront: npc4FrontImg, imgDiag: npc4DiagImg, 
    dialogue: ["Opa bom dia, tu deve ser novo por aqui.", "Bem vindo a Riverviews, aqui ta só o pó da rabiola mas é bem bonito.", "Isso aqui é um observador, se tu quiser dar uma olhada na vista esteja a vontade, mas primeiro tu precisa de uma moeda.", "Eu aconselho tu dar uma olhada no predio rosa aqui do lado, tem umas coisas bacanas lá.."] 
  }
];

// Controle de Diálogo
let currentDialogue = null; // Quando null, ninguém está falando
let dialogueIndex = 0;

// --- NOVAS VARIÁVEIS ---
let playerHasCoin = false; 
const npcObj = { x: 600, y: 964, width: 32, height: 32 }; // Posição do NPC

// Variáveis do Fade
let fadeOpacity = 0;
let isFading = false;
let fadeTarget = ""; // "open", "show", "hide"

// ===== CONTROLES =====
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

window.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "e" && !isFading) {
        // 1. Se já tem um diálogo aberto, passa para a próxima frase
        if (currentDialogue) {
            dialogueIndex++;
            if (dialogueIndex >= currentDialogue.length) {
                currentDialogue = null; // Fecha o diálogo
                dialogueIndex = 0;
            }
            return; // Encerra aqui para não abrir o telescópio ao mesmo tempo
        }

        // 2. Tenta conversar com algum NPC da lista
        let interectedWithNpc = false;
        npcs.forEach(npc => {
            if (isPlayerNear(player, npc)) {
                currentDialogue = npc.dialogue;
                dialogueIndex = 0;
                interectedWithNpc = true;

                // Lógica da moeda
                if (npc.id === "moeda" && !playerHasCoin) {
                    playerHasCoin = true;
                    console.log("Moeda coletada!");
                }
            }
        });

        if (interectedWithNpc) return; // Se falou com NPC, não tenta abrir o telescópio

        // 3. Lógica do Telescópio
        if (isTelescopeOpen) {
            isFading = true;
            fadeTarget = "hide";
        } else if (isPlayerNear(player, telescopeObj)) {
            if (playerHasCoin) {
                isFading = true;
                fadeTarget = "open";
            } else {
                console.log("Você precisa de uma moeda!");
            }
        }
    }
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

function getNpc4Image(npc, player) {
    const dx = player.x - npc.x;
    const dy = player.y - npc.y;
    // Se o player estiver muito na diagonal (ex: dx e dy parecidos)
    if (Math.abs(dx) > 10 && Math.abs(dy) > 10) {
        return npc.imgDiag;
    }
    return npc.imgFront;
}

// ===== INICIAR JOGO =====
const TOTAL_ASSETS = 11; 
let assetsLoaded = 0;

function assetLoaded() {
    assetsLoaded++;
    console.log("Asset carregado: " + assetsLoaded + "/" + TOTAL_ASSETS);
    if (assetsLoaded === TOTAL_ASSETS) {
        resizeCanvas(); 
        player.x = spawnPoint.x;
        player.y = spawnPoint.y;
        requestAnimationFrame(loop);
    }
}

// Garanta que TODOS esses abaixo existam no seu código:
cityMap.onload = assetLoaded;
playerImg.onload = assetLoaded;
cityFront.onload = assetLoaded;
cloudsImg.onload = assetLoaded;
telescopeViewImg.onload = assetLoaded;
objectsImg.onload = assetLoaded;
npc1Img.onload = assetLoaded;
npc2Img.onload = assetLoaded;
npc3Img.onload = assetLoaded;
npc4FrontImg.onload = assetLoaded;
npc4DiagImg.onload = assetLoaded;

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

const teleportArea = {
  x: 1311,
  y: 1450,
  width: 800,
  height: 300
};

const teleportTarget = {
  x: 1450,
  y: 1225
};

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
  },
];

const cloudsAreas = [
  {
    x: 1311,
    y: 1347,
    width: 800,
    height: 300
  }
];

function isInsideArea(player, area) {
  return (
    player.x < area.x + area.width &&
    player.x + player.width > area.x &&
    player.y < area.y + area.height &&
    player.y + player.height > area.y
  );
}

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
  if (currentDialogue) return; // Trava o movimento durante o diálogo

  // --- LÓGICA DO FADE (ADICIONE AQUI) ---
    if (isFading) {
        if (fadeTarget === "open") {
            fadeOpacity += 0.05; // Escurece
            if (fadeOpacity >= 1) {
                fadeOpacity = 1;
                isTelescopeOpen = true; 
                fadeTarget = "show"; // Agora vai clarear com o telescópio aberto
            }
        } else if (fadeTarget === "show" || fadeTarget === "hide") {
            fadeOpacity -= 0.05; // Clareia
            if (fadeOpacity <= 0) {
                fadeOpacity = 0;
                isFading = false;
                if (fadeTarget === "hide") isTelescopeOpen = false;
            }
        }
        return; // IMPORTANTE: Trava o player enquanto o fade acontece
    }


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

  // ===== INICIAR TELEPORTE =====
  if (!teleportFading && isInsideArea(player, teleportArea)) {
    teleportFading = true;
    teleportStep = "out";
    teleportFadeOpacity = 0;
  }

  // ===== FADE DE TELEPORTE COM ESPERA =====
  if (teleportFading) {

    // FADE OUT
    if (teleportStep === "out") {
      teleportFadeOpacity += 0.05;

      if (teleportFadeOpacity >= 1) {
        teleportFadeOpacity = 1;
        teleportStep = "wait";
        teleportWaitTime = 0; // reseta o tempo
      }
    }

    // ESPERA 3 SEGUNDOS (≈ 180 frames)
    else if (teleportStep === "wait") {
      teleportWaitTime++;

      if (teleportWaitTime >= 180) {
        // TELEPORTA APÓS A ESPERA
        player.x = teleportTarget.x;
        player.y = teleportTarget.y;

        teleportStep = "in";
      }
    }

    // FADE IN
    else if (teleportStep === "in") {
      teleportFadeOpacity -= 0.05;

      if (teleportFadeOpacity <= 0) {
        teleportFadeOpacity = 0;
        teleportFading = false;
        teleportStep = "";
      }
    }

    return; // player totalmente travado durante tudo
  }


  camera.x = player.x + player.width / 2 - camera.width / 2;
  camera.y = player.y + player.height / 2 - camera.height / 2;

  camera.x = Math.max(0, Math.min(camera.x, cityMap.width - camera.width));
  camera.y = Math.max(0, Math.min(camera.y, cityMap.height - camera.height));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Forçar suavização desligada para Pixel Art
    ctx.imageSmoothingEnabled = false;

    const camX = Math.floor(camera.x);
    const camY = Math.floor(camera.y);

    // 1. FUNDO
    ctx.drawImage(
        cityMap, 
        camX, camY, camera.width, camera.height,
        0, 0, canvas.width, canvas.height
    );

    // 2. PLAYER (Desenhado antes dos NPCs e prédios)
    ctx.drawImage(
        playerImg, 
        Math.floor(player.x - camX), 
        Math.floor(player.y - camY), 
        player.width, player.height
    );

    // 4. OBJETOS DO MAPA (objectsImg)
    ctx.drawImage(objectsImg, camX, camY, camera.width, camera.height, 0, 0, canvas.width, canvas.height);

    // 5. CAMADA DE PRÉDIOS (city_front) com transparência
    const behindBuilding = isPlayerBehindAnyBuilding(player, cityFrontAreas);
    ctx.save();
    ctx.globalAlpha = behindBuilding ? 0.4 : 1;
    ctx.drawImage(
        cityFront,
        camX, camY, camera.width, camera.height,
        0, 0, canvas.width, canvas.height
    );
    ctx.restore();

    // 6. CAMADA DE NUVENS
    const behindClouds = isPlayerBehindAnyBuilding(player, cloudsAreas);
    ctx.save();
    ctx.globalAlpha = behindClouds ? 0.4 : 1;
    ctx.drawImage(
        cloudsImg,
        camX, camY, camera.width, camera.height,
        0, 0, canvas.width, canvas.height
    );
    ctx.restore();

    // --- DESENHAR TODOS OS NPCS DA LISTA (Modo Debug) ---
    npcs.forEach(npc => {
      let imgToDraw = npc.img;
      
      if (npc.id === "dinamico") {
          imgToDraw = getNpc4Image(npc, player);
      }

      // 2. DESENHA A IMAGEM POR CIMA
      if (imgToDraw && imgToDraw.complete) {
          ctx.drawImage(
              imgToDraw,
              Math.floor(npc.x - camX),
              Math.floor(npc.y - camY),
              npc.width,
              npc.height
          );
      }

      // 3. DESENHA O BALÃO [E] SE ESTIVER PERTO
      if (isPlayerNear(player, npc)) {
          ctx.fillStyle = "white";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillText("[E] Falar", (npc.x + npc.width / 2) - camX, (npc.y - 5) - camY);
      }
    });

    // 7. INTERFACE (Moeda no canto da tela)
    if (playerHasCoin) {
        ctx.fillStyle = "gold";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("🪙", 15, 30);
    }

    // 8. TELESCÓPIO (Overlay de visão)
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
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Pressione [E] para sair", canvas.width / 2, (canvas.height / 2 + imgH / 2) + 15);
    } else if (isPlayerNear(player, telescopeObj)) {
        // Ícone de interagir no telescópio
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("[E] Usar Telescópio", (telescopeObj.x + telescopeObj.width / 2) - camX, (telescopeObj.y - 5) - camY);
    }

    // 9. CAIXA DE DIÁLOGO (Sempre por cima de quase tudo)
    drawDialogue();

    // 10. FADES (Transições de tela)
    if (fadeOpacity > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (teleportFadeOpacity > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${teleportFadeOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawDialogue() {
    if (!currentDialogue) return;

    const padding = 20;
    const boxHeight = 80;
    const boxY = canvas.height - boxHeight - 20;

    // Fundo do Balão (Borda branca, fundo preto)
    ctx.fillStyle = "white";
    ctx.fillRect(padding - 2, boxY - 2, canvas.width - (padding * 2) + 4, boxHeight + 4);
    ctx.fillStyle = "black";
    ctx.fillRect(padding, boxY, canvas.width - (padding * 2), boxHeight);

    // Texto
    ctx.fillStyle = "white";
    ctx.font = "14px 'Courier New', monospace";
    ctx.textAlign = "left";
    
    // Mostra a linha atual do diálogo
    const text = currentDialogue[dialogueIndex];
    ctx.fillText(text, padding + 20, boxY + 35);
    
    ctx.font = "10px Arial";
    ctx.fillText("Aperte [E] para continuar...", canvas.width - 150, boxY + boxHeight - 10);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}