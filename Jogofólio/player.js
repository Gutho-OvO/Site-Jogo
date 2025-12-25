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