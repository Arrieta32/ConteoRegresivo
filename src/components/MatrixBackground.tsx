import React, { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  theme: string;
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Configuración responsiva
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Configuración de columnas
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1);

    // Caracteres por tema
    const getChars = () => {
      switch (theme) {
        case 'matrix':
          return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍﾗﾄ'.split('');
        case 'cyberpunk':
          return '01'.split('');
        case 'dracula':
          // Símbolos de programación (muy ad-hoc para Prog 3)
          return 'const{}=>()=>[]:;classextendsimportfromreturnletifforwhiletrycatch'.split('');
        case 'nord':
          return '01/*-+=<>!%&|?~^[]{}()#$;._'.split('');
        default:
          return '01'.split('');
      }
    };

    // Color principal por tema
    const getColors = () => {
      switch (theme) {
        case 'matrix':
          return {
            primary: '#00ff41',
            glow: '#008f11',
            fade: 'rgba(5, 5, 5, 0.08)',
          };
        case 'cyberpunk':
          return {
            primary: '#ff007f',
            glow: '#00ffff',
            fade: 'rgba(10, 6, 18, 0.08)',
          };
        case 'dracula':
          return {
            primary: '#bd93f9',
            glow: '#ff79c6',
            fade: 'rgba(30, 31, 41, 0.08)',
          };
        case 'nord':
          return {
            primary: '#88c0d0',
            glow: '#8fbcbb',
            fade: 'rgba(46, 52, 64, 0.08)',
          };
        default:
          return {
            primary: '#ff007f',
            glow: '#00ffff',
            fade: 'rgba(10, 6, 18, 0.08)',
          };
      }
    };

    let chars = getChars();
    let colors = getColors();

    // Actualiza configuraciones si cambia el tema
    const updateThemeSettings = () => {
      chars = getChars();
      colors = getColors();
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    };

    updateThemeSettings();

    // Función de dibujado
    const draw = () => {
      ctx.fillStyle = colors.fade;
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px var(--font-mono)`;

      for (let i = 0; i < drops.length; i++) {
        // Selecciona carácter aleatorio
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Define color con un degradado sutil
        const isHead = Math.random() > 0.97;
        
        if (isHead) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.shadowColor = colors.glow;
        } else {
          ctx.fillStyle = Math.random() > 0.5 ? colors.primary : colors.glow;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Resetea drop si llega abajo
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
};
