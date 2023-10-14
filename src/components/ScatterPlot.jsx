/* eslint-disable react/prop-types */
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from 'recharts';

const ScatterPlot = ({ data }) => {
  const { x_range, y_range, positions } = data;

  const customTooltip = ({ payload }) => {
    if (payload.length === 0) return null;
    const point = payload[0].payload;
    return (
      <div style={{ background: '#fff', padding: '5px', border: '1px solid #ccc' }}>
        X: {point.x} - Y: {point.y}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name={`${data.X_left} to ${data.X_right}`}
            domain={x_range}
            tickCount={x_range.length}
          >
            <Label value="X Axis" position="bottom" style={{ textAnchor: 'middle' }} offset={0} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            name={`${data.Y_bottom} to ${data.Y_top}`}
            domain={y_range}
            tickCount={y_range.length}
          >
            <Label
              value="Y Axis"
              position="left"
              angle={-90}
              style={{ textAnchor: 'middle' }}
              offset={0}
            />
          </YAxis>
          <Scatter data={positions} fill={data.marker_color} />
          <line
            x1={x_range[0]}
            y1={0}
            x2={x_range[x_range.length - 1]}
            y2={0}
            stroke="#000"
            strokeWidth={2}
          />
          <line
            x1={0}
            y1={y_range[0]}
            x2={0}
            y2={y_range[y_range.length - 1]}
            stroke="#000"
            strokeWidth={2}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
