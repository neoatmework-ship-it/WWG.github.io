(function () {
    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function hit(a, b, r) {
        return Math.hypot(a.x - b.x, a.y - b.y) < r;
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
            draw(ctx, x, y, scale, frame, flip, rotation) {
                const f = Math.abs(Math.floor(frame || 0)) % frames;
                const w = width * scale;
                const h = height * scale;
                ctx.save();
                ctx.translate(x, y);
                if (rotation) ctx.rotate(rotation);
                if (flip) ctx.scale(-1, 1);
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
            ship: makeSprite(26, 18, 3, (ctx, f) => {
                px(ctx, 4, 7, 16, 4, "#d7f3ff");
                px(ctx, 10, 3, 9, 12, "#38bdf8");
                px(ctx, 17, 6, 7, 6, "#0f172a");
                px(ctx, 0, 2, 8, 5, "#f472b6");
                px(ctx, 0, 11, 8, 5, "#f472b6");
                px(ctx, 2, 7, 4, 4, f === 1 ? "#fde047" : "#fb923c");
                px(ctx, 6, 8, 3, 2, "#ffffff");
            }),
            drone: makeSprite(22, 18, 4, (ctx, f) => {
                px(ctx, 4, 5, 14, 8, "#a78bfa");
                px(ctx, 8, 3, 6, 12, "#312e81");
                px(ctx, 1, 2 + (f % 2), 6, 3, "#67e8f9");
                px(ctx, 15, 13 - (f % 2), 6, 3, "#67e8f9");
                px(ctx, 15, 7, 3, 3, "#fef3c7");
            }),
            rock: makeSprite(20, 20, 4, (ctx, f) => {
                px(ctx, 4, 2, 10, 3, "#94a3b8");
                px(ctx, 2, 5, 15, 10, "#64748b");
                px(ctx, 5, 15, 10, 3, "#475569");
                px(ctx, 7 + (f % 2), 7, 3, 3, "#cbd5e1");
                px(ctx, 12, 11, 3, 2, "#334155");
            }),
            bubble: makeSprite(22, 20, 4, (ctx, f) => {
                px(ctx, 5, 3 + (f % 2), 12, 3, "#bbf7d0");
                px(ctx, 3, 6, 16, 9, "#34d399");
                px(ctx, 6, 15, 10, 3, "#047857");
                px(ctx, 7, 7, 3, 3, "#ecfeff");
                px(ctx, 14, 9, 2, 2, "#064e3b");
            }),
            wheel: makeSprite(18, 18, 4, (ctx, f) => {
                px(ctx, 4, 4, 10, 10, "#fb7185");
                px(ctx, 7, 1 + (f % 2), 4, 16, "#7f1d1d");
                px(ctx, 1 + (f % 2), 7, 16, 4, "#7f1d1d");
                px(ctx, 7, 7, 4, 4, "#ffe4e6");
            }),
            bloom: makeSprite(16, 16, 3, (ctx, f) => {
                px(ctx, 7, 2, 2, 12, "#bef264");
                px(ctx, 3, 4 + (f % 2), 10, 5, "#f0abfc");
                px(ctx, 5, 6, 6, 4, "#fde047");
            }),
            ninja: makeSprite(20, 28, 4, (ctx, f) => {
                px(ctx, 6, 2, 9, 7, "#111827");
                px(ctx, 8, 4, 5, 2, "#67e8f9");
                px(ctx, 5, 9, 11, 9, "#1f2937");
                px(ctx, 2, 11 + (f % 2), 5, 4, "#e5e7eb");
                px(ctx, 14, 11 - (f % 2), 5, 4, "#e5e7eb");
                px(ctx, 6, 18, 4, 8, f % 2 ? "#0f172a" : "#111827");
                px(ctx, 12, 18, 4, 8, f % 2 ? "#111827" : "#0f172a");
                px(ctx, 15, 6, 5, 2, "#f472b6");
            }),
            bot: makeSprite(22, 18, 4, (ctx, f) => {
                px(ctx, 4, 5, 14, 9, "#f97316");
                px(ctx, 7, 8, 3, 3, "#fff7ed");
                px(ctx, 14, 8, 3, 3, "#111827");
                px(ctx, 3, 14, 4, 3 + (f % 2), "#7c2d12");
                px(ctx, 15, 14, 4, 3 - (f % 2), "#7c2d12");
            }),
            meteor: makeSprite(20, 20, 4, (ctx, f) => {
                px(ctx, 4, 3, 11, 12, "#fbbf24");
                px(ctx, 2, 6, 14, 8, "#f97316");
                px(ctx, 7, 7, 5, 5, "#fef3c7");
                px(ctx, 15, 8, 4 + f, 3, "#ef4444");
            }),
            comet: makeSprite(24, 18, 4, (ctx, f) => {
                px(ctx, 6, 6, 13, 7, "#c4b5fd");
                px(ctx, 11, 3, 6, 12, "#8b5cf6");
                px(ctx, 17, 7, 5, 4, "#f8fafc");
                px(ctx, 1, 4, 7 - (f % 2), 3, "#22d3ee");
                px(ctx, 0, 11, 8 + (f % 2), 3, "#f472b6");
            }),
            crystal: makeSprite(16, 18, 4, (ctx, f) => {
                px(ctx, 7, 1, 3, 3, "#ecfeff");
                px(ctx, 4, 4, 9, 9, f % 2 ? "#67e8f9" : "#a5f3fc");
                px(ctx, 6, 13, 5, 4, "#0891b2");
            }),
            cloud: makeSprite(24, 16, 4, (ctx, f) => {
                px(ctx, 4, 7, 17, 6, "#475569");
                px(ctx, 7, 4 + (f % 2), 8, 5, "#64748b");
                px(ctx, 13, 6, 8, 5, "#334155");
                px(ctx, 5, 12, 4, 3, "#f43f5e");
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
            hit,
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
            },
            overlay(text) {
                if (!text) return;
                ctx.save();
                ctx.fillStyle = "rgba(0,0,0,.42)";
                ctx.fillRect(0, 0, kit.w, kit.h);
                ctx.fillStyle = "#f6f7ff";
                ctx.textAlign = "center";
                ctx.font = "800 34px Inter, system-ui, sans-serif";
                ctx.fillText(text, kit.w / 2, kit.h / 2);
                ctx.restore();
            }
        };

        function resize() {
            const dpr = Math.min(devicePixelRatio || 1, 2);
            kit.w = canvas.clientWidth || innerWidth;
            kit.h = canvas.clientHeight || innerHeight;
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

    function starshipSprint(canvasId) {
        createGame(canvasId, (kit) => {
            const ship = { x: 120, y: kit.h / 2, r: 20, fire: 0, inv: 0 };
            const bullets = [];
            const enemies = [];
            const sparks = [];
            let spawn = 0, score = 0, lives = 3, over = false, scroll = 0;
            kit.toast("Auto-fire online. Move through the lanes.");

            function burst(x, y, color) {
                for (let i = 0; i < 12; i++) sparks.push({ x, y, vx: kit.rand(-180, 90), vy: kit.rand(-120, 120), life: .45, color });
            }

            return {
                update(dt) {
                    if (over) return;
                    scroll += dt * 180;
                    const dy = (kit.keys.ArrowDown || kit.keys.KeyS ? 1 : 0) - (kit.keys.ArrowUp || kit.keys.KeyW ? 1 : 0);
                    const dx = (kit.keys.ArrowRight || kit.keys.KeyD ? 1 : 0) - (kit.keys.ArrowLeft || kit.keys.KeyA ? 1 : 0);
                    ship.x = kit.clamp(ship.x + dx * 320 * dt, 50, kit.w * .62);
                    ship.y = kit.clamp(ship.y + dy * 320 * dt, 78, kit.h - 54);
                    if (kit.pointer.active && kit.pointer.down) {
                        ship.x += (kit.pointer.x - ship.x) * .12;
                        ship.y += (kit.pointer.y - ship.y) * .12;
                    }
                    ship.fire -= dt;
                    ship.inv -= dt;
                    if (ship.fire <= 0) {
                        bullets.push({ x: ship.x + 28, y: ship.y, vx: 620, r: 5 });
                        ship.fire = .18;
                    }
                    spawn -= dt;
                    if (spawn <= 0) {
                        const rock = Math.random() > .48;
                        enemies.push({ x: kit.w + 50, y: kit.rand(90, kit.h - 80), vx: kit.rand(140, 260), r: rock ? 24 : 22, rock, spin: kit.rand(-5, 5) });
                        spawn = Math.max(.34, .85 - score * .001);
                    }
                    bullets.forEach((b) => b.x += b.vx * dt);
                    enemies.forEach((e) => e.x -= e.vx * dt);
                    sparks.forEach((s) => { s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; });
                    for (let i = enemies.length - 1; i >= 0; i--) {
                        const e = enemies[i];
                        if (e.x < -80) { enemies.splice(i, 1); continue; }
                        for (let j = bullets.length - 1; j >= 0; j--) {
                            if (hit(e, bullets[j], e.r)) {
                                bullets.splice(j, 1);
                                enemies.splice(i, 1);
                                score += e.rock ? 12 : 22;
                                burst(e.x, e.y, e.rock ? "#fbbf24" : "#67e8f9");
                                break;
                            }
                        }
                        if (enemies[i] && ship.inv <= 0 && hit(ship, e, ship.r + e.r - 8)) {
                            lives--;
                            ship.inv = 1.15;
                            enemies.splice(i, 1);
                            burst(ship.x, ship.y, "#f472b6");
                            if (lives <= 0) { over = true; kit.toast("Run ended. Restart is armed."); }
                        }
                    }
                    while (bullets[0] && bullets[0].x > kit.w + 40) bullets.shift();
                    while (sparks[0] && sparks[0].life <= 0) sparks.shift();
                    score += dt * 4;
                    kit.setStats({ score: Math.floor(score), lives, level: Math.floor(score / 120) + 1 });
                },
                render(ctx) {
                    kit.fill("#061021", "#14091e", -scroll);
                    ctx.fillStyle = "#7dd3fc";
                    bullets.forEach((b) => ctx.fillRect(b.x - 8, b.y - 2, 16, 4));
                    enemies.forEach((e, i) => {
                        const f = kit.time * 8 + i;
                        (e.rock ? kit.sprites.rock : kit.sprites.drone).draw(ctx, e.x, e.y, 2.2, f, false, e.rock ? kit.time * e.spin : 0);
                    });
                    sparks.forEach((s) => {
                        ctx.fillStyle = s.color;
                        ctx.globalAlpha = Math.max(0, s.life * 2);
                        ctx.fillRect(s.x, s.y, 4, 4);
                        ctx.globalAlpha = 1;
                    });
                    kit.sprites.ship.draw(ctx, ship.x, ship.y, 2.35, kit.time * 12, false, 0);
                    kit.overlay(over ? "SHIP DOWN" : "");
                }
            };
        });
    }

    function bubbleGarden(canvasId) {
        createGame(canvasId, (kit) => {
            const player = { x: kit.w / 2, y: kit.h / 2, r: 22, inv: 0 };
            const blooms = [];
            const wheels = [];
            let score = 0, lives = 4, spawn = 0, over = false;
            kit.toast("Collect blooms. Dodge the rolling thorns.");

            for (let i = 0; i < 7; i++) blooms.push({ x: kit.rand(60, kit.w - 60), y: kit.rand(92, kit.h - 60), r: 18 });
            for (let i = 0; i < 5; i++) wheels.push({ x: kit.rand(90, kit.w - 90), y: kit.rand(110, kit.h - 90), vx: kit.rand(-100, 100), vy: kit.rand(-100, 100), r: 22 });

            return {
                update(dt) {
                    if (over) return;
                    const ix = (kit.keys.ArrowRight || kit.keys.KeyD ? 1 : 0) - (kit.keys.ArrowLeft || kit.keys.KeyA ? 1 : 0);
                    const iy = (kit.keys.ArrowDown || kit.keys.KeyS ? 1 : 0) - (kit.keys.ArrowUp || kit.keys.KeyW ? 1 : 0);
                    player.x = kit.clamp(player.x + ix * 260 * dt, 28, kit.w - 28);
                    player.y = kit.clamp(player.y + iy * 260 * dt, 82, kit.h - 28);
                    if (kit.pointer.down) {
                        player.x += (kit.pointer.x - player.x) * .08;
                        player.y += (kit.pointer.y - player.y) * .08;
                    }
                    player.inv -= dt;
                    wheels.forEach((w) => {
                        w.x += w.vx * dt;
                        w.y += w.vy * dt;
                        if (w.x < 30 || w.x > kit.w - 30) w.vx *= -1;
                        if (w.y < 90 || w.y > kit.h - 30) w.vy *= -1;
                        if (player.inv <= 0 && hit(player, w, player.r + w.r - 10)) {
                            lives--;
                            player.inv = 1;
                            w.vx *= -1.2;
                            w.vy *= -1.2;
                            if (lives <= 0) { over = true; kit.toast("Garden closed. Restart to regrow."); }
                        }
                    });
                    for (let i = blooms.length - 1; i >= 0; i--) {
                        if (hit(player, blooms[i], player.r + 12)) {
                            blooms.splice(i, 1);
                            score += 15;
                        }
                    }
                    spawn -= dt;
                    if (spawn <= 0 && blooms.length < 10) {
                        blooms.push({ x: kit.rand(50, kit.w - 50), y: kit.rand(100, kit.h - 50), r: 18 });
                        spawn = .8;
                    }
                    if (score > 0 && score % 90 < 1 && wheels.length < 9) {
                        wheels.push({ x: kit.rand(80, kit.w - 80), y: 100, vx: kit.rand(-130, 130), vy: kit.rand(80, 150), r: 22 });
                        score += 1;
                    }
                    kit.setStats({ score, lives, level: wheels.length });
                },
                render(ctx) {
                    kit.fill("#06281f", "#101827", kit.time * 20);
                    ctx.fillStyle = "rgba(190,242,100,.12)";
                    for (let x = 0; x < kit.w; x += 48) for (let y = 72; y < kit.h; y += 48) ctx.fillRect(x + 20, y + 20, 3, 10);
                    blooms.forEach((b, i) => kit.sprites.bloom.draw(ctx, b.x, b.y, 2.2, kit.time * 6 + i, false, 0));
                    wheels.forEach((w, i) => kit.sprites.wheel.draw(ctx, w.x, w.y, 2.2, kit.time * 10 + i, false, kit.time * 3));
                    kit.sprites.bubble.draw(ctx, player.x, player.y, 2.5, kit.time * 9, false, 0);
                    kit.overlay(over ? "GARDEN LOST" : "");
                }
            };
        });
    }

    function neonNinjaRunner(canvasId) {
        createGame(canvasId, (kit) => {
            const ground = () => kit.h * .74;
            const player = { x: 130, y: ground(), vy: 0, r: 22, slash: 0 };
            const obstacles = [];
            let spawn = 0, score = 0, lives = 3, over = false, speed = 270;
            kit.toast("Jump, slash, and keep the rooftop streak alive.");

            return {
                update(dt) {
                    if (over) return;
                    speed += dt * 3;
                    const jump = kit.wasPressed("Space") || kit.wasPressed("ArrowUp") || kit.wasPressed("KeyW") || kit.pointer.pressed;
                    const slash = kit.wasPressed("KeyX") || kit.wasPressed("ShiftLeft") || kit.wasPressed("ShiftRight") || (jump && player.y < ground() - 30);
                    if (jump && player.y >= ground() - 1) player.vy = -560;
                    if (slash) player.slash = .18;
                    player.vy += 1450 * dt;
                    player.y = Math.min(ground(), player.y + player.vy * dt);
                    if (player.y >= ground()) player.vy = 0;
                    player.slash -= dt;
                    spawn -= dt;
                    if (spawn <= 0) {
                        obstacles.push({ x: kit.w + 50, y: ground() - (Math.random() > .55 ? 18 : 82), drone: Math.random() > .55, r: 22 });
                        spawn = kit.rand(.72, 1.18);
                    }
                    for (let i = obstacles.length - 1; i >= 0; i--) {
                        const o = obstacles[i];
                        o.x -= speed * dt;
                        if (o.x < -60) { obstacles.splice(i, 1); score += 8; continue; }
                        if (hit(player, o, player.r + o.r - 8)) {
                            if (player.slash > 0 && o.drone) {
                                obstacles.splice(i, 1);
                                score += 30;
                            } else {
                                lives--;
                                obstacles.splice(i, 1);
                                if (lives <= 0) { over = true; kit.toast("Rooftop streak broken. Restart to run again."); }
                            }
                        }
                    }
                    score += dt * 8;
                    kit.setStats({ score: Math.floor(score), lives, level: Math.floor(speed / 80) });
                },
                render(ctx) {
                    kit.fill("#09041f", "#1f1235", -kit.time * speed);
                    ctx.fillStyle = "#22d3ee";
                    ctx.fillRect(0, ground() + 34, kit.w, 5);
                    ctx.fillStyle = "rgba(244,114,182,.22)";
                    for (let x = -((kit.time * speed) % 120); x < kit.w; x += 120) ctx.fillRect(x, ground() + 48, 78, 10);
                    obstacles.forEach((o, i) => (o.drone ? kit.sprites.drone : kit.sprites.bot).draw(ctx, o.x, o.y, 2.2, kit.time * 12 + i, false, 0));
                    kit.sprites.ninja.draw(ctx, player.x, player.y - 28, 2.25, kit.time * 11, false, 0);
                    if (player.slash > 0) {
                        ctx.strokeStyle = "#f472b6";
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        ctx.arc(player.x + 30, player.y - 36, 34, -1.1, 1.1);
                        ctx.stroke();
                    }
                    kit.overlay(over ? "RUN ENDED" : "");
                }
            };
        });
    }

    function orbitalDefense(canvasId) {
        createGame(canvasId, (kit) => {
            const meteors = [];
            let angle = 0, spawn = 0, score = 0, lives = 5, over = false;
            kit.toast("Aim the shield. Break meteors before impact.");

            function diff(a, b) {
                return Math.atan2(Math.sin(a - b), Math.cos(a - b));
            }

            return {
                update(dt) {
                    if (over) return;
                    const cx = kit.w / 2, cy = kit.h / 2;
                    if (kit.pointer.active) angle = Math.atan2(kit.pointer.y - cy, kit.pointer.x - cx);
                    if (kit.keys.ArrowLeft || kit.keys.KeyA) angle -= dt * 3.2;
                    if (kit.keys.ArrowRight || kit.keys.KeyD) angle += dt * 3.2;
                    spawn -= dt;
                    if (spawn <= 0) {
                        const a = kit.rand(0, Math.PI * 2);
                        meteors.push({ x: cx + Math.cos(a) * (Math.max(kit.w, kit.h) * .7), y: cy + Math.sin(a) * (Math.max(kit.w, kit.h) * .7), a, speed: kit.rand(130, 230), r: 20 });
                        spawn = Math.max(.3, .85 - score * .002);
                    }
                    for (let i = meteors.length - 1; i >= 0; i--) {
                        const m = meteors[i];
                        const a = Math.atan2(cy - m.y, cx - m.x);
                        m.x += Math.cos(a) * m.speed * dt;
                        m.y += Math.sin(a) * m.speed * dt;
                        const d = Math.hypot(m.x - cx, m.y - cy);
                        if (d < 112 && d > 78 && Math.abs(diff(Math.atan2(m.y - cy, m.x - cx), angle)) < .48) {
                            meteors.splice(i, 1);
                            score += 18;
                        } else if (d < 50) {
                            meteors.splice(i, 1);
                            lives--;
                            if (lives <= 0) { over = true; kit.toast("Core breached. Restart the shield."); }
                        }
                    }
                    kit.setStats({ score, lives, level: meteors.length });
                },
                render(ctx) {
                    kit.fill("#050816", "#10132b", kit.time * -50);
                    const cx = kit.w / 2, cy = kit.h / 2;
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.fillStyle = "#2563eb";
                    ctx.beginPath();
                    ctx.arc(0, 0, 45, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "rgba(34,211,238,.38)";
                    ctx.fillRect(-8, -42, 16, 84);
                    ctx.strokeStyle = "rgba(125,211,252,.25)";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, 110, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.rotate(angle);
                    ctx.strokeStyle = "#fde047";
                    ctx.lineWidth = 12;
                    ctx.beginPath();
                    ctx.arc(0, 0, 104, -.48, .48);
                    ctx.stroke();
                    ctx.restore();
                    meteors.forEach((m, i) => kit.sprites.meteor.draw(ctx, m.x, m.y, 2.1, kit.time * 10 + i, false, kit.time * 3));
                    kit.overlay(over ? "CORE BREACHED" : "");
                }
            };
        });
    }

    function crystalComet(canvasId) {
        createGame(canvasId, (kit) => {
            const player = { x: 116, y: kit.h / 2, r: 22, fire: 0, inv: 0 };
            const crystals = [];
            const clouds = [];
            const shots = [];
            let score = 0, lives = 3, spawn = 0, over = false, drift = 0;
            kit.toast("Collect crystals. Burn through storm clouds.");

            return {
                update(dt) {
                    if (over) return;
                    drift += dt * 220;
                    const yv = (kit.keys.ArrowDown || kit.keys.KeyS ? 1 : 0) - (kit.keys.ArrowUp || kit.keys.KeyW ? 1 : 0);
                    player.y = kit.clamp(player.y + yv * 330 * dt, 86, kit.h - 50);
                    if (kit.pointer.down) player.y += (kit.pointer.y - player.y) * .1;
                    player.inv -= dt;
                    player.fire -= dt;
                    if ((kit.keys.Space || kit.pointer.down) && player.fire <= 0) {
                        shots.push({ x: player.x + 32, y: player.y, vx: 620 });
                        player.fire = .24;
                    }
                    spawn -= dt;
                    if (spawn <= 0) {
                        if (Math.random() > .48) crystals.push({ x: kit.w + 50, y: kit.rand(92, kit.h - 70), r: 16 });
                        else clouds.push({ x: kit.w + 50, y: kit.rand(92, kit.h - 70), r: 28 });
                        spawn = kit.rand(.38, .75);
                    }
                    shots.forEach((s) => s.x += s.vx * dt);
                    crystals.forEach((c) => c.x -= 230 * dt);
                    clouds.forEach((c) => c.x -= 260 * dt);
                    for (let i = crystals.length - 1; i >= 0; i--) {
                        if (crystals[i].x < -40) crystals.splice(i, 1);
                        else if (hit(player, crystals[i], player.r + crystals[i].r)) {
                            crystals.splice(i, 1);
                            score += 20;
                        }
                    }
                    for (let i = clouds.length - 1; i >= 0; i--) {
                        const c = clouds[i];
                        let gone = false;
                        for (let j = shots.length - 1; j >= 0; j--) {
                            if (hit(c, shots[j], c.r)) {
                                shots.splice(j, 1);
                                clouds.splice(i, 1);
                                score += 14;
                                gone = true;
                                break;
                            }
                        }
                        if (gone) continue;
                        if (c.x < -60) clouds.splice(i, 1);
                        else if (player.inv <= 0 && hit(player, c, player.r + c.r - 8)) {
                            lives--;
                            player.inv = 1;
                            clouds.splice(i, 1);
                            if (lives <= 0) { over = true; kit.toast("Comet trail lost. Restart to relaunch."); }
                        }
                    }
                    while (shots[0] && shots[0].x > kit.w + 40) shots.shift();
                    score += dt * 5;
                    kit.setStats({ score: Math.floor(score), lives, level: Math.floor(score / 150) + 1 });
                },
                render(ctx) {
                    kit.fill("#08051d", "#1b1037", -drift);
                    ctx.fillStyle = "#fef08a";
                    shots.forEach((s) => ctx.fillRect(s.x, s.y - 2, 20, 4));
                    crystals.forEach((c, i) => kit.sprites.crystal.draw(ctx, c.x, c.y, 2.3, kit.time * 8 + i, false, 0));
                    clouds.forEach((c, i) => kit.sprites.cloud.draw(ctx, c.x, c.y, 2.4, kit.time * 8 + i, false, 0));
                    kit.sprites.comet.draw(ctx, player.x, player.y, 2.45, kit.time * 10, false, 0);
                    kit.overlay(over ? "TRAIL LOST" : "");
                }
            };
        });
    }

    window.WWGSpriteGames = {
        starshipSprint,
        bubbleGarden,
        neonNinjaRunner,
        orbitalDefense,
        crystalComet
    };
})();
