import { Heading } from "../primitives/heading";
import { Strong } from "../primitives/text";
import { Skeleton } from "../ui/skeleton";

export default function StockMetadataLoading({symbol}: {symbol: string}) {
  return (
    <div className="w-full">
      <Heading level={2}>Loading stock data for ${symbol}</Heading>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div>
          <Strong>Information:</Strong>
          <Skeleton className="w-full h-4 mt-2" />
        </div>
        <div>
          <Strong>Symbol:</Strong>
          <Skeleton className="w-full h-4 mt-2" />
        </div>
        <div>
          <Strong>Last Refreshed:</Strong>
          <Skeleton className="w-full h-4 mt-2" />
        </div>
        <div>
          <Strong>Output Size:</Strong>
          <Skeleton className="w-full h-4 mt-2" />
        </div>
        <div>
          <Strong>Time Zone:</Strong>
          <Skeleton className="w-full h-4 mt-2" />
        </div>
      </div>
    </div>
  );
}