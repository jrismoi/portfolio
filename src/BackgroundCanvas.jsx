import React, { useRef, useEffect, useState } from 'react';
import './BackgroundCanvas.css';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paintingEnabled, setPaintingEnabled] = useState(false);
  const [brushColor, setBrushColor] = useState('#ffb300');
  const [brushSize, setBrushSize] = useState(3);
  const [showControls, setShowControls] = useState(false);

  // Resize canvas to cover the full document (scrollable) area and account for DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      // Document (page) dimensions in CSS pixels
      const pageWidth = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      const pageHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);

      // Device Pixel Ratio for crisp drawing
      const dpr = window.devicePixelRatio || 1;

      // Set CSS size (so layout & positioning use these CSS pixels)
      canvas.style.width = `${pageWidth}px`;
      canvas.style.height = `${pageHeight}px`;

      // Set actual pixel buffer size (scaled by DPR)
      canvas.width = Math.floor(pageWidth * dpr);
      canvas.height = Math.floor(pageHeight * dpr);

      // Reset transform and scale so drawing commands use CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fill with translucent background (optional)
      ctx.clearRect(0, 0, pageWidth, pageHeight);
      ctx.fillStyle = 'rgba(255, 245, 211, 0.05)';
      ctx.fillRect(0, 0, pageWidth, pageHeight);
    };

    // Initial size
    resizeCanvas();

    // Update on resize/orientation change (and when content might change)
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    // If content dynamically changes height after load, you might also want:
    // - a MutationObserver on document.body to call resizeCanvas, or
    // - call resizeCanvas manually where content changes.
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  // Helper: coordinates relative to the full page (CSS pixels)
  const getCoordinates = (e) => {
    const isTouch = !!e.touches;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const x = (clientX || 0) + window.scrollX;
    const y = (clientY || 0) + window.scrollY;
    return { x, y };
  };

  const startDrawing = (e) => {
    if (!canvasRef.current || !paintingEnabled) return;
    // Prevent page drag while drawing
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;

    // account for DPR: ctx is already scaled via setTransform, so lineWidth should be in CSS pixels
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    try {
      ctx.closePath();
    } catch (err) {}
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear using CSS-pixel dimensions (because we used ctx.setTransform(dpr...))
    const pageWidth = parseInt(canvas.style.width || window.innerWidth, 10);
    const pageHeight = parseInt(canvas.style.height || window.innerHeight, 10);

    ctx.setTransform(1, 0, 0, 1, 0, 0); // temporarily reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // restore transform to DPR mapping
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fill subtle background
    ctx.fillStyle = 'rgba(255, 245, 211, 0.05)';
    ctx.fillRect(0, 0, pageWidth, pageHeight);
  };

  const changeBrushColor = (color) => setBrushColor(color);
  const changeBrushSize = (size) => setBrushSize(size);

  return (
    <>
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

      {/* Stars added directly to BackgroundCanvas */}
      <div className="stars-container">
        <img 
          src="/images/funkystar.png" 
          alt="Funky Star"
          className="funky-star top-left"
        />
        <img 
          src="/images/funkystar.png" 
          alt="Funky Star"
          className="funky-star top-right"
        />
        <img 
          src="/images/funkystar.png" 
          alt="Funky Star"
          className="funky-star bottom-left"
        />
        <img 
          src="/images/funkystar.png" 
          alt="Funky Star"
          className="funky-star bottom-right"
        />
      </div>

      <div className={`drawing-container ${showControls ? 'expanded' : 'collapsed'}`}>
        {showControls ? (
          <div className="drawing-controls">
            <button
              className="toggle-controls"
              onClick={() => setShowControls(false)}
            >
              ✕
            </button>

            <div className="color-palette">
              {[
                '#ffb300',
                '#000000',
                '#ffffff',
                '#ff6b6b',
                '#4ecdc4',
                '#45b7d1',
                '#96ceb4',
                '#ffeaa7',
              ].map((color) => (
                <button
                  key={color}
                  className={`color-swatch ${brushColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => changeBrushColor(color)}
                />
              ))}
            </div>

            <div className="brush-controls">
              <button className={`brush-size-btn ${brushSize === 2 ? 'active' : ''}`} onClick={() => changeBrushSize(2)}>Small</button>
              <button className={`brush-size-btn ${brushSize === 5 ? 'active' : ''}`} onClick={() => changeBrushSize(5)}>Medium</button>
              <button className={`brush-size-btn ${brushSize === 10 ? 'active' : ''}`} onClick={() => changeBrushSize(10)}>Large</button>
            </div>

            <button className="clear-btn" onClick={clearCanvas}>Clear Canvas</button>
            <button className="clear-btn" onClick={() => setPaintingEnabled(prev => !prev)}>
              {paintingEnabled ? 'Painting: ON' : 'Painting: OFF'}
            </button>
          </div>
        ) : (
          <button
            className="show-controls-btn"
            onClick={() => {
              setShowControls(true);
            }}
          >
            Wanna draw?
          </button>
        )}
      </div>
    </>
  );
};

export default BackgroundCanvas;