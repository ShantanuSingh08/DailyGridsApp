import React, { useRef, useState, useEffect } from 'react';
import './Whiteboard.css';
import { FaPencilAlt, FaEraser, FaTrashAlt } from 'react-icons/fa';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [tool, setTool] = useState('pencil'); // Current tool (pencil or eraser)
  const [lineColor, setLineColor] = useState('#000000'); // Default color for the pencil tool

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');
    setCtx(context);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pencil' || tool === 'eraser') {
      setIsDrawing(true);
      draw(x, y);
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && (tool === 'pencil' || tool === 'eraser')) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      draw(x, y);
    }
  };

  const handleMouseUp = () => {
    if (tool === 'pencil' || tool === 'eraser') {
      setIsDrawing(false);
      if (ctx) {
        ctx.beginPath(); // End the current path
      }
    }
  };

  const draw = (x, y) => {
    if (!ctx) return;
    ctx.lineWidth = tool === 'eraser' ? 10 : 5; // Eraser vs pencil size
    ctx.lineCap = 'round'; // Rounded line ends
    ctx.strokeStyle = tool === 'eraser' ? '#fff' : lineColor; // Eraser vs pencil color

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    }
  };

  return (
    <div className="whiteboard-container">
      <canvas
        ref={canvasRef}
        className="whiteboard-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // To stop drawing if mouse leaves canvas
      />
      <div className="toolbox">
        <input
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
          style={{ margin: '0 10px' }}
        />
        <div className={`toolbox-icon ${tool === 'pencil' ? 'active' : ''}`} onClick={() => setTool('pencil')}>
          <FaPencilAlt />
        </div>
        <div className={`toolbox-icon ${tool === 'eraser' ? 'active' : ''}`} onClick={() => setTool('eraser')}>
          <FaEraser />
        </div>
        <div className="toolbox-icon" onClick={clearCanvas}>
          <FaTrashAlt />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
