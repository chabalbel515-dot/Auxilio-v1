const MAG_CONFIG = {
    stickyForce: 0.4,       // Coeficiente de "grude" (40% da velocidade)
    nearThreshold: 80,      // Raio de ativação próximo
    farThreshold: 30,       // Raio de ativação longo alcance
    smoothFactor: 0.12      
};

class MagnetismEngine {
    constructor() {
        this.isLocked = false;
    }

    // Suavização Bézier: f(t) = 3t² - 2t³
    bezierSmooth(t) {
        return t * t * (3 - 2 * t);
    }

    calculateMagnetism(currentX, currentY, deltaX, deltaY, target) {
        if (!target) return { x: deltaX, y: deltaY };

        const distX = target.x - currentX;
        const distY = target.y - currentY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        const threshold = target.isFar ? MAG_CONFIG.farThreshold : MAG_CONFIG.nearThreshold;

        if (distance < threshold) {
            this.isLocked = true;
            // Aplica a redução de velocidade (Magnetismo)
            return {
                x: this.bezierSmooth(deltaX * MAG_CONFIG.stickyForce),
                y: this.bezierSmooth(deltaY * MAG_CONFIG.stickyForce)
            };
        }

        this.isLocked = false;
        return { x: deltaX, y: deltaY };
    }
}

const magEngine = new MagnetismEngine();

// Funções de Interface
function checkKey() {
    const key = document.getElementById('key-input').value;
    if (key === "1234567") { // Senha definida
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('panel-screen').style.display = 'flex';
    } else {
        alert("Acesso Negado!");
    }
}

function openFreeFire() {
    // Comando para abrir o Free Fire diretamente
    window.location.href = "intent://#Intent;package=com.dts.freefireMax;scheme=android-app;end";
}
