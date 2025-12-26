// ===== CONTROLES =====
const keys = {};

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === "e" && !isFading) {

        // 1. Avança diálogo
        if (currentDialogue) {
            dialogueIndex++;
            if (dialogueIndex >= currentDialogue.length) {
                currentDialogue = null;
                dialogueIndex = 0;
            }
            return;
        }

        // 2. Interação com NPC
        let interacted = false;
        npcs.forEach(npc => {
            if (isPlayerNear(player, npc)) {
                currentDialogue = npc.dialogue;
                dialogueIndex = 0;
                interacted = true;

                if (npc.id === "moeda" && !playerHasCoin) {
                    playerHasCoin = true;
                }
            }
        });

        if (interacted) return;

    // 🚪 PORTAS
    buildingDoors.forEach(door => {
        if (currentMap === "city" && isPlayerNear(player, door)) {
            currentMap = door.targetMap;
            player.x = door.spawn.x;
            player.y = door.spawn.y;
        }
    });

        // 3. Telescópio
        if (isTelescopeOpen) {
            isFading = true;
            fadeTarget = "hide";
        } else if (isPlayerNear(player, telescopeObj)) {
            if (playerHasCoin) {
                isFading = true;
                fadeTarget = "open";
            }
        }
    }
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});