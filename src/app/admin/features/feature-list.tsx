import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFilteredFeatures } from "@/app/admin/features/actions";
import Paginations from "@/components/pagination";
import ActionDropdown from "@/app/admin/action-dropdown";
import { deleteFeature } from "@/app/admin/features/actions";

interface FeatureListProps {
  srcqry: string;
  currentPage: number;
  pagesCount: number;
  itemsCount: number;
}

const FeatureList = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: FeatureListProps) => {
  const features = await getFilteredFeatures(
    srcqry,
    currentPage,
    Number(process.env.FEATURE_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    features.length / Number(process.env.FEATURE_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? features.length : itemsCount;

  if (features.length === 0) {
    return (
      <div className="text-center font-semibold text-xl">No feature found</div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader className="font-medium text-foreground">
          <TableRow className="">
            <TableHead className="">Name</TableHead>
            <TableHead className="">Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground/80">
          {features.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell className="">{feature.feature_name}</TableCell>
              <TableCell>{feature.slug}</TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  deleteItem={deleteFeature}
                  id={feature.id}
                  url={`/admin/features/edit/${feature.slug}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-muted-foreground text-xs font-normal">
          <TableRow>
            <TableCell colSpan={2}>
              {`Showing (${
                (currentPage - 1) * Number(process.env.FEATURE_PER_PAGE) + 1
              } - ${
                features.length === Number(process.env.FEATURE_PER_PAGE)
                  ? currentPage * Number(process.env.FEATURE_PER_PAGE)
                  : currentPage * Number(process.env.FEATURE_PER_PAGE) -
                    (Number(process.env.FEATURE_PER_PAGE) - features.length)
              }) of ${icount}`}
            </TableCell>
            <TableCell className="text-right min-w-28">
              Page {currentPage} of {pcount}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {pcount > 1 && (
        <div className="mt-8">
          <Paginations totalPages={pagesCount} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
};

export default FeatureList;
