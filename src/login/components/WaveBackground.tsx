import { useEffect, useRef } from "react";

interface WaveBackgroundProps {
    color: string;
}

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace("#", "");
    return [
        parseInt(h.substring(0, 2), 16),
        parseInt(h.substring(2, 4), 16),
        parseInt(h.substring(4, 6), 16)
    ];
}

export function WaveBackground({ color }: WaveBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let time = 0;
        const [r, g, b] = hexToRgb(color);

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas!.getBoundingClientRect();
            canvas!.width = rect.width * dpr;
            canvas!.height = rect.height * dpr;
            ctx!.scale(dpr, dpr);
        }

        function animate() {
            const rect = canvas!.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            ctx!.clearRect(0, 0, w, h);

            time += 0.008;

            // Wave sits in the lower portion of the viewport
            const baseY = h * 0.55;
            const amplitude1 = h * 0.06;
            const amplitude2 = h * 0.03;
            const amplitude3 = h * 0.015;

            // Build wave path
            ctx!.beginPath();
            ctx!.moveTo(0, h);

            for (let x = 0; x <= w; x += 2) {
                const nx = x / w;
                const y =
                    baseY +
                    Math.sin(nx * Math.PI * 2 + time) * amplitude1 +
                    Math.sin(nx * Math.PI * 4 - time * 1.3) * amplitude2 +
                    Math.sin(nx * Math.PI * 6 + time * 0.7) * amplitude3;
                if (x === 0) {
                    ctx!.moveTo(x, y);
                } else {
                    ctx!.lineTo(x, y);
                }
            }

            // Close path to fill below the wave
            ctx!.lineTo(w, h);
            ctx!.lineTo(0, h);
            ctx!.closePath();

            // Gradient fill below the wave
            const gradient = ctx!.createLinearGradient(0, baseY, 0, h);
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.18)`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.08)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.02)`);
            ctx!.fillStyle = gradient;
            ctx!.fill();

            // Draw the bright wave boundary line
            ctx!.beginPath();
            for (let x = 0; x <= w; x += 2) {
                const nx = x / w;
                const y =
                    baseY +
                    Math.sin(nx * Math.PI * 2 + time) * amplitude1 +
                    Math.sin(nx * Math.PI * 4 - time * 1.3) * amplitude2 +
                    Math.sin(nx * Math.PI * 6 + time * 0.7) * amplitude3;
                if (x === 0) {
                    ctx!.moveTo(x, y);
                } else {
                    ctx!.lineTo(x, y);
                }
            }

            ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
            ctx!.lineWidth = 2;
            ctx!.shadowBlur = 12;
            ctx!.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
            ctx!.stroke();

            // Reset shadow for next frame
            ctx!.shadowBlur = 0;

            // Draw a subtle second wave slightly offset
            ctx!.beginPath();
            const baseY2 = baseY + h * 0.08;
            for (let x = 0; x <= w; x += 2) {
                const nx = x / w;
                const y =
                    baseY2 +
                    Math.sin(nx * Math.PI * 2.5 - time * 0.6) * amplitude2 +
                    Math.sin(nx * Math.PI * 5 + time * 0.9) * amplitude3;
                if (x === 0) {
                    ctx!.moveTo(x, y);
                } else {
                    ctx!.lineTo(x, y);
                }
            }

            ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
            ctx!.lineWidth = 1;
            ctx!.shadowBlur = 6;
            ctx!.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
            ctx!.stroke();
            ctx!.shadowBlur = 0;

            animFrameRef.current = requestAnimationFrame(animate);
        }

        let resizeTimeout: ReturnType<typeof setTimeout>;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 100);
        }

        resize();
        animFrameRef.current = requestAnimationFrame(animate);

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [color]);

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
                pointerEvents: "none"
            }}
        />
    );
}
