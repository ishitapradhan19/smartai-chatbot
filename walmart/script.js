document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navContainer = document.querySelector('.nav-container');

    menuToggle.addEventListener('click', () => {
        navContainer.classList.toggle('active');
    });

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChat = document.getElementById('close-chat');

    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'flex' : 'none';
        if (chatbotContainer.style.display === 'flex') {
            chatbotToggle.style.display = 'none';
        } else {
            chatbotToggle.style.display = 'block';
        }
    });

    closeChat.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
        chatbotToggle.style.display = 'block';
    });

    // Handle send button click in chatbot
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatbotMessages = document.querySelector('.chatbot-messages');

    sendBtn.addEventListener('click', () => {
        handleUserMessage(chatInput.value.trim());
    });

    // Handle Enter key press in chatbot input field
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Function to handle user message input and provide contextual responses
    function handleUserMessage(userMessage) {
        if (userMessage) {
            // Create and display user message
            const userMessageElem = document.createElement('div');
            userMessageElem.className = 'message user-message';
            userMessageElem.textContent = userMessage;
            chatbotMessages.appendChild(userMessageElem);

            // Clear input field
            chatInput.value = '';

            // Scroll to the bottom of the messages
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Check for specific keywords and redirect if necessary
            const keywords = ['basketball', 'headphones', 'bluetooth speaker'];
            if (keywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
                window.location.href = 'list.html';
                return;
            }

            // Determine the current page context
            const pageContext = getPageContext();

            // Generate bot response based on page context and user message
            setTimeout(() => {
                const botResponse = generateBotResponse(pageContext, userMessage);
                const botMessageElem = document.createElement('div');
                botMessageElem.className = 'message bot-message';
                botMessageElem.textContent = botResponse;
                chatbotMessages.appendChild(botMessageElem);

                // Scroll to the bottom of the messages
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
    }

    // Function to determine the current page context
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

    // Function to generate a bot response based on the page context and user message
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
