import { Skeleton } from "../ui/skeleton";
import StockMetadataLoading from "./StockMetadataLoading";

export default function StockPageLoading({symbol}: {symbol: string}) {
  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <StockMetadataLoading symbol={symbol} />
      {/* <Skeleton className="w-[896px] h-[300px]" /> */}
      <Skeleton className="w-[896px] h-[300px]" />
    </div>
  );
}