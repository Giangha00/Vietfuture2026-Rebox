function conditionToGrade(condition) {
  switch (condition) {
    case "Like New":
      return "Grade A+";
    case "Good":
      return "Grade B";
    case "Fair":
      return "Grade C";
    default:
      return "Grade —";
  }
}

function stationToText(station) {
  if (!station) return "";
  const { partnerName, city, address, lockerCode } = station;
  const parts = [];
  if (partnerName) parts.push(partnerName);
  if (city) parts.push(city);
  if (lockerCode) parts.push(`Locker #${lockerCode}`);
  const head = parts.length ? parts.join(" — ") : "";
  if (address) return `${head}${head ? " (" : ""}${address}${head ? ")" : ""}`;
  return head || "";
}

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80";

export function normalizeBackendUser(user) {
  if (!user) return null;

  return {
    id: user.id || user._id,
    name: user.fullName || user.name || "User",
    email: user.email || "",
    phone: user.phone || "",
    avatar: user.avatarUrl || user.avatar || DEFAULT_AVATAR,
    role: user.role || "user",
    rating: 0,
    bio: user.bio || "Trusted marketplace member",
    stats: [
      { label: "Items Sold", value: "0", icon: "box" },
      { label: "Active Listings", value: "0", icon: "tag" },
      { label: "Trust Score", value: "0%", icon: "shield" },
    ],
    level: 1,
    levelProgress: 0,
    badges: [
      {
        title: "Verified Account",
        subtitle: "Account exists in ReBox system",
      },
    ],
  };
}

export function normalizeBackendProduct(product) {
  if (!product) return null;

  const seller = product.seller;
  const category = product.category;
  const station = product.station;

  const sellerId = seller?._id || seller?.id || "";
  const categoryName =
    typeof category === "string" ? category : category?.name || "";

  const stationText = stationToText(station);

  const conditionGrade = conditionToGrade(product.condition);
  const specs = [
    { label: "Condition", value: product.condition || "—" },
    { label: "Station", value: stationText || "—" },
    {
      label: "Description",
      value: product.description ? product.description.slice(0, 90) : "—",
    },
  ];

  return {
    id: product._id || product.id,
    title: product.title || "",
    description: product.description || "",
    price: Number(product.price || 0),
    condition: product.condition || "Good",
    images: Array.isArray(product.images) ? product.images : [],
    image: Array.isArray(product.images) ? product.images[0] : "",
    verified: Boolean(product.isVerified),
    premiumEscrow: Boolean(product.isVerified),
    autoOffer: false,
    category: categoryName,
    location: stationText,
    station: stationText,
    status:
      product.status === "reserved" || product.status === "sold"
        ? "escrow"
        : "active",
    offers: 0,
    autoReleaseHours: null,
    seller: {
      id: sellerId,
      name: seller?.fullName || seller?.name || "Seller",
      avatar: seller?.avatarUrl || seller?.avatar || "",
      rating: null,
      trades: null,
    },
    // Fields used by existing UI
    boxSize: "Standard",
    conditionGrade,
    cta: product.isVerified ? "instant" : "details",
    specs,
  };
}

