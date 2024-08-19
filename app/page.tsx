import { Heading } from "@/components/primitives/heading";
import StockViewer from "@/components/StockViewer";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Home() {
  const SYMBOLS = [
    "AAPL",
    "MSFT",
    "AMZN",
    "GOOG",
    "TSLA",
    "META",
    "NFLX",
    "GOOG",
    "INTC",
    "AMC",
    "TWTR",
    "IBM",
    "TMUS",
    "SBUX",
    "BABA",
    "DIS",
    "T",
    "AMD",
    "RACE",
    "WORK"
  ];

  return (
    <div className="w-full flex flex-col gap-8 p-8">
      <main className="grid grid-cols-4 gap-4 w-full">
        {SYMBOLS.map((symbol) => (
          <Suspense
            key={symbol}
            fallback={<Skeleton className="w-full h-[120px]" />}
          >
            <StockViewer key={symbol} symbol={symbol} />
          </Suspense>
        ))}
      </main>
    </div>
  );
}
