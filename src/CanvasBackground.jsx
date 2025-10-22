// src/CanvasBackground.jsx
import { useEffect, useRef } from "react";
import "./CanvasBackground.css";

function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to match page size
    const resizeCanvas = () => {
      canvas.width = document.documentElement.scrollWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    let drawing = false;

    const startDraw = (e) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(
        e.pageX - canvas.offsetLeft,
        e.pageY - canvas.offsetTop + window.scrollY
      );
    };

    const draw = (e) => {
      if (!drawing) return;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000000";
      ctx.lineTo(
        e.pageX - canvas.offsetLeft,
        e.pageY - canvas.offsetTop + window.scrollY
      );
      ctx.stroke();
    };

    const stopDraw = () => {
      drawing = false;
      ctx.closePath();
    };

    // Mouse events
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseout", stopDraw);

    // Touch support (mobile)
    canvas.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      startDraw({ pageX: touch.pageX, pageY: touch.pageY });
    });
    canvas.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      draw({ pageX: touch.pageX, pageY: touch.pageY });
    });
    canvas.addEventListener("touchend", stopDraw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="background-canvas"></canvas>;
}

export default CanvasBackground;
