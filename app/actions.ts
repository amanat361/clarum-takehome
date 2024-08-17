"use server";

import { StockData } from "@/types/stocks";

const API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;
const SYMBOL_URL = (symbol: string) => `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`;

export async function fetchStockData(symbol: string): Promise<StockData> {
  // simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const url = SYMBOL_URL(symbol);
  const response = await fetch(url);
  const data: StockData = await response.json();
  return data;
}
