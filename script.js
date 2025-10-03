document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const toggleButton = document.getElementById('toggle-balance');

    // 1. SALDO ATUALIZADO
    const actualBalance = 'R$ 3.684,45';
    const hiddenBalance = 'R$ ••••••••';
    let isHidden = true;

    // Define o saldo inicial no elemento (como oculto)
    balanceElement.textContent = hiddenBalance;

    // 2. FUNÇÃO TOGGLE SALDO (Botão Olho)
    toggleButton.addEventListener('click', () => {
        if (isHidden) {
            // Se estiver oculto, mostra o saldo
            balanceElement.textContent = actualBalance;
            toggleButton.textContent = 'visibility'; // Altera o ícone para "olho aberto"
            isHidden = false;
        } else {
            // Se estiver visível, oculta o saldo
            balanceElement.textContent = hiddenBalance;
            toggleButton.textContent = 'visibility_off'; // Altera o ícone para "olho fechado"
            isHidden = true;
        }
        console.log(`Ação: Saldo foi ${isHidden ? 'ocultado' : 'exibido'}.`);
    });


    // 3. FUNÇÕES PARA TODOS OS OUTROS BOTÕES E MENUS
    // Seleciona todos os elementos que possuem o atributo data-action
    const functionalElements = document.querySelectorAll('[data-action]');

    functionalElements.forEach(element => {
        // Ignora o botão de toggle-balance que já tem um evento específico
        if (element.id === 'toggle-balance') {
            return;
        }

        element.addEventListener('click', (event) => {
            // Previne a ação padrão (se for um link ou form)
            event.preventDefault();

            // Pega o nome da ação definida no HTML
            const action = element.getAttribute('data-action');
            let message = '';

            // Lógica de simulação de clique
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

            // Exibe a simulação em um alerta
            alert(message);
            console.log(message);
        });
    });
});