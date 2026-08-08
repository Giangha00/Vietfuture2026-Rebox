import { Suspense } from "react";
import OrderDetailContent from "@/components/order/OrderDetailContent";

export const metadata = {
  title: "Order detail",
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-rb-muted">
          Loading order...
        </div>
      }
    >
      <OrderDetailContent orderId={id} />
    </Suspense>
  );
}
