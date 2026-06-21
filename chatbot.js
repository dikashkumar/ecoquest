/* ==========================================================================
   ECOQUEST CHATBOT FRONTEND CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
});

function sendMessage() {
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages-container');
    
    if (!input || !input.value.trim() || !container) return;
    
    const text = input.value.trim();
    input.value = '';
    
    // Play sound click
    playSFX('click');
    
    // Append User Bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.innerHTML = `<p>${escapeHTML(text)}</p>`;
    container.appendChild(userBubble);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
    
    // Spawn typing bubble for Bot
    const botTypingBubble = document.createElement('div');
    botTypingBubble.className = 'chat-bubble bot';
    botTypingBubble.id = 'bot-typing-id';
    botTypingBubble.innerHTML = `<p><em>EcoBot is analyzing...</em></p>`;
    container.appendChild(botTypingBubble);
    container.scrollTop = container.scrollHeight;
    
    // Send AJAX POST request to API
    fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    })
    .then(res => res.json())
    .then(data => {
        // Remove typing
        const typingEl = document.getElementById('bot-typing-id');
        if (typingEl) typingEl.remove();
        
        // Append Bot Reply Bubble
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';
        
        // Render Markdown-ish lists/bold if bot replies have them
        const renderedText = renderSimpleMarkdown(data.reply);
        botBubble.innerHTML = `<p>${renderedText}</p>`;
        
        container.appendChild(botBubble);
        container.scrollTop = container.scrollHeight;
        
        playSFX('success');
    })
    .catch(err => {
        console.error("Chatbot API Error:", err);
        const typingEl = document.getElementById('bot-typing-id');
        if (typingEl) typingEl.remove();
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Support a basic markdown formatter for bolding (**text**) and newlines
function renderSimpleMarkdown(text) {
    let clean = escapeHTML(text);
    // Convert newlines to breaks
    clean = clean.replace(/\n/g, '<br>');
    // Bold tags
    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Simple list conversions
    clean = clean.replace(/-\s(.*?)(<br>|$)/g, '<li>$1</li>');
    // Wrap consecutive list items in <ul>
    if (clean.includes('<li>')) {
        clean = clean.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
        clean = clean.replace(/<\/ul>\s*<ul>/g, ''); // combine consecutive uls
    }
    return clean;
}
