import { Suspense } from "react";
import OrderPageContent from "@/components/order/OrderPageContent";

export const metadata = {
  title: "Order",
};

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-rb-muted">
          Loading checkout...
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}
