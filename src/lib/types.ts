import { ZodIssue } from "zod";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export interface ResponseType {
  type: "error" | "success";
  message: string | ZodIssue[];
}

export type ActionResponseType = {
  type: "error" | "success";
  message: string | ZodIssue[];
};

export interface FileWithDimensions extends File {
  width: number;
  height: number;
}

export interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

export interface PaginationProps {
  srcqry: string;
  currentPage: number;
  pagesCount: number;
  itemsCount: number;
}
