/* eslint-disable react/prop-types */
// ScatterPlot.js

import React from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot = ({ data, xAxisRange, yAxisRange }) => {
  // Define the trace for the scatter plot
  const trace = {
    x: data.settings.x_range,
    y: data.settings.y_range,
    mode: 'markers',
    type: 'scatter',
    marker: { size: 8, color: 'blue' },
  };

  // Define the layout for the scatter plot
  const layout = {
    title: data.settings.name,
    xaxis: { title: data.settings.X_left, range: [4, -2] },
    yaxis: { title: data.settings.Y_bottom, range: [4, -2] },
  };

  return (
    <div>
      <Plot data={[trace]} layout={layout} />
    </div>
  );
};

export default ScatterPlot;
