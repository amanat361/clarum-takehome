import { Avatar } from "@/components/primitives/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/primitives/dropdown";
import { symbols } from "@/lib/symbols";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

export default function StockDropdown() {
  return (
    <Dropdown>
      <DropdownButton outline>
        Symbol
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu className="min-w-64" anchor="bottom start">
        {symbols.map((symbol) => (
          <DropdownItem key={symbol} href={`/${symbol}`}>
            <DropdownLabel>{symbol}</DropdownLabel>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
