"use client";

import React, { useState } from "react";
import { TimeSeriesData } from "@/types/stocks";
import StockChart from "@/components/StockChart";
import MiniStockChart from "@/components/MiniStockChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "./ui/card";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/primitives/dialog";
import { Button } from "./primitives/button";
import { Heading } from "./primitives/heading";
import Chart from "./StockChartRewrite";

interface StockChartWrapperProps {
  timeSeries: { [date: string]: TimeSeriesData };
}

const StockChartWrapper: React.FC<StockChartWrapperProps> = ({
  timeSeries,
}) => {
  const [numPoints, setNumPoints] = useState(100);
  const [isOpen, setIsOpen] = useState(false);

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
    })).reverse();

  // Helper function to format data for mini charts
  const formatMiniChartData = (points: number) =>
    Object.keys(timeSeries)
      .slice(0, points)
      .map((date) => ({
        date,
        close: parseFloat(timeSeries[date]["4. close"]),
      }));

  // Handle opening the dialog with the selected number of points
  const handleCardClick = (points: number) => {
    setNumPoints(points);
    setIsOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <div className="grid grid-cols-3 gap-4 w-full">
        {[10, 50, 100, 500, 1000, 5000].map((points) => (
          <Card
            key={points}
            onClick={() => handleCardClick(points)}
            className="cursor-pointer hover:bg-zinc-950/5 dark:hover:bg-white/5 transition-colors hover:border-zinc-950/15 dark:hover:border-white/15"
          >
            <CardHeader>
              <Heading>{`${points} data points`}</Heading>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <MiniStockChart data={formatMiniChartData(points)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} size="5xl">
        <DialogTitle>Stock Chart</DialogTitle>
        <DialogDescription>
          View the stock chart for the last {numPoints} data points.
        </DialogDescription>
        <DialogBody className="mb-20">
          <Chart data={formattedData} />
          {/* <StockChart data={formattedData} /> */}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StockChartWrapper;
