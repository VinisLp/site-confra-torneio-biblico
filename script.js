document.addEventListener('DOMContentLoaded', () => {

    // URL do Google Apps Script (para envio e carregamento de confirmações)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_MFY7Oj7nyDF4cvLJTXekH87cWryWa9G5OYEe3dsIiQ-4thN3acBmbesaslqhgk-j/exec';

    const form = document.getElementById('confirmacao-form');
    const messageDiv = document.getElementById('form-message');
    const confirmadosContainer = document.getElementById('confirmados-container');

    /**
     * Função para carregar a lista de confirmados
     */
    async function loadConfirmacoes() {
        if (!confirmadosContainer) return;

        try {
            const response = await fetch(SCRIPT_URL);
            if (!response.ok) {
                throw new Error('Falha na resposta da rede.');
            }
            const data = await response.json();

            if (!data || data.length === 0) {
                confirmadosContainer.innerHTML = '<p class="centered">Ainda não há confirmações. Seja o primeiro!</p>';
                return;
            }

            confirmadosContainer.innerHTML = '';
            confirmadosContainer.classList.add('confirmados-grid');

            // Renderizar cabeçalho
            const headerHTML = `
                <div class="confirmado-header">
                    <div><i class="fas fa-user"></i> Nome</div>
                    <div><i class="fas fa-calendar-alt"></i> Participação</div>
                    <div><i class="fas fa-utensils"></i> Contribuição</div>
                </div>
            `;
            confirmadosContainer.innerHTML += headerHTML;

            // Renderizar itens
            const itemsHTML = data.map(item => `
                <div class="confirmado-item-grid">
                    <div class="col-nome">${item.nome}</div>
                    <div class="col-dias">${item.dias}</div>
                    <div class="col-contribuicao">${item.contribuicao}</div>
                    ${item.alergias && item.alergias.toLowerCase() !== 'nenhuma' 
                        ? `<div class="col-alergia"><i class="fas fa-exclamation-triangle"></i> ${item.alergias}</div>` 
                        : ''
                    }
                </div>
            `).join('');
            confirmadosContainer.innerHTML += itemsHTML;
        } catch (error) {
            console.error('Erro ao carregar confirmações:', error);
            confirmadosContainer.innerHTML = '<p class="centered error-msg">Erro ao carregar confirmações. Tente novamente mais tarde.</p>';
        }
    }

    /**
     * Função para mostrar mensagem de sucesso
     */
    function showSuccessMessage(message) {
        messageDiv.innerHTML = `<div class="success-msg"><i class="fas fa-check-circle"></i> ${message}</div>`;
    }

    /**
     * Função para mostrar mensagem de erro
     */
    function showErrorMessage(message) {
        messageDiv.innerHTML = `<div class="error-msg"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
    }

    /**
     * Função para limpar mensagens
     */
    function clearMessages() {
        messageDiv.innerHTML = '';
    }

    /**
     * Lógica para o envio do formulário
     */
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.submit-button');

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            const formData = {
                nome: document.getElementById('nome').value,
                dias: document.querySelector('input[name="dias"]:checked').value,
                contribuicao: document.querySelector('input[name="contribuicao"]:checked').value,
                alergias: document.getElementById('alergias').value.trim() || 'Nenhuma',
            };

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                // 1. Mostrar mensagem de sucesso e limpar formulário
                showSuccessMessage('Presença confirmada com sucesso! Obrigado!');
                form.reset();

                // 2. Animar o botão para o estado de sucesso
                submitBtn.classList.add('success');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Presença Confirmada!';

                // 3. Após um tempo, reverter o botão e carregar a lista
                setTimeout(() => {
                    // Reverte o botão ao estado original
                    submitBtn.classList.remove('success');
                    submitBtn.innerHTML = 'Confirmar minha Presença';
                    submitBtn.disabled = false;

                    // Carrega a nova lista de confirmações
                    loadConfirmacoes();

                    // Limpa a mensagem de sucesso e rola a tela
                    clearMessages();
                    document.getElementById('lista-confirmados').scrollIntoView({ behavior: 'smooth' });
                }, 2500);

            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                showErrorMessage('Erro ao enviar. Tente novamente!');
                // Reverte o botão imediatamente em caso de erro
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Confirmar minha Presença';
            }
        });
    }

    /**
     * Scroll suave para links internos (âncoras)
     */
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Carrega as confirmações ao iniciar
    loadConfirmacoes();

    // Recarrega a lista a cada 30 segundos
    setInterval(loadConfirmacoes, 30000);
});