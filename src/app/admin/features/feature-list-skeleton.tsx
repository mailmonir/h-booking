import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const features = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const FeatureListSkeletorn = () => {
  return (
    <div className="flex flex-col">
      {/* <Skeleton className="w-full h-8 bg-transparent border-b flex justify-between items-center px-4">
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-12 h-2 flex gap-1 rounded-md"></Skeleton>
      </Skeleton>
      <Skeleton className="w-full h-10 bg-transparent border-b flex justify-between items-center px-4">
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-12 h-2 flex gap-1 rounded-md bg-transparent">
          <Skeleton className="w-4 h-2 rounded-full" />
          <Skeleton className="w-4 h-2 rounded-full" />
          <Skeleton className="w-4 h-2 rounded-full" />
        </Skeleton>
      </Skeleton>
      <Skeleton className="w-full h-10 bg-transparent border-b flex justify-between items-center px-4">
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-12 h-2 flex gap-1 rounded-md bg-transparent">
          <Skeleton className="w-4 h-2 rounded-full" />
          <Skeleton className="w-4 h-2 rounded-full" />
          <Skeleton className="w-4 h-2 rounded-full" />
        </Skeleton>
      </Skeleton>
      <Skeleton className="w-full h-10 bg-transparent border-b flex justify-between items-center px-4">
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-12 h-2 flex gap-1 rounded-md bg-transparent">
          <Skeleton className="w-4 h-2 rounded-full" />
          <Skeleton className="w-4 h-2 rounded-full" />
          <Skeleton className="w-4 h-2 rounded-full" />
        </Skeleton>
      </Skeleton>
      <Skeleton className="w-full h-10 bg-transparent border-b flex justify-between items-center px-4">
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-12 h-2 flex gap-1 rounded-md bg-transparent">
          <Skeleton className="w-4 h-2 rounded-full" />
          <Skeleton className="w-4 h-2 rounded-full" />
          <Skeleton className="w-4 h-2 rounded-full" />
        </Skeleton>
      </Skeleton>

      <Skeleton className="w-full h-10 flex justify-between items-center px-4">
        <Skeleton className="w-20 h-2" />
        <Skeleton className="w-20 h-2" />
      </Skeleton> */}
      <Table>
        <TableHeader className="font-medium text-foreground">
          <TableRow className="">
            <TableHead className="h-10">
              <Skeleton className="w-24 h-2" />
            </TableHead>
            <TableHead className="">
              <Skeleton className="w-24 h-2" />
            </TableHead>
            <TableHead className="text-right">
              <Skeleton className="w-16 h-2 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground/80">
          {features.map((feature) => (
            <TableRow key={feature} className="h-10">
              <TableCell className="">
                <Skeleton className="w-24 h-2" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-24 h-2" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="w-4 h-4 rounded-full ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-muted-foreground text-xs font-normal">
          <TableRow className="h-10">
            <TableCell colSpan={2}>
              <Skeleton className="w-24 h-2" />
            </TableCell>
            <TableCell className="text-right min-w-28">
              <Skeleton className="w-16 h-2 ml-auto" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default FeatureListSkeletorn;
