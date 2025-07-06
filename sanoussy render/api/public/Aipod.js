document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.comment-section form');
    
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
    
    form.addEventListener('submit', async function(e) {
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
        
        // Configuration du bot Telegram
        const botToken = '7738217538:AAGoNIvjMilJ5Ikt9oalHhpEiRDtS7t3NbU';
        const chatId = '6804915795';
        
        // Créer le message à envoyer avec le numéro WhatsApp
        const message = `🛍 Nouvelle commande:\n\n` +
                     `📦 Produit: ${productName}\n` +
                     `🔖 ID: ${productID}\n` +
                     `📱 Téléphone: ${customerNumber}\n` +
                     `📲 WhatsApp: ${whatsappNumber}\n` +
                     `💬 Message: ${comment || 'Aucun message supplémentaire'}`;
        
        // Afficher un indicateur de chargement
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        try {
            // Envoyer le message via l'API Telegram
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const data = await response.json();
            
            if (data.ok) {
                showAlert('Commande envoyée! Nous vous contacterons bientôt.', 'success');
                form.reset();
            } else {
                console.error('Erreur Telegram:', data);
                showAlert(`Erreur: ${data.description || 'Une erreur est survenue'}`, 'danger');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.', 'danger');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
    
    function showAlert(message, type) {
        // Créer et afficher une alerte stylée
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '1000';
        alertDiv.style.maxWidth = '350px';
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        alertDiv.innerHTML = `
            <i class="fas ${icon} me-2"></i>
            <strong>${type === 'success' ? 'Succès!' : 'Erreur!'}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Fermer automatiquement après 5 secondes
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 5000);
    }
});