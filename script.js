// --- CONFIGURAÇÃO DA KEY ---
const KEY_FIXA = "ZS-VIP-2026"; // Altere sua key aqui

// Auto-Login: Verifica se o usuário já validou antes
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('zs_session') === 'authorized') {
        liberarAcesso();
    }
});

function autenticar() {
    const input = document.getElementById('keyInput').value.trim();

    if (input === KEY_FIXA) {
        localStorage.setItem('zs_session', 'authorized');
        liberarAcesso();
    } else {
        alert("CHAVE INVÁLIDA! Tente novamente.");
    }
}

function liberarAcesso() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainPanel').style.display = 'block';
    document.getElementById('dot').classList.add('active');
}

// --- ENGINE DE SENSIBILIDADE E MOVIMENTO ---
let engineAtiva = false;
let uX = 0, uY = 0;

const EngineSettings = {
    travaVertical: 18,
    antiJitterForca: 0.1,
    multiplicadorSensi: 1.2,
    bezierSuavidade: 50 // Pixels para atingir curva máxima
};

function bezierCurva(t) { return t * t * (3 - 2 * t); }

function injetarEngine() {
    if (engineAtiva) return;

    const btn = document.getElementById('btnInject');
    btn.innerHTML = "ENGINE ATIVA!";
    btn.classList.add('active');
    engineAtiva = true;

    document.addEventListener('touchstart', (e) => {
        uX = e.touches[0].clientX;
        uY = e.touches[0].clientY;
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!engineAtiva) return;

        const toque = e.touches[0];
        let dX = toque.clientX - uX;
        let dY = toque.clientY - uY;

        // Lógica Anti-Jitter (Estabilização Samsung)
        if (document.getElementById('jitter').checked) {
            if (Math.abs(dX) < 1) dX *= EngineSettings.antiJitterForca;
            if (Math.abs(dY) < 1) dY *= EngineSettings.antiJitterForca;
        }

        // Lógica Aimbot (Bézier + Trava)
        if (document.getElementById('aim').checked) {
            const progresso = Math.min(Math.abs(dY) / EngineSettings.bezierSuavidade, 1);
            const curva = bezierCurva(progresso);
            
            dX *= curva;
            dY *= curva;

            // Trava de pixel para evitar que a mira suba demais
            if (Math.abs(dY) > EngineSettings.travaVertical) {
                dY = EngineSettings.travaVertical * Math.sign(dY);
            }
        }

        // No Recoil (Redução horizontal)
        if (document.getElementById('recoil').checked) {
            dX *= 0.5;
        }

        // Execução do Scroll Simulado (Engine)
        window.scrollBy(dX * EngineSettings.multiplicadorSensi, dY * EngineSettings.multiplicadorSensi);

        uX = toque.clientX;
        uY = toque.clientY;

        if (e.cancelable) e.preventDefault();
    }, { passive: false });
}
