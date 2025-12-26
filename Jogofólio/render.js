function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    const camX = Math.floor(camera.x);
    const camY = Math.floor(camera.y);

    const directionMap = {
        "down": 0,
        "down-left": 1,
        "left": 2,
        "up-left": 3,
        "up": 4,
        "up-right": 5,
        "right": 6,
        "down-right": 7
    };

    // 1. FUNDO
    
    let activeMap = currentMap === "city" ? cityMap : buildingMap;

    ctx.drawImage(
        activeMap,
        camX,
        camY,
        camera.width,
        camera.height,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // 2. PLAYER
    const row = directionMap[player.direction];

    const sx = player.frame * 32;
    const sy = row * 32;

    ctx.drawImage(
        playerImg,
        sx,
        sy,
        32,
        32,
        Math.floor(player.x - camX),
        Math.floor(player.y - camY),
        32,
        32
    );

    if (currentMap === "city") {
        // 3. OBJETOS DO MAPA
        ctx.drawImage(objectsImg, camX, camY, camera.width, camera.height, 0, 0, canvas.width, canvas.height);

        // 4. CAMADA DE PRÉDIOS (Com transparência)
        const behindBuilding = isPlayerBehindAnyBuilding(player, cityFrontAreas);
        ctx.save();
        ctx.globalAlpha = behindBuilding ? 0.3 : 1;
        ctx.drawImage(cityFront, camX, camY, camera.width, camera.height, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // 5. NUVENS
        const behindClouds = isPlayerBehindAnyBuilding(player, cloudsAreas);
        ctx.save();
        ctx.globalAlpha = behindClouds ? 0.3 : 1;
        ctx.drawImage(cloudsImg, camX, camY, camera.width, camera.height, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // 6. NPCs
        npcs.forEach(npc => {
            let imgToDraw = (npc.id === "dinamico") ? getNpc4Image(npc, player) : npc.img;
            if (imgToDraw && imgToDraw.complete) {
                ctx.drawImage(imgToDraw, Math.floor(npc.x - camX), Math.floor(npc.y - camY), npc.width, npc.height);
            }
            if (isPlayerNear(player, npc)) {
                drawInteractionText("[E] Falar", npc.x, npc.y, camX, camY);
            }
        });
    }
    

    // 7. INTERFACE E OVERLAYS
    if (playerHasCoin) drawUI();
    if (isTelescopeOpen) drawTelescopeView();
    else if (isPlayerNear(player, telescopeObj)) {
        drawInteractionText("[E] Usar Telescópio", telescopeObj.x, telescopeObj.y, camX, camY);
    }

    drawDialogue();
    drawFades();

}


// Funções auxiliares de desenho para manter o draw() limpo
function drawInteractionText(text, x, y, camX, camY) {
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, (x + 16) - camX, (y - 5) - camY);
}

function drawUI() {
    ctx.fillStyle = "gold";
    ctx.font = "bold 20px Arial";
    ctx.fillText("🪙", 15, 30);
}

function drawDialogue() {
    if (!currentDialogue) return;

    const padding = 20;
    const boxHeight = 80;
    const boxY = canvas.height - boxHeight - 20;

    ctx.fillStyle = "white";
    ctx.fillRect(padding - 2, boxY - 2, canvas.width - (padding * 2) + 4, boxHeight + 4);
    ctx.fillStyle = "black";
    ctx.fillRect(padding, boxY, canvas.width - (padding * 2), boxHeight);

    ctx.fillStyle = "white";
    ctx.font = "14px 'Courier New', monospace";
    ctx.textAlign = "left";
    
    const text = currentDialogue[dialogueIndex];
    ctx.fillText(text, padding + 20, boxY + 35);
    
    ctx.font = "10px Arial";
    ctx.fillText("Aperte [E] para continuar...", canvas.width - 150, boxY + boxHeight - 10);
}

function drawFades() {
    if (fadeOpacity > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (teleportFadeOpacity > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${teleportFadeOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawTelescopeView() {
    // 1. Limpa o fundo com preto para dar foco à visão do telescópio
    ctx.fillStyle = "#131313";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (telescopeViewImg.complete) {
        // 2. Calcula as proporções para a imagem caber na tela (Letterbox)
        const hRatio = canvas.width / telescopeViewImg.width;
        const vRatio = canvas.height / telescopeViewImg.height;
        const ratio  = Math.min(hRatio, vRatio); // Garante que a imagem caiba inteira
        
        const centerShiftX = (canvas.width - telescopeViewImg.width * ratio) / 2;
        const centerShiftY = (canvas.height - telescopeViewImg.height * ratio) / 2;

        // 3. Desenha a imagem adaptada
        ctx.drawImage(
            telescopeViewImg, 
            0, 0, telescopeViewImg.width, telescopeViewImg.height,
            centerShiftX, centerShiftY, 
            telescopeViewImg.width * ratio, 
            telescopeViewImg.height * ratio
        );
    }
}