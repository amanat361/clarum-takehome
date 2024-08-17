import { StockData } from "@/types/stocks";
import StockMetadata from "@/components/StockMetadata";
import StockChartWrapper from "@/components/StockChartWrapper";
import { fetchStockData } from "./actions";

export default async function Home() {
  const SYMBOLS = ["AAPL", "MSFT", "AMZN", "GOOG", "TSLA", "META", "NFLX", "GOOG", "INTC", "AMC", "TWTR", "IBM"];
  
  const allStockData = await Promise.all(SYMBOLS.map(fetchStockData));
  const stockData = allStockData[2];

  const metaData = stockData["Meta Data"];
  const timeSeries = stockData["Time Series (Daily)"];

  return (
    <main className="flex flex-col items-center h-screen justify-center gap-8 max-w-4xl m-auto">
      <StockMetadata metaData={metaData} />
      <StockChartWrapper timeSeries={timeSeries} />
    </main>
  );
}
