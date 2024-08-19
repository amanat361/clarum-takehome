import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Badge } from "./primitives/badge";

interface FormattedStockData {
  date: string;
  low: number;
  high: number;
  open: number;
  close: number;
  volume: number;
}

interface StockChartProps {
  data: FormattedStockData[];
}

const keys = ["low", "open", "close", "high"];
  const height = 500;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDarkMode = useRef(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (!data || !svgRef.current) return;
    if (!svgRef.current.parentElement) return;

    const width = svgRef.current.parentElement.clientWidth || 928;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const maxStackHeight = (d3.max(data, (d) => d.high) || 0) + marginBottom;

    // Prepare the scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, maxStackHeight]) // Adjust domain to the max stack height
      .range([height - marginBottom, marginTop]);

    // Color scheme depending on dark mode
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#22d3ee", "#0891b2", "#155e75", "#083344"]);

    // Create stack generator
    const stackGenerator = d3
      .stack()
      .keys(keys)
      .value((d, key) => {
        switch (key) {
          case "low":
            return d.low;
          case "open":
            return d.open - d.low;
          case "close":
            return d.close - d.open;
          case "high":
            return d.high - d.close;
          default:
            return 0;
        }
      });

    // Stack the data
    const series = stackGenerator(data as Iterable<{ [key: string]: number }>);

    // Append the y-axis grid lines first (so they are behind the bars)
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      //@ts-ignore
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width + marginLeft + marginRight) // Extend ticks across the chart for grid lines
          //@ts-ignore
          .tickFormat("")
      )
      .call((g) => g.select(".domain").remove()) // Ensure no top axis line is shown
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "#aaa").attr("opacity", 0.5)
      ); // Soften the grid lines

    // Append the x-axis grid lines aligned with the visible ticks
    const numTicks = Math.max(1, Math.floor(data.length / 10));
    const visibleTicks = x.domain().filter((d, i) => !(i % numTicks));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      //@ts-ignore
      .call(
        d3
          .axisBottom(x)
          .tickValues(visibleTicks)
          .tickSize(-height + marginTop + marginBottom)
          //@ts-ignore
          .tickFormat("")
      )
      .call((g) => g.select(".domain").remove()) // Remove the bottom border of the x-axis
      .call(
        (g) =>
          g
            .selectAll(".tick line")
            .attr("stroke", "#aaa")
            .attr("opacity", 0.5)
            .attr("transform", `translate(-${x.bandwidth() / 2}, 0)`) // Shift the lines to the left by half the bar width
      );


    // Now append the bars, which will be on top of the grid lines
    const layer = svg
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", (d) => color(d.key) as string);

    const maxDelay = 2000; // Max total delay for the entire wave effect
    const delayPerBar = Math.min(maxDelay / data.length, 50); // Scale delay by data length

    layer
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d, i) => x(data[i].date) || 0)
      .attr("y", height - marginBottom) // Start at the bottom
      .attr("height", 0) // Start with height 0
      .attr("width", x.bandwidth())
      .transition()
      .duration(800)
      .delay((d, i) => i * delayPerBar) // Stagger transitions by calculated delay
      .ease(d3.easeCubicInOut)
      .attr("y", (d) => y(d[1])) // Transition to final y position
      .attr("height", (d) => y(d[0]) - y(d[1])); // Transition to final height

    // Add the x-axis labels on top of the bars
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickValues(visibleTicks))
      .call((g) => g.select(".domain").remove()); // Remove the bottom border of the x-axis

    // Add the y-axis with a left axis line (remove the right line if added)
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call((g) =>
        g
          .select(".domain")
          .attr("stroke", isDarkMode.current ? "#fff" : "black")
      ); // Ensure the left axis line color
  }, [data]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      isDarkMode.current = e.matches;
      // Re-run the effect to update the chart
      if (svgRef.current) {
        svgRef.current.innerHTML = "";
        const x = d3
          .scaleBand()
          .domain(data.map((d) => d.date))
          .range([marginLeft, svgRef.current.clientWidth - marginRight])
          .padding(0.1);
        // Trigger re-rendering
        //@ts-ignore
        d3.select(svgRef.current).call(d3.axisBottom(x).tickFormat(""));
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [data]);


  const renderLegend = () => {
    const colors = isDarkMode.current
      ? ["#22d3ee", "#0891b2", "#155e75", "#083344"] // Colors for dark mode
      : ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]; // Colors for light mode

    return keys.map((key, index) => (
      <div key={key} className="flex items-center gap-2">
        <div
          className="w-4 h-4"
          style={{ backgroundColor: colors[index] }}
        ></div>
        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
      </div>
    ));
  };

  return (
    <div className="w-full p-4 bg-white text-black dark:bg-zinc-900 dark:text-white">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Stock Price Chart</h2>
        <div className="flex gap-4">{renderLegend()}</div>
      </div>
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
};

export default StockChart;
