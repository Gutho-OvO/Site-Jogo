const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Estados do Jogo
let teleportFading = false;
let teleportFadeOpacity = 0;
let teleportStep = ""; 
let teleportWaitTime = 0;
let isTelescopeOpen = false;
let currentDialogue = null;
let dialogueIndex = 0;
let playerHasCoin = false;
let fadeOpacity = 0;
let isFading = false;
let fadeTarget = "";

// Funções de utilidade
function isPlayerNear(p, obj) {
    const dist = 20; 
    return (
        p.x < obj.x + obj.width + dist &&
        p.x + p.width > obj.x - dist &&
        p.y < obj.y + obj.height + dist &&
        p.y + p.height > obj.y - dist
    );
}

function update() {
    if (currentDialogue) return; 

    // Lógica de Fade do Telescópio
    if (isFading) {
        if (fadeTarget === "open") {
            fadeOpacity += 0.05;
            if (fadeOpacity >= 1) {
                fadeOpacity = 1;
                isTelescopeOpen = true; 
                fadeTarget = "show";
            }
        } else if (fadeTarget === "show" || fadeTarget === "hide") {
            fadeOpacity -= 0.05;
            if (fadeOpacity <= 0) {
                fadeOpacity = 0;
                isFading = false;
                if (fadeTarget === "hide") isTelescopeOpen = false;
            }
        }
        return; 
    }

    if (isTelescopeOpen) return;

    // Lógica de Teleporte
    if (!teleportFading && isInsideArea(player, teleportArea)) {
        teleportFading = true;
        teleportStep = "out";
    }

    if (teleportFading) {
        if (teleportStep === "out") {
            teleportFadeOpacity += 0.05;
            if (teleportFadeOpacity >= 1) {
                teleportFadeOpacity = 1;
                teleportStep = "wait";
                teleportWaitTime = 0;
            }
        } else if (teleportStep === "wait") {
            teleportWaitTime++;
            if (teleportWaitTime >= 180) {
                player.x = teleportTarget.x;
                player.y = teleportTarget.y;
                teleportStep = "in";
            }
        } else if (teleportStep === "in") {
            teleportFadeOpacity -= 0.05;
            if (teleportFadeOpacity <= 0) {
                teleportFadeOpacity = 0;
                teleportFading = false;
            }
        }
        return;
    }

    updatePlayer();
}

function loop() {
    update();
    draw(); // Esta função está no render.js
    requestAnimationFrame(loop);
}

function start() {
    // Garante que as imagens carregaram e o canvas foi ajustado
    if (assetsLoaded === TOTAL_ASSETS) {
        resizeCanvas();
        player.x = spawnPoint.x;
        player.y = spawnPoint.y;
        loop(); // Inicia o ciclo do jogo
    } else {
        // Se ainda não carregou, espera um pouco e tenta de novo
        requestAnimationFrame(start);
    }
}

// Inicia o processo de checagem
start();
