import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface MiniStockChartProps {
  data: { date: string; close: number }[];
}

const MiniStockChart: React.FC<MiniStockChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 300; // Fixed width for mini chart
    const height = 80; // Fixed height for mini chart
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.close) || 0,
        d3.max(data, (d) => d.close) || 0,
      ])
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<{ date: string; close: number }>()
      .x((d) => x(d.date) || 0)
      .y((d) => y(d.close));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#1f77b4")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data]);

  return <svg ref={svgRef} />;
};

export default MiniStockChart;
