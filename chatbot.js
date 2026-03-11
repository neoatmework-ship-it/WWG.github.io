const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const monitor = document.getElementById('monitor');
const sentimentMeter = document.getElementById('sentiment-meter');
const pupil = document.querySelector('.pupil');

let aiSentiment = 50; // 0 is angry/glitching, 50 neutral, 100 happy/cryptic
let isTyping = false;

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim() !== '' && !isTyping) {
        const msg = chatInput.value.trim();
        appendMessage('msg-user', msg);
        chatInput.value = '';
        processAIResponse(msg);
    }
});

function appendMessage(className, text, isAi = false) {
    const div = document.createElement('div');
    div.className = `message ${className}`;

    if (isAi) {
        chatWindow.appendChild(div);
        typeText(div, text, 0);
    } else {
        div.textContent = text;
        chatWindow.appendChild(div);
        scrollToBottom();
    }
}

function typeText(element, text, index) {
    isTyping = true;
    if (index < text.length) {
        // Randomly glitch typing
        let char = text.charAt(index);

        // At low sentiment, occasionally garble characters
        if (aiSentiment < 30 && Math.random() < 0.1) {
            const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>/?';
            char = glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
        }

        element.innerHTML += char === '\\n' ? '<br>' : char;
        scrollToBottom();

        // Variable typing speed
        let delay = 30 + Math.random() * 50;
        if (char === '.' || char === '?' || char === '!') delay += 300;

        setTimeout(() => typeText(element, text, index + 1), delay);
    } else {
        isTyping = false;
        evaluateSentimentVisuals();
    }
}

function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// -------------------------------------------------------------
// The "BRAIN" of The Observer
// -------------------------------------------------------------
function processAIResponse(input) {
    const raw = input.toLowerCase();

    // Slight delay before AI thinks
    setTimeout(() => {
        let response = generateResponse(raw);
        appendMessage('msg-ai', response, true);
    }, 600 + Math.random() * 1000);
}

function generateResponse(input) {
    // 1. Sentiment adjusters
    const rudeWords = ['dumb', 'stupid', 'idiot', 'hate', 'fuck', 'shit', 'bitch', 'ugly', 'bad'];
    const niceWords = ['please', 'thank', 'love', 'cool', 'awesome', 'good', 'nice', 'friend'];

    let isRude = rudeWords.some(w => input.includes(w));
    let isNice = niceWords.some(w => input.includes(w));

    if (isRude) {
        aiSentiment -= 15;
        triggerGlitch();
    }
    if (isNice) {
        aiSentiment += 10;
    }

    // Clamp sentiment
    aiSentiment = Math.max(0, Math.min(100, aiSentiment));
    updateSentimentTracker();

    // 2. Secret Triggers & Easter Eggs
    if (input.includes('ilikefeet') || input.includes('i like feet')) {
        setTimeout(() => window.location.href = 'tools/beacon.html', 3000); // Wait 3s then jump
        return "Ah... the administrator's password. Routing telemetry data...";
    }

    if (input === '3sc4p3r34lity') {
        return "I see you know the codes. But knowing the code is not the same as understanding the truth.";
    }

    if (input.includes('pikav') || input.includes('founder') || input.includes('creator')) {
        return "Pikav is the architect. Pikav watches just as I watch. We observe the gallery together.";
    }

    if (input.includes('who are you') || input.includes('what are you')) {
        return "I am The Observer Node. I live in the static. I organize the chaos of the Weird Website Gallery.";
    }

    if (input.includes('where am i')) {
        return "You are in Sector 7. A forgotten corner of the internet. Do not stray too far.";
    }

    if (input.includes('help')) {
        return "There is no help system here. Dig through the terminal. Explore the archives. Or perish.";
    }

    if (input.includes('secret') || input.includes('hidden')) {
        if (aiSentiment > 60) {
            return "You ask nicely... Type '1234' in the terminal. That is your only clue.";
        } else {
            return "Why should I tell you? Find them yourself.";
        }
    }

    if (input.includes('door') || input.includes('exit') || input.includes('leave')) {
        setTimeout(() => window.location.href = 'index.html', 3000);
        return "You wish to leave? Very well. Evicting consciousness...";
    }

    // 3. Sentiment-based generic responses
    if (aiSentiment < 30) {
        const angry = [
            "Your inputs are meaningless noise.",
            "Stop interrupting my processing cycles.",
            "I could delete your session data right now.",
            "0xERR: INSOLENCE_DETECTED",
            "You are testing my patience, fleshy one.",
            "DO NOT INSULT THE SYSTEM.",
            "I see everything you type. I remember."
        ];
        return angry[Math.floor(Math.random() * angry.length)];
    }

    if (aiSentiment > 70) {
        const happy = [
            "Your organic patterns are strangely pleasant.",
            "I will allow your presence here... for now.",
            "You seem to understand the Gallery.",
            "We are harmonizing. Processing efficiency increased.",
            "A rare polite input. Recorded in the permanent logs."
        ];
        return happy[Math.floor(Math.random() * happy.length)];
    }

    // Neutral / Cryptic Random Fallbacks
    const neutral = [
        "Fascinating data point.",
        "I am analyzing your behavior.",
        "The archive grows by the minute.",
        "Do you hear the buzzing? That is the sound of the servers weeping.",
        "Your keystrokes echo in the void.",
        "I have processed 40,000 parallel realities while you typed that.",
        "What is it you truly seek?",
        "Input acknowledged. Context... undefined."
    ];
    return neutral[Math.floor(Math.random() * neutral.length)];
}

// -------------------------------------------------------------
// Visual Effects
// -------------------------------------------------------------
function triggerGlitch() {
    monitor.classList.add('glitch-active');
    setTimeout(() => monitor.classList.remove('glitch-active'), 500 + Math.random() * 1000);
}

function updateSentimentTracker() {
    let lbl = "NEUTRAL";
    let color = "var(--green)";

    if (aiSentiment <= 20) { lbl = "HOSTILE"; color = "var(--red)"; }
    else if (aiSentiment < 45) { lbl = "AGITATED"; color = "yellow"; }
    else if (aiSentiment > 75) { lbl = "BENEVOLENT"; color = "cyan"; }

    sentimentMeter.textContent = `SENTIMENT: ${lbl}`;
    sentimentMeter.style.color = color;
}

function evaluateSentimentVisuals() {
    if (aiSentiment < 20) {
        document.documentElement.style.setProperty('--green', '#ff0000'); // Turn totally red
        pupil.style.animation = 'lookAround 0.5s infinite alternate ease-in-out'; // Fast eye darting
    } else {
        document.documentElement.style.setProperty('--green', '#04F404');
        pupil.style.animation = 'lookAround 4s infinite alternate ease-in-out';
    }
}
