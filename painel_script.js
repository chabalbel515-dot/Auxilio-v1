// --- SEU SISTEMA DE KEY ORIGINAL (MANTIDO 100%) ---
function autenticar() {
    const input = document.getElementById('keyInput').value.trim();
    const agora = new Date().getTime();
    const partes = input.split('-');

    if (partes.length < 3 || partes[0] !== "ZS") {
        alert("  Formato de chave inválido!");
        return;
    }

    const keyExpiration = parseInt(partes[1]);

    if (agora > keyExpiration) {
        alert("  ESTA CHAVE JÁ EXPIROU!");
        return;
    }

    const chaveAtivaNoCelular = localStorage.getItem('licenca_ativa');

    if (!chaveAtivaNoCelular) {
        localStorage.setItem('licenca_ativa', input);
        liberarAcesso();
    } else if (chaveAtivaNoCelular === input) {
        liberarAcesso();
    } else {
        // Bloqueio de dispositivo (opcional)
    }
}

function liberarAcesso() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainPanel').style.display = 'block';
    document.getElementById('dot').classList.add('active'); 
    console.log("Acesso autorizado pela Engine Zs.xisFF");
}

// --- ENGINE DE SENSIBILIDADE (MIRA DURA E ANTI-TREMEDEIRA) ---

let engineAtiva = false;
let ultimoX = 0;
let ultimoY = 0;

const EngineConfig = {
    travaY: 22,          
    suavizacao: 0.4,     
    filtroRuido: 0.6,    
    sensiBase: 1.2       
};

function injetarEngine() {
    const aimbotAtivo = document.getElementById('aim').checked;
    const recoilAtivo = document.getElementById('recoil').checked;
    const jitterAtivo = document.getElementById('jitter').checked;

    if (!aimbotAtivo && !recoilAtivo) {
        alert("Selecione uma função antes de injetar!");
        return;
    }

    const btn = document.getElementById('btnInject');
    btn.innerHTML = "ENGINE INJETADA!";
    btn.classList.add('active');
    
    engineAtiva = true;

    // Listeners com estratégia de delay zero
    document.addEventListener('touchstart', (e) => {
        ultimoX = e.touches[0].clientX;
        ultimoY = e.touches[0].clientY;
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!engineAtiva) return;

        const toque = e.touches[0];
        let deltaX = toque.clientX - ultimoX;
        let deltaY = toque.clientY - ultimoY;

        if (jitterAtivo) {
            if (Math.abs(deltaX) < EngineConfig.filtroRuido) deltaX = 0;
            if (Math.abs(deltaY) < EngineConfig.filtroRuido) deltaY = 0;
        }

        if (aimbotAtivo) {
            if (deltaY < -EngineConfig.travaY) {
                deltaY = -EngineConfig.travaY;
            }
            deltaX *= EngineConfig.suavizacao;
            deltaY *= EngineConfig.suavizacao;
        }

        if (recoilAtivo) {
            deltaX *= 0.8; 
        }

        requestAnimationFrame(() => {
            window.scrollBy(deltaX * EngineConfig.sensiBase, deltaY * EngineConfig.sensiBase);
        });

        ultimoX = toque.clientX;
        ultimoY = toque.clientY;

        if (e.cancelable) e.preventDefault();
    }, { passive: false });

    console.log("Engines Zs.xisFF rodando em segundo plano.");
}
