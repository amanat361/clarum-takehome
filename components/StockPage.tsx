import { fetchStockData } from "@/app/actions";
import { Text } from "./primitives/text";
import StockMetadata from "./StockMetadata";
import StockChartWrapper from "./StockChartWrapper";

export default async function StockViewer({symbol}: {symbol: string}) {
  const stockData = await fetchStockData(symbol);

  const errorMessage = stockData["Error Message"];

  if (errorMessage) {
    return <Text>{errorMessage}</Text>;
  }
  const metaData = stockData["Meta Data"];
  const timeSeries = stockData["Time Series (Daily)"];

  if (!metaData || !timeSeries) {
    return <Text>The data is not available. {JSON.stringify(stockData)}</Text>;
  }

  return (
    <main className="flex flex-col items-center justify-center gap-8">
      <StockMetadata metaData={metaData} />
      <StockChartWrapper timeSeries={timeSeries} />
    </main>
  );
}
