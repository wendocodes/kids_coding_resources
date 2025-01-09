"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
        console.error("Canvas element not found. Animation will not run.");
        return; // Stop execution if canvas is not found
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        // Particle properties
        const particleCount = 1000;
        const particles = [];

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * 6, // Random speed between -3 and 3
                dy: (Math.random() - 0.5) * 6, // Random speed between -3 and 3
                radius: Math.random() * 4 + 1, // Random size between 1 and 5
                color: getRandomColor(),
            });
        }

        // Animation loop
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                // Draw each particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                ctx.closePath();

                // Update particle position
                particle.x += particle.dx;
                particle.y += particle.dy;

                // Bounce particles off edges
                if (
                    particle.x + particle.radius > canvas.width ||
                    particle.x - particle.radius < 0
                ) {
                    particle.dx = -particle.dx;
                }
                if (
                    particle.y + particle.radius > canvas.height ||
                    particle.y - particle.radius < 0
                ) {
                    particle.dy = -particle.dy;
                }
            });

            // Loop the animation
            requestAnimationFrame(draw);
        }

        // Random color generator
        function getRandomColor() {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgb(${r}, ${g}, ${b})`;
        }

        // Start the animation
        draw();
    } else {
        console.error("Canvas context not supported.");
    }
});
