import React from "react";
import { MetaData } from "@/types/stocks";
import { Text } from "@/components/primitives/text";
import { Heading } from "./primitives/heading";

interface StockMetadataProps {
  metaData: MetaData;
}

const StockMetadata: React.FC<StockMetadataProps> = ({ metaData }) => {
  return (
    <div className="flex justify-between items-center w-full gap-4 border-b border-zinc-950/10 pb-4 dark:border-white/10">
      <Heading level={2}>
        Viewing stock data for ${metaData["2. Symbol"]}
      </Heading>
      <Text>Last Refreshed: {metaData["3. Last Refreshed"]}</Text>
    </div>
  );
};

export default StockMetadata;
