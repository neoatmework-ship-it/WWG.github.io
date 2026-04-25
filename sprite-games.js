(function () {
    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function makeSprite(width, height, frames, paint) {
        const sheet = document.createElement("canvas");
        const ctx = sheet.getContext("2d");
        sheet.width = width * frames;
        sheet.height = height;
        ctx.imageSmoothingEnabled = false;
        for (let frame = 0; frame < frames; frame++) {
            ctx.save();
            ctx.translate(frame * width, 0);
            paint(ctx, frame, width, height);
            ctx.restore();
        }
        return {
            draw(ctx, x, y, scale, frame, rotation) {
                const f = Math.abs(Math.floor(frame || 0)) % frames;
                const w = width * scale;
                const h = height * scale;
                ctx.save();
                ctx.translate(x, y);
                if (rotation) ctx.rotate(rotation);
                ctx.drawImage(sheet, f * width, 0, width, height, -w / 2, -h / 2, w, h);
                ctx.restore();
            }
        };
    }

    function px(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }

    function buildSprites() {
        return {
            seven: makeSprite(22, 24, 4, (ctx, f) => {
                px(ctx, 3, 3, 16, 4, "#fef3c7");
                px(ctx, 14 - (f % 2), 7, 4, 5, "#facc15");
                px(ctx, 11, 12, 4, 5, "#f59e0b");
                px(ctx, 8, 17, 4, 4, "#ef4444");
                px(ctx, 3, 2, 17, 2, "#ffffff");
            }),
            gem: makeSprite(22, 24, 4, (ctx, f) => {
                px(ctx, 8, 2, 7, 3, "#ecfeff");
                px(ctx, 5, 5, 13, 6, f % 2 ? "#67e8f9" : "#a5f3fc");
                px(ctx, 7, 11, 9, 8, "#0891b2");
                px(ctx, 10, 19, 4, 3, "#155e75");
            }),
            coin: makeSprite(22, 24, 4, (ctx, f) => {
                px(ctx, 6 + (f % 2), 3, 10, 3, "#fde68a");
                px(ctx, 4, 6, 14, 12, "#f59e0b");
                px(ctx, 7, 8, 8, 8, "#fef3c7");
                px(ctx, 10, 6, 2, 12, "#92400e");
            }),
            cherry: makeSprite(22, 24, 4, (ctx, f) => {
                px(ctx, 11, 2, 3, 8, "#65a30d");
                px(ctx, 8, 5 + (f % 2), 8, 3, "#84cc16");
                px(ctx, 4, 12, 7, 7, "#e11d48");
                px(ctx, 12, 11, 7, 7, "#fb7185");
                px(ctx, 6, 13, 2, 2, "#ffe4e6");
            }),
            bell: makeSprite(22, 24, 4, (ctx, f) => {
                px(ctx, 8, 3, 7, 3, "#fde047");
                px(ctx, 5, 6, 13, 10, f % 2 ? "#facc15" : "#fbbf24");
                px(ctx, 3, 15, 17, 3, "#92400e");
                px(ctx, 9, 18, 5, 3, "#fef3c7");
            }),
            skull: makeSprite(22, 24, 4, (ctx, f) => {
                px(ctx, 5, 4, 13, 12, "#e5e7eb");
                px(ctx, 7, 8, 3, 3, "#111827");
                px(ctx, 14, 8, 3, 3, "#111827");
                px(ctx, 9, 13, 6, 2, f % 2 ? "#f43f5e" : "#111827");
                px(ctx, 8, 16, 8, 3, "#9ca3af");
            })
        };
    }

    function createGame(canvasId, factory) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext("2d");
        const keys = {};
        const pressed = new Set();
        const pointer = { x: innerWidth / 2, y: innerHeight / 2, down: false, pressed: false, active: false };
        const kit = {
            canvas,
            ctx,
            keys,
            pointer,
            sprites: buildSprites(),
            w: 0,
            h: 0,
            time: 0,
            clamp,
            rand,
            wasPressed(code) {
                return pressed.has(code);
            },
            setStats(stats) {
                Object.keys(stats).forEach((key) => {
                    const el = document.querySelector(`[data-${key}]`);
                    if (el) el.textContent = stats[key];
                });
            },
            toast(text) {
                const el = document.querySelector("[data-toast]");
                if (el) el.textContent = text || "";
            },
            fill(bg1, bg2, drift) {
                const g = ctx.createLinearGradient(0, 0, kit.w, kit.h);
                g.addColorStop(0, bg1);
                g.addColorStop(1, bg2);
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, kit.w, kit.h);
                ctx.fillStyle = "rgba(255,255,255,.12)";
                for (let i = 0; i < 70; i++) {
                    const x = (i * 151 + (drift || 0)) % (kit.w + 80) - 40;
                    const y = (i * 97) % kit.h;
                    ctx.fillRect(x, y, 2, 2);
                }
            }
        };

        function resize() {
            const dpr = Math.min(devicePixelRatio || 1, 2);
            const visualW = window.visualViewport?.width || innerWidth;
            const visualH = window.visualViewport?.height || innerHeight;
            kit.w = Math.min(canvas.clientWidth || visualW, innerWidth, visualW, document.documentElement.clientWidth || visualW);
            kit.h = Math.min(canvas.clientHeight || visualH, innerHeight, visualH, document.documentElement.clientHeight || visualH);
            canvas.width = Math.floor(kit.w * dpr);
            canvas.height = Math.floor(kit.h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.imageSmoothingEnabled = false;
        }

        function point(e) {
            const r = canvas.getBoundingClientRect();
            pointer.x = e.clientX - r.left;
            pointer.y = e.clientY - r.top;
            pointer.active = true;
        }

        addEventListener("resize", resize);
        addEventListener("keydown", (e) => {
            if (!keys[e.code]) pressed.add(e.code);
            keys[e.code] = true;
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
        });
        addEventListener("keyup", (e) => {
            keys[e.code] = false;
        });
        canvas.addEventListener("pointerdown", (e) => {
            pointer.down = true;
            pointer.pressed = true;
            point(e);
            canvas.setPointerCapture(e.pointerId);
        });
        canvas.addEventListener("pointermove", point);
        canvas.addEventListener("pointerup", (e) => {
            pointer.down = false;
            point(e);
        });

        resize();
        let game = factory(kit);
        document.querySelector("[data-restart]")?.addEventListener("click", () => {
            game = factory(kit);
        });
        document.querySelectorAll("[data-action]").forEach((button) => {
            button.addEventListener("click", () => game.action(button.dataset.action));
        });

        let last = performance.now();
        function frame(now) {
            const dt = Math.min(.033, (now - last) / 1000);
            last = now;
            kit.time = now / 1000;
            game.update(dt);
            game.render(ctx);
            pressed.clear();
            pointer.pressed = false;
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function voidSlots(canvasId) {
        createGame(canvasId, (kit) => {
            const names = ["seven", "gem", "coin", "cherry", "bell", "skull"];
            const weights = [4, 8, 12, 18, 16, 14];
            const payouts = { seven: 30, gem: 14, coin: 8, cherry: 5, bell: 4, skull: 2 };
            const reels = Array.from({ length: 3 }, (_, i) => ({
                symbol: names[i],
                target: names[i],
                offset: 0,
                speed: 0,
                stopAt: 0,
                spinning: false
            }));
            const coins = [];
            let credits = 250;
            let bet = 10;
            let lastWin = 0;
            let spinTimer = 0;
            let flash = 0;
            let message = "Fake credits only. Space or Spin to play.";
            kit.toast(message);

            function weightedSymbol() {
                const total = weights.reduce((sum, n) => sum + n, 0);
                let roll = Math.random() * total;
                for (let i = 0; i < names.length; i++) {
                    roll -= weights[i];
                    if (roll <= 0) return names[i];
                }
                return names[names.length - 1];
            }

            function setStats() {
                kit.setStats({ credits, bet, win: lastWin });
            }

            function sprayCoins(multiplier) {
                const count = clamp(10 + multiplier * 3, 12, 80);
                for (let i = 0; i < count; i++) {
                    coins.push({
                        x: kit.w / 2 + rand(-120, 120),
                        y: kit.h * .42 + rand(-50, 40),
                        vx: rand(-220, 220),
                        vy: rand(-420, -150),
                        life: rand(.8, 1.7),
                        spin: rand(0, 20)
                    });
                }
            }

            function finishSpin() {
                const result = reels.map((r) => r.target);
                lastWin = 0;
                const counts = result.reduce((map, symbol) => {
                    map[symbol] = (map[symbol] || 0) + 1;
                    return map;
                }, {});
                const triple = Object.keys(counts).find((symbol) => counts[symbol] === 3);
                const pair = Object.keys(counts).find((symbol) => counts[symbol] === 2);
                if (triple) {
                    lastWin = bet * payouts[triple];
                    message = triple === "seven" ? "JACKPOT. The void blinks back." : `${triple.toUpperCase()} triple pays ${payouts[triple]}x.`;
                    sprayCoins(payouts[triple]);
                    flash = 1.1;
                } else if (pair) {
                    lastWin = Math.ceil(bet * 1.5);
                    message = `${pair.toUpperCase()} pair pays a small mercy bonus.`;
                    sprayCoins(3);
                    flash = .45;
                } else {
                    message = "No match. The house smiles politely.";
                }
                credits += lastWin;
                if (credits <= 0) message = "Out of fake credits. Reset to refill.";
                kit.toast(message);
                setStats();
            }

            function spin() {
                if (spinTimer > 0) return;
                if (credits < bet) {
                    message = "Not enough fake credits for that bet.";
                    kit.toast(message);
                    return;
                }
                credits -= bet;
                lastWin = 0;
                spinTimer = 1.55;
                flash = 0;
                reels.forEach((reel, i) => {
                    reel.target = weightedSymbol();
                    reel.speed = 26 + i * 7;
                    reel.stopAt = .75 + i * .32;
                    reel.spinning = true;
                });
                message = "Reels spinning. The odds are pretending to be mysterious.";
                kit.toast(message);
                setStats();
            }

            function changeBet(delta) {
                if (spinTimer > 0) return;
                bet = clamp(bet + delta, 5, 50);
                if (bet > credits && credits > 0) bet = Math.max(5, Math.min(50, credits));
                message = `Bet set to ${bet} fake credits.`;
                kit.toast(message);
                setStats();
            }

            setStats();

            return {
                action(name) {
                    if (name === "spin") spin();
                    if (name === "bet-up") changeBet(5);
                    if (name === "bet-down") changeBet(-5);
                },
                update(dt) {
                    if (kit.wasPressed("Space") || kit.pointer.pressed) spin();
                    if (kit.wasPressed("ArrowUp") || kit.wasPressed("KeyW")) changeBet(5);
                    if (kit.wasPressed("ArrowDown") || kit.wasPressed("KeyS")) changeBet(-5);
                    if (spinTimer > 0) {
                        spinTimer -= dt;
                        reels.forEach((reel) => {
                            if (!reel.spinning) return;
                            reel.offset += reel.speed * dt;
                            if (spinTimer < reel.stopAt) {
                                reel.spinning = false;
                                reel.symbol = reel.target;
                                reel.offset = 0;
                            } else {
                                reel.symbol = names[Math.floor(reel.offset) % names.length];
                            }
                        });
                        if (spinTimer <= 0) {
                            reels.forEach((reel) => {
                                reel.spinning = false;
                                reel.symbol = reel.target;
                                reel.offset = 0;
                            });
                            finishSpin();
                        }
                    }
                    flash = Math.max(0, flash - dt);
                    for (let i = coins.length - 1; i >= 0; i--) {
                        const c = coins[i];
                        c.x += c.vx * dt;
                        c.y += c.vy * dt;
                        c.vy += 780 * dt;
                        c.spin += dt * 16;
                        c.life -= dt;
                        if (c.life <= 0 || c.y > kit.h + 80) coins.splice(i, 1);
                    }
                },
                render(ctx) {
                    kit.fill("#08040f", "#201326", kit.time * 28);
                    const compact = window.matchMedia("(max-width: 720px)").matches;
                    const cx = kit.w / 2;
                    const cy = kit.h / 2 + 20;
                    const machineW = compact ? Math.min(356, kit.w - 34) : Math.min(760, kit.w - 34);
                    const machineH = compact ? Math.max(320, Math.min(374, kit.h - 300)) : Math.min(430, kit.h - 170);
                    const top = compact ? Math.min(242, kit.h - machineH - 132) : cy - machineH / 2;
                    const left = compact ? 17 : cx - machineW / 2;
                    const machineCx = left + machineW / 2;
                    ctx.save();
                    ctx.fillStyle = "#130816";
                    ctx.strokeStyle = flash > 0 ? "#fde047" : "rgba(255,255,255,.18)";
                    ctx.lineWidth = flash > 0 ? 5 : 2;
                    ctx.fillRect(left, top, machineW, machineH);
                    ctx.strokeRect(left, top, machineW, machineH);

                    const blink = Math.sin(kit.time * 8) > 0;
                    ctx.fillStyle = blink || flash > 0 ? "#fde047" : "#a16207";
                    ctx.font = "900 24px Courier New, monospace";
                    ctx.textAlign = "center";
                    ctx.fillText("VOID SLOTS", machineCx, top + 44);
                    ctx.fillStyle = "rgba(255,255,255,.64)";
                    ctx.font = "700 12px Courier New, monospace";
                    ctx.fillText("PLAY MONEY ONLY", machineCx, top + 66);

                    const reelW = Math.min(150, (machineW - 120) / 3);
                    const reelH = Math.min(190, machineH - 160);
                    const startX = machineCx - reelW - 18;
                    reels.forEach((reel, i) => {
                        const x = startX + i * (reelW + 18);
                        const y = top + 104;
                        ctx.fillStyle = "#f8fafc";
                        ctx.fillRect(x, y, reelW, reelH);
                        ctx.fillStyle = "#111827";
                        ctx.fillRect(x + 8, y + 8, reelW - 16, reelH - 16);
                        ctx.strokeStyle = "#7dd3fc";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x + 8, y + 8, reelW - 16, reelH - 16);
                        const list = reel.spinning ? names : [reel.symbol];
                        if (reel.spinning) {
                            for (let j = -1; j < 3; j++) {
                                const symbol = names[(Math.floor(reel.offset) + j + names.length) % names.length];
                                const sy = y + reelH / 2 + (j * 62) + ((reel.offset % 1) * 62);
                                kit.sprites[symbol].draw(ctx, x + reelW / 2, sy, 3.2, kit.time * 10 + j);
                            }
                        } else {
                            kit.sprites[list[0]].draw(ctx, x + reelW / 2, y + reelH / 2, 4.1, kit.time * 8 + i);
                        }
                    });

                    ctx.fillStyle = "#0f172a";
                    ctx.fillRect(left + 32, top + machineH - 62, machineW - 64, 34);
                    ctx.fillStyle = "#7dd3fc";
                    ctx.font = "700 14px Courier New, monospace";
                    ctx.fillText(machineW < 430 ? "Fake credits only." : message, machineCx, top + machineH - 40);
                    ctx.restore();

                    coins.forEach((coin, i) => {
                        kit.sprites.coin.draw(ctx, coin.x, coin.y, 1.7, coin.spin + i, coin.spin * .1);
                    });
                }
            };
        });
    }

    window.WWGSpriteGames = {
        voidSlots
    };
})();
