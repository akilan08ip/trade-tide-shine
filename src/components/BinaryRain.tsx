import { useEffect, useRef } from 'react';

const BinaryRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100);
    const chars = '01';

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 2, 2, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Varying green intensities
        const intensity = Math.random();
        if (intensity > 0.95) {
          ctx.fillStyle = 'hsl(142, 71%, 85%)';
          ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
        } else if (intensity > 0.7) {
          ctx.fillStyle = 'hsl(142, 71%, 55%)';
          ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
        } else {
          ctx.fillStyle = `hsl(142, 71%, ${20 + intensity * 25}%)`;
          ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.4 }}
    />
  );
};

export default BinaryRain;
