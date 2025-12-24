import React, { useEffect, useRef } from 'react';

interface SnowfallProps {
  /** Số lượng bông tuyết */
  count?: number;
  /** Tốc độ rơi (1 = mặc định) */
  speed?: number;
  /** Kích thước bông tuyết tối đa (px) */
  maxSize?: number;
  /** Độ mờ tối đa */
  maxAlpha?: number;
}

const Snowfall: React.FC<SnowfallProps> = ({
  count = 150,
  speed = 1,
  maxSize = 3,
  maxAlpha = 0.9,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const onResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', onResize);

    // Khởi tạo hạt tuyết
    const flakes = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * maxSize + 0.5,
      a: Math.random() * maxAlpha * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.6 * speed, // gió ngang nhẹ
      vy: (Math.random() * 0.8 + 0.4) * speed, // rơi xuống
      drift: Math.random() * 2 * Math.PI,
      driftSpeed: Math.random() * 0.02 + 0.005, // lượn nhẹ
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const f of flakes) {
        f.drift += f.driftSpeed;
        const sway = Math.sin(f.drift) * 0.4;
        f.x += f.vx + sway;
        f.y += f.vy;

        // Wrap quanh màn hình
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;
        if (f.y > height + 10) {
          f.y = -10;
          f.x = Math.random() * width;
        }

        ctx.globalAlpha = f.a;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = '#feb1d3ff';
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    // Tôn trọng người dùng giảm chuyển động
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [count, speed, maxSize, maxAlpha]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1, // trên nền, dưới nội dung
      }}
    />
  );
};

export default Snowfall;
