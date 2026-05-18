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
    "ML & Data Science Enthusiast",
    "Cyber-Brutalist Architect"
];

document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("scramble-text");
    if(el) {
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

// Animated ASCII Background (Cyber-Brutalist Binary Rain)
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('ascii-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Using dense ASCII characters for the cyber brutalist effect
        const chars = '@#%*+=-:. '.split('');
        const fontSize = 12; // Smaller font creates denser columns
        let columns = Math.floor(canvas.width / fontSize) + 1;
        let drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * (canvas.height / fontSize);
        }

        function draw() {
            ctx.fillStyle = 'rgba(5, 5, 5, 0.08)'; // Lower alpha for longer, denser trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; // More prominent text color
            ctx.font = fontSize + 'px "JetBrains Mono", monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        // Re-initialize drops on resize
        window.addEventListener('resize', () => {
            columns = Math.floor(canvas.width / fontSize) + 1;
            drops = [];
            for (let x = 0; x < columns; x++) {
                drops[x] = Math.random() * (canvas.height / fontSize);
            }
        });

        setInterval(draw, 50);
    }
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
            elem.style.transform = `translate(${body.position.x - w/2}px, ${body.position.y - h/2}px) rotate(${body.angle}rad)`;
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
