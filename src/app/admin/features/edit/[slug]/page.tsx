import EditFeatureForm from "./edit-feature-form";
import { getFeature } from "@/app/admin/features/actions";

export default async function EditFeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const feature = await getFeature(slug);

  return (
    <main>
      <div className="max-w-2xl mx-auto">
        {feature ? (
          <EditFeatureForm feature={feature} />
        ) : (
          <p className="mx-auto text-center">No feature to edit</p>
        )}
      </div>
    </main>
  );
}
