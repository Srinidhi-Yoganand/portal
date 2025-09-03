class MaerskChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.loadChatHistory();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div id="maersk-chatbot" class="maersk-chatbot">
                <!-- Chat Toggle Button -->
                <div class="chatbot-toggle" id="chatbot-toggle">
                    <div class="chatbot-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                    </div>
                    <span class="chatbot-label">PIPE Team Assistant</span>
                </div>

                <!-- Chat Window -->
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-title">
                            <div class="chatbot-avatar">🚢</div>
                            <div>
                                <h3>PIPE Team Assistant</h3>
                                <p>Your DevOps documentation helper</p>
                            </div>
                        </div>
                        <button class="chatbot-close" id="chatbot-close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>

                    <div class="chatbot-messages" id="chatbot-messages">
                        <!-- Messages will be inserted here -->
                    </div>

                    <div class="chatbot-input">
                        <div class="input-wrapper">
                            <input type="text" id="chatbot-input-field" placeholder="Ask about DevOps, CI/CD, infrastructure...">
                            <button id="chatbot-send">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="quick-actions">
                            <button class="quick-action" data-query="How do I deploy to staging?">🚀 Deploy</button>
                            <button class="quick-action" data-query="What's our CI/CD workflow?">🔧 CI/CD</button>
                            <button class="quick-action" data-query="How do I access logs?">📊 Logs</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        // Toggle chatbot
        document.getElementById('chatbot-toggle').addEventListener('click', () => {
            this.toggleChat();
        });

        // Close chatbot
        document.getElementById('chatbot-close').addEventListener('click', () => {
            this.closeChat();
        });

        // Send message
        document.getElementById('chatbot-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key in input field
        document.getElementById('chatbot-input-field').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const query = e.target.dataset.query;
                document.getElementById('chatbot-input-field').value = query;
                this.sendMessage();
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.maersk-chatbot')) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        if (this.isOpen) {
            window.classList.add('open');
            toggle.classList.add('active');
            document.getElementById('chatbot-input-field').focus();
        } else {
            window.classList.remove('open');
            toggle.classList.remove('active');
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chatbot-window').classList.remove('open');
        document.getElementById('chatbot-toggle').classList.remove('active');
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input-field');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        this.showTypingIndicator();

        // Simulate bot response (replace with actual AI integration)
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 2000);
    }

    addMessage(text, sender) {
        const message = {
            id: Date.now(),
            text,
            sender,
            timestamp: new Date()
        };

        this.messages.push(message);
        this.displayMessage(message);
        this.saveChatHistory();
        this.scrollToBottom();
    }

    displayMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${message.sender}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <div class="message-time">${this.formatTime(message.timestamp)}</div>
            </div>
        `;
        messagesContainer.appendChild(messageElement);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'chatbot-message bot typing';
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        
        if (message.includes('deploy') || message.includes('staging')) {
            return `To deploy to staging, use the command: \`Maersk-cli deploy staging\`. Make sure all tests pass and you have the necessary approvals. Check the CI/CD Pipeline documentation for detailed workflow information.`;
        }
        
        if (message.includes('ci/cd') || message.includes('pipeline')) {
            return `Our CI/CD pipeline uses Jenkins with automated testing, code review requirements, and deployment to staging before production. All changes go through feature branches from 'develop'. See the CI/CD Pipeline section for detailed workflows.`;
        }
        
        if (message.includes('logs') || message.includes('access')) {
            return `Access logs using: \`Maersk-cli logs service=tracking-api\`. You can also use kubectl: \`kubectl logs -n Maersk-core\`. For production issues, page the on-call engineer via PagerDuty.`;
        }
        
        if (message.includes('kubernetes') || message.includes('cluster')) {
            return `Check cluster status with: \`kubectl get pods -n Maersk-core\`. We use Kubernetes for container orchestration with Terraform for infrastructure management. See the Infrastructure section for architecture details.`;
        }
        
        if (message.includes('terraform') || message.includes('infrastructure')) {
            return `Our infrastructure is managed with Terraform modules. Clone the infrastructure repo: \`git clone git@github.com:Maersk/infrastructure.git\`. Run \`./scripts/setup-dev-env.sh\` for local setup.`;
        }
        
        if (message.includes('monitoring') || message.includes('grafana')) {
            return `We use Grafana dashboards with Prometheus for metrics and alerting. Real-time logistics tracking metrics are available. Check the Monitoring section for dashboard access and alert configurations.`;
        }
        
        if (message.includes('help') || message.includes('support')) {
            return `For immediate assistance: Production incidents → Page via PagerDuty, General support → Microsoft Teams 'DevOps Support' channel. Daily stand-up is at 9:30 AM EST.`;
        }
        
        
        return `I can help you with DevOps processes, CI/CD workflows, infrastructure management, monitoring, and best practices. Try asking about deployment, Kubernetes, Terraform, or monitoring. You can also use the quick action buttons above!`;
    }

    addWelcomeMessage() {
        this.addMessage(`Hello! I'm your PIPE Team Assistant. I can help you with DevOps documentation, deployment processes, infrastructure questions, and more. How can I assist you today?`, 'bot');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTime(dateLike) {
        try {
            const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (_) {
            return '';
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    saveChatHistory() {
        localStorage.setItem('maersk-chatbot-history', JSON.stringify(this.messages.slice(-50)));
    }

    loadChatHistory() {
        const saved = localStorage.getItem('maersk-chatbot-history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.messages = parsed.map(m => ({
                    ...m,
                    // Restore Date objects for timestamps
                    timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
                }));
                this.messages.forEach(message => this.displayMessage(message));
            } catch (_) {
                // If parsing fails, clear corrupt history
                localStorage.removeItem('maersk-chatbot-history');
                this.messages = [];
            }
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MaerskChatbot();
});
