// --- CLASSE HIGH STRAFE ENGINE (INTEGRADA) ---
// Esta classe processa o movimento lateral com boost de velocidade
class HighStrafeEngine {
    constructor() {
        this.lastX = 0;
        this.velocity = 0;
        this.direction = 0; // -1: Esquerda, 1: Direita
        
        // Configurações da sua Engine de Strafe
        this.boost = 2.2;      
        this.friction = 0.92;  
        this.sensitivity = 1.5; 
    }

    processStrafe(currentX) {
        let rawDeltaX = currentX - this.lastX;
        const currentDir = rawDeltaX > 0 ? 1 : -1;

        // Detecta inversão de movimento para aplicar o Boost
        if (currentDir !== this.direction && Math.abs(rawDeltaX) > 1) {
            this.velocity = rawDeltaX * this.boost;
            this.direction = currentDir;
        } else {
            this.velocity = (this.velocity * this.friction) + (rawDeltaX * (1 - this.friction));
        }

        this.lastX = currentX;
        return this.velocity * this.sensitivity;
    }
}

const strafeMotor = new HighStrafeEngine();

// --- SISTEMA DE KEY (MANTIDO 100%) ---
function autenticar() {
    const input = document.getElementById('keyInput').value.trim();
    const agora = new Date().getTime();
    const partes = input.split('-');

    if (partes.length < 3 || partes[0] !== "ZS") {
        alert("Formato de chave inválido!");
        return;
    }

    const keyExpiration = parseInt(partes[1]);
    if (agora > keyExpiration) {
        alert("ESTA CHAVE JÁ EXPIROU!");
        return;
    }

    liberarAcesso(); // Chama a liberação do painel
}

function liberarAcesso() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainPanel').style.display = 'block';
    document.getElementById('dot').classList.add('active'); 
}

// --- ENGINE DE SENSIBILIDADE E INJEÇÃO ---
let engineAtiva = false;
let ultimoY = 0;

const EngineConfig = {
    travaY: 22,          // Limite para a mira não subir demais
    suavizacao: 0.4,     // Curva de movimento
    filtroRuido: 0.6,    // Anti-Jitter
    sensiBase: 1.2       
};

function injetarEngine() {
    const aimbotAtivo = document.getElementById('aim').checked;
    const recoilAtivo = document.getElementById('recoil').checked;
    const jitterAtivo = document.getElementById('jitter').checked;
    const strafeAtivo = document.getElementById('auxilio').checked; // Checkbox nova

    if (!aimbotAtivo && !recoilAtivo && !strafeAtivo) {
        alert("Selecione uma função antes de injetar!");
        return;
    }

    // Feedback visual do botão
    const btn = document.getElementById('btnInject');
    btn.innerHTML = "ENGINE INJETADA!";
    btn.classList.add('active');
    
    engineAtiva = true;

    // Inicia Listeners de Toque
    document.addEventListener('touchstart', (e) => {
        strafeMotor.lastX = e.touches[0].clientX;
        ultimoY = e.touches[0].clientY;
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!engineAtiva) return;

        const toque = e.touches[0];
        let deltaX;
        let deltaY = toque.clientY - ultimoY;

        // 1. APLICAR LÓGICA DE MOVIMENTO LATERAL (X)
        if (strafeAtivo) {
            // Usa a classe HighStrafe que você enviou
            deltaX = strafeMotor.processStrafe(toque.clientX);
        } else {
            deltaX = toque.clientX - strafeMotor.lastX;
            strafeMotor.lastX = toque.clientX;
        }

        // 2. ANTI-JITTER (Filtro de Ruído)
        if (jitterAtivo) {
            if (Math.abs(deltaX) < EngineConfig.filtroRuido) deltaX = 0;
            if (Math.abs(deltaY) < EngineConfig.filtroRuido) deltaY = 0;
        }

        // 3. TRAVA DE EIXO Y E RECOIL
        if (aimbotAtivo) {
            if (deltaY < -EngineConfig.travaY) deltaY = -EngineConfig.travaY;
            deltaY *= EngineConfig.suavizacao;
            if (!strafeAtivo) deltaX *= EngineConfig.suavizacao;
        }

        if (recoilAtivo) {
            deltaX *= 0.8;
        }

        // Sincronização com o Refresh Rate (60Hz/120Hz)
        requestAnimationFrame(() => {
            window.scrollBy(deltaX * EngineConfig.sensiBase, deltaY * EngineConfig.sensiBase);
        });

        ultimoY = toque.clientY;

        if (e.cancelable) e.preventDefault();
    }, { passive: false });

    console.log("Engine Zs.xisFF com High Strafe Ativa.");
}
