import { fetchStockData } from "@/app/actions";
import { Text } from "@/components/primitives/text";
import { Button } from "@/components/primitives/button";
import StockChartWrapper from "./StockPageChartWrapper";
import StockMetadata from "@/components/StockMetadata";
import { Heading } from "@/components/primitives/heading";

export default async function StockPageInner({ symbol }: { symbol: string }) {
  const stockData = await fetchStockData(symbol);

  const errorMessage = stockData["Error Message"];
  if (errorMessage) {
    return <Text>{errorMessage}</Text>;
  }

  const metaData = stockData["Meta Data"];
  const timeSeries = stockData["Time Series (Daily)"];

  if (!metaData || !timeSeries) {
    return <Heading level={2}>Could not load ${symbol}. The API has likely reached its daily limit.</Heading>;
  }

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center">
      <StockMetadata metaData={metaData} />
      <StockChartWrapper timeSeries={timeSeries} />
    </div>
  );
}
