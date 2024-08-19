import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

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

// Define chart configuration
const keys = ["low", "open", "close", "high"];
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;
const maxBars = 100; // Maximum number of bars to display

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDarkMode = useRef(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Function to reduce the data by averaging every N points
  const reduceData = (data: FormattedStockData[], targetLength: number) => {
    const reduceFactor = Math.ceil(data.length / targetLength);
    const reducedData: FormattedStockData[] = [];

    for (let i = 0; i < data.length; i += reduceFactor) {
      const chunk = data.slice(i, i + reduceFactor);
      const averageData = chunk.reduce(
        (acc, curr) => ({
          date: curr.date, // Use the last date in the chunk
          low: acc.low + curr.low / chunk.length,
          high: acc.high + curr.high / chunk.length,
          open: acc.open + curr.open / chunk.length,
          close: acc.close + curr.close / chunk.length,
          volume: acc.volume + curr.volume / chunk.length,
        }),
        {
          date: chunk[chunk.length - 1].date,
          low: 0,
          high: 0,
          open: 0,
          close: 0,
          volume: 0,
        }
      );
      reducedData.push(averageData);
    }

    return reducedData;
  };

  useEffect(() => {
    // Ensure there is data and a valid SVG element to draw the chart
    if (!data || !svgRef.current) return;
    if (!svgRef.current.parentElement) return;

    // Calculate the width based on parent element
    const width = svgRef.current.parentElement.clientWidth || 928;

    // Check if data needs to be reduced
    const chartData = data.length > maxBars ? reduceData(data, maxBars) : data;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up the SVG canvas dimensions
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Determine maximum height for the stack
    const maxStackHeight =
      (d3.max(chartData, (d) => d.high) || 0) + marginBottom;

    // Define the scales for the chart
    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.date).reverse())
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, maxStackHeight])
      .range([height - marginBottom, marginTop]);

    // Define color scale based on mode
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#22d3ee", "#0891b2", "#155e75", "#083344"]);

    // Stack the data based on keys
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

    const series = stackGenerator(
      chartData as Iterable<{ [key: string]: number }>
    );

    // Append y-axis grid lines
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      //@ts-ignore
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width + marginLeft + marginRight)
          //@ts-ignore
          .tickFormat("")
      )
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "#aaa").attr("opacity", 0.5)
      );

    // Append x-axis grid lines
    const numTicks = Math.max(1, Math.floor(chartData.length / 5));
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
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("stroke", "#aaa")
          .attr("opacity", 0.5)
          .attr("transform", `translate(-${x.bandwidth() / 2}, 0)`)
      );

    // Append stacked bars to the chart
    const layer = svg
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", (d) => color(d.key) as string);

    const maxDelay = 2000;
    const delayPerBar = Math.min(maxDelay / chartData.length, 50);

    layer
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d, i) => x(chartData[i].date) || 0)
      .attr("y", height - marginBottom)
      .attr("height", 0)
      .attr("width", x.bandwidth())
      .transition()
      .duration(800)
      .delay((d, i) => i * delayPerBar)
      .ease(d3.easeCubicInOut)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]));

    // Append x-axis labels on top of the bars
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickValues(visibleTicks))
      .call((g) => g.select(".domain").remove());

    // Append y-axis on the left side
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call((g) =>
        g
          .select(".domain")
          .attr("stroke", isDarkMode.current ? "#fff" : "black")
      );
  }, [data]);

  useEffect(() => {
    // Listen for changes in color scheme (dark mode)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      isDarkMode.current = e.matches;
      // Re-render the chart on color scheme change
      if (svgRef.current) {
        svgRef.current.innerHTML = "";
        const x = d3
          .scaleBand()
          .domain(data.map((d) => d.date))
          .range([marginLeft, svgRef.current.clientWidth - marginRight])
          .padding(0.1);
        //@ts-ignore
        d3.select(svgRef.current).call(d3.axisBottom(x).tickFormat(""));
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [data]);

  // Render the legend
  const renderLegend = () => {
    const colors = ["#22d3ee", "#0891b2", "#155e75", "#083344"];

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
    <div className="w-full bg-white text-black dark:bg-zinc-900 dark:text-white">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold"></h2>
        <div className="flex gap-4">{renderLegend()}</div>
      </div>
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
};

export default StockChart;
