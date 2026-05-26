// Cyber Scramble / Decode Effect
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const phrases = [
    "Full-Stack Developer",
    "Mobile App Developer",
    "ML & Data Science Enthusiast"
];

document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("scramble-text");
    if (el) {
        const fx = new TextScramble(el);
        let counter = 0;
        const next = () => {
            fx.setText(phrases[counter]).then(() => {
                setTimeout(next, 2000);
            });
            counter = (counter + 1) % phrases.length;
        };
        setTimeout(next, 1000);
    }
});

// Scroll Reveal Effect
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'home') {
            section.style.opacity = 0;
            section.style.transform = "translateY(30px)";
            section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
            observer.observe(section);
        }
    });
});

// Animated Halftone Portrait Background — optimised with pre-render + dirty flag
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('ascii-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.style.willChange = 'contents'; // hint browser to GPU-layer the canvas

    const image = new Image();
    image.src = 'linkedinPhoto.png';

    // Each cell: { alpha: 0..1, r, g, b: 0-255 }
    let dotGrid = [];
    let cols = 0, rows = 0, blockSize = 5;

    // Pre-rendered offscreen of ALL white dots (drawn once, blitted every frame)
    let staticCanvas = null;
    let staticCtx    = null;

    // Mouse state
    let mouseX = -9999, mouseY = -9999;
    let dirty  = true;  // only redraw when something changed
    const COLOR_RADIUS = 200;

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const nx = e.clientX - rect.left;
        const ny = e.clientY - rect.top;
        if (nx !== mouseX || ny !== mouseY) {
            mouseX = nx;
            mouseY = ny;
            dirty  = true;
        }
    });

    document.addEventListener('mouseleave', () => {
        mouseX = -9999;
        mouseY = -9999;
        dirty  = true;
    });

    image.onload = () => {

        function initAscii() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;

            blockSize = canvas.width < 768 ? 4 : 5;
            cols = Math.floor(canvas.width  / blockSize);
            rows = Math.floor(canvas.height / blockSize);

            // Offscreen 1: black bg for luminance
            const grayOff = document.createElement('canvas');
            grayOff.width  = cols;
            grayOff.height = rows;
            const grayCtx = grayOff.getContext('2d');

            // Offscreen 2: transparent for original RGB color
            const colorOff = document.createElement('canvas');
            colorOff.width  = cols;
            colorOff.height = rows;
            const colorCtx = colorOff.getContext('2d');

            const imgRatio    = image.width / image.height;
            const canvasRatio = cols / rows;
            let drawWidth, drawHeight, offsetX, offsetY;
            const minOffsetY = 90 / blockSize;

            if (canvasRatio > 1) {
                drawWidth  = cols * 0.52;
                drawHeight = drawWidth / imgRatio;
                offsetX    = cols - drawWidth - (cols * 0.01);
                offsetY    = Math.max((rows - drawHeight) * 0.38, minOffsetY);
            } else {
                drawWidth  = cols * 0.95;
                drawHeight = drawWidth / imgRatio;
                offsetX    = (cols - drawWidth) / 2;
                offsetY    = Math.max((rows - drawHeight) * 0.3, minOffsetY);
            }

            grayCtx.fillStyle = 'black';
            grayCtx.fillRect(0, 0, cols, rows);
            grayCtx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

            colorCtx.clearRect(0, 0, cols, rows);
            colorCtx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

            const grayData  = grayOff.getContext('2d').getImageData(0, 0, cols, rows).data;
            const colorData = colorCtx.getImageData(0, 0, cols, rows).data;

            const portraitCX = offsetX + drawWidth  * 0.50;
            const portraitCY = offsetY + drawHeight * 0.40;
            const rx = drawWidth  * 0.56;
            const ry = drawHeight * 0.54;

            dotGrid = [];
            for (let y = 0; y < rows; y++) {
                const row = [];
                for (let x = 0; x < cols; x++) {
                    const i = (y * cols + x) * 4;
                    const gR = grayData[i], gG = grayData[i+1], gB = grayData[i+2], gA = grayData[i+3];
                    let brightness = 0;
                    if (gA > 0) {
                        brightness = (gR * 0.299 + gG * 0.587 + gB * 0.114) * (gA / 255);
                        brightness = Math.min(255, Math.max(0, (brightness - 15) * 1.4));
                    }
                    const ndx  = (x - portraitCX) / rx;
                    const ndy  = (y - portraitCY) / ry;
                    const dist = Math.sqrt(ndx * ndx + ndy * ndy);
                    let fade = Math.max(0, 1.0 - dist);
                    fade = fade * fade * (3 - 2 * fade);
                    fade = fade * fade * (3 - 2 * fade);
                    row.push({
                        alpha: (brightness / 255) * fade,
                        r: colorData[i], g: colorData[i+1], b: colorData[i+2]
                    });
                }
                dotGrid.push(row);
            }

            // --- Pre-render all white dots into a static offscreen canvas ---
            staticCanvas = document.createElement('canvas');
            staticCanvas.width  = canvas.width;
            staticCanvas.height = canvas.height;
            staticCtx = staticCanvas.getContext('2d');

            const maxR = (blockSize * 0.9) / 2;
            // Build one big path for all white dots of the same alpha bucket
            // Group dots into ~20 alpha buckets to minimise fillStyle changes
            const BUCKETS = 20;
            const bucketPaths  = new Array(BUCKETS).fill(null).map(() => []);

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const alpha = dotGrid[y][x].alpha;
                    if (alpha < 0.008) continue;
                    const bucket = Math.min(BUCKETS - 1, Math.floor(alpha * BUCKETS));
                    bucketPaths[bucket].push({
                        cx: x * blockSize + blockSize / 2,
                        cy: y * blockSize + blockSize / 2,
                        r:  maxR * Math.sqrt(alpha),
                        a:  Math.min(1, alpha * 1.2)
                    });
                }
            }

            for (let b = 0; b < BUCKETS; b++) {
                if (bucketPaths[b].length === 0) continue;
                const repAlpha = bucketPaths[b][0].a;
                staticCtx.fillStyle = 'rgba(255,255,255,' + repAlpha + ')';
                staticCtx.beginPath();
                for (const d of bucketPaths[b]) {
                    staticCtx.moveTo(d.cx + d.r, d.cy);
                    staticCtx.arc(d.cx, d.cy, d.r, 0, Math.PI * 2);
                }
                staticCtx.fill();
            }

            dirty = true;
        }

        function draw() {
            requestAnimationFrame(draw); // schedule next frame first

            if (!dirty || !staticCanvas) return; // nothing changed — skip work
            dirty = false;

            // 1. Blit the pre-rendered white-dot canvas (single GPU call)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(staticCanvas, 0, 0);

            // 2. Color spotlight — only iterate cells inside a bounding box around cursor
            if (mouseX >= 0 && mouseX < canvas.width && mouseY >= 0 && mouseY < canvas.height) {
                const maxR         = (blockSize * 0.9) / 2;
                const colorRadSq   = COLOR_RADIUS * COLOR_RADIUS;

                const minCol = Math.max(0,        Math.floor((mouseX - COLOR_RADIUS) / blockSize));
                const maxCol = Math.min(cols - 1, Math.ceil ((mouseX + COLOR_RADIUS) / blockSize));
                const minRow = Math.max(0,        Math.floor((mouseY - COLOR_RADIUS) / blockSize));
                const maxRow = Math.min(rows - 1, Math.ceil ((mouseY + COLOR_RADIUS) / blockSize));

                for (let y = minRow; y <= maxRow; y++) {
                    for (let x = minCol; x <= maxCol; x++) {
                        const cell  = dotGrid[y][x];
                        if (cell.alpha < 0.008) continue;

                        const cx = x * blockSize + blockSize / 2;
                        const cy = y * blockSize + blockSize / 2;
                        const dx = cx - mouseX, dy = cy - mouseY;
                        const dSq = dx * dx + dy * dy;
                        if (dSq >= colorRadSq) continue;

                        // Smoothstep blend factor: 1 at cursor center, 0 at radius edge
                        const rawT = 1 - Math.sqrt(dSq) / COLOR_RADIUS;
                        const t    = rawT * rawT * (3 - 2 * rawT);
                        // Brighten the original color
                        const brightFactor = 1.4; 
                        const targetR = Math.min(255, cell.r * brightFactor);
                        const targetG = Math.min(255, cell.g * brightFactor);
                        const targetB = Math.min(255, cell.b * brightFactor);

                        const dr   = Math.round(255 + (targetR - 255) * t);
                        const dg   = Math.round(255 + (targetG - 255) * t);
                        const db   = Math.round(255 + (targetB - 255) * t);

                        // Erase the white dot, redraw with color
                        ctx.clearRect(x * blockSize, y * blockSize, blockSize, blockSize);
                        ctx.beginPath();
                        ctx.arc(cx, cy, maxR * Math.sqrt(cell.alpha), 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(' + dr + ',' + dg + ',' + db + ',' + Math.min(1, cell.alpha * 1.2) + ')';
                        ctx.fill();
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            initAscii();
        });

        initAscii();
        draw();
    };
});

// Typewriter effect for About heading
document.addEventListener("DOMContentLoaded", () => {
    const text = "Building ideas into reality.";
    const typewriterElement = document.getElementById("typewriter-heading");
    let index = 0;

    if (typewriterElement) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        const aboutSection = document.getElementById("about");
        if (aboutSection) {
            observer.observe(aboutSection);
        }

        function typeWriter() {
            if (index < text.length) {
                typewriterElement.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, 75); // Balanced typing speed
            }
        }
    }
});

// Typewriter effect for Services heading
document.addEventListener("DOMContentLoaded", () => {
    const text = "What I do best";
    const typewriterElement = document.getElementById("typewriter-services");
    let index = 0;

    if (typewriterElement) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        const servicesSection = document.getElementById("services");
        if (servicesSection) {
            observer.observe(servicesSection);
        }

        function typeWriter() {
            if (index < text.length) {
                typewriterElement.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, 75); // Balanced typing speed
            }
        }
    }
});

// Typewriter effect for Projects heading
document.addEventListener("DOMContentLoaded", () => {
    const text = "Some of the things I've built, loved, and occasionally debugged at 2 a.m";
    const typewriterElement = document.getElementById("typewriter-projects");
    let index = 0;

    if (typewriterElement) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
            observer.observe(projectsSection);
        }

        function typeWriter() {
            if (index < text.length) {
                typewriterElement.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50); // Slightly faster for longer text
            }
        }
    }
});

// Active Nav Link on Scroll
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a:not(.btn-contact)");

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${entry.target.id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

    sections.forEach((section) => {
        navObserver.observe(section);
    });
});

// Canvas ASCII Trail Effect
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("cursor-trail-canvas");
    if (!canvas || window.matchMedia('(pointer: coarse)').matches) return;

    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
        canvas.width = width = window.innerWidth;
        canvas.height = height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    const particles = [];
    const chars = ['0', '1', '!', '<', '>', '-', '_', '\\', '/', '[', ']', '{', '}', '=', '+', '*', '^', '?', '#', '@'];
    let lastMouse = { x: null, y: null };
    let distanceAccumulator = 0;
    const spacing = 22; // Balanced spacing for a moderately dense trail

    document.addEventListener("mousemove", (e) => {
        if (lastMouse.x !== null) {
            const dx = e.clientX - lastMouse.x;
            const dy = e.clientY - lastMouse.y;
            const distance = Math.hypot(dx, dy);

            distanceAccumulator += distance;

            while (distanceAccumulator >= spacing) {
                // Approximate the spawn position along the movement vector
                const ratio = Math.max(0, (distance - (distanceAccumulator - spacing))) / distance || 0;

                particles.push({
                    // Offset by 12px right and 16px down to spawn from the tail of a standard cursor
                    x: lastMouse.x + dx * ratio + 12 + (Math.random() - 0.5) * 4,
                    y: lastMouse.y + dy * ratio + 16 + (Math.random() - 0.5) * 4,
                    char: chars[Math.floor(Math.random() * chars.length)],
                    life: 1.0,
                    // Subtle drift
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                });
                distanceAccumulator -= spacing;
            }
        }
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02; // Fade out speed

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            // Characters shrink slightly as they fade
            const size = Math.max(0.1, p.life) * 20;
            ctx.font = `bold ${size}px "JetBrains Mono", monospace`;

            // Brutalist white fading to transparent
            ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;

            ctx.fillText(p.char, p.x, p.y);
        }

        requestAnimationFrame(animate);
    }
    animate();
});

// Skills Physics using Matter.js
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('physics-container');
    const skillItems = document.querySelectorAll('.skills-list li');

    // Only run if elements exist and Matter is loaded
    if (!container || skillItems.length === 0 || typeof Matter === 'undefined') return;

    // Matter.js module aliases
    const Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint;

    // Create engine
    const engine = Engine.create();
    engine.gravity.y = 0.4; // Reduce gravity for a lighter, floatier feel

    const width = container.clientWidth;
    const height = container.clientHeight;
    const wallThickness = 60;

    // Static bodies for boundaries
    const ground = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 200, wallThickness, { isStatic: true });
    const leftWall = Bodies.rectangle(0 - wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true });

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Map DOM elements to Physics bodies
    const domBodies = [];

    skillItems.forEach((item, index) => {
        // Read actual DOM size
        const w = item.offsetWidth;
        const h = item.offsetHeight;

        // Stagger spawn positions horizontally
        const xPos = Math.random() * (width - 100) + 50;
        const yPos = -20 - (index * 30); // Spawn closer to the box top to reduce fall time

        // Create physics body
        const body = Bodies.rectangle(xPos, yPos, w, h, {
            restitution: 0.6, // Bounciness
            friction: 0.1,
            frictionAir: 0.02,
            angle: Math.random() * 0.2 - 0.1 // Slight initial tilt
        });

        Composite.add(engine.world, body);

        domBodies.push({
            elem: item,
            body: body,
            w: w,
            h: h
        });

        // Make element visible now that physics holds its state
        item.style.opacity = 1;
    });

    // Add mouse control
    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });
    Composite.add(engine.world, mouseConstraint);

    // Remove scroll interference from Matter's mouse listener
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    // Create runner
    const runner = Runner.create();

    // Update DOM inside requestAnimationFrame loop to match physics
    function updateDOM() {
        domBodies.forEach((db) => {
            const { elem, body, w, h } = db;
            // Translate by top-left corner instead of center
            elem.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
        });
        requestAnimationFrame(updateDOM);
    }

    // Wait until section is scrolled into view before dropping
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            Runner.run(runner, engine);
            updateDOM();
            observer.disconnect(); // Only drop once
        }
    }, { threshold: 0.3 });

    observer.observe(container);

    // Handle window resize gracefully
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        Matter.Body.setPosition(ground, { x: newWidth / 2, y: height + wallThickness / 2 });
        Matter.Body.setPosition(rightWall, { x: newWidth + wallThickness / 2, y: height / 2 });
    });
});

// Accordion Logic
document.addEventListener("DOMContentLoaded", () => {
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            // Toggle active class on header
            header.classList.toggle("active");

            // Toggle max-height on the body for smooth animation
            const body = header.nextElementSibling;
            if (header.classList.contains("active")) {
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                body.style.maxHeight = 0;
            }

            // Close other open accordion items
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains("active")) {
                    otherHeader.classList.remove("active");
                    otherHeader.nextElementSibling.style.maxHeight = 0;
                }
            });
        });
    });
});

// Contact Form — Custom Validation
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("retro-contact-form");
    if (!form) return;

    const fields = {
        name: {
            input: document.getElementById("retro-name"),
            error: document.getElementById("error-name"),
            validate(val) {
                if (!val) return "// ERR: Name field cannot be empty.";
                if (val.length < 2) return "// ERR: Name must be at least 2 characters.";
                return null;
            }
        },
        email: {
            input: document.getElementById("retro-email"),
            error: document.getElementById("error-email"),
            validate(val) {
                if (!val) return "// ERR: Email field cannot be empty.";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "// ERR: Enter a valid email address.";
                return null;
            }
        },
        message: {
            input: document.getElementById("retro-message"),
            error: document.getElementById("error-message"),
            validate(val) {
                if (!val) return "// ERR: Message field cannot be empty.";
                if (val.length < 10) return "// ERR: Message must be at least 10 characters.";
                return null;
            }
        }
    };

    const successBox = document.getElementById("retro-form-success");

    const errorTimers = {};

    function showError(field, msg, key) {
        field.error.textContent = msg;
        field.error.classList.add("visible");
        field.input.classList.add("input-error");
        field.input.classList.remove("input-success");

        // Auto-dismiss after 3 seconds
        clearTimeout(errorTimers[key]);
        errorTimers[key] = setTimeout(() => clearError(field), 3000);
    }

    function clearError(field) {
        field.error.textContent = "";
        field.error.classList.remove("visible");
        field.input.classList.remove("input-error");
    }

    function markSuccess(field) {
        clearError(field);
        field.input.classList.add("input-success");
    }

    // Live validation on blur
    Object.entries(fields).forEach(([key, field]) => {
        field.input.addEventListener("blur", () => {
            const val = field.input.value.trim();
            const err = field.validate(val);
            if (err) showError(field, err, key);
            else markSuccess(field);
        });

        // Clear error on input
        field.input.addEventListener("input", () => {
            if (field.error.classList.contains("visible")) {
                const val = field.input.value.trim();
                if (!field.validate(val)) markSuccess(field);
            }
        });
    });

    // Submit validation
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let valid = true;

        Object.entries(fields).forEach(([key, field]) => {
            const val = field.input.value.trim();
            const err = field.validate(val);
            if (err) {
                showError(field, err, key);
                valid = false;
            } else {
                markSuccess(field);
            }
        });

        if (valid) {
            const submitBtn = form.querySelector('.retro-submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'SENDING...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';

            try {
                const payload = {
                    access_key: "d2e71211-9994-46b7-942d-8d5b76c456d7", // TODO: Replace with your Web3Forms access key
                    name: fields.name.input.value.trim(),
                    email: fields.email.input.value.trim(),
                    message: fields.message.input.value.trim(),
                };
                console.log("Sending contact form payload:", payload);

                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();
                console.log("Form submission response status:", response.status);
                console.log("Form submission response result:", result);

                if (response.status === 200) {
                    successBox.textContent = "> MESSAGE_SENT. I'll get back to you shortly.";
                    successBox.style.color = ""; // Revert to original color
                    successBox.classList.add("visible");
                    form.reset();
                    Object.values(fields).forEach(f => {
                        f.input.classList.remove("input-success");
                    });
                } else {
                    console.error("Form submission failed:", response.status, result);
                    successBox.textContent = "> ERROR_SENDING. Please try again.";
                    successBox.style.color = "#ef4444";
                    successBox.classList.add("visible");
                }
            } catch (error) {
                console.error("Form submission encountered an error:", error);
                successBox.textContent = "> ERROR_SENDING. Please check your connection.";
                successBox.style.color = "#ef4444";
                successBox.classList.add("visible");
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                setTimeout(() => successBox.classList.remove("visible"), 5000);
            }
        }
    });
});
