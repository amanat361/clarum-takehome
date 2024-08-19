"use client";

import React, { useState } from "react";
import { Text } from "./primitives/text";
import StockChartWrapper from "./StockChartWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
      <Card
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:bg-zinc-950/5 dark:hover:bg-white/5 transition-colors hover:border-zinc-950/15 dark:hover:border-white/15"
      >
        <CardHeader>
          <CardTitle>{stockName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Last Refreshed: {lastRefreshed}</Text>
          {/* Optionally, add a mini chart preview here */}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} size="3xl">
        {/* <StockMetadata metaData={metaData} /> */}
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
