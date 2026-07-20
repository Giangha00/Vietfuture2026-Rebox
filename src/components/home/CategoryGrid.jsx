import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";
import { fetchBackendCategories } from "@/lib/rebox-backend-api";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`${ROUTES.products}?category=${category.label}`}
      className="group flex flex-col items-center gap-3 rounded-2xl bg-rb-pink px-4 py-6 text-center transition hover:-translate-y-1 hover:bg-rb-red-soft hover:shadow-md"
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-white text-rb-ink shadow-sm transition group-hover:text-rb-red">
        <Icon name={category.icon} className="size-6" />
      </span>
      <span className="text-sm font-semibold text-rb-ink">{category.label}</span>
    </Link>
  );
}

export async function CategoryGrid() {
  const backendCategories = await fetchBackendCategories();
  const categories = backendCategories.map((c) => ({
    id: c._id || c.id,
    label: c.name,
    icon: c.icon || "more",
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-rb-ink sm:text-3xl">
          Browse Supermarket Shelves
        </h2>
        <Link
          href={ROUTES.products}
          className="text-sm font-semibold text-rb-red hover:underline"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}
