import React, { useRef, useEffect, useState } from 'react';
import './BackgroundCanvas.css';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paintingEnabled, setPaintingEnabled] = useState(false);
  const [brushColor, setBrushColor] = useState('#ffb300');
  const [brushSize, setBrushSize] = useState(3);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = 'rgba(255, 245, 211, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e) => {
    if (!canvasRef.current || !paintingEnabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const y = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const y = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 245, 211, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
              {['#ffb300', '#000000', '#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'].map(color => (
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
