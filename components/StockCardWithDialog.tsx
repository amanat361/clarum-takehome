"use client";

import React, { useState } from "react";
import StockChartWrapper from "./StockChartWrapper";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/primitives/dialog";
import { Button } from "./primitives/button";
import { MetaData, TimeSeriesData } from "@/types/stocks";

interface StockCardWithDialogProps {
  metaData: MetaData
  timeSeries: { [date: string]: TimeSeriesData };
}

const StockCardWithDialog: React.FC<StockCardWithDialogProps> = ({
  metaData,
  timeSeries,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const lastRefreshed = metaData["3. Last Refreshed"];
  const stockName = metaData["2. Symbol"];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>View Chart for ${stockName}</Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} size="3xl">
        <DialogTitle>Viewing detailed stock information for ${stockName}</DialogTitle> 
        <DialogDescription>
          Last Refreshed: {lastRefreshed}
        </DialogDescription>
        <DialogBody>
          <main className="flex flex-col items-center justify-center gap-8">
            <StockChartWrapper timeSeries={timeSeries} />
          </main>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StockCardWithDialog;
