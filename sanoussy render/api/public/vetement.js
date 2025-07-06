document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderForm');
    
    // Gérer le clic sur les boutons "Commander"
    document.querySelectorAll('.command-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            const productName = productCard.dataset.productName;
            
            // Pré-remplir le formulaire
            document.getElementById('productName').value = productName;
            document.getElementById('productID').value = productId;
            
            // Scroll vers le formulaire
            document.getElementById('contact-form').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Focus sur le champ suivant
            document.getElementById('customerNumber').focus();
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const productName = document.getElementById('productName').value;
        const whatsappNumber = document.getElementById('whatsappNumber').value;
        const productID = document.getElementById('productID').value;
        const customerNumber = document.getElementById('customerNumber').value;
        const comment = document.getElementById('comment').value;
        
        // Vérifier que tous les champs sont remplis
        if (!productName || !whatsappNumber || !productID || !customerNumber) {
            showAlert('Veuillez remplir tous les champs obligatoires du formulaire.', 'danger');
            return;
        }

        // Vérifier le format du numéro WhatsApp
        if (!isValidPhoneNumber(whatsappNumber)) {
            showAlert('Veuillez entrer un numéro WhatsApp valide.', 'danger');
            return;
        }

        // Vérifier le format du numéro de téléphone
        if (!isValidPhoneNumber(customerNumber)) {
            showAlert('Veuillez entrer un numéro de téléphone valide.', 'danger');
            return;
        }

        // Configuration du bot Telegram
        const botToken = '7738217538:AAGoNIvjMilJ5Ikt9oalHhpEiRDtS7t3NbU';
        const chatId = '6804915795';

        // Créer le message à envoyer avec le numéro WhatsApp
        const message = `🛍 *NOUVELLE COMMANDE SANOUSSY FASHION* 🛍\n\n` +
                     `📌 *Produit:* ${productName}\n` +
                     `🆔 *ID:* ${productID}\n` +
                     `📱 *Téléphone:* ${customerNumber}\n` +
                     `💬 *WhatsApp:* ${whatsappNumber}\n` +
                     `✏️ *Message:* ${comment || 'Aucun message supplémentaire'}\n\n` +
                     `⏱ *Date:* ${new Date().toLocaleString()}`;
        
        // Encoder le message pour l'URL
        const encodedMessage = encodeURIComponent(message);
        
        // Afficher un indicateur de chargement
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Envoyer le message via l'API Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedMessage}&parse_mode=Markdown`)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    showAlert('✅ Commande envoyée avec succès! Nous vous contacterons bientôt.', 'success');
                    form.reset();
                    
                    // Animation de confirmation
                    const confirmation = document.createElement('div');
                    confirmation.innerHTML = `
                        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                            background: rgba(0,0,0,0.8); z-index: 9999; display: flex; 
                            justify-content: center; align-items: center; flex-direction: column;">
                            <div style="background: white; padding: 2em; border-radius: 16px; text-align: center;
                                max-width: 500px; animation: zoomIn 0.5s;">
                                <div style="font-size: 5em; color: #2ed573; margin-bottom: 0.5em;">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <h3 style="color: var(--dark-color); margin-bottom: 1em;">Commande confirmée!</h3>
                                <p style="margin-bottom: 1.5em;">Nous avons bien reçu votre commande et vous contacterons dans les plus brefs délais.</p>
                                <button onclick="this.parentElement.parentElement.remove()" 
                                    style="background: var(--gradient); color: white; border: none; 
                                    padding: 0.75em 1.5em; border-radius: 30px; font-weight: 600;
                                    cursor: pointer; transition: all 0.3s;">
                                    Fermer
                                </button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(confirmation);
                } else {
                    showAlert('❌ Une erreur est survenue. Veuillez réessayer plus tard.', 'danger');
                    console.error('Erreur Telegram:', data);
                }
            })
            .catch(error => {
                showAlert('❌ Erreur réseau. Veuillez vérifier votre connexion.', 'danger');
                console.error('Erreur:', error);
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });

    // Fonction pour valider les numéros de téléphone
    function isValidPhoneNumber(phone) {
        // Expression régulière pour valider les numéros internationaux
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,}[-\s.]?[0-9]{3,}$/im;
        return phoneRegex.test(phone);
    }

    // Fonction pour afficher des alertes personnalisées
    function showAlert(message, type) {
        // Supprimer les alertes existantes
        const existingAlerts = document.querySelectorAll('.custom-alert');
        existingAlerts.forEach(alert => alert.remove());

        // Créer la nouvelle alerte
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert alert-${type}`;
        
        // Icône selon le type
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        alertDiv.innerHTML = `
            <div style="display: flex; align-items: center; padding: 1em; background: white; 
                border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <div style="font-size: 1.5em; margin-right: 0.5em; 
                    color: ${type === 'success' ? '#2ed573' : '#ff4757'}">
                    <i class="fas ${icon}"></i>
                </div>
                <div>${message}</div>
                <button onclick="this.parentElement.remove()" 
                    style="margin-left: auto; background: none; border: none; 
                    cursor: pointer; color: #666;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Afficher l'alerte avec animation
        setTimeout(() => {
            alertDiv.classList.add('show');
        }, 10);
        
        // Fermer automatiquement après 5 secondes
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }

    // Animation au scroll
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

    // Écouteur d'événement pour le scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger initial
    animateOnScroll();

    // Effet de flottement pour les cartes au survol
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateZ(1deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateZ(0)';
        });
    });
});