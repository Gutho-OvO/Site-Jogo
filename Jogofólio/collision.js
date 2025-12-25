// ===== BARREIRAS =====
const barriers = [
  //ponte
  { x: 0, y: 0, width: 300, height: 1600 },
  { x: 300, y: 834, width: 1092, height: 40 },
  { x: 300, y: 1107, width: 1109, height: 48 },
  // ... (Cole aqui TODAS as outras barreiras que você listou antes)
  { x: 1409, y: 682, width: 15, height: 16 },
];

const teleportArea = {
  x: 1311, y: 1450, width: 800, height: 300
};

const teleportTarget = {
  x: 1450, y: 1225
};

// Áreas que deixam as coisas transparentes
const cityFrontAreas = [
  { x: 1623, y: 940, width: 1300, height: 340 },
  { x: 2144, y: 670, width: 176, height: 25 },
];

const cloudsAreas = [
  { x: 1311, y: 1347, width: 800, height: 300 }
];

const telescopeObj = { x: 1409, y: 682, width: 15, height: 16 };

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