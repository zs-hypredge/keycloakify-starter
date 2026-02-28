import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
}

const COLORS = [
    "rgba(59, 232, 176, 0.7)",  // Teal
    "rgba(26, 175, 208, 0.7)",  // Cyan
    "rgba(106, 103, 206, 0.7)", // Purple
    "rgba(255, 185, 0, 0.6)"    // Amber
];

const CONNECTION_DISTANCE = 150;
const MOUSE_REPULSION_RADIUS = 200;
const FRICTION = 0.998;
const DRIFT = 0.03;

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animFrameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas!.getBoundingClientRect();
            canvas!.width = rect.width * dpr;
            canvas!.height = rect.height * dpr;
            ctx!.scale(dpr, dpr);
            initParticles(rect.width, rect.height);
        }

        function initParticles(w: number, h: number) {
            const count = Math.min(80, Math.floor((w * h) / 15000));
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    radius: Math.random() * 2 + 1.5,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)]
                });
            }
        }

        function animate() {
            const rect = canvas!.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            ctx!.clearRect(0, 0, w, h);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DISTANCE) {
                        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.25;
                        ctx!.beginPath();
                        ctx!.moveTo(particles[i].x, particles[i].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        ctx!.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx!.lineWidth = 0.5;
                        ctx!.stroke();
                    }
                }
            }

            // Update and draw particles
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            for (const p of particles) {
                // Mouse repulsion
                const dmx = p.x - mx;
                const dmy = p.y - my;
                const mDist = Math.sqrt(dmx * dmx + dmy * dmy);
                if (mDist < MOUSE_REPULSION_RADIUS && mDist > 0) {
                    const force = ((MOUSE_REPULSION_RADIUS - mDist) / MOUSE_REPULSION_RADIUS) * 0.15;
                    p.vx += (dmx / mDist) * force;
                    p.vy += (dmy / mDist) * force;
                }

                // Apply friction and drift
                p.vx = p.vx * FRICTION + (Math.random() - 0.5) * DRIFT;
                p.vy = p.vy * FRICTION + (Math.random() - 0.5) * DRIFT;

                // Cap velocity
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 1.0) {
                    p.vx = (p.vx / speed) * 1.0;
                    p.vy = (p.vy / speed) * 1.0;
                }

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                // Draw glow
                ctx!.beginPath();
                ctx!.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
                ctx!.fillStyle = p.color.replace(/[\d.]+\)$/, "0.15)");
                ctx!.fill();

                // Draw particle
                ctx!.beginPath();
                ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx!.fillStyle = p.color;
                ctx!.fill();
            }

            animFrameRef.current = requestAnimationFrame(animate);
        }

        function handleMouseMove(e: MouseEvent) {
            const rect = canvas!.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }

        function handleMouseLeave() {
            mouseRef.current = { x: -1000, y: -1000 };
        }

        let resizeTimeout: ReturnType<typeof setTimeout>;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 100);
        }

        resize();
        animFrameRef.current = requestAnimationFrame(animate);

        window.addEventListener("resize", handleResize);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener("resize", handleResize);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "auto"
            }}
        />
    );
}
