import { Button } from "../primitives/button";
import { Skeleton } from "../ui/skeleton";
import StockMetadataLoading from "./StockMetadataLoading";

export default function StockPageLoading({symbol}: {symbol: string}) {
  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center">
      <StockMetadataLoading symbol={symbol} />
      <div className="grid grid-cols-5 gap-4 w-full">
        <Button disabled outline>Loading...</Button>
        <Button disabled outline>Loading...</Button>
        <Button disabled outline>Loading...</Button>
        <Button disabled outline>Loading...</Button>
        <Button disabled outline>Loading...</Button>
      </div>
      <Skeleton className="w-full h-[300px]" />
    </div>
  );
}