import { Input, InputGroup } from "./primitives/input";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { searchSymbol } from "@/app/actions";


export default function Search() {
  return (
    <form action={searchSymbol}>
      <InputGroup>
        <MagnifyingGlassIcon />
        <Input placeholder="$SYMBOL" name="symbol" />
      </InputGroup>
    </form>
  );
}
