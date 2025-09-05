// Dify chatbot configuration
window.difyChatbotConfig = {
    token: 'zGg2ydIBkLV7wekK',
    baseUrl: 'https://dify.dev.maersk-digital.net'
};

// Custom styling for the Dify chatbot
const customStyles = `
    <style>
        #dify-chatbot-bubble-button {
            background-color: #1C64F2 !important;
        }
        #dify-chatbot-bubble-window {
            width: 24rem !important;
            height: 40rem !important;
        }
    </style>
`;

// Add custom styles to the document
document.head.insertAdjacentHTML('beforeend', customStyles);

// Reset any existing widget and (re)load the Dify chatbot script
(function reloadDifyWidget() {
	// Remove previous script (same id) if present
	const existingScript = document.getElementById('zGg2ydIBkLV7wekK');
	if (existingScript && existingScript.parentNode) existingScript.parentNode.removeChild(existingScript);

	// Remove any previously injected widget containers (without opening/closing)
	document.querySelectorAll('[id^="dify-chatbot"]').forEach(el => el.remove());
	document.querySelectorAll('#dify-chatbot-bubble-button, #dify-chatbot-bubble-window').forEach(el => el.remove());

	// Optionally clear stale local/session storage keys used by the widget
	try {
		const shouldDelete = (k) => {
			if (!k) return false;
			const n = k.toLowerCase();
			return n.includes('dify') || n.includes('conversation') || n.includes('chatbot');
		};
		for (let i = localStorage.length - 1; i >= 0; i--) {
			const k = localStorage.key(i);
			if (shouldDelete(k)) localStorage.removeItem(k);
		}
		for (let i = sessionStorage.length - 1; i >= 0; i--) {
			const k = sessionStorage.key(i);
			if (shouldDelete(k)) sessionStorage.removeItem(k);
		}
	} catch (_) { /* ignore */ }

	// Re-inject script fresh
	const s = document.createElement('script');
	s.src = 'https://dify.dev.maersk-digital.net/embed.min.js';
	s.id = 'zGg2ydIBkLV7wekK';
	s.defer = true;

	// No auto-opening/closing; rely on fresh injection + cleared storage only

	document.head.appendChild(s);
})();

 
