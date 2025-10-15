// Arquivo gerado automaticamente: JavaScript extraído de index.html

// URL do Google Apps Script (envio/carregamento de confirmações)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_MFY7Oj7nyDF4cvLJTXekH87cWryWa9G5OYEe3dsIiQ-4thN3acBmbesaslqhgk-j/exec';

// Envio do formulário
document.getElementById('confirmacao-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('.submit-button');
    const messageDiv = document.getElementById('form-message');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const formData = {
        nome: document.getElementById('nome').value,
        dias: document.querySelector('input[name="dias"]:checked').value,
        contribuicao: document.querySelector('input[name="contribuicao"]:checked').value,
        alergias: document.getElementById('alergias').value || 'Nenhuma',
        dormira: false,
        pago: false
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        messageDiv.innerHTML = '<div class="success-msg"><i class="fas fa-check-circle"></i> Presença confirmada com sucesso! Obrigado!</div>';
        e.target.reset();

        setTimeout(() => {
            loadConfirmacoes();
            messageDiv.innerHTML = '';
            document.getElementById('lista-confirmados').scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    } catch (error) {
        console.error('Erro ao enviar:', error);
        messageDiv.innerHTML = '<div class="error-msg"><i class="fas fa-exclamation-circle"></i> Erro ao enviar. Tente novamente!</div>';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirmar minha Presença';
    }
});

// Carregar lista de confirmados
async function loadConfirmacoes() {
    const container = document.getElementById('confirmados-container');
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();

        if (!data || data.length === 0) {
            container.innerHTML = '<p class="centered">Ainda não há confirmações. Seja o primeiro!</p>';
            return;
        }

        container.innerHTML = data.map(item => `
            <div class="confirmado-item">
                <div class="confirmado-nome"><i class="fas fa-user"></i> ${item.nome}</div>
                <div class="confirmado-info">
                    <span><i class="fas fa-calendar"></i> ${item.dias}</span>
                    <span><i class="fas fa-utensils"></i> ${item.contribuicao}</span>
                    ${item.alergias && item.alergias !== 'Nenhuma' ? `<span><i class="fas fa-exclamation-triangle"></i> ${item.alergias}</span>` : ''}
                    ${item.dormira ? '<span><i class="fas fa-bed"></i> Vai dormir</span>' : ''}
                    ${item.pago ? '<span><i class="fas fa-check-circle"></i> Pago</span>' : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar confirmações:', error);
        container.innerHTML = '<p class="centered error-msg">Erro ao carregar confirmações. Tente novamente mais tarde.</p>';
    }
}

// Scroll suave para âncoras e carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    loadConfirmacoes();
});

// Atualizar lista a cada 30 segundos
setInterval(loadConfirmacoes, 30000);
// ============== CONFIGURAÇÃO ==============
// ALTERE ESTA DATA PARA O INÍCIO DO SEU RELACIONAMENTO
const startDate = new Date('2025-03-06T00:00:00');

// Atualizar data no display
document.getElementById('startDate').textContent = startDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
});

// ============== CONTADOR ==============
function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    // Calcular tempo
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    // Calcular anos e meses
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Ajustar dias
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let remainingDays = now.getDate() - startDate.getDate();
    if (remainingDays < 0) {
        months--;
        remainingDays += daysInMonth;
    }

    // Atualizar display
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = remainingDays;
    document.getElementById('hours').textContent = now.getHours().toString().padStart(2, '0');
    document.getElementById('minutes').textContent = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('seconds').textContent = now.getSeconds().toString().padStart(2, '0');
}

// Atualizar a cada segundo
setInterval(updateCounter, 1000);
updateCounter();

// ============== PARTÍCULAS FLUTUANTES ==============
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const hearts = ['💖', '💗', '💝', '💕', '💓', '💞'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (12 + Math.random() * 8) + 's';
        particle.style.fontSize = (15 + Math.random() * 15) + 'px';
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ============== CORAÇÕES AO CLICAR ==============
function createHeart(x, y) {
    const hearts = ['❤️', '💖', '💗', '💝', '💕', '💓', '💞', '🌹'];
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// Criar corações ao clicar
document.addEventListener('click', (e) => {
    createHeart(e.clientX, e.clientY);
    
    // Criar múltiplos corações
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            createHeart(e.clientX + offsetX, e.clientY + offsetY);
        }, i * 100);
    }
});

// Criar corações automaticamente
setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight;
    createHeart(x, y);
}, 2000);

// ============== ANIMAÇÕES AO SCROLL ==============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.counter-section, .love-message, .photo-gallery, .music-section').forEach(el => {
    observer.observe(el);
});