import * as d3 from "d3";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import { Text } from "./primitives/text";
import { useEffect, useState } from "react";

interface ChartData {
  date: string;
  low: number;
  high: number;
  open: number;
  close: number;
  volume: number;
}

const keys = ["low", "open", "close", "high"] as const;

export default function Chart({ data }: { data: ChartData[] }) {
  const [ref, bounds] = useMeasure();
  const [reducedData, setReducedData] = useState<ChartData[]>([]);

  // Function to reduce the data by averaging every N points
  const reduceData = (data: ChartData[], targetLength: number) => {
    const reduceFactor = Math.ceil(data.length / targetLength);
    const reducedData: ChartData[] = [];

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
    setReducedData(reduceData(data, 100));
  }, [data]);

  const handleDeleteDataPoint = (dataPoint: ChartData) => {
    if (reducedData.length <= 1) return;
    setReducedData(reducedData.filter((d) => d.date !== dataPoint.date));
  };

  return (
    <>
      <div className="relative h-96 w-full" ref={ref}>
        {bounds.width > 0 && (
          <ChartInner
            deleteDataPoint={handleDeleteDataPoint}
            data={reducedData}
            width={bounds.width}
            height={bounds.height}
            key={data.length}
          />
        )}
      </div>
    </>
  );
}

interface ChartInnerProps {
  deleteDataPoint: (dataPoint: ChartData) => void;
  data: ChartData[];
  width: number;
  height: number;
}

function ChartInner({ deleteDataPoint, data, width, height }: ChartInnerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  let margin = {
    top: 10,
    right: 10,
    bottom: 30,
    left: 24,
  };

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.date))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, (d3.max(data, (d) => d.high) || 0) + margin.bottom])
    .range([height - margin.bottom, margin.top]);

  const colors = ["#22d3ee", "#0891b2", "#155e75", "#083344"];

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

  const series = stackGenerator(data as Iterable<{ [key: string]: number }>);

  const numXTicks = Math.max(1, Math.floor(data.length / 5));
  const visibleXTicks = xScale.domain().filter((d, i) => !(i % numXTicks));

  return (
    <>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Y axis */}
        {yScale.ticks(6).map((max) => (
          <g
            transform={`translate(0,${yScale(max)})`}
            className="text-gray-800 dark:text-gray-400"
            key={max}
          >
            <line
              x1={margin.left + 5}
              x2={width - margin.right}
              stroke="currentColor"
              strokeDasharray="1,3"
            />
            <text
              alignmentBaseline="middle"
              className="text-[10px]"
              fill="currentColor"
            >
              {max}
            </text>
          </g>
        ))}

        {/* X axis */}
        <g
          transform={`translate(0,${height})`}
          className="text-gray-800 dark:text-gray-400"
        >
          {visibleXTicks.map((tick, i) => (
            <text
              x={xScale(tick) || 0}
              key={i}
              alignmentBaseline="after-edge"
              className="text-[10px]"
              fill="currentColor"
            >
              {new Date(tick).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </text>
          ))}
        </g>

        {/* Stacked bars */}
        {series.map((singleSeries, j) => (
          <motion.g key={j}>
            {singleSeries.map((d, i) => (
              <motion.rect
                key={i}
                initial={{ height: 0 }}
                animate={{
                  height: Math.max(
                    yScale(d[0]) -
                      yScale(d[1]) +
                      (selectedIndex === i ? 15 : 0),
                    0
                  ),
                  translateY: selectedIndex === i ? -15 * (j + 1) : 0,
                }}
                y={yScale(d[1])}
                height={Math.max(yScale(d[0]) - yScale(d[1]), 0)}
                x={xScale(data[i].date) || 0}
                width={xScale.bandwidth()}
                transition={{
                  duration: (selectedIndex !== null && selectedIndex !== i) ? 0 : 0.2,
                  delay: selectedIndex !== null ? 0 : j * 0.3 + i * 0.01,
                  type: "tween",
                }}
                fill={colors[j]}
                stroke={selectedIndex === i ? "currentColor" : colors[j]}
                className="text-black dark:text-white cursor-pointer"
                onHoverStart={() => setSelectedIndex(i)}
                onClick={() => deleteDataPoint(data[i])}
              />
            ))}
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-2 w-full justify-between mt-6">
        <div className="w-full flex gap-4 items-center">
          {selectedIndex === null ? (
            <Text>Selected Date: N/A</Text>
          ) : (
            <Text>
              Selected Date:{" "}
              {new Date(data[selectedIndex].date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          )}
          <Text>
            Open:{" "}
            {selectedIndex === null
              ? "N/A"
              : data[selectedIndex].open.toFixed(2)}
          </Text>
          <Text>
            High:{" "}
            {selectedIndex === null
              ? "N/A"
              : data[selectedIndex].high.toFixed(2)}
          </Text>
          <Text>
            Low:{" "}
            {selectedIndex === null
              ? "N/A"
              : data[selectedIndex].low.toFixed(2)}
          </Text>
          <Text>
            Close:{" "}
            {selectedIndex === null
              ? "N/A"
              : data[selectedIndex].close.toFixed(2)}
          </Text>
        </div>
        {keys.map((key, index) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-4 h-4"
              style={{ backgroundColor: colors[index] }}
            ></div>
            <Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          </div>
        ))}
      </div>
    </>
  );
}
