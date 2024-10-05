document.addEventListener('DOMContentLoaded', () => {
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('view-cart').textContent = `Cart (${cartCount})`;
    };

    // Initialize cart count
    updateCartCount();

    // Quantity Controls
    document.querySelectorAll('.quantity-increase').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const quantityInput = document.querySelector(`.quantity-input[data-product="${product}"]`);
            
            if (quantityInput) {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            } else {
                console.error(`Quantity input for product ${product} not found.`);
            }
        });
    });

    document.querySelectorAll('.quantity-decrease').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const quantityInput = document.querySelector(`.quantity-input[data-product="${product}"]`);
            
            if (quantityInput && parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            } else if (!quantityInput) {
                console.error(`Quantity input for product ${product} not found.`);
            }
        });
    });

    // Add to Cart Buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const product = event.target.getAttribute('data-product');
            const price = parseFloat(event.target.getAttribute('data-price'));
            const quantityInput = document.querySelector(`.quantity-input[data-product="${product.toLowerCase()}"]`);
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemIndex = cart.findIndex(item => item.product === product);

            if (itemIndex > -1) {
                cart[itemIndex].quantity += quantity;
            } else {
                cart.push({ product, price, quantity });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            window.location.href = 'checkout.html';
        });
    });

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChat = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatbotMessages = document.querySelector('.chatbot-messages');

    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'flex' : 'none';
    });

    closeChat.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
    });

    sendBtn.addEventListener('click', () => {
        handleUserMessage(chatInput.value.trim());
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    function handleUserMessage(userMessage) {
        if (userMessage) {
            const userMessageElem = document.createElement('div');
            userMessageElem.className = 'message user-message';
            userMessageElem.textContent = userMessage;
            chatbotMessages.appendChild(userMessageElem);

            chatInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            const keywords = ['basketball', 'headphones', 'bluetooth speaker'];
            if (keywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
                window.location.href = 'list.html';
                return;
            }

            const pageContext = getPageContext();

            setTimeout(() => {
                const botResponse = generateBotResponse(pageContext, userMessage);
                const botMessageElem = document.createElement('div');
                botMessageElem.className = 'message bot-message';
                botMessageElem.textContent = botResponse;
                chatbotMessages.appendChild(botMessageElem);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
    }

    function getPageContext() {
        const pagePath = window.location.pathname;
        if (pagePath.includes('index.html')) {
            return 'home';
        } else if (pagePath.includes('products.html')) {
            return 'products';
        } else if (pagePath.includes('deals.html')) {
            return 'deals';
        } else if (pagePath.includes('categories.html')) {
            return 'categories';
        }
        return 'general';
    }

    function generateBotResponse(pageContext, userMessage) {
        let response = "I'm here to help! What can I do for you?";

        if (pageContext === 'home') {
            response = "Welcome to our store! Are you looking for anything specific today?";
        } else if (pageContext === 'products') {
            response = "You can browse through our wide range of products. Do you need help finding something specific?";
        } else if (pageContext === 'deals') {
            response = "Check out our latest deals! Let me know if you're looking for a particular discount.";
        } else if (pageContext === 'categories') {
            response = "We have products categorized for your convenience. Which category are you interested in?";
        }

        if (userMessage.toLowerCase().includes('help')) {
            response = "Sure! What do you need help with?";
        } else if (userMessage.toLowerCase().includes('discount') && pageContext === 'deals') {
            response = "We have great discounts on various products! Can I help you find something specific?";
        } else if (userMessage.toLowerCase().includes('buy') || userMessage.toLowerCase().includes('purchase')) {
            response = "If you're ready to make a purchase, just add the items to your cart and proceed to checkout!";
        }

        return response;
    }
});
