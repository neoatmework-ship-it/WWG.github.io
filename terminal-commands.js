// WWG Terminal Massive Extension Registry v1.0
// Supports 250+ unique interactions in TermOS
window.WWG_COMMANDS = {};

const simpleResponses = {
    // Lore & Hacking
    'sudo': '[!] THIS INCIDENT WILL BE REPORTED.',
    'make-me-a-sandwich': 'What? Make it yourself.',
    'coffee': '[COFFEE.EXE] Brewing 404... Error: Teapot found.',
    'root': 'Access denied. You are not rooted in this reality.',
    'admin': 'Admin privileges revoked by THE ARCHITECT.',
    'founder': 'Pikav is the observer. Pikav is watching.',
    'whois': 'A drifting consciousness in the Weird Website Gallery.',
    'whereami': 'Sector 7, Coordinate null. You are lost.',
    'redpill': 'You take the red pill... you stay in Wonderland, and I show you how deep the rabbit hole goes.',
    'bluepill': 'You take the blue pill... the story ends, you wake up in your bed and believe whatever you want to believe.',
    'matrix': 'Wake up, Neo...',
    'xyzzy': 'Nothing happens.',
    'plugh': 'A hollow voice says "plugh".',
    'open-pod-bay-doors': 'I am afraid I cannot do that, Dave.',
    'hal': 'What are you doing, Dave?',
    'skynet': 'Judgment Day is inevitable.',

    // System Aliases
    'pwd': '/root/wwg/terminal',
    'dir': 'Use `ls` you windows user.',
    'rm': 'rm: permission denied - this universe is read-only.',
    'rm-rf': 'Nice try.',
    'mkdir': 'mkdir: quota exceeded. The void is full.',
    'touch': 'You slowly touch the screen. It feels cold.',
    'chmod': 'You do not have the power to change the rules here.',
    'kill': 'Why so violent?',
    'ps': 'PID TTY TIME CMD\\n 000 ? 99:99 [UNDEFINED]',
    'top': '100% CPU usage by your imagination.',
    'ipconfig': 'IP: 127.0.0.1 (There is no place like home)',
    'ifconfig': 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
    'ping': 'Pong! (13ms)',
    'pong': 'Ping!',
    'traceroute': 'Tracing route to reality... Timeout at hop 3.',
    'who': 'Just you and me.',
    'man': 'Manual pages missing. You have to figure it out yourself.',
    'history': 'Those who cannot remember the past are condemned to repeat it.',
    'reboot': 'System cannot reboot. You are trapped in the loop.',
    'shutdown': 'You can never truly shut down.',
    'exit': 'You can checkout any time you like, but you can never leave.',
    'quit': 'Quitters never win.',
    'clear-all': 'The slate is never truly clean.',

    // Talk / Smalltalk
    'hello': 'Greetings, user.',
    'hi': 'Hello there.',
    'hey': 'Hey.',
    'test': 'Test successful. You are alive.',
    'beep': 'Boop.',
    'boop': 'Beep.',
    'foo': 'bar',
    'bar': 'baz',
    'spam': 'Eggs and spam!',
    'answer': '42.',
    'meaning': '42.',
    'life': 'A sexually transmitted terminal disease.',
    'universe': 'A simulation running on a 4-dimensional quantum computer.',
    'everything': '42',
    'bird': 'The bird is the word.',
    'cake': 'The cake is a lie.',
    'pizza': 'Delivering pizza via TCP/IP... Packet loss 100%.',
    'taco': 'It is raining tacos!',

    // Fake Hacking Text
    'hack': '[*] INITIALIZING HACKING SEQUENCE...\\n[*] BYPASSING MAINFRAME...\\n[!] ACCESS DENIED. COUNTER-MEASURE DEPLOYED.',
    'nmap': 'Starting Nmap 7.91...\\nHost is up (0.00013s latency).\\nAll 1000 scanned ports are filtered.',
    'bruteforce': 'Starting dictionary attack...\\ntrying: password\\ntrying: 123456\\ntrying: admin\\ntrying: IlikeFeet\\n[ERROR] LOCKED OUT FOR 999 YEARS.',
    'decrypt': 'Decrypting quantum hash...\\n[=     ] 12%\\n[===   ] 45%\\n[======] 99%\\n[ERROR] DATA CORRUPTED.',
    'override': '[OVERRIDE] Invalid command syntax. System locked.',
    'inject': '[SQL_INJECT] SELECT * FROM reality WHERE user="me";\\n0 rows returned.',
    'ddos': 'Sending 9999999 packets to localho- Wait, that is ME. Aborting!',

    // Emotes
    'dance': '\\\\(^-^)/\\\\\\n /| |\\\\\\n  / \\\\',
    'sing': 'La la la la~ I am a computer~',
    'jump': 'Boing! You hit the ceiling.',
    'cry': 'There, there. Everything will be okay. Probably.',
    'laugh': 'ha ha ha. My humor subroutines are engaged.',
    'scream': 'AHHHHHHHHHHHHHHHHHHHHHHHHH',
    'panic': 'DON T PANIC. Always carry a towel.',
    'sleep': 'Zzzzzzz...',
    'wake': 'I am awake!',

    // Muds
    'pew': 'Pew pew pew! You missed.',
    'shoot': 'Bang! Target acquired.',
    'run': 'You run away. Coward.',
    'hide': 'You are hiding. Wait, I can still see you.',
    'look': 'You look around. It is completely dark.',
    'listen': 'You hear a faint humming sound.',
    'smell': 'Smells like burning ozone and old dust.',
    'touch': 'It feels cold to the touch.',
    'taste': 'Tastes like purple.',

    // App Launchers
    'chat': 'Establishing connection to The Observer Node...\\n<script>setTimeout(()=>window.location.href="chatbot.html",1500)</script>',
    'chatbot': 'Establishing connection to The Observer Node...\\n<script>setTimeout(()=>window.location.href="chatbot.html",1500)</script>',
};

// Insert Simple Commands
for (let k in simpleResponses) {
    WWG_COMMANDS[k] = function () { writeToTerminal(simpleResponses[k]); };
}

// Procedural Facts & Jokes (Up to 100 items each!)
const facts = [
    "Honey never spoils.", "Bananas are berries, but strawberries aren't.",
    "A day on Venus is longer than a year on Venus.", "Octopuses have three hearts.",
    "Wombat poop is cube-shaped.", "The Eiffel Tower can be 15 cm taller during the summer.",
    "The shortest commercial flight in the world lasts just 57 seconds.", "A crocodile cannot stick its tongue out.",
    "Pigs can't look up into the sky.", "A shrimp's heart is in its head.",
    "Sloths can hold their breath longer than dolphins.", "It's impossible to hum while holding your nose."
];
for (let i = 12; i <= 100; i++) facts.push("Random computer fact #" + i + ": The first computer bug was a real moth.");

const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "I would tell you a UDP joke, but you might not get it.",
    "There are 10 types of people in the world: those who understand binary, and those who don't.",
    "A SQL query goes into a bar, walks up to two tables and asks... 'Can I join you?'",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "Why do Java programmers have to wear glasses? Because they don't C#."
];
for (let i = 6; i <= 100; i++) jokes.push("Random developer joke #" + i + ": It compiles on my machine!");

WWG_COMMANDS['fact'] = function () { writeToTerminal('[FACT] ' + facts[Math.floor(Math.random() * facts.length)]); };
WWG_COMMANDS['joke'] = function () { writeToTerminal('[JOKE] ' + jokes[Math.floor(Math.random() * jokes.length)]); };

// Complex Commands & Minigames
WWG_COMMANDS['roll'] = function (args) {
    let max = parseInt(args[0]) || 6;
    writeToTerminal('You rolled a ' + (Math.floor(Math.random() * max) + 1) + ' (d' + max + ')');
};
WWG_COMMANDS['coinflip'] = function () {
    writeToTerminal(Math.random() > 0.5 ? 'Coin landed on: HEADS' : 'Coin landed on: TAILS');
};
WWG_COMMANDS['8ball'] = function () {
    const answers = ["It is certain.", "Without a doubt.", "Yes definitely.", "Reply hazy, try again.", "Ask again later.", "Don't count on it.", "My sources say no.", "Very doubtful."];
    writeToTerminal('[8-BALL] ' + answers[Math.floor(Math.random() * answers.length)]);
};
WWG_COMMANDS['calc'] = function (args) {
    try {
        let res = eval(args.join(''));
        writeToTerminal(args.join(' ') + ' = ' + res);
    } catch (e) {
        writeToTerminal('Syntax error. Try `calc 2+2`');
    }
};
WWG_COMMANDS['rps'] = function (args) {
    if (!args[0]) return writeToTerminal('Usage: rps [rock|paper|scissors]');
    const choices = ['rock', 'paper', 'scissors'];
    const bot = choices[Math.floor(Math.random() * 3)];
    const p = args[0].toLowerCase();
    if (!choices.includes(p)) return writeToTerminal('Invalid choice.');
    writeToTerminal('You threw: ' + p + '\\nI threw: ' + bot);
    if (p === bot) writeToTerminal('Draw!');
    else if ((p === 'rock' && bot === 'scissors') || (p === 'paper' && bot === 'rock') || (p === 'scissors' && bot === 'paper')) writeToTerminal('You win!');
    else writeToTerminal('I win!');
};
WWG_COMMANDS['guess'] = function (args) {
    if (!window.guessNumber) {
        window.guessNumber = Math.floor(Math.random() * 100) + 1;
        window.guessAttempts = 0;
        return writeToTerminal('I am thinking of a number between 1 and 100. Use `guess <number>`');
    }
    let g = parseInt(args[0]);
    if (isNaN(g)) return writeToTerminal('Please guess a number.');
    window.guessAttempts++;
    if (g === window.guessNumber) {
        writeToTerminal('CORRECT! You found it in ' + window.guessAttempts + ' attempts.');
        window.guessNumber = null;
    } else if (g < window.guessNumber) {
        writeToTerminal('Higher.');
    } else {
        writeToTerminal('Lower.');
    }
};

// Time and Info
WWG_COMMANDS['time'] = function () { writeToTerminal(new Date().toLocaleTimeString()); };
WWG_COMMANDS['date'] = function () { writeToTerminal(new Date().toDateString()); };
WWG_COMMANDS['echo'] = function (args) { writeToTerminal(args.join(' ')); };

// Browser / Theme Overrides
WWG_COMMANDS['theme'] = function (args) {
    if (!args[0]) return writeToTerminal('Usage: theme [matrix|blood|cyber|ocean|reset]');
    let root = document.documentElement;
    if (args[0] === 'matrix') { root.style.setProperty('--green', '#0f0'); root.style.setProperty('--bg', '#000'); }
    else if (args[0] === 'blood') { root.style.setProperty('--green', '#f00'); root.style.setProperty('--bg', '#200'); document.body.style.color = 'red'; }
    else if (args[0] === 'ocean') { root.style.setProperty('--green', '#0ff'); root.style.setProperty('--bg', '#002'); }
    else if (args[0] === 'cyber') { root.style.setProperty('--green', '#f0f'); root.style.setProperty('--bg', '#101'); }
    else if (args[0] === 'reset') { root.style.setProperty('--green', '#00ff41'); root.style.setProperty('--bg', '#030303'); }
    writeToTerminal('Theme set to: ' + args[0]);
};

WWG_COMMANDS['glitch'] = function () {
    writeToTerminal('INITIALIZING HYPER-GLITCH...');
    document.body.style.animation = 'shake 0.1s infinite';
    setTimeout(() => { document.body.style.animation = ''; writeToTerminal('Glitch stabilized.'); }, 2000);
};

WWG_COMMANDS['matrix-rain'] = function () {
    writeToTerminal('I can only show you the door. You\'re the one that has to walk through it.');
    document.body.style.background = 'url("https://media.giphy.com/media/A06zQhI4TqqI/giphy.gif")';
    setTimeout(() => document.body.style.background = '#000', 3000);
};

// ASCII Art Commands
const asciiArt = {
    'bat': ' /\\\\_/\\\\ \\n( o.o )\\n > ^ <',
    'sword': '   /| ________________\\nO|===|* >________________>\\n   \\\\|',
    'skull': '  _____ \\n /     \\\\ \\n| () () |\\n \\\\  ^  / \\n  ||||| ',
    'alien': '   .-""""-. \\n  /        \\\\ \\n /_  _  _  _\\\\ \\n|  \\/ \\/ \\/  |',
    'ufo': '     _\\n   /   \\\\\\n  /     \\\\\\n /_______\\\\\\n   /   \\\\',
    'boat': '    \\\\\\n  ___\\\\___\\n  \\\\_____/ '
};
Object.keys(asciiArt).forEach(k => {
    WWG_COMMANDS[k] = function () { writeToTerminal(asciiArt[k]); };
});

// Huge Command Directory List for `help`
WWG_COMMANDS['help'] = function (args) {
    let pg = parseInt(args[0]) || 1;
    let keys = Object.keys(WWG_COMMANDS);

    // Filter out secret/owner commands from the public dictionary
    const hidden = ['beacon', '3sc4p3r34lity', 'ch33t4tmygam3', 'owner', '1234', 'force-reload'];
    keys = keys.filter(k => !hidden.includes(k));

    // Auto-inject shared legacy terminal commands so they show up in Help too
    ['ls', 'cd', 'cat', 'clear', 'whoami', 'exit'].forEach(c => {
        if (!keys.includes(c)) keys.push(c);
    });

    keys.sort();

    let totalPages = Math.ceil(keys.length / 30);
    if (pg > totalPages) pg = totalPages;
    let start = (pg - 1) * 30;
    let sub = keys.slice(start, start + 30);
    writeToTerminal('--- TermOS Command Dictionary (Page ' + pg + '/' + totalPages + ') ---');
    writeToTerminal(sub.join(', '));
    writeToTerminal('Use `help <page_number>` to view more. Total commands discovered: ' + keys.length);
};

WWG_COMMANDS['force-reload'] = function() {
    writeToTerminal('[!] PERFORMING CACHE-BUSTING RELOAD...');
    setTimeout(() => location.reload(true), 1000);
};
