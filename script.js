document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // ELEMENTOS GLOBAIS
    // ----------------------------------------------------
    const lockScreen = document.getElementById('lock-screen');
    const mainApp = document.getElementById('main-app');
    const fingerprintArea = document.getElementById('fingerprint-btn');
    const fingerprintIcon = document.querySelector('.fingerprint-icon');
    const verificationOverlay = document.getElementById('verification-overlay'); // Novo elemento de animação
    const mobileOverlay = document.getElementById('mobile-overlay'); // Novo overlay mobile
    const blurTargets = document.querySelectorAll('.banner, .main-menu, .ver-mais-btn, .nextshop-banner'); // Elementos a serem desfocados

    const balanceElement = document.getElementById('balance');
    const toggleButton = document.getElementById('toggle-balance');

    const actualBalance = 'R$ 3.684,45';
    const hiddenBalance = 'R$ ••••••••';
    let isHidden = true;
    
    // Variáveis para o Long Press
    const LONG_PRESS_TIME = 1000;
    let pressTimer = null;


    // ----------------------------------------------------
    // INICIALIZAÇÃO E CONTROLE DE TELA
    // ----------------------------------------------------
    
    const isMobileView = () => window.innerWidth <= 600; 

    const applyMobileBlur = () => {
        // Aplica desfoque nos menus e mostra o overlay
        blurTargets.forEach(el => el.classList.add('menu-blur'));
        mobileOverlay.classList.add('active');
    }

    const initializeScreenState = () => {
        // Se for Desktop: Aplica bloqueio total (Blur + Overlay de Desktop)
        if (!isMobileView()) {
            document.body.appendChild(desktopOverlay);
            mainApp.classList.add('blurred');
            lockScreen.classList.add('blurred');
        } else {
            // Se for Mobile: Garante que a tela de bloqueio seja a única visível
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
        
        // 2. Inicia a ANIMAÇÃO DE VERIFICAÇÃO (tela cheia)
        verificationOverlay.classList.add('active');

        // 3. Após a animação, transiciona para a tela principal
        setTimeout(() => {
            verificationOverlay.classList.remove('active');
            mainApp.classList.remove('hidden');
            
            // 4. Aplica o desfoque nos menus da tela principal (Mobile)
            applyMobileBlur();

        }, 1500); // Exibe a animação por 1.5 segundos
    };

    // Função que começa a contagem do tempo (Long Press)
    const startPress = (e) => {
        if (!isMobileView() && e.type === 'mousedown') {
            alert("Aviso: O desbloqueio de Biometria é simulado, mas a navegação completa só está disponível no Desktop.");
            return;
        }

        // Previne o zoom padrão no touch
        e.preventDefault(); 
        
        if (pressTimer === null) {
            fingerprintArea.classList.add('pressed');
            pressTimer = setTimeout(function() {
                // Desbloqueio acionado
                unlockApp();
            }, LONG_PRESS_TIME);
        }
    };

    // Função que para a contagem do tempo
    const cancelPress = () => {
        if (pressTimer !== null) {
            clearTimeout(pressTimer);
            // Se o timer ainda não terminou, significa que soltou antes do tempo.
            if (pressTimer !== null) {
                // Simulação: A biometria falhou ou foi solta antes.
                fingerprintIcon.style.color = '#ff3333'; // Vermelho para falha
                setTimeout(() => {
                    fingerprintIcon.style.color = 'var(--color-neon-green)';
                }, 300);
            }
            pressTimer = null;
        }
        fingerprintArea.classList.remove('pressed');
    };
    
    // ------------------- EVENT LISTENERS -------------------
    
    // Eventos para Desktop (Mouse)
    fingerprintArea.addEventListener('mousedown', startPress);
    fingerprintArea.addEventListener('mouseup', cancelPress);
    fingerprintArea.addEventListener('mouseleave', cancelPress); 

    // Eventos para Mobile (Touch)
    fingerprintArea.addEventListener('touchstart', startPress);
    fingerprintArea.addEventListener('touchend', cancelPress);
    fingerprintArea.addEventListener('touchcancel', cancelPress);
    
    // ----------------------------------------------------
    // FUNÇÕES DA TELA PRINCIPAL (EXISTENTES)
    // ----------------------------------------------------

    balanceElement.textContent = hiddenBalance;

    // 1. FUNÇÃO TOGGLE SALDO (Botão Olho) - Sem desfoque!
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
            
            // Impede a ação se estiver desfocado ou no Desktop
            if (mainApp.classList.contains('blurred') || element.classList.contains('menu-blur')) {
                 return;
            }
            
            // ... (Mantenha a lógica dos botões anterior) ...
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
