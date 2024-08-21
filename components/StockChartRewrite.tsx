import * as d3 from "d3";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import { Text } from "./primitives/text";

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

  return (
    <div className="relative h-96 w-full" ref={ref}>
      {bounds.width > 0 && (
        <ChartInner
          data={reduceData(data, 50)}
          width={bounds.width}
          height={bounds.height}
          key={data.length}
        />
      )}
    </div>
  );
}

interface ChartInnerProps {
  data: ChartData[];
  width: number;
  height: number;
}

function ChartInner({ data, width, height }: ChartInnerProps) {
  let margin = {
    top: 10,
    right: 10,
    bottom: 30,
    left: 24,
  };

  const startDay = new Date(data[0].date);
  const endDay = new Date(data[data.length - 1].date);
  const numDays = Math.ceil(
    (endDay.getTime() - startDay.getTime()) / (1000 * 3600 * 24)
  );

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

  const colorScale = d3
    .scaleOrdinal()
    .domain(keys)
    .range(["#22d3ee", "#0891b2", "#155e75", "#083344"]);

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

  console.log(series);

  const maxDelay = 2000;
  const delayPerBar = 1;

  return (
    <>
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
    >
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
      {series.map((singleSeries, j) => {
        return singleSeries.map((d, i) => (
          <motion.rect
            // initial={false}
            key={i}
            initial={{ height: 0 }}
            animate={{
              height: yScale(d[0]) - yScale(d[1]),
            }}
            y={yScale(d[1])}
            height={yScale(d[0]) - yScale(d[1])}
            x={xScale(data[i].date) || 0}
            width={xScale.bandwidth()}
            transition={{
              duration: 0.5,
              delay: i * 0.01 + j,
              type: "tween",
            }}
            fill={colors[j]}
          />
        ));
      })}
    </svg>

    {/* Legend */}
    <div className="flex items-center gap-2 w-full justify-end mt-4">
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
