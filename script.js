document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // ELEMENTOS GLOBAIS
    // ----------------------------------------------------
    const lockScreen = document.getElementById('lock-screen');
    const mainApp = document.getElementById('main-app');
    const fingerprintBtn = document.getElementById('fingerprint-btn');
    const balanceElement = document.getElementById('balance');
    const toggleButton = document.getElementById('toggle-balance');

    // Saldo real e oculto
    const actualBalance = 'R$ 3.684,45';
    const hiddenBalance = 'R$ ••••••••';
    let isHidden = true;

    // ----------------------------------------------------
    // FUNÇÕES DA TELA DE BLOQUEIO
    // ----------------------------------------------------

    // 1. Atualiza a hora na tela de bloqueio
    const updateTime = () => {
        const timeElement = document.querySelector('.lock-time');
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        timeElement.textContent = timeString;
    };
    updateTime();
    setInterval(updateTime, 1000); // Atualiza a cada segundo

    // 2. FUNÇÃO DE DESBLOQUEIO
    const unlockApp = () => {
        // Simula o processo de leitura digital
        const icon = document.querySelector('.fingerprint-icon');
        icon.style.animation = 'none'; // Para a animação pulsante
        icon.style.color = '#fff'; // Muda a cor para cinza
        icon.textContent = 'check_circle'; // Mostra o ícone de 'check'

        // Após um pequeno atraso, faz a transição para a tela principal
        setTimeout(() => {
            lockScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            // Remove a classe de tela cheia do lock-screen para o body voltar ao normal
            lockScreen.classList.remove('lock-screen-active'); 
        }, 800);
    };

    // Evento de clique para desbloquear
    if (fingerprintBtn) {
        fingerprintBtn.addEventListener('click', unlockApp);
    }


    // ----------------------------------------------------
    // FUNÇÕES DA TELA PRINCIPAL (EXISTENTES)
    // ----------------------------------------------------

    // Define o saldo inicial no elemento (como oculto)
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
            const action = element.getAttribute('data-action');
            let message = '';

            switch (action) {
                case 'settings':
                    message = 'Ação: Abrir Configurações da Conta.';
                    break;
                case 'share-data':
                    message = 'Ação: Compartilhar Dados (Open Finance) iniciado.';
                    break;
                case 'extrato':
                    message = 'Ação: Navegar para Saldo e Extrato.';
                    break;
                case 'pix':
                    message = 'Ação: Abrir Área Pix.';
                    break;
                case 'pagamentos':
                    message = 'Ação: Navegar para Pagamentos.';
                    break;
                case 'ver-mais':
                    message = 'Ação: Exibir todos os menus (Ver Mais).';
                    break;
                case 'contratar-seguro':
                    message = 'Ação: Iniciar Contratação do Seguro.';
                    break;
                default:
                    message = 'Ação Desconhecida: ' + action;
            }

            alert(message);
            console.log(message);
        });
    });
});
