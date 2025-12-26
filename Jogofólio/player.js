// ===== PLAYER =====
const player = {
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    speed: 0.7,

    direction: "down",
    frame: 0,
    frameTimer: 0,
    frameDelay: 25,
    moving: false
};

const spawnPoint = { x: 520, y: 964 };

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function isInsideArea(player, area) {
  return (
    player.x < area.x + area.width &&
    player.x + player.width > area.x &&
    player.y < area.y + area.height &&
    player.y + player.height > area.y
  );
}

function updatePlayer() {

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) dy--;
    if (keys["s"] || keys["arrowdown"]) dy++;
    if (keys["a"] || keys["arrowleft"]) dx--;
    if (keys["d"] || keys["arrowright"]) dx++;

    player.moving = dx !== 0 || dy !== 0;

    // 🧭 DIREÇÃO
    if (player.moving) {
        if (dx === 0 && dy === -1) player.direction = "up";
        else if (dx === 0 && dy === 1) player.direction = "down";
        else if (dx === -1 && dy === 0) player.direction = "left";
        else if (dx === 1 && dy === 0) player.direction = "right";
        else if (dx === -1 && dy === -1) player.direction = "up-left";
        else if (dx === 1 && dy === -1) player.direction = "up-right";
        else if (dx === -1 && dy === 1) player.direction = "down-left";
        else if (dx === 1 && dy === 1) player.direction = "down-right";
    }

    // 🔄 NORMALIZA DIAGONAL
    const len = Math.hypot(dx, dy);
    if (len !== 0) {
        dx /= len;
        dy /= len;
    }

    // 🔮 PRÓXIMA POSIÇÃO
    const nextX = player.x + dx * player.speed;
    const nextY = player.y + dy * player.speed;

    // 👣 HITBOX NOS PÉS
    const hitbox = {
        x: nextX + (player.width - 18) / 2,
        y: nextY + player.height - 15,
        width: 18,
        height: 15
    };

    let collided = false;

    const activeBarriers = currentMap === "city" ? barriers : buildingBarriers;

    for (const barrier of activeBarriers) {
        if (isColliding(hitbox, barrier)) {
            collided = true;
            break;
        }
    }

    // 🚧 APLICA MOVIMENTO
    if (!collided) {
        player.x = nextX;
        player.y = nextY;
    }

    // 🎞️ ANIMAÇÃO
  if (player.moving && !collided) {
      player.frameTimer++;

      if (player.frameTimer >= player.frameDelay) {
          player.frame++;

          if (player.frame > 4) {
              player.frame = 1; // volta para primeiro frame andando
          }

          player.frameTimer = 0;
      }
  } else {
      player.frame = 0; // parado
  }

    updateCamera();
}
