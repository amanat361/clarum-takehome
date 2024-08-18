import React from "react";

interface StockChartProps {
  data: { date: string; close: number }[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const width = 1000; // Total width of the SVG
  const height = 300; // Total height of the SVG
  const padding = 0; // Padding around the SVG
  const barWidth = Math.max(1, (width - 2 * padding) / data.length); // Dynamic bar width based on the number of data points

  // Get the maximum closing price for scaling
  const maxClose = Math.max(...data.map((point) => point.close));

  // Scale function to map closing prices to SVG heights
  const scaleY = (value: number) => (value / maxClose) * (height - 2 * padding);

  return (
    <svg width={width} height={height}>
      {/* X-axis */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="black"
      />
      {/* Y-axis */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="black"
      />

      {/* Render bars */}
      {data.map((point, index) => {
        const barHeight = scaleY(point.close);
        const x = padding + index * barWidth;
        const y = height - padding - barHeight;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth - 1} // Space between bars
            height={barHeight}
            fill="steelblue"
            className="hover:fill-darkblue transition duration-200"
            // title={`Date: ${point.date}, Close: ${point.close}`}
          />
        );
      })}
    </svg>
  );
};

export default StockChart;
