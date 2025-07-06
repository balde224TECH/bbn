document.addEventListener('DOMContentLoaded', function() {
    // Effets de particules cosmiques
    const section = document.querySelector('.contact-section');
    const colors = ['rgba(0, 247, 255, 0.7)', 'rgba(189, 0, 255, 0.7)', 'rgba(0, 255, 157, 0.7)'];
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 3 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = '0';
        particle.style.transition = `all ${duration}s linear ${delay}s`;
        
        section.appendChild(particle);
        
        setTimeout(() => {
            particle.style.opacity = '0.8';
            particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
        }, 50);
        
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    }
    
    setInterval(createParticle, 300);
    
    // Effet de survol sur les info-items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.info-icon i');
            icon.style.transform = 'scale(1.3)';
            if (icon.classList.contains('fa-whatsapp')) {
                icon.style.textShadow = '0 0 15px var(--neon-green)';
            } else if (icon.classList.contains('fa-telegram-plane')) {
                icon.style.textShadow = '0 0 15px #0088cc';
            } else {
                icon.style.textShadow = '0 0 15px var(--neon-blue)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.info-icon i');
            icon.style.transform = 'scale(1)';
            icon.style.textShadow = 'none';
        });
    });

    // Gestion du formulaire de contact
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Afficher un indicateur de chargement
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        try {
            // Récupération des données du formulaire
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Configuration Telegram
            const botToken = '7265673272:AAHwAe-NnbrGVwDSvDOB3cOMxM7YzYHZZuA';
            const chatId = '6804915795';
            
            const telegramMessage = `Nouveau message de contact\n\n`
                                + `Nom: ${formData.name}\n`
                                + `Email: ${formData.email}\n`
                                + `Sujet: ${formData.subject}\n`
                                + `Message:\n${formData.message}`;
            
            const encodedMessage = encodeURIComponent(telegramMessage);
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedMessage}`;
            
            const response = await fetch(telegramUrl);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.description || `Erreur HTTP: ${response.status}`);
            }
            
            showNotification('Message envoyé avec succès!', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Erreur:', error);
            showNotification(`Erreur: ${error.message}`, 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
    
    // Fonction pour afficher les notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }
    
    // Ajout du CSS pour les notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification.success {
            background: linear-gradient(135deg, #00ff9d, #00b36b);
            border-left: 5px solid #007a46;
        }
        
        .notification.error {
            background: linear-gradient(135deg, #ff4d4d, #cc0000);
            border-left: 5px solid #990000;
        }
    `;
    document.head.appendChild(notificationStyles);
});