import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";
import { fetchBackendCategories } from "@/lib/rebox-backend-api";

const FALLBACK = [
  { id: "keyboards", label: "Keyboards", icon: "keyboard", slug: "keyboards" },
  { id: "mice", label: "Mice", icon: "mouse", slug: "mice" },
  { id: "monitors", label: "Monitors", icon: "monitor", slug: "monitors" },
];

function isMoreCategory(category) {
  const slug = String(category.slug || "").toLowerCase();
  const name = String(category.name || category.label || "").toLowerCase();
  return slug === "more" || name === "more";
}

export function mapCategoryForDisplay(category) {
  return {
    id: category._id || category.id || category.slug || category.name,
    label: category.name || category.label,
    icon: category.icon || "more",
    slug: category.slug || "",
  };
}

/** Categories shown on home + products filters (excludes the catch-all "More"). */
export function getBrowsableCategories(backendCategories = []) {
  const source =
    backendCategories.length > 0 ? backendCategories : FALLBACK;
  return source.filter((c) => !isMoreCategory(c)).map(mapCategoryForDisplay);
}

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`${ROUTES.products}?category=${encodeURIComponent(category.label)}`}
      className="group flex flex-col items-center gap-3 text-center"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-rb-green-soft text-rb-green transition group-hover:scale-105 group-hover:bg-rb-mint sm:size-20">
        <Icon name={category.icon} className="size-7 sm:size-8" />
      </span>
      <span className="text-sm font-medium text-rb-ink">{category.label}</span>
    </Link>
  );
}

export async function CategoryGrid() {
  const backendCategories = await fetchBackendCategories().catch(() => []);
  const categories = getBrowsableCategories(backendCategories);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-rb-ink sm:text-3xl">
          Explore categories
        </h2>
        <Link
          href={ROUTES.products}
          className="text-sm font-semibold text-rb-green hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-3 gap-6 sm:gap-10">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}
