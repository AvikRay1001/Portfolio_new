// Typewriter Effect
const roles = [
    "Full-Stack Developer.",
    "Mobile Application Developer.",
    "ML & Data Science Enthusiast.",
    "Problem Solver."
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;
const typewriterElement = document.getElementById("typewriter");

function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Faster when deleting
    } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
}

// Start typewriter when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    if (typewriterElement) {
        setTimeout(type, 1000);
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
