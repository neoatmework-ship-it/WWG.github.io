const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

let isTyping = false;

// Handle enter key and button click
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim() !== '' && !isTyping) {
        sendMessage();
    }
});

sendBtn.addEventListener('click', () => {
    if (chatInput.value.trim() !== '' && !isTyping) {
        sendMessage();
    }
});

function sendMessage() {
    const msg = chatInput.value.trim();
    chatInput.value = '';

    // Add User Message
    appendUserMessage(msg);

    // Show AI Typing Indicator
    const typingElem = showTypingIndicator();

    // Process Response
    processAIResponse(msg, typingElem);
}

function appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'message-row user';
    row.innerHTML = `
        <div class="avatar user-avatar">U</div>
        <div class="message-content">${escapeHTML(text)}</div>
    `;
    chatWindow.appendChild(row);
    scrollToBottom();
}

function showTypingIndicator() {
    isTyping = true;
    const row = document.createElement('div');
    row.className = 'message-row ai typing-row';
    row.innerHTML = `
        <div class="avatar ai-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="message-content" style="display: flex; align-items: center; height: 26px;">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatWindow.appendChild(row);
    scrollToBottom();
    return row;
}

function appendAIMessage(typingRow, text) {
    // Remove the typing indicator row
    chatWindow.removeChild(typingRow);

    const row = document.createElement('div');
    row.className = 'message-row ai';

    // We start with an empty message content and stream the text in
    row.innerHTML = `
        <div class="avatar ai-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="message-content"></div>
    `;

    chatWindow.appendChild(row);
    const contentDiv = row.querySelector('.message-content');

    typeText(contentDiv, text, 0);
}

function typeText(element, text, index) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index) === '\\n' ? '<br>' : escapeHTML(text.charAt(index));
        scrollToBottom();

        let delay = 15 + Math.random() * 20; // Very fast typing like typical LLMs
        setTimeout(() => typeText(element, text, index + 1), delay);
    } else {
        isTyping = false;
    }
}

function scrollToBottom() {
    chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth'
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// -------------------------------------------------------------
// The "Normal" Brain
// -------------------------------------------------------------
function processAIResponse(input, typingRow) {
    const raw = input.toLowerCase();

    // Specific triggers
    if (raw.includes('ilikefeet')) {
        setTimeout(() => window.location.href = 'tools/beacon.html', 3000);
        appendAIMessage(typingRow, "I see you have the administrative password. Redirecting you to the telemetry dashboard...");
        return;
    }

    setTimeout(() => {
        let response = generateHelpfulResponse(raw);
        appendAIMessage(typingRow, response);
    }, 800 + Math.random() * 1000); // Simulate network thinking time
}

function generateHelpfulResponse(input) {
    // Basic Triggers
    if (input.includes('hello') || input.includes('hi ') || input === 'hi' || input.includes('hey')) {
        return "Hello! How can I help you explore the Weird Website Gallery today?";
    }

    if (input.includes('help') || input.includes('what can you do')) {
        return "I can answer questions about the sites in the gallery, help you navigate the terminal, or just chat! The gallery contains interactive physics simulations, atmospheric art pieces, and hidden games.";
    }

    if (input.includes('secret') || input.includes('hidden')) {
        return "The gallery is full of secrets. Have you tried exploring the terminal? Sometimes typing unexpected commands can lead to interesting discoveries. (Hint: Try reading the manifest in the root directory).";
    }

    if (input.includes('who are you') || input.includes('what are you')) {
        return "I am the WWG Assistant, an artificial intelligence designed to help you navigate and understand the Weird Website Gallery.";
    }

    if (input.includes('pikav') || input.includes('creator') || input.includes('made this')) {
        return "Pikav is the creator of the Weird Website Gallery. They designed these interactive experiences for you to explore.";
    }

    if (input.includes('terminal')) {
        return "The terminal is a powerful tool in the gallery. You can use standard commands like 'ls' or 'cat', but there are also over 250 hidden commands and minigames to discover!";
    }

    if (input.includes('thank')) {
        return "You're welcome! Let me know if you need anything else.";
    }

    if (input.includes('bye') || input.includes('quit') || input.includes('exit')) {
        return "Goodbye! Have fun exploring the rest of the gallery.";
    }

    // Default Fallbacks
    const defaults = [
        "That's an interesting point. The gallery has many different interactive elements to match that kind of thinking.",
        "I'm not completely sure about that, but if you explore the gallery you might find what you're looking for.",
        "I can help with questions about the Weird Website Gallery, the terminal commands, or the interactive exhibits.",
        "Could you tell me a little more about what you're trying to find?",
        "As an AI assistant, my primary function is to guide you through this collection of digital art and experiments."
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
}
