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

    // Elementos para o Desktop Overlay
    const desktopOverlay = document.createElement('div');
    desktopOverlay.id = 'desktop-overlay';
    desktopOverlay.innerHTML = 'Acesse pelo Desktop';

    // Saldo e Long Press
    const actualBalance = 'R$ 3.684,45';
    const hiddenBalance = 'R$ ••••••••';
    let isHidden = true;
    const LONG_PRESS_TIME = 1000; // 1 segundo
    let pressTimer = null;
    let isPressing = false; 

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
    // FUNÇÕES DE DESBLOQUEIO E ANIMAÇÃO - CORREÇÃO DE BUG
    // ----------------------------------------------------
    
    const unlockApp = () => {
        clearTimeout(pressTimer);
        pressTimer = null;
        isPressing = false;

        // 1. Esconde a tela de bloqueio
        lockScreen.classList.add('hidden');
        
        // 2. Inicia a ANIMAÇÃO DE VERIFICAÇÃO (Símbolo Verificado Gigante)
        verificationOverlay.classList.add('active');

        // 3. Após a animação, transiciona para a tela principal
        setTimeout(() => {
            verificationOverlay.classList.remove('active');
            mainApp.classList.remove('hidden');
            
            applyMobileBlur();
        }, 1500); 
    };

    // Função que começa a contagem do tempo (Long Press)
    const startPress = (e) => {
        if (e.type === 'mousedown' && !isMobileView()) {
             alert("Aviso: O desbloqueio de Biometria é simulado, mas a navegação completa só está disponível no Desktop.");
             return;
        }

        // CORREÇÃO ESSENCIAL: Previne o disparo múltiplo e o menu de contexto do navegador
        e.preventDefault(); 
        
        if (!isPressing) {
            isPressing = true;
            fingerprintArea.classList.add('pressed');
            
            // Inicia o timer para a função de desbloqueio
            pressTimer = setTimeout(function() {
                unlockApp();
            }, LONG_PRESS_TIME);
        }
    };

    // Função que para a contagem do tempo (soltou o dedo/mouse)
    const cancelPress = (e) => {
        // CORREÇÃO: Previne o menu de contexto no touch/mouse up
        e.preventDefault();
        
        if (isPressing) {
            // Se o timer ainda estiver ativo, significa que soltou antes do tempo
            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                
                // Animação de Falha
                fingerprintIcon.style.color = '#ff3333'; // Vermelho
                setTimeout(() => {
                    fingerprintIcon.style.color = 'var(--color-neon-green)';
                }, 300);
            }
            
            // Zera as flags e estilos
            pressTimer = null;
            isPressing = false;
            fingerprintArea.classList.remove('pressed');
        }
    };
    
    // ------------------- EVENT LISTENERS - LOCK SCREEN (CORRIGIDOS) -------------------
    
    // Desktop Events
    fingerprintArea.addEventListener('mousedown', startPress);
    fingerprintArea.addEventListener('mouseup', cancelPress);
    fingerprintArea.addEventListener('mouseleave', cancelPress); 

    // Mobile/Touch Events
    // Usamos {passive: false} para garantir que o preventDefault no startPress funcione
    fingerprintArea.addEventListener('touchstart', startPress, {passive: false});
    fingerprintArea.addEventListener('touchend', cancelPress);
    fingerprintArea.addEventListener('touchcancel', cancelPress);
    
    // CORREÇÃO EXTRA: Bloqueia o menu de contexto padrão (botão direito/long press) na área da digital
    fingerprintArea.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        cancelPress(e); // Garante que o timer seja limpo
    });
    
    // ----------------------------------------------------
    // FUNÇÕES DA TELA PRINCIPAL (Mantidas as correções anteriores)
    // ----------------------------------------------------

    balanceElement.textContent = hiddenBalance;

    // 1. FUNÇÃO TOGGLE SALDO (Botão Olho) - Isolada e funcional
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
        // Pula o botão de toggle de saldo
        if (element.id === 'toggle-balance') {
            return; 
        }

        element.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Impede a ação se estiver desfocado ou no Desktop
            const isBlurred = element.closest('.menu-blur-target') || mainApp.classList.contains('blurred');
            if (isBlurred) {
                 return;
            }
            
            const action = element.getAttribute('data-action');
            let message = '';
            // Lógica para todos os outros botões que devem exibir um alerta:
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
