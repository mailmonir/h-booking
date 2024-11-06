"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationsProps {
  totalPages: number;
  currentPage: number;
}

const Paginations = ({ totalPages, currentPage }: PaginationsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const range = [];
  const delta = 2;

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    range.unshift("...");
  }
  if (currentPage + delta < totalPages - 1) {
    range.push("...");
  }

  range.unshift(1);
  if (totalPages !== 1) range.push(totalPages);

  const createPageURL = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          className={
            currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
          }
        >
          <PaginationPrevious href={createPageURL(currentPage - 1)} />
        </PaginationItem>
        {range.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis key={index} />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                className={cn(page === currentPage && "font-bold")}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem
          className={
            currentPage >= totalPages
              ? "pointer-events-none opacity-50"
              : undefined
          }
        >
          <PaginationNext href={createPageURL(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginations;
