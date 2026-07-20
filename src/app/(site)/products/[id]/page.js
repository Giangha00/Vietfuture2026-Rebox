import ImageGallery from "@/components/product-detail/ImageGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import InspectionReport from "@/components/product-detail/InspectionReport";
import { notFound } from "next/navigation";
import { fetchBackendProductById } from "@/lib/rebox-backend-api";
import { normalizeBackendProduct } from "@/lib/normalize-backend";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const raw = await fetchBackendProductById(id);
    const product = normalizeBackendProduct(raw);
    if (!product) return {};
    return { title: product.title, description: product.description };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  let rawProduct = null;
  try {
    rawProduct = await fetchBackendProductById(id);
  } catch {
    return notFound();
  }

  const product = normalizeBackendProduct(rawProduct);
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} title={product.title} />
        <ProductInfo product={product} />
      </div>
      <InspectionReport product={product} />
    </div>
  );
}
