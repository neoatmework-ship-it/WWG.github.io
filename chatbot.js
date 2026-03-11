const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

let isTyping = false;

// --- API KEY MANAGEMENT ---
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const apiStatus = document.getElementById('api-status');

// Load saved key on startup
const savedKey = localStorage.getItem('wwg_claude_key');
if (savedKey) {
    apiKeyInput.value = savedKey;
    apiStatus.textContent = "API Key loaded. Claude is active.";
    apiStatus.style.color = "var(--primary-accent)";
}

saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key.startsWith('sk-ant-')) {
        localStorage.setItem('wwg_claude_key', key);
        apiStatus.textContent = "API Key saved. Claude is active!";
        apiStatus.style.color = "var(--primary-accent)";
    } else {
        apiStatus.textContent = "Invalid Key Format (must start with sk-ant-)";
        apiStatus.style.color = "var(--red)"; // fallback to default text color if red unsupported
    }
});

// --- CHAT UI LOGIC ---

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
// Claude API Integration
// -------------------------------------------------------------
async function processAIResponse(input, typingRow) {
    const apiKey = localStorage.getItem('wwg_claude_key');

    // Basic internal secrets before hitting the API
    if (input.toLowerCase().includes('ilikefeet')) {
        setTimeout(() => window.location.href = 'tools/beacon.html', 3000);
        appendAIMessage(typingRow, "I see you have the administrative password. Redirecting you to the telemetry dashboard...");
        return;
    }

    if (!apiKey) {
        // Fallback if no key is supplied
        setTimeout(() => {
            appendAIMessage(typingRow, "Please enter your Claude API Key at the top of the screen to connect me to the mainframe. Until then, I cannot process your request.");
        }, 800);
        return;
    }

    try {
        // Warning: Direct browser calls to Anthropic usually hit CORS issues.
        // We use a public cors proxy strictly for demonstration/client-side use.
        // If this proxy fails, the user will need to run a local backend.
        const proxyUrl = 'https://corsproxy.io/?';
        const apiUrl = 'https://api.anthropic.com/v1/messages';

        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307', // Fast, cheap model
                max_tokens: 1024,
                system: "You are the WWG Assistant, an artificial intelligence designed to help users navigate and understand the 'Weird Website Gallery'. This gallery contains retro internet oddities, interactive physics sims, and hidden terminal games. Keep your responses helpful, slightly mysterious, and extremely concise.",
                messages: [
                    { role: 'user', content: input }
                ]
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.content[0].text;

        appendAIMessage(typingRow, reply);
    } catch (error) {
        console.error('Claude API Error:', error);
        appendAIMessage(typingRow, `API Connection Error: ${error.message}. Wait, or check your API Key / browser console.`);
    }
}
