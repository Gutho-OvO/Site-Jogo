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
