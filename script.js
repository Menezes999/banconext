document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // ELEMENTOS GLOBAIS
    // ----------------------------------------------------
    const lockScreen = document.getElementById('lock-screen');
    const mainApp = document.getElementById('main-app');
    const fingerprintArea = document.getElementById('fingerprint-btn'); // Renomeado para área
    const fingerprintIcon = document.querySelector('.fingerprint-icon');
    const balanceElement = document.getElementById('balance');
    const toggleButton = document.getElementById('toggle-balance');

    // Elementos para o Desktop Overlay
    const desktopOverlay = document.createElement('div');
    desktopOverlay.id = 'desktop-overlay';
    desktopOverlay.innerHTML = 'Acesso somente pelo Desktop';

    // Saldo
    const actualBalance = 'R$ 3.684,45';
    const hiddenBalance = 'R$ ••••••••';
    let isHidden = true;
    
    // Variáveis para o Long Press
    const LONG_PRESS_TIME = 1000; // Tempo em milissegundos (1 segundo)
    let pressTimer = null;


    // ----------------------------------------------------
    // INICIALIZAÇÃO DA TELA
    // ----------------------------------------------------
    
    const isMobileView = () => window.innerWidth <= 600; 

    const initializeScreenState = () => {
        if (!isMobileView()) {
            // Desktop: Bloqueia a visualização do app e da lock screen
            document.body.appendChild(desktopOverlay);
            mainApp.classList.add('blurred');
            lockScreen.classList.add('blurred');
        } else {
            // Mobile: Garante que a tela de bloqueio seja a única visível
            mainApp.classList.add('hidden');
            lockScreen.classList.remove('hidden');
        }
    };
    
    initializeScreenState();

    // ----------------------------------------------------
    // FUNÇÕES DA TELA DE BLOQUEIO - NOVO GESTO
    // ----------------------------------------------------
    
    const unlockApp = () => {
        // Simula o processo de leitura digital (Animação de Verificação)
        const originalIcon = fingerprintIcon.textContent;

        // 1. Inicia a animação de verificação
        fingerprintIcon.style.animation = 'none';
        fingerprintIcon.style.color = 'yellow'; 
        fingerprintIcon.textContent = 'loop'; 
        
        // 2. Verifica (após 0.5 segundo)
        setTimeout(() => {
            fingerprintIcon.style.color = '#fff';
            fingerprintIcon.textContent = 'check_circle'; 
            fingerprintArea.classList.remove('pressed');

            // 3. Transição para a tela principal (após 0.5s)
            setTimeout(() => {
                lockScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
                
                // Limpeza do overlay/desfoque se necessário
                mainApp.classList.remove('blurred');
                if (desktopOverlay.parentNode) {
                    desktopOverlay.parentNode.removeChild(desktopOverlay);
                }
            }, 500);
        }, 500); // 0.5 segundo para simular a leitura rápida
    };

    // Função que começa a contagem do tempo
    const startPress = (e) => {
        // Ignora cliques do mouse (que não são long press) no Desktop
        if (!isMobileView() && e.type === 'mousedown') {
            return;
        }

        if (pressTimer === null) {
            fingerprintArea.classList.add('pressed');
            pressTimer = setTimeout(function() {
                // Se o timer acabar, o desbloqueio é acionado
                unlockApp();
            }, LONG_PRESS_TIME);
        }
    };

    // Função que para a contagem do tempo
    const cancelPress = () => {
        if (pressTimer !== null) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
        fingerprintArea.classList.remove('pressed');
        
        // Se soltou antes do tempo, mostra um alerta
        if (pressTimer !== null) {
            alert("Mantenha o dedo pressionado por um pouco mais de tempo para desbloquear!");
        }
    };
    
    // ------------------- EVENT LISTENERS -------------------
    
    // Eventos para Desktop (Mouse)
    fingerprintArea.addEventListener('mousedown', startPress);
    fingerprintArea.addEventListener('mouseup', cancelPress);
    fingerprintArea.addEventListener('mouseleave', cancelPress); // Cancela se o mouse sair da área

    // Eventos para Mobile (Touch)
    fingerprintArea.addEventListener('touchstart', startPress);
    fingerprintArea.addEventListener('touchend', cancelPress);
    fingerprintArea.addEventListener('touchcancel', cancelPress);
    
    // ----------------------------------------------------
    // FUNÇÕES DA TELA PRINCIPAL (EXISTENTES)
    // ----------------------------------------------------

    balanceElement.textContent = hiddenBalance;

    // 1. FUNÇÃO TOGGLE SALDO (Botão Olho)
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            if (isHidden) {
                balanceElement.textContent = actualBalance;
                toggleButton.textContent = 'visibility';
                isHidden = false;
            } else {
                balanceElement.textContent = hiddenBalance;
                toggleButton.textContent = 'visibility_off';
                isHidden = true;
            }
            console.log(`Ação: Saldo foi ${isHidden ? 'ocultado' : 'exibido'}.`);
        });
    }

    // 2. FUNÇÕES PARA TODOS OS OUTROS BOTÕES E MENUS
    const functionalElements = document.querySelectorAll('#main-app [data-action]');

    functionalElements.forEach(element => {
        if (element.id === 'toggle-balance') {
            return;
        }

        element.addEventListener('click', (event) => {
            event.preventDefault();
            
            if (mainApp.classList.contains('blurred')) {
                 return;
            }
            
            const action = element.getAttribute('data-action');
            let message = '';

            switch (action) {
                case 'settings': message = 'Ação: Abrir Configurações da Conta.'; break;
                case 'share-data': message = 'Ação: Compartilhar Dados (Open Finance) iniciado.'; break;
                case 'extrato': message = 'Ação: Navegar para Saldo e Extrato.'; break;
                case 'pix': message = 'Ação: Abrir Área Pix.'; break;
                case 'pagamentos': message = 'Ação: Navegar para Pagamentos.'; break;
                case 'ver-mais': message = 'Ação: Exibir todos os menus (Ver Mais).'; break;
                case 'contratar-seguro': message = 'Ação: Iniciar Contratação do Seguro.'; break;
                default: message = 'Ação Desconhecida: ' + action;
            }

            alert(message);
            console.log(message);
        });
    });
});
