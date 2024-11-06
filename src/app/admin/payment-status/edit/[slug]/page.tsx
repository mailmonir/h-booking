import EditPaymentStatusForm from "./edit-payment-status-form";
import { getPaymentStatus } from "@/app/admin/payment-status/actions";

export default async function EditPaymentStatusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const paymentStatus = await getPaymentStatus(slug);

  return (
    <main>
      <div className="max-w-2xl mx-auto">
        {paymentStatus ? (
          <EditPaymentStatusForm paymentStatus={paymentStatus} />
        ) : (
          <p className="mx-auto text-center">No PaymentStatus to edit</p>
        )}
      </div>
    </main>
  );
}
