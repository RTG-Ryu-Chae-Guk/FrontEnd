import React, { useRef, useEffect } from 'react';
import { WaveGroup } from './WaveGroup';

const WaveCanvas = () => {
  const canvasRef = useRef(null);
  const waveGroupRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    waveGroupRef.current = new WaveGroup();

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      waveGroupRef.current.resize(width, height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      waveGroupRef.current.draw(ctx);
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '20.5rem', // 200px
        zIndex: 0,
        display: 'block',
      }}
    />
  );
};

export default WaveCanvas;
