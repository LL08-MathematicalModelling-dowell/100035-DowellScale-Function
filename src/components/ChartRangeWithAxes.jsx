// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const ChartWithAxisRanges = ({ xAxisRange, yAxisRange }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const svg = d3.select(chartRef.current);
//     const width = 400;
//     const height = 400;
//     const margin = { top: 20, right: 20, bottom: 40, left: 40 };
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;

//     // Create an SVG group for the chart
//     const chart = svg
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);

//     // Create scales for x and y
//     const xScale = d3.scaleLinear().domain(xAxisRange).range([0, innerWidth]);
//     const yScale = d3.scaleLinear().domain(yAxisRange).range([innerHeight, 0]);

//     // Add x-axis
//     chart
//       .append('g')
//       .attr('transform', `translate(0, ${innerHeight})`)
//       .call(d3.axisBottom(xScale))
//       .selectAll('text')
//       .attr('dy', '1em');

//     // Add y-axis
//     chart.append('g').call(d3.axisLeft(yScale));

//     // Display x-axis range
//     chart
//       .append('text')
//       .attr('x', innerWidth / 2)
//       .attr('y', innerHeight + 30)
//       .text(`X Range: [${xAxisRange[0]}, ${xAxisRange[1]}]`)
//       .attr('text-anchor', 'middle')
//       .attr('font-weight', 'bold');

//     // Display y-axis range
//     chart
//       .append('text')
//       .attr('x', -innerHeight / 2)
//       .attr('y', -30)
//       .attr('transform', 'rotate(-90)')
//       .text(`Y Range: [${yAxisRange[0]}, ${yAxisRange[1]}]`)
//       .attr('text-anchor', 'middle')
//       .attr('font-weight', 'bold');
//   }, [xAxisRange, yAxisRange]);

//   return <svg ref={chartRef} width={400} height={400} style={{ border: '1px solid black' }}></svg>;
// };

// export default ChartWithAxisRanges;
