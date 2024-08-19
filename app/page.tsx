import { Heading } from "@/components/primitives/heading";
import { Text } from "@/components/primitives/text";
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
    "WORK",
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between items-center w-full gap-4 border-b border-zinc-950/10 pb-4 dark:border-white/10">
        <Heading level={2}>Hey there!</Heading>
        <Text>Made with ❤️ by Sam for Clarum</Text>
      </div>
      <main className="grid grid-cols-5 gap-4 w-full">
        {SYMBOLS.map((symbol) => (
          <Suspense
            key={symbol}
            fallback={<Skeleton className="w-full h-[40px]" />}
          >
            <StockViewer key={symbol} symbol={symbol} />
          </Suspense>
        ))}
      </main>
    </div>
  );
}
