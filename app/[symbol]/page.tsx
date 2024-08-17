import StockViewer from "@/components/StockPage";
import StockPageLoading from "@/components/loading/StockPageLoading";
import { Suspense } from "react";

export default async function StockPage({
  params,
}: {
  params: { symbol: string };
}) {
  return (
    <main className="max-w-4xl">
      <Suspense fallback={<StockPageLoading />}>
        <StockViewer symbol={params.symbol} />
      </Suspense>
    </main>
  );
}

export async function generateStaticParams() {
  const symbols = [
    "AAPL",
    "MSFT",
    "AMZN",
    "GOOGL",
    "TSLA",
    "FB",
    "NFLX",
    "GOOG",
    "INTC",
    "AMC",
    "TWTR",
    "IBM",
  ];

  return symbols.map((symbol) => ({
    symbol,
  }));
}
