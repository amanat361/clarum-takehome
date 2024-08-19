"use server";

import { StockData, TimeSeriesData } from "@/types/stocks";
import { redirect } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;
const SYMBOL_URL = (symbol: string) => `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`;

export async function fetchStockData(symbol: string): Promise<StockData> {
  // simulate a delay
  // await new Promise((resolve) => setTimeout(resolve, 4000));
  const url = SYMBOL_URL(symbol);
  const response = await fetch(url);
  const data: StockData = await response.json();
  // const data = await generateRandomStockData({ symbol });
  return data;
}

export async function searchSymbol(formData: FormData) {
  const symbol = formData.get("symbol");
  if (symbol) {
    redirect(`/${symbol}`);
  }
}

async function generateRandomStockData({ symbol }: { symbol: string }): Promise<StockData> {
  // simulate a delay
  const delay = Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const getRandomNumber = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const generateRandomTimeSeriesData = (): TimeSeriesData => {
    const open = getRandomNumber(100, 200).toFixed(2);
    const high = (parseFloat(open) + getRandomNumber(0, 50)).toFixed(2);
    const low = (parseFloat(open) - getRandomNumber(0, 50)).toFixed(2);
    const close = getRandomNumber(parseFloat(low), parseFloat(high)).toFixed(2);
    const volume = Math.floor(getRandomNumber(1000, 10000)).toString();

    return {
      "1. open": open,
      "2. high": high,
      "3. low": low,
      "4. close": close,
      "5. volume": volume,
    };
  };

  const timeSeries: { [date: string]: TimeSeriesData } = {};
  const startDate = new Date();

  for (let i = 0; i < 2000; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() - i);
    timeSeries[formatDate(date)] = generateRandomTimeSeriesData();
  }

  const stockData: StockData = {
    "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": symbol,
      "3. Last Refreshed": formatDate(startDate),
      "4. Output Size": "Full size",
      "5. Time Zone": "US/Eastern",
    },
    "Time Series (Daily)": timeSeries,
  };

  return stockData;
}