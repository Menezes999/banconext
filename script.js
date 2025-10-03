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
    
    // Novo: Seleciona todos os elementos marcados para desfoque no Mobile
    const blurTargets = document.querySelectorAll('.menu-target'); 

    // Elementos para o Desktop Overlay (Criado no JS, como antes)
    const desktopOverlay = document.createElement('div');
    desktopOverlay.id = 'desktop-overlay';
    desktopOverlay.innerHTML = 'Acesso somente pelo Desktop';

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
    
    // FUNÇÃO REVERTIDA: Atualiza a hora
    const updateTime = () => {
        const timeElement = document.querySelector('.lock-time');
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if (timeElement) timeElement.textContent = timeString;
    };
    updateTime();
    setInterval(updateTime, 1000); 

    const applyMobileBlur = () => {
        // Aplica desfoque nos menus e mostra o overlay
        blurTargets.forEach(el => el.classList.add('menu-blur'));
        mobileOverlay.classList.add('active');
    }

    const initializeScreenState = () => {
        if (!isMobileView()) {
            // Desktop: Bloqueio total
            document.body.appendChild(desktopOverlay);
            mainApp.classList.add('blurred');
            lockScreen.classList.add('blurred');
            mainApp.classList.remove('hidden'); // Exibe o main app desfocado para o overlay cobrir
        } else {
            // Mobile: Exibe Lock Screen por padrão
            mainApp.classList.add('hidden');
            lockScreen.classList.remove('hidden');
        }
    };
    
    initializeScreenState();

    // ----------------------------------------------------
    // FUNÇÕES DE DESBLOQUEIO E ANIMAÇÃO
    // ----------------------------------------------------
    
    const unlockApp = () => {
        // 1. Esconde a tela de bloqueio
        lockScreen.classList.add('hidden');
        
        // 2. Inicia a ANIMAÇÃO DE VERIFICAÇÃO
        verificationOverlay.classList.add('active');

        // 3. Após a animação, transiciona para a tela principal
        setTimeout(() => {
            verificationOverlay.classList.remove('active');
            
            // CORREÇÃO DO BUG: A tela principal estava oculta (`hidden`) e precisa ser exibida.
            mainApp.classList.remove('hidden');
            
            // 4. Aplica o desfoque nos menus da tela principal (Mobile)
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
    
    // ------------------- EVENT LISTENERS -------------------
    
    fingerprintArea.addEventListener('mousedown', startPress);
    fingerprintArea.addEventListener('mouseup', cancelPress);
    fingerprintArea.addEventListener('mouseleave', cancelPress); 
    fingerprintArea.addEventListener('touchstart', startPress);
    fingerprintArea.addEventListener('touchend', cancelPress);
    fingerprintArea.addEventListener('touchcancel', cancelPress);
    
    // ----------------------------------------------------
    // FUNÇÕES DA TELA PRINCIPAL
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
        });
    }

    // 2. FUNÇÕES PARA TODOS OS OUTROS BOTÕES E MENUS
    const functionalElements = document.querySelectorAll('#main-app [data-action]');

    functionalElements.forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Impede a ação se estiver desfocado (menu-blur) ou no Desktop (blurred)
            if (element.closest('.menu-target') && element.closest('.menu-target').classList.contains('menu-blur') || mainApp.classList.contains('blurred')) {
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
        });
    });
});
