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

  // --- Fixed Border Stars that scroll with content ---
  useEffect(() => {
    const borderCanvas = borderCanvasRef.current;
    if (!borderCanvas) return;

    const ctx = borderCanvas.getContext('2d');
    const starImg = new Image();
    starImg.src = '/images/tiny-star.png';

    let currentWidth = 0;
    let currentHeight = 0;

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

      const starSize = 20;
      const canvasWidth = width;
      const canvasHeight = height;

      // Top & bottom borders
      for (let i = 0; i <= canvasWidth / starSize; i++) {
        const x = i * starSize;
        ctx.drawImage(starImg, x, 0, starSize, starSize); // top
        ctx.drawImage(starImg, x, canvasHeight - starSize, starSize, starSize); // bottom
      }

      // Left & right borders
      for (let i = 0; i <= canvasHeight / starSize; i++) {
        const y = i * starSize;
        ctx.drawImage(starImg, 0, y, starSize, starSize); // left
        ctx.drawImage(starImg, canvasWidth - starSize, y, starSize, starSize); // right
      }
    };

    const handleResize = () => drawBorderStars();

    starImg.onload = drawBorderStars;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    window.addEventListener('resize', handleResize);

    const mutationObserver = new MutationObserver(handleResize);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    drawBorderStars();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', handleResize);
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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
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
