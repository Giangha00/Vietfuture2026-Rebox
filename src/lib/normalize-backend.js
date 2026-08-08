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

function shipsFromText(product, seller) {
  return (
    product?.pickupLocation ||
    seller?.pickupLocation ||
    seller?.pickupCity ||
    ""
  );
}

const DEFAULT_AVATAR = "/default-avatar.svg";

export function normalizeBackendUser(user) {
  if (!user) return null;

  return {
    id: user.id || user._id,
    name: user.fullName || user.name || "User",
    email: user.email || "",
    phone: user.phone || "",
    avatar: user.avatarUrl || user.avatar || DEFAULT_AVATAR,
    role: user.role || "user",
    emailVerified: Boolean(user.emailVerified),
    deliveryAddress: user.deliveryAddress || {},
    pickupAddress: user.pickupAddress || {},
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

  const sellerId = seller?._id || seller?.id || "";
  const categoryName =
    typeof category === "string" ? category : category?.name || "";
  const categorySlug =
    typeof category === "object" && category ? category.slug || "" : "";

  const locationText = shipsFromText(product, seller);

  const conditionGrade = conditionToGrade(product.condition);
  const attributeLabels = Array.isArray(product.attributeLabels)
    ? product.attributeLabels
    : [];

  const specs = [
    { label: "Brand", value: product.brand || "—" },
    { label: "Condition", value: product.condition || "—" },
    ...attributeLabels.map((row) => ({
      label: row.label,
      value: row.value,
    })),
    { label: "Ships from", value: locationText || "—" },
  ];

  const highlightSpecs = attributeLabels
    .slice(0, 2)
    .map((row) => row.value)
    .filter(Boolean);

  return {
    id: product._id || product.id,
    title: product.title || "",
    brand: product.brand || "",
    description: product.description || "",
    price: Number(product.price || 0),
    condition: product.condition || "Good",
    attributes: product.attributes || {},
    attributeLabels,
    images: Array.isArray(product.images) ? product.images : [],
    image: Array.isArray(product.images) ? product.images[0] : "",
    verified: Boolean(product.isVerified),
    premiumEscrow: Boolean(product.isVerified),
    autoOffer: product.acceptsOffers !== false,
    acceptsOffers: product.acceptsOffers !== false,
    category: categoryName,
    categorySlug,
    categoryId: category?._id || category?.id || "",
    stationId: "",
    location: locationText,
    station: locationText,
    moderationStatus: product.moderationStatus || "pending",
    rejectionReason: product.rejectionReason || "",
    listingStatus: product.status || "active",
    createdAt: product.createdAt || product.updatedAt || null,
    status:
      product.status === "reserved" || product.status === "sold"
        ? "escrow"
        : "active",
    offers: 0,
    autoReleaseHours: null,
    seller: {
      id: String(sellerId),
      name: seller?.fullName || seller?.name || "Seller",
      avatar: seller?.avatarUrl || seller?.avatar || DEFAULT_AVATAR,
      rating: null,
      trades: null,
    },
    // Fields used by existing UI
    boxSize: "Standard",
    conditionGrade,
    cta: product.isVerified ? "instant" : "details",
    specs,
    highlightSpecs,
  };
}
