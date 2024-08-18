import React from "react";
import { MetaData } from "@/types/stocks";
import { Strong, Text } from "@/components/primitives/text";
import { Heading } from "./primitives/heading";

interface StockMetadataProps {
  metaData: MetaData;
}

const StockMetadata: React.FC<StockMetadataProps> = ({ metaData }) => {
  return (
    <div className="w-full">
      <Heading level={2}>Viewing stock data for ${metaData["2. Symbol"]}</Heading>
      {/* <div className="flex items-center gap-4">
        <Heading level={2}>Stock Metadata for</Heading>
        <StockDropdown />
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div>
          <Strong>Information:</Strong>
          <Text>{metaData["1. Information"]}</Text>
        </div>
        <div>
          <Strong>Symbol:</Strong>
          <Text>{metaData["2. Symbol"]}</Text>
        </div>
        <div>
          <Strong>Last Refreshed:</Strong>
          <Text>{metaData["3. Last Refreshed"]}</Text>
        </div>
        <div>
          <Strong>Output Size:</Strong>
          <Text>{metaData["4. Output Size"]}</Text>
        </div>
        <div>
          <Strong>Time Zone:</Strong>
          <Text>{metaData["5. Time Zone"]}</Text>
        </div>
      </div>
    </div>
  );
};

export default StockMetadata;
