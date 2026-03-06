const fs = require('fs');
const path = require('path');

const emojiMap = {
    'ambient-sounds.html': '🎧',
    'ant-simulation.html': '🐜',
    'ascii-cam.html': '📸',
    'catch-button.html': '🏃',
    'color-piano.html': '🎹',
    'compliment-machine.html': '🥰',
    'constellation-maker.html': '✨',
    'cookie-but-worse.html': '🍪',
    'dessert-oracle.html': '🧁',
    'dog-dress-up.html': '🐶',
    'dont-press-space.html': '🛑',
    'draw-badly.html': '🖍️',
    'emoji-slots.html': '🎰',
    'emotional-cursor.html': '😠',
    'excuse-generator.html': '🗣️',
    'fake-loading.html': '⏳',
    'flappy-neon.html': '🦅',
    'floor-is-lava.html': '🌋',
    'ghost-workshop.html': '👻',
    'gravity-playground.html': '🪐',
    'gravity-text.html': '🔠',
    'index.html': '👾',
    'infinite-maze.html': '🌀',
    'invisible-maze.html': '🕵️',
    'memory-cheats.html': '🧠',
    'optical-modem.html': '📡',
    'pixel-canvas.html': '🖌️',
    'pixel-war.html': '⚔️',
    'radio-explorer.html': '📻',
    'reaction-lies.html': '🤥',
    'rock-paper-nothing.html': '🥁',
    'sound-garden.html': '',
    'soup-oracle.html': '🥣',
    'story-dice.html': '🎲',
    'sundial-os.html': '☀️',
    'terrain-gen.html': '⛰️',
    'toothless-dance.html': '🐉',
    'type-racer.html': '⌨️',
    'useless-buttons.html': '🔘',
    'vibe-check.html': '🔮',
    'video-to-sprite.html': '🎞️',
    'wifi-check.html': '📶'
};

const dir = 'c:/Users/pikav/OneDrive/Desktop/websites';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let emoji = emojiMap[file] || '🎮';
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Create properly encoded SVG data URI
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
    const encodedSvg = encodeURIComponent(svg);
    const faviconTag = `<link rel="icon" href="data:image/svg+xml,${encodedSvg}">`;

    if (content.match(/<link rel="icon"[^>]*>/i)) {
        // Replace existing
        content = content.replace(/<link rel="icon"[^>]*>/i, faviconTag);
    } else {
        // Insert after <head> or <head ...>
        content = content.replace(/<head[^>]*>/i, match => match + '\n    ' + faviconTag);
    }

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
    console.log(`Updated ${file} with fully encoded SVG`);
});
