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