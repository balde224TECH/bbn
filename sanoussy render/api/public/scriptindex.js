// Vous pouvez ajouter ici votre JavaScript personnalisé
// Par exemple, pour gérer les interactions avec les produits

document.addEventListener('DOMContentLoaded', function() {
    // Exemple: Gestion du clic sur le bouton "Ajouter au panier"
    const addToCartButtons = document.querySelectorAll('.product-card button');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Afficher une notification
            alert(`Produit "${productName}" ajouté au panier !`);
            
            // Ici, vous pourriez ajouter le produit au panier (localStorage ou appel API)
        });
    });
    
    // Animation au défilement
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-fadeInUp');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécuter une fois au chargement
});