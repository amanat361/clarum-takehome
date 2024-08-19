"use client";

import React, { useState } from "react";
import { TimeSeriesData } from "@/types/stocks";
import StockChart from "@/components/StockChart";
import { Button } from "@/components/primitives/button";
import { Heading } from "@/components/primitives/heading";

interface StockChartWrapperProps {
  timeSeries: { [date: string]: TimeSeriesData };
}

const StockChartWrapper: React.FC<StockChartWrapperProps> = ({
  timeSeries,
}) => {
  const [numPoints, setNumPoints] = useState(100);

  // Format data for the full chart
  const formattedData = Object.keys(timeSeries)
    .slice(0, numPoints)
    .map((date) => ({
      date,
      low: parseFloat(timeSeries[date]["3. low"]),
      high: parseFloat(timeSeries[date]["2. high"]),
      open: parseFloat(timeSeries[date]["1. open"]),
      close: parseFloat(timeSeries[date]["4. close"]),
      volume: parseFloat(timeSeries[date]["5. volume"]),
    }));

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <div className="flex gap-4">
        {[10, 50, 100, 500, 1000, 5000].map((points) => (
          <Button key={points} onClick={() => setNumPoints(points)} outline>
            View {`${points} data points`}
          </Button>
        ))}
      </div>
      <StockChart data={formattedData} />
    </div>
  );
};

export default StockChartWrapper;
