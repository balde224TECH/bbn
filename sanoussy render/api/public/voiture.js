    // Gérer le clic sur les boutons "Commander"
    document.querySelectorAll('.product-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.tagName === 'A') {
                return;
            }
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            const productName = productCard.dataset.productName;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            document.getElementById('productName').value = productName;
            document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('customerName').focus();
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productName = document.getElementById('productName').value;
        const customerName = document.getElementById('customerName').value;
        const customerNumber = document.getElementById('customerNumber').value;
        const comment = document.getElementById('comment').value;

        if (!customerNumber) {
            showAlert('Veuillez entrer votre numéro de téléphone.', 'danger');
            return;
        }

        if (!isValidPhoneNumber(customerNumber)) {
            showAlert('Veuillez entrer un numéro de téléphone valide.', 'danger');
            return;
        }

        let message = `Bonjour SanoussyAuto,\n\n`;
        message += `Je suis intéressé par un véhicule.\n`;
        if (productName) message += `Modèle: ${productName}\n`;
        if (customerName) message += `Nom: ${customerName}\n`;
        message += `Téléphone: ${customerNumber}\n`;
        if (comment) message += `Message: ${comment}\n`;

        const encodedMessage = encodeURIComponent(message);
        window.location.href = `https://wa.me/224664278708?text=${encodedMessage}`;
    });

    function isValidPhoneNumber(phone) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,}[-\s.]?[0-9]{3,}$/im;
        return phoneRegex.test(phone);
    }

    function showAlert(message, type) {
        const existingAlerts = document.querySelectorAll('.custom-alert');
        existingAlerts.forEach(alert => alert.remove());

        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert alert-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        alertDiv.innerHTML = `
            <div style="display: flex; align-items: center; padding: 1em; background: white; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <div style="font-size: 1.5em; margin-right: 0.5em; color: ${type === 'success' ? '#2ed573' : '#ff4757'}">
                    <i class="fas ${icon}"></i>
                </div>
                <div>${message}</div>
                <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; cursor: pointer; color: #666;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }

    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate__animated');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.animationPlayState = 'running';
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Animation au survol des cartes produits
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateZ(1deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateZ(0)';
        });
    });