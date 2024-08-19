import StockPageLoading from "@/components/loading/StockPageLoading";
import { Suspense } from "react";
import { symbols } from "@/lib/symbols";
import StockPageInner from "./StockPage";

export default async function StockPage({
  params,
}: {
  params: { symbol: string };
}) {
  return (
    <Suspense fallback={<StockPageLoading symbol={params.symbol.toUpperCase()} />}>
      <StockPageInner symbol={params.symbol.toUpperCase()} />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return symbols.map((symbol) => ({
    symbol,
  }));
}
