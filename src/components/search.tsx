"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchbarProps {
  placeholder: string;
}

const Search = ({ placeholder }: SearchbarProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <form className="relative flex flex-1" action="#" method="GET">
      <Label htmlFor="search-field" className="sr-only">
        Search
      </Label>
      <SearchIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground flex-g" />
      <Input
        type="search"
        name="search"
        placeholder={placeholder}
        className="flex-1 border-0 rounded-none border-b pl-8 focus-visible:ring-0 max-w-[50%] focus:border-foreground/40"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </form>
  );
};

export default Search;
