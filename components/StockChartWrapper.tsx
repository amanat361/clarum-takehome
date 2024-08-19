"use client";

import React, { useState } from "react";
import { TimeSeriesData } from "@/types/stocks";
import StockChart from "@/components/StockChart";
import { Button } from "./primitives/button";

interface StockChartWrapperProps {
  timeSeries: { [date: string]: TimeSeriesData };
}

const StockChartWrapper: React.FC<StockChartWrapperProps> = ({
  timeSeries,
}) => {
  const [numPoints, setNumPoints] = useState(100); // Default to 100 data points

  // Format and filter data based on the number of data points
  const formattedData = Object.keys(timeSeries)
    .slice(0, numPoints)
    .map((date) => ({
      date,
      low: parseFloat(timeSeries[date]["3. low"]),
      high: parseFloat(timeSeries[date]["2. high"]),
      open: parseFloat(timeSeries[date]["1. open"]), // Optional if you want to pass this
      close: parseFloat(timeSeries[date]["4. close"]), // Optional if you want to pass this
      volume: parseFloat(timeSeries[date]["5. volume"]), // Optional if you want to pass this
    }));

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <div className="flex space-x-2 w-full">
        {[10, 50, 100, 500, 1000].map((points) => (
          <Button
            className="flex-1"
            outline
            key={points}
            onClick={() => setNumPoints(points)}
          >
            Last {points} points
          </Button>
        ))}
      </div>
      <StockChart data={formattedData} />
    </div>
  );
};

export default StockChartWrapper;
