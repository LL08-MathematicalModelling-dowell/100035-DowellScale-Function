import React, { useRef, useEffect, useState } from 'react';
import { ItemTypes } from './Itemtypes';
import { useDrop } from 'react-dnd';

const CustomCanvas = ({ xAxisRange, yAxisRange }) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvas = canvasRef.current;
      if (offset && canvas) {
        const boundingRect = canvas.getBoundingClientRect();
        const x = offset.x - boundingRect.left;
        const y = offset.y - boundingRect.top;

        // Scale the mouse coordinates to graph coordinates
        const xRange = xAxisRange || 10;
        const yRange = yAxisRange || 10;
        const graphX = (x / canvas.width) * 2 * xRange - xRange;
        const graphY = -(y / canvas.height) * 2 * yRange + yRange;

        // Round to the nearest whole number
        const roundedX = Math.round(graphX);
        const roundedY = Math.round(graphY);

        // Set the position based on the rounded graph coordinates
        setDraggedItem({ name: item.name, position: [roundedX, roundedY] });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const labels = {
    north: 'North',
    south: 'South',
    west: 'West',
    east: 'East',
  };

  const xRange = xAxisRange; // Define the axis range for x (default to 10 if not provided)
  const yRange = yAxisRange; // Define the axis range for y (default to 10 if not provided)

  const gridSpacing = 40;
  const unitSpacing = 40;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);
  }, []);

  useEffect(() => {
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.font = '14px Arial';
      ctx.fillStyle = 'black';

      // Set up the origin at the center of the canvas
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;
      ctx.translate(centerX, centerY);

      // Draw grid lines
      ctx.strokeStyle = '#ddd';
      for (let x = -centerX; x <= centerX; x += centerX / xAxisRange) {
        ctx.beginPath();
        ctx.moveTo(x, -centerY);
        ctx.lineTo(x, centerY);
        ctx.stroke();
      }
      for (let y = -centerY; y <= centerY; y += centerY / yAxisRange) {
        ctx.beginPath();
        ctx.moveTo(-centerX, y);
        ctx.lineTo(centerX, y);
        ctx.stroke();
      }

      // Draw the axes
      ctx.beginPath();
      ctx.moveTo(0, -centerY);
      ctx.lineTo(0, centerY);
      ctx.moveTo(-centerX, 0);
      ctx.lineTo(centerX, 0);
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // Label the axes
      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(labels.north, -20, -centerY + 20);
      ctx.fillText(labels.south, -20, centerY - 20);
      ctx.fillText(labels.west, -centerX + 10, 10);
      ctx.fillText(labels.east, centerX - 30, 10);

          //  // Draw the axes
          //  ctx.strokeStyle = 'black';
          //  ctx.beginPath();
          //  ctx.moveTo(0, -centerY);
          //  ctx.lineTo(0, centerY);
          //  ctx.moveTo(-centerX, 0);
          //  ctx.lineTo(centerX, 0);
          //  ctx.stroke();
     
          //  // Label the axes
          //  ctx.fillText('X', centerX - 20, 20);
          //  ctx.fillText('Y', -20, -centerY + 20);

      // Display coordinates
      ctx.font = '10px Arial';
      ctx.fillStyle = 'blue';
      ctx.fillText('O(0, 0)', 5, -5);
      // ctx.fillText(`(${xRange}, 0)`, centerX - unitSpacing, -10);
      // ctx.fillText(`(0, ${yRange})`, -centerX + unitSpacing, -10);

      // Draw axis units with spacing
      // for (let x = -xRange; x <= xRange; x++) {
      //   const xPos = (x / (2 * xRange)) * centerX;
      //   ctx.fillText(x.toString(), xPos, 10);
      // }
      // for (let y = -yRange; y <= yRange; y++) {
      //   const yPos = (-y / (2 * yRange)) * centerY;
      //   ctx.fillText(y.toString(), 10, yPos);
      // }
      if (draggedItem) {
        const [x, y] = draggedItem.position;
        ctx.fillStyle = 'red';
        ctx.beginPath();
        // Scale back to canvas coordinates
        const canvasX = ((x + xRange) / (2 * xRange)) * canvasRef.current.width;
        const canvasY =
          ((yRange - y) / (2 * yRange)) * canvasRef.current.height;
        ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
      // if (draggedItem) {
      //   const [x, y] = draggedItem.position;
      //   ctx.fillStyle = 'red';
      //   ctx.beginPath();
      //   ctx.arc(x, -y, 5, 0, 2 * Math.PI);
      //   ctx.fill();
      // }
    }
  }, [ctx, xRange, yRange, draggedItem]);

  const isActive = canDrop && isOver;
  let backgroundColor = '#ffff';
  if (isActive) {
    backgroundColor = '';
  } else if (canDrop) {
    backgroundColor = '';
  }
  return (
    <div ref={drop} data-testid="dustbin" style={{ backgroundColor }}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '1px solid black', padding: 40 }}
        className='xl:w-[600px] xl:h-[600px] w-full h-full'
      ></canvas>
      {draggedItem && (
        <p>
          {draggedItem.name}
          x-----({draggedItem.position[0]}) y-----({draggedItem.position[1]})
        </p>
      )}
    </div>
  );
};

export default CustomCanvas;
