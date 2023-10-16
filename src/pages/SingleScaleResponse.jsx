import React, { useRef, useEffect, useState } from 'react';

import { useParams, useLocation } from 'react-router-dom';

const CreateResponse = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);
  }, []);

  useEffect(() => {
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Set up the origin at the center of the canvas
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;
      ctx.translate(centerX, centerY);

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
      ctx.fillText('North', -20, -centerY + 20);
      ctx.fillText('South', -20, centerY - 10);
      ctx.fillText('West', -centerX + 10, 10);
      ctx.fillText('East', centerX - 30, 10);

      // Display coordinates
      ctx.font = '10px Arial';
      ctx.fillStyle = 'blue';
      ctx.fillText('(0, 0)', 5, -5); // Center
      ctx.fillText('(10, 60)', 10, 60);
      ctx.fillText('(-70, 30)', -70, 30);
      ctx.fillText('(-20, 80)', -20, 80);
      ctx.fillText('(-70, 30)', -70, 30);
    }
  }, [ctx]);
  const { id } = useParams(); // Get the 'id' parameter from the route
  // const history = useHistory();
  const location = useLocation();

  // Access route state and initialize userSelections
  const userSelections = location.state?.userSelections || [];

  // Function to handle form submission (you can adapt this based on your needs)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the userSelections and other form data to the backend
    try {
      // Make an API request to save the user's selections and other data
      // You can use Axios or any other library you prefer
      // After successful submission, you can navigate to a success page or perform any other actions
      // history.push(`/response-success/${id}`);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        // style={{ border: '1px solid black' }}
      ></canvas>
      <h1>Create Scale Response</h1>
      <p>Scale ID: {id}</p>

      <form onSubmit={handleSubmit}>
        {/* Render your form elements here */}
        {/* Example: */}
        {userSelections.map((selectedOption, index) => (
          <div key={index}>
            <label>Pair {index + 1} Selection:</label>
            <p>{selectedOption}</p>
          </div>
        ))}

        <button type="submit">Submit Response</button>
      </form>
    </div>
  );
};

export default CreateResponse;
