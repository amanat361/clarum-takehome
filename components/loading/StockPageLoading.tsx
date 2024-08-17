import { Skeleton } from "../ui/skeleton";

export default function StockPageLoading() {
  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <Skeleton className="w-[896px] h-[300px]" />
      <Skeleton className="w-[896px] h-[300px]" />
    </div>
  );
}