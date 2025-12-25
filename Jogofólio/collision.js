// ===== BARREIRAS =====
const barriers = [
  //ponte
  { x: 0, y: 0, width: 300, height: 1600 },
  { x: 300, y: 834, width: 1092, height: 40 },
  { x: 300, y: 1107, width: 1109, height: 40 },
  //barreiras
  { x: 1391, y: 644, width: 18, height: 214 },
  { x: 1409, y: 644, width: 384, height: 22 },
  { x: 1775, y: 430, width: 18, height: 214 },
  { x: 1295, y: 1147, width: 18, height: 350 },
  //barreira policia
  { x: 2914, y: 682, width: 18, height: 480 },
  //objetos do mapa
  { x: 1793, y: 548, width: 112, height: 21 },
  { x: 1797, y: 864, width: 6, height: 6 },
  { x: 1797, y: 1073, width: 6, height: 6 },
  { x: 2149, y: 816, width: 6, height: 6 },
  { x: 2149, y: 1056, width: 6, height: 6 },
  { x: 2309, y: 816, width: 6, height: 6 },
  { x: 2309, y: 1056, width: 6, height: 6 },
  { x: 2661, y: 848, width: 6, height: 6 },
  { x: 2661, y: 1088, width: 6, height: 6 },
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
  //telescopio
  { x: 1409, y: 682, width: 15, height: 16 },
  //npcs
  { x: 2650, y: 365, width: 13, height: 13 },
  { x: 1492, y: 666, width: 8, height: 24 },
  { x: 310, y: 915, width: 8, height: 16 },
  { x: 310, y: 1041, width: 8, height: 16 },
  //predios-decoração
  { x: 1616, y: 1194, width: 16, height: 414 },
  { x: 1632, y: 1194, width: 464, height: 16 },
  { x: 2096, y: 1194, width: 16, height: 48 },
  { x: 2112, y: 1242, width: 16, height: 32 },
  { x: 2128, y: 1258, width: 240, height: 16 },
  { x: 2368, y: 1226, width: 16, height: 48 },
  { x: 2384, y: 1226, width: 176, height: 16 },
  { x: 2560, y: 1226, width: 16, height: 48 },
  { x: 2576, y: 1258, width: 224, height: 16 },
  { x: 2800, y: 1210, width: 16, height: 64 },
  { x: 2816, y: 1162, width: 160, height: 64 },
  //predio-beco
  { x: 2768, y: 666, width: 30, height: 48 },
  { x: 2798, y: 666, width: 116, height: 32 },
  { x: 2818, y: 698, width: 14, height: 16 },
  { x: 2880, y: 698, width: 14, height: 16 },
  { x: 2672, y: 300, width: 96, height: 382 },
  { x: 2623, y: 300, width: 48, height: 46 },
  { x: 2688, y: 682, width: 48, height: 15 },
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