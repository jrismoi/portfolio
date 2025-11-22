// src/BackgroundCanvas.jsx
import React, { useRef, useEffect, useState } from 'react';
import './BackgroundCanvas.css';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const borderCanvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [paintingEnabled, setPaintingEnabled] = useState(false);
  const [brushColor, setBrushColor] = useState('#ffb300');
  const [brushSize, setBrushSize] = useState(3);
  const [showControls, setShowControls] = useState(false);
  const [starFrame, setStarFrame] = useState(0);

  // --- Flip between funky star frames ---
  useEffect(() => {
    const interval = setInterval(() => {
      setStarFrame(prev => (prev === 0 ? 1 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // --- Resize background canvas ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const width = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      const dpr = window.devicePixelRatio || 1;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 245, 211, 0.05)';
      ctx.fillRect(0, 0, width, height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  // --- Border Stars Canvas (scrolls with page) ---
  useEffect(() => {
    const borderCanvas = borderCanvasRef.current;
    if (!borderCanvas) return;

    const ctx = borderCanvas.getContext('2d');
    let currentWidth = 0;
    let currentHeight = 0;

    // Function to draw a 5-pointed star
    const drawStar = (cx, cy, outerRadius, innerRadius) => {
      ctx.fillStyle = '#562a0bff'; // Brown color
      ctx.strokeStyle = '#523518ff'; // Darker brown outline
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        // Outer point
        const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const outerX = cx + Math.cos(outerAngle) * outerRadius;
        const outerY = cy + Math.sin(outerAngle) * outerRadius;
        
        if (i === 0) {
          ctx.moveTo(outerX, outerY);
        } else {
          ctx.lineTo(outerX, outerY);
        }
        
        // Inner point
        const innerAngle = ((i * 2 + 1) * Math.PI) / 5 - Math.PI / 2;
        const innerX = cx + Math.cos(innerAngle) * innerRadius;
        const innerY = cy + Math.sin(innerAngle) * innerRadius;
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    const drawBorderStars = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);

      if (width === currentWidth && height === currentHeight) return;
      currentWidth = width;
      currentHeight = height;

      borderCanvas.width = Math.floor(width * dpr);
      borderCanvas.height = Math.floor(height * dpr);
      borderCanvas.style.width = `${width}px`;
      borderCanvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = 25; // Space between stars
      const outerRadius = 6;
      const innerRadius = 3;
      const margin = 12;

      // Top border - entire width including right corner
      for (let i = 0; i <= Math.ceil(width / spacing) + 1; i++) {
        const x = i * spacing + margin;
        if (x <= width - margin) {
          drawStar(x, margin, outerRadius, innerRadius);
        }
      }

      // Bottom border - entire width including right corner
      for (let i = 0; i <= Math.ceil(width / spacing) + 1; i++) {
        const x = i * spacing + margin;
        if (x <= width - margin) {
          drawStar(x, height - margin, outerRadius, innerRadius);
        }
      }

      // Left border - entire height (skip corners to avoid double-drawing)
      for (let i = 1; i < Math.ceil(height / spacing); i++) {
        const y = i * spacing + margin;
        if (y > spacing && y < height - spacing) {
          drawStar(margin, y, outerRadius, innerRadius);
        }
      }

      // Right border - entire height (skip corners to avoid double-drawing)
      for (let i = 1; i < Math.ceil(height / spacing); i++) {
        const y = i * spacing + margin;
        if (y > spacing && y < height - spacing) {
          drawStar(width - margin, y, outerRadius, innerRadius);
        }
      }
    };

    const handleResize = () => {
      requestAnimationFrame(drawBorderStars);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    const mutationObserver = new MutationObserver(handleResize);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Initial draw
    requestAnimationFrame(drawBorderStars);

    // Redraw periodically to catch any missed updates
    const interval = setInterval(handleResize, 500);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      clearInterval(interval);
    };
  }, []);

  // --- Painting logic ---
  const getCoordinates = (e) => {
    const isTouch = !!e.touches;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    return { x: (clientX || 0) + window.scrollX, y: (clientY || 0) + window.scrollY };
  };

  const startDrawing = (e) => {
    if (!canvasRef.current || !paintingEnabled) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    try { ctx.closePath(); } catch {}
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pageWidth = parseInt(canvas.style.width || window.innerWidth, 10);
    const pageHeight = parseInt(canvas.style.height || window.innerHeight, 10);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = 'rgba(255, 245, 211, 0.05)';
    ctx.fillRect(0, 0, pageWidth, pageHeight);
  };

  return (
    <>
      <canvas
        ref={borderCanvasRef}
        className="border-stars-canvas"
      />
      <canvas
        ref={canvasRef}
        className="background-canvas"
        style={{ pointerEvents: paintingEnabled ? 'auto' : 'none' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div className="stars-container">
        <img
          src="/images/funkystar.png"
          alt="Funky Star"
          className={`funky-star top-left ${starFrame === 1 ? 'frame-2' : ''}`}
        />
        <img
          src="/images/funkystar.png"
          alt="Funky Star"
          className={`funky-star top-right ${starFrame === 1 ? 'frame-2' : ''}`}
        />
        <img
          src="/images/funkystar.png"
          alt="Funky Star"
          className={`funky-star bottom-left ${starFrame === 1 ? 'frame-2' : ''}`}
        />
        <img
          src="/images/funkystar.png"
          alt="Funky Star"
          className={`funky-star bottom-right ${starFrame === 1 ? 'frame-2' : ''}`}
        />
      </div>

      <div className={`drawing-container ${showControls ? 'expanded' : 'collapsed'}`}>
        {showControls ? (
          <div className="drawing-controls">
            <button className="toggle-controls" onClick={() => setShowControls(false)}>✕</button>

            <div className="color-palette">
              {['#ffb300','#000','#fff','#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7'].map(color => (
                <button
                  key={color}
                  className={`color-swatch ${brushColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setBrushColor(color)}
                />
              ))}
            </div>

            <div className="brush-controls">
              {[2,5,10].map(size => (
                <button
                  key={size}
                  className={`brush-size-btn ${brushSize === size ? 'active' : ''}`}
                  onClick={() => setBrushSize(size)}
                >
                  {size === 2 ? 'Small' : size === 5 ? 'Medium' : 'Large'}
                </button>
              ))}
            </div>

            <button className="clear-btn" onClick={clearCanvas}>Clear Canvas</button>
            <button className="clear-btn" onClick={() => setPaintingEnabled(p => !p)}>
              {paintingEnabled ? 'Painting: ON' : 'Painting: OFF'}
            </button>
          </div>
        ) : (
          <button className="show-controls-btn" onClick={() => setShowControls(true)}>
            Wanna draw?
          </button>
        )}
      </div>
    </>
  );
};

export default BackgroundCanvas;