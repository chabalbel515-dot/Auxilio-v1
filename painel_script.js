// --- SISTEMA DE KEY (MANTIDO) ---
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
    localStorage.setItem('licenca_ativa', input);
    liberarAcesso();
}

function liberarAcesso() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainPanel').style.display = 'block';
    document.getElementById('dot').classList.add('active');
}

// --- ENGINE ZS.XISFF V2.5 (MAGNETISMO & BEZIER) ---

let engineAtiva = false;
let ultimoX = 0;
let ultimoY = 0;

const EngineConfig = {
    travaY: 18,            // Trava de X pixels (Puxada forte trava aqui)
    suavizacao: 0.35,      // Curva de Bezier para puxada fraca
    filtroRuido: 0.8,      // Anti-Jitter Samsung
    magRadius: 60,         // Raio do magnetismo (em pixels do centro)
    magForca: 0.45,        // Força do "grude"
    sensiBase: 1.15
};

// Curva de Bezier Cúbica para suavizar o rastro do dedo
function aplicarBezier(t) {
    // Aproximação de curva: acelera no início e estabiliza no fim
    return t * t * (3 - 2 * t);
}

function injetarEngine() {
    const aimbotAtivo = document.getElementById('aim').checked;
    const recoilAtivo = document.getElementById('recoil').checked;
    const jitterAtivo = document.getElementById('jitter').checked;

    if (!aimbotAtivo && !recoilAtivo) {
        alert("Selecione uma função!");
        return;
    }

    const btn = document.getElementById('btnInject');
    btn.innerHTML = "ENGINE ATIVA!";
    btn.classList.add('active');
    engineAtiva = true;

    document.addEventListener('touchstart', (e) => {
        ultimoX = e.touches[0].clientX;
        ultimoY = e.touches[0].clientY;
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!engineAtiva) return;

        // Estratégia Chrome: Captura eventos coalescidos (mais frames de toque)
        const touches = e.getCoalescedEvents ? e.getCoalescedEvents() : [e.touches[0]];
        
        touches.forEach(toque => {
            let deltaX = toque.clientX - ultimoX;
            let deltaY = toque.clientY - ultimoY;

            // 1. ANTI-JITTER (Filtro de Ruído Samsung)
            if (jitterAtivo) {
                if (Math.abs(deltaX) < EngineConfig.filtroRuido) deltaX *= 0.2;
                if (Math.abs(deltaY) < EngineConfig.filtroRuido) deltaY *= 0.2;
            }

            // 2. LÓGICA DE MAGNETISMO (Sticky Aim no Centro)
            if (aimbotAtivo) {
                const centroX = window.innerWidth / 2;
                const centroY = window.innerHeight / 2;
                
                // Distância do toque atual para o centro (onde estaria o inimigo)
                const distX = centroX - toque.clientX;
                const distY = centroY - toque.clientY;
                const distancia = Math.sqrt(distX * distX + distY * distY);

                if (distancia < EngineConfig.magRadius) {
                    // Reduz sensibilidade (Fricção) e aplica força magnética
                    deltaX = (deltaX * 0.5) + (distX * EngineConfig.magForca * 0.1);
                    deltaY = (deltaY * 0.5) + (distY * EngineConfig.magForca * 0.1);
                }

                // 3. CURVA DE BEZIER & TRAVA X PIXELS
                // Normaliza o movimento para aplicar a curva
                const t = Math.min(Math.abs(deltaY) / 50, 1); 
                const curva = aplicarBezier(t);
                
                deltaX *= curva;
                deltaY *= curva;

                // Trava forte: se puxar muito rápido, o DeltaY não ultrapassa o limite
                if (Math.abs(deltaY) > EngineConfig.travaY) {
                    deltaY = EngineConfig.travaY * Math.sign(deltaY);
                }
            }

            // 4. NO RECOIL (Peso Horizontal)
            if (recoilAtivo) {
                deltaX *= 0.7;
            }

            // Sincronização de Frames (V-Sync de Toque)
            requestAnimationFrame(() => {
                window.scrollBy(deltaX * EngineConfig.sensiBase, deltaY * EngineConfig.sensiBase);
            });

            ultimoX = toque.clientX;
            ultimoY = toque.clientY;
        });

        if (e.cancelable) e.preventDefault();
    }, { passive: false });
}
