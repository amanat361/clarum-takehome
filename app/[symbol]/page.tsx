import StockPageLoading from "@/components/loading/StockPageLoading";
import StockViewer from "@/components/StockPage";
import { Suspense } from "react";
import { symbols } from "@/lib/symbols";

export default async function StockPage({
  params,
}: {
  params: { symbol: string };
}) {
  return (
    <Suspense fallback={<StockPageLoading symbol={params.symbol} />}>
      <StockViewer symbol={params.symbol} />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return symbols.map((symbol) => ({
    symbol,
  }));
}
