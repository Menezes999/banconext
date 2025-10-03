document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // ELEMENTOS GLOBAIS
    // ----------------------------------------------------
    const lockScreen = document.getElementById('lock-screen');
    const mainApp = document.getElementById('main-app');
    const fingerprintBtn = document.getElementById('fingerprint-btn');
    const balanceElement = document.getElementById('balance');
    const toggleButton = document.getElementById('toggle-balance');
    
    // Novo: Elementos para o Desktop Overlay
    const desktopOverlay = document.createElement('div');
    desktopOverlay.id = 'desktop-overlay';
    desktopOverlay.innerHTML = 'Acesso somente pelo Desktop';

    // Saldo real e oculto
    const actualBalance = 'R$ 3.684,45';
    const hiddenBalance = 'R$ ••••••••';
    let isHidden = true;

    // ----------------------------------------------------
    // INICIALIZAÇÃO DA TELA
    // ----------------------------------------------------
    
    // 1. Verifica se está em um dispositivo pequeno (celular/app)
    const isMobileView = () => window.innerWidth <= 600; 

    // 2. Configura o estado inicial (Desfoque e Overlay no Desktop)
    const initializeScreenState = () => {
        if (!isMobileView()) {
            // Se for Desktop, adiciona o overlay de aviso e desfoca o app
            document.body.appendChild(desktopOverlay);
            mainApp.classList.add('blurred');
            lockScreen.classList.add('blurred');
        } else {
            // Se for mobile, garante que a tela de bloqueio seja a única visível
            mainApp.classList.add('hidden');
            lockScreen.classList.remove('hidden');
        }
    };
    
    // 3. Atualiza a hora na tela de bloqueio
    const updateTime = () => {
        const timeElement = document.querySelector('.lock-time');
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if (timeElement) timeElement.textContent = timeString;
    };
    updateTime();
    setInterval(updateTime, 1000); 

    // Chama a função de inicialização
    initializeScreenState();

    // ----------------------------------------------------
    // FUNÇÕES DA TELA DE BLOQUEIO
    // ----------------------------------------------------

    // FUNÇÃO DE DESBLOQUEIO
    const unlockApp = () => {
        if (!isMobileView()) {
             // Simula o clique e mostra o alerta, mas não desbloqueia
            alert("Aviso: O desbloqueio de Biometria é simulado, mas a navegação completa só está disponível no Desktop.");
            return;
        }

        // Simula o processo de leitura digital (Animação de Verificação)
        const icon = document.querySelector('.fingerprint-icon');
        const originalIcon = icon.textContent;

        // 1. Inicia a animação de verificação
        icon.style.animation = 'none';
        icon.style.color = 'yellow'; // Amarelo para 'Lendo...'
        icon.textContent = 'loop'; // Ícone de 'carregando'
        
        // 2. Verifica (após 1 segundo)
        setTimeout(() => {
            icon.style.color = '#fff'; // Branco
            icon.textContent = 'check_circle'; // Ícone de 'check'

            // 3. Transição para a tela principal (após 0.5s)
            setTimeout(() => {
                lockScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
                
                // Remove o desfoque e overlay se por algum motivo ainda estiverem lá
                mainApp.classList.remove('blurred');
                if (desktopOverlay.parentNode) {
                    desktopOverlay.parentNode.removeChild(desktopOverlay);
                }
                
            }, 500);
        }, 1000); // 1 segundo para simular a leitura

    };

    // Evento de clique para desbloquear
    if (fingerprintBtn) {
        fingerprintBtn.addEventListener('click', unlockApp);
    }


    // ----------------------------------------------------
    // FUNÇÕES DA TELA PRINCIPAL
    // ----------------------------------------------------

    // Define o saldo inicial no elemento (como oculto)
    balanceElement.textContent = hiddenBalance;

    // FUNÇÃO TOGGLE SALDO (Botão Olho)
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

    // FUNÇÕES PARA TODOS OS OUTROS BOTÕES E MENUS
    const functionalElements = document.querySelectorAll('#main-app [data-action]');

    functionalElements.forEach(element => {
        if (element.id === 'toggle-balance') {
            return;
        }

        element.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Se estiver desfocado (Desktop), não faz nada. O CSS já impede o clique, mas é bom ter uma segurança.
            if (mainApp.classList.contains('blurred')) {
                 return;
            }
            
            const action = element.getAttribute('data-action');
            let message = '';

            switch (action) {
                // ... (mantenha a lógica dos botões anterior) ...
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
