document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // ELEMENTOS GLOBAIS
    // ----------------------------------------------------
    const lockScreen = document.getElementById('lock-screen');
    const mainApp = document.getElementById('main-app');
    const verificationOverlay = document.getElementById('verification-overlay');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const menuBlurTargets = document.querySelectorAll('.menu-blur-target'); 
    
    // Elementos do Saldo
    const balanceElement = document.getElementById('balance');
    const toggleButtonElement = document.getElementById('toggle-balance'); // Tem id e data-action

    // ... (Variáveis e funções de Lock Screen permanecem as mesmas) ...
    // ... (Inicialização e Controle de Tela permanecem as mesmas) ...
    
    // Funções de Long Press para o Fingerprint (mantidas)
    // ...

    // ----------------------------------------------------
    // FUNÇÕES DA TELA PRINCIPAL - CORREÇÃO DO BUG DE ALERTA
    // ----------------------------------------------------

    // Saldo inicial (oculto)
    balanceElement.textContent = 'R$ ••••••••';

    // 1. FUNÇÃO TOGGLE SALDO (Botão Olho) - Isolar esta função é a chave.
    if (toggleButtonElement) {
        toggleButtonElement.addEventListener('click', () => {
            // Lógica de mostrar/esconder o saldo
            if (isHidden) {
                balanceElement.textContent = 'R$ 3.684,45';
                toggleButtonElement.textContent = 'visibility';
                isHidden = false;
            } else {
                balanceElement.textContent = 'R$ ••••••••';
                toggleButtonElement.textContent = 'visibility_off';
                isHidden = true;
            }
        });
    }

    // 2. FUNÇÕES PARA TODOS OS OUTROS BOTÕES E MENUS
    const functionalElements = document.querySelectorAll('#main-app [data-action]');

    functionalElements.forEach(element => {
        // CORREÇÃO: Se for o botão de toggle de saldo, APENAS pula, pois ele já tem um evento separado acima.
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
            // Lógica para todos os outros botões que devem exibir um alerta:
            switch (action) {
                case 'settings': message = 'Ação: Abrir Configurações da Conta.'; break;
                // ... (outras ações de menu) ...
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
    
    // ... (Mantenha o restante do código JS aqui, como as funções de unlockApp, startPress, etc.) ...
    
    // As funções completas para lock screen e inicialização estão no código anterior,
    // mas devem ser mantidas no seu arquivo script.js final.

});
