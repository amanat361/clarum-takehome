import { Heading } from "@/components/primitives/heading";
import { Text } from "@/components/primitives/text";
import StockViewer from "@/components/StockViewer";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { symbols } from "@/lib/symbols";
import { Button } from "@/components/primitives/button";

export default async function Home() {


  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between items-center w-full gap-4 border-b border-zinc-950/10 pb-4 dark:border-white/10">
        <Heading level={2}>Hey there!</Heading>
        <Text>Made with ❤️ by Sam for Clarum</Text>
      </div>
      <main className="grid grid-cols-5 gap-4 w-full">
        {symbols.map((symbol) => (
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
