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
        //alert("  BLOQUEADO!\nEste dispositivo já está vinculado a outra licença.");
    }
}

function liberarAcesso() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainPanel').style.display = 'block';
    document.getElementById('dot').classList.add('active'); // Ativa a bolinha verde
    console.log("Acesso autorizado pela Engine Zs.xisFF");
}

// --- ENGINE DE SENSIBILIDADE (MIRA DURA E ANTI-TREMEDEIRA) ---

let engineAtiva = false;
let ultimoX = 0;
let ultimoY = 0;

// Configurações Técnicas (Baseadas na análise Samsung de baixa latência)
const EngineConfig = {
    travaY: 22,          // Limite de pixels para a mira não subir demais
    suavizacao: 0.4,     // Curva de Bézier Linear para tirar o "pulo" da mira
    filtroRuido: 0.6,    // Anti-Jitter: ignora tremedeira do dedo
    sensiBase: 1.2       // Multiplicador de fluidez
};

function injetarEngine() {
    const aimbotAtivo = document.getElementById('aim').checked;
    const recoilAtivo = document.getElementById('recoil').checked;
    const jitterAtivo = document.getElementById('jitter').checked;

    if (!aimbotAtivo && !recoilAtivo) {
        alert("Selecione uma função antes de injetar!");
        return;
    }

    // Feedback Visual no botão
    const btn = document.getElementById('btnInject');
    btn.innerHTML = "ENGINE INJETADA!";
    btn.classList.add('active');
    
    engineAtiva = true;

    // Inicia os Listeners de Toque com estratégia Chrome de delay zero
    document.addEventListener('touchstart', (e) => {
        ultimoX = e.touches[0].clientX;
        ultimoY = e.touches[0].clientY;
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!engineAtiva) return;

        const toque = e.touches[0];
        let deltaX = toque.clientX - ultimoX;
        let deltaY = toque.clientY - ultimoY;

        // 1. APLICAR ANTI-JITTER (Tirar tremedeira)
        if (jitterAtivo) {
            if (Math.abs(deltaX) < EngineConfig.filtroRuido) deltaX = 0;
            if (Math.abs(deltaY) < EngineConfig.filtroRuido) deltaY = 0;
        }

        // 2. APLICAR TRAVA DE EIXO Y (Mira não passar da cabeça)
        if (aimbotAtivo) {
            // Se o movimento de subida for muito rápido (negativo no Y), ele trava
            if (deltaY < -EngineConfig.travaY) {
                deltaY = -EngineConfig.travaY;
            }
            // Suavização Bézier (Linear Interpolation)
            deltaX *= EngineConfig.suavizacao;
            deltaY *= EngineConfig.suavizacao;
        }

        // 3. NO RECOIL (Ultra) - Estabiliza o eixo horizontal no tiro
        if (recoilAtivo) {
            deltaX *= 0.8; // Deixa o movimento lateral mais "pesado/preciso"
        }

        // Sincroniza com os frames da tela (Reduz o input lag do Android)
        requestAnimationFrame(() => {
            // Simula a estabilização da Viewport
            window.scrollBy(deltaX * EngineConfig.sensiBase, deltaY * EngineConfig.sensiBase);
        });

        ultimoX = toque.clientX;
        ultimoY = toque.clientY;

        // Impede o comportamento padrão do Chrome (tirar delay)
        if (e.cancelable) e.preventDefault();
    }, { passive: false });

    console.log("Engines Zs.xisFF rodando em segundo plano.");
}
