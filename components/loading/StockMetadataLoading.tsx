import { Heading } from "../primitives/heading";

export default function StockMetadataLoading({symbol}: {symbol: string}) {
  return (
    <div className="flex justify-between items-center w-full gap-4 border-b border-zinc-950/10 pb-4 dark:border-white/10">
      <Heading level={2}>Loading stock data for ${symbol}</Heading>
    </div>
  );
}