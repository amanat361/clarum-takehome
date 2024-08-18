import React, { useEffect, useRef, useState } from "react";

interface StockData {
  date: string;
  close: number;
}

interface ParsedStockData {
  date: Date;
  close: number;
}

interface StockChartProps {
  data: StockData[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const [width, setWidth] = useState(1000); // Initial width of the chart
  const height = 400; // Total height of the SVG
  const margin = { top: 20, right: 30, bottom: 50, left: 50 }; // Margins for the chart area
  const chartRef = useRef<SVGSVGElement | null>(null);

  // Update width dynamically based on the size of the parent element
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setWidth(chartRef.current.clientWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Parse the date format
  const parseDate = (dateString: string) => new Date(dateString);
  const parsedData: ParsedStockData[] = data.map((d) => ({
    date: parseDate(d.date),
    close: d.close,
  }));

  // Get min and max dates for X-axis
  const minDate = Math.min(...parsedData.map((d) => d.date.getTime()));
  const maxDate = Math.max(...parsedData.map((d) => d.date.getTime()));

  // Get max closing price for Y-axis
  const maxClose = Math.max(...parsedData.map((d) => d.close));

  // X scale
  const xScale = (date: Date) => {
    const normalized = (date.getTime() - minDate) / (maxDate - minDate);
    return margin.left + normalized * chartWidth;
  };

  // Y scale
  const yScale = (close: number) => {
    const normalized = close / maxClose;
    return margin.top + (1 - normalized) * chartHeight;
  };

  // Generate ticks for X-axis (6 ticks)
  const xTicks = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(minDate + ((maxDate - minDate) / 5) * i);
    return {
      value: date,
      xOffset: xScale(date) + chartWidth / parsedData.length / 2, // Shift ticks right to match bars
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });

  // Generate ticks for Y-axis (6 ticks)
  const yTicks = Array.from({ length: 6 }, (_, i) => {
    const value = (maxClose / 5) * i;
    return {
      value,
      yOffset: yScale(value),
      label: value.toFixed(2),
    };
  });

  return (
    <svg ref={chartRef} width="100%" height={height}>
      {/* X-axis */}
      <line
        x1={margin.left}
        y1={height - margin.bottom}
        x2={width}
        y2={height - margin.bottom}
        stroke="currentColor"
        className="text-black dark:text-white fill-current"
      />
      {/* Y-axis */}
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={height - margin.bottom}
        stroke="currentColor"
        className="text-black dark:text-white fill-current"
      />

      {/* X-axis ticks and labels */}
      {xTicks.map((tick, index) => (
        <g
          key={index}
          transform={`translate(${tick.xOffset}, ${height - margin.bottom})`}
        >
          <line
            y2="6"
            stroke="currentColor"
            className="text-black dark:text-white fill-current"
          />
          <text
            y="20"
            textAnchor="middle"
            className="text-black dark:text-white fill-current"
            fontSize="10"
          >
            {tick.label}
          </text>
        </g>
      ))}

      {/* Y-axis ticks and labels */}
      {yTicks.map((tick, index) => (
        <g key={index} transform={`translate(${margin.left}, ${tick.yOffset})`}>
          <line
            x1="-6"
            stroke="currentColor"
            className="text-black dark:text-white fill-current"
          />
          <text
            x="-10"
            dy="0.32em"
            textAnchor="end"
            className="text-black dark:text-white fill-current"
            fontSize="10"
          >
            {tick.label}
          </text>
        </g>
      ))}

      {/* Render bars */}
      <g transform={`translate(0, ${margin.top})`}>
        {parsedData.map((point, index) => {
          const barWidth = chartWidth / parsedData.length;
          const x = xScale(point.date);
          const y = yScale(point.close);
          const barHeight = chartHeight - (y - margin.top);

          // Determine the color based on the previous bar's close value
          const prevClose =
            index > 0 ? parsedData[index - 1].close : point.close;
          const color = point.close < prevClose ? "#c23650" : "#4bbf71";

          return (
            <rect
              key={index}
              x={x + 2} // Shift bars right
              y={y - 22} // Shift bars up
              width={barWidth - 2} // Space between bars
              height={barHeight}
              fill={color}
              className="hover:fill-darkblue transition duration-200 ease-in-out"
            />
          );
        })}
      </g>
    </svg>
  );
};

export default StockChart;
