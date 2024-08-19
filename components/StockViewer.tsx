import { fetchStockData } from "@/app/actions";
import { Text } from "./primitives/text";
import StockCardWithDialog from "./StockCardWithDialog";

export default async function StockViewer({ symbol }: { symbol: string }) {
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

  return <StockCardWithDialog metaData={metaData} timeSeries={timeSeries} />;
}
