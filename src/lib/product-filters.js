export const FILTER_CATEGORIES = ["Tech", "Fashion", "Photography"];

export const FILTER_CONDITIONS = ["Like New", "Good", "Fair"];

export const STATION_FILTERS = {
  all: "All Locations",
  q1: "District 1",
  td: "Thảo Điền",
  q7: "District 7",
};

const STATION_MATCHERS = {
  q1: /district 1|quận 1|q1|nguyễn huệ|nguyen hue|le loi|central station alpha/i,
  td: /thảo điền|thao dien|q2/i,
  q7: /quận 7|district 7|q7|phú mỹ hưng|phu my hung/i,
};

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function searchParamsToObject(searchParams) {
  if (!searchParams) return {};

  if (typeof searchParams.entries === "function") {
    const result = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === "filter") {
        result.filter = searchParams.getAll("filter");
      } else if (!(key in result)) {
        result[key] = value;
      }
    }
    if (!result.filter) result.filter = searchParams.getAll("filter");
    return result;
  }

  return { ...searchParams };
}

export function parseProductSearchParams(searchParams = {}) {
  const categories = searchParams.category
    ? String(searchParams.category).split(",").filter(Boolean)
    : [];

  return {
    q: searchParams.q ? String(searchParams.q) : "",
    categories,
    condition: searchParams.condition ? String(searchParams.condition) : "",
    minPrice: searchParams.minPrice ? String(searchParams.minPrice) : "",
    maxPrice: searchParams.maxPrice ? String(searchParams.maxPrice) : "",
    station: searchParams.station ? String(searchParams.station) : "all",
    filters: toArray(searchParams.filter),
    sort: searchParams.sort ? String(searchParams.sort) : "relevance",
    page: Math.max(1, Number(searchParams.page) || 1),
  };
}

export function filterProducts(products, searchParams = {}) {
  const params = parseProductSearchParams(searchParams);
  let result = [...products];

  if (params.q) {
    const query = params.q.toLowerCase();
    result = result.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query),
    );
  }

  if (params.categories.length > 0) {
    result = result.filter((product) => params.categories.includes(product.category));
  }

  if (params.condition) {
    result = result.filter((product) => product.condition === params.condition);
  }

  const minPrice = Number(params.minPrice);
  const maxPrice = Number(params.maxPrice);

  if (!Number.isNaN(minPrice) && params.minPrice !== "") {
    result = result.filter((product) => product.price >= minPrice);
  }

  if (!Number.isNaN(maxPrice) && params.maxPrice !== "") {
    result = result.filter((product) => product.price <= maxPrice);
  }

  if (params.station && params.station !== "all") {
    const matcher = STATION_MATCHERS[params.station];
    if (matcher) {
      result = result.filter(
        (product) => matcher.test(product.location) || matcher.test(product.station),
      );
    }
  }

  if (params.filters.includes("escrow")) {
    result = result.filter((product) => product.premiumEscrow);
  }

  if (params.filters.includes("budget")) {
    result = result.filter((product) => product.price < 200);
  }

  switch (params.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) => Number(b.id) - Number(a.id));
      break;
    default:
      break;
  }

  return result;
}

export function buildProductsQuery(currentParams, updates = {}) {
  const params = new URLSearchParams();

  const merged = {
    ...parseProductSearchParams(currentParams),
    ...updates,
  };

  if (merged.q) params.set("q", merged.q);
  if (merged.categories.length > 0) params.set("category", merged.categories.join(","));
  if (merged.condition) params.set("condition", merged.condition);
  if (merged.minPrice) params.set("minPrice", merged.minPrice);
  if (merged.maxPrice) params.set("maxPrice", merged.maxPrice);
  if (merged.station && merged.station !== "all") params.set("station", merged.station);
  merged.filters.forEach((filter) => params.append("filter", filter));
  if (merged.sort && merged.sort !== "relevance") params.set("sort", merged.sort);
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));

  return params.toString();
}
