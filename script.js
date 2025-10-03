document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // ELEMENTOS GLOBAIS
    // ----------------------------------------------------
    const lockScreen = document.getElementById('lock-screen');
    const mainApp = document.getElementById('main-app');
    const fingerprintArea = document.getElementById('fingerprint-btn');
    const fingerprintIcon = document.querySelector('.fingerprint-icon');
    const verificationOverlay = document.getElementById('verification-overlay');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const menuBlurTargets = document.querySelectorAll('.menu-blur-target'); 
    
    // Elementos do Saldo
    const balanceElement = document.getElementById('balance');
    const toggleButtonElement = document.getElementById('toggle-balance');

    // Elementos para o Desktop Overlay (Criado no JS, como antes)
    const desktopOverlay = document.createElement('div');
    desktopOverlay.id = 'desktop-overlay';
    desktopOverlay.innerHTML = 'Acesse pelo Desktop';

    // Saldo e Long Press
    const actualBalance = 'R$ 3.684,45';
    const hiddenBalance = 'R$ ••••••••';
    let isHidden = true;
    const LONG_PRESS_TIME = 1000;
    let pressTimer = null;


    // ----------------------------------------------------
    // INICIALIZAÇÃO E CONTROLE DE TELA
    // ----------------------------------------------------
    
    const isMobileView = () => window.innerWidth <= 600; 
    
    const updateTime = () => {
        const timeElement = document.querySelector('.lock-time');
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if (timeElement) timeElement.textContent = timeString;
    };
    updateTime();
    setInterval(updateTime, 1000); 

    const applyMobileBlur = () => {
        menuBlurTargets.forEach(el => el.classList.add('menu-blur-target'));
        mobileOverlay.classList.add('active');
    }

    const initializeScreenState = () => {
        if (!isMobileView()) {
            document.body.appendChild(desktopOverlay);
            mainApp.classList.add('blurred');
            lockScreen.classList.add('blurred');
            mainApp.classList.remove('hidden'); 
        } else {
            mainApp.classList.add('hidden');
            lockScreen.classList.remove('hidden');
        }
    };
    
    initializeScreenState();

    // ----------------------------------------------------
    // FUNÇÕES DE DESBLOQUEIO E ANIMAÇÃO
    // ----------------------------------------------------
    
    const unlockApp = () => {
        lockScreen.classList.add('hidden');
        
        verificationOverlay.classList.add('active');

        setTimeout(() => {
            verificationOverlay.classList.remove('active');
            mainApp.classList.remove('hidden');
            
            applyMobileBlur();
        }, 1500); 
    };

    // Função que começa a contagem do tempo (Long Press)
    const startPress = (e) => {
        if (!isMobileView() && e.type === 'mousedown') {
            alert("Aviso: O desbloqueio de Biometria é simulado, mas a navegação completa só está disponível no Desktop.");
            return;
        }

        e.preventDefault(); 
        
        if (pressTimer === null) {
            fingerprintArea.classList.add('pressed');
            pressTimer = setTimeout(function() {
                unlockApp();
            }, LONG_PRESS_TIME);
        }
    };

    // Função que para a contagem do tempo
    const cancelPress = () => {
        if (pressTimer !== null) {
            clearTimeout(pressTimer);
            if (pressTimer !== null) {
                fingerprintIcon.style.color = '#ff3333';
                setTimeout(() => {
                    fingerprintIcon.style.color = 'var(--color-neon-green)';
                }, 300);
            }
            pressTimer = null;
        }
        fingerprintArea.classList.remove('pressed');
    };
    
    // ------------------- EVENT LISTENERS - LOCK SCREEN -------------------
    
    fingerprintArea.addEventListener('mousedown', startPress);
    fingerprintArea.addEventListener('mouseup', cancelPress);
    fingerprintArea.addEventListener('mouseleave', cancelPress); 
    fingerprintArea.addEventListener('touchstart', startPress);
    fingerprintArea.addEventListener('touchend', cancelPress);
    fingerprintArea.addEventListener('touchcancel', cancelPress);
    
    // ----------------------------------------------------
    // FUNÇÕES DA TELA PRINCIPAL
    // ----------------------------------------------------

    // Saldo inicial (oculto)
    balanceElement.textContent = hiddenBalance;

    // 1. FUNÇÃO TOGGLE SALDO (Botão Olho) - AGORA ISOLADA PARA NÃO GERAR ALERTA
    if (toggleButtonElement) {
        toggleButtonElement.addEventListener('click', () => {
            if (isHidden) {
                balanceElement.textContent = actualBalance;
                toggleButtonElement.textContent = 'visibility';
                isHidden = false;
            } else {
                balanceElement.textContent = hiddenBalance;
                toggleButtonElement.textContent = 'visibility_off';
                isHidden = true;
            }
        });
    }

    // 2. FUNÇÕES PARA TODOS OS OUTROS BOTÕES E MENUS
    const functionalElements = document.querySelectorAll('#main-app [data-action]');

    functionalElements.forEach(element => {
        // CORREÇÃO: Pula o elemento de toggle-balance para evitar o alerta "Ação Desconhecida"
        if (element.id === 'toggle-balance') {
            return; 
        }

        element.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Impede a ação se o elemento estiver desfocado (menu-blur-target) ou no Desktop (blurred)
            const isBlurred = element.closest('.menu-blur-target') || mainApp.classList.contains('blurred');
            if (isBlurred) {
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
                default: message = 'Ação Desconhecida: ' + action; // Mantido para botões novos
            }

            alert(message);
        });
    });
});
