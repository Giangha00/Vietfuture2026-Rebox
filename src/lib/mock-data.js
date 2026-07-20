export const CATEGORIES = [
  { id: "tech", label: "Tech", icon: "laptop" },
  { id: "fashion", label: "Fashion", icon: "shirt" },
  { id: "home", label: "Home Living", icon: "sofa" },
  { id: "gaming", label: "Gaming", icon: "gamepad" },
  { id: "books", label: "Books", icon: "book" },
  { id: "others", label: "Others", icon: "more" },
];

export const PRODUCTS = [
  {
    id: "1",
    title: "Precision Chronograph Series 7",
    price: 495,
    originalPrice: 620,
    discount: 20,
    condition: "Like New",
    verified: true,
    premiumEscrow: true,
    autoOffer: true,
    location: "District 1 Station",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    ],
    seller: {
      id: "marcus",
      name: "Marcus Chen",
      rating: 4.9,
      trades: 142,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    boxSize: "Size M",
    conditionGrade: "Grade A+",
    station: "Circle K Nguyễn Huệ — Locker #A12",
    description:
      "AI-Vision inspection confirms original dial, crystal clarity, and bracelet stretch within Grade A+ tolerance. Minor desk-dive marks on clasp only.",
    specs: [
      { label: "Case Diameter", value: "41mm" },
      { label: "Movement", value: "Automatic Chronograph" },
      { label: "Water Resistance", value: "100m" },
      { label: "Material", value: "Stainless Steel" },
    ],
    cta: "instant",
  },
  {
    id: "2",
    title: "Razer Blade 15 Gaming Laptop",
    price: 1180,
    condition: "Good",
    verified: true,
    premiumEscrow: true,
    autoOffer: true,
    location: "Central Station Alpha",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771bb0b?w=800&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    ],
    seller: {
      id: "marcus",
      name: "Marcus Chen",
      rating: 4.9,
      trades: 142,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    boxSize: "Size L",
    conditionGrade: "Grade B+",
    station: "GS25 Lê Lợi — Locker #B04",
    description:
      "Fully stress-tested GPU and keyboard. Battery health 87%. Includes original charger.",
    specs: [
      { label: "CPU", value: "Intel i7 12th Gen" },
      { label: "GPU", value: "RTX 3070" },
      { label: "RAM", value: "16GB" },
      { label: "Storage", value: "1TB SSD" },
    ],
    cta: "instant",
  },
  {
    id: "3",
    title: "Sony A7 III Mirrorless Body",
    price: 890,
    condition: "Like New",
    verified: true,
    premiumEscrow: false,
    autoOffer: false,
    location: "Thảo Điền Station",
    category: "Photography",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    ],
    seller: {
      id: "linh",
      name: "Linh Tran",
      rating: 4.8,
      trades: 89,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    boxSize: "Size M",
    conditionGrade: "Grade A",
    station: "Circle K Thảo Điền — Locker #C08",
    description: "Shutter count under 12k. Sensor clean. No dents.",
    specs: [
      { label: "Sensor", value: "24.2MP Full Frame" },
      { label: "Shutter Count", value: "11,840" },
      { label: "IBIS", value: "5-axis" },
      { label: "Mount", value: "Sony E" },
    ],
    cta: "details",
  },
  {
    id: "4",
    title: "Custom Mechanical Keyboard",
    price: 249,
    condition: "Good",
    verified: true,
    premiumEscrow: false,
    autoOffer: true,
    location: "Bình Thạnh Station",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80",
    ],
    seller: {
      id: "marcus",
      name: "Marcus Chen",
      rating: 4.9,
      trades: 142,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    boxSize: "Size S",
    conditionGrade: "Grade B",
    station: "GS25 Xô Viết — Locker #D02",
    description: "Hot-swap PCB, lubed switches, custom keycaps included.",
    specs: [
      { label: "Layout", value: "75%" },
      { label: "Switches", value: "Gateron Oil King" },
      { label: "Keycaps", value: "PBT Doubleshot" },
      { label: "Connection", value: "USB-C / BT" },
    ],
    cta: "details",
  },
  {
    id: "5",
    title: "Nike Dunk Low Retro",
    price: 145,
    condition: "Fair",
    verified: false,
    premiumEscrow: false,
    autoOffer: false,
    location: "Phú Nhuận Station",
    category: "Apparel",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    seller: {
      id: "minh",
      name: "Minh Vo",
      rating: 4.6,
      trades: 34,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    },
    boxSize: "Size M",
    conditionGrade: "Grade C+",
    station: "Circle K Phan Xích Long — Locker #E11",
    description: "Worn 8 times. Box included. No structural damage.",
    specs: [
      { label: "Size", value: "US 9" },
      { label: "Colorway", value: "Panda" },
      { label: "Year", value: "2023" },
      { label: "Box", value: "Included" },
    ],
    cta: "details",
  },
  {
    id: "6",
    title: "Dyson V11 Absolute",
    price: 320,
    condition: "Like New",
    verified: true,
    premiumEscrow: true,
    autoOffer: false,
    location: "Quận 7 Station",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    ],
    seller: {
      id: "linh",
      name: "Linh Tran",
      rating: 4.8,
      trades: 89,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    boxSize: "Size L",
    conditionGrade: "Grade A",
    station: "GS25 Phú Mỹ Hưng — Locker #F06",
    description: "Runtime verified. All attachments included.",
    specs: [
      { label: "Runtime", value: "60 min" },
      { label: "Suction", value: "185 AW" },
      { label: "Bin", value: "0.76 L" },
      { label: "Attachments", value: "Full set" },
    ],
    cta: "instant",
  },
];

export const PROFILE_LISTINGS = [
  {
    id: "4",
    title: "Custom Mechanical Keyboard",
    price: 249,
    status: "active",
    offers: 3,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&q=80",
  },
  {
    id: "2",
    title: "Razer Blade 15 Gaming Laptop",
    price: 1180,
    status: "escrow",
    offers: 1,
    autoReleaseHours: 18,
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771bb0b?w=600&q=80",
  },
];

export const CURRENT_USER = {
  name: "Marcus Chen",
  bio: "Trusted seller · Premium electronics & collectibles",
  rating: 4.9,
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  stats: [
    { label: "Items Sold", value: "124", icon: "box" },
    { label: "Active Listings", value: "8", icon: "tag" },
    { label: "Trust Score", value: "98%", icon: "shield" },
  ],
  level: 4,
  levelProgress: 72,
  badges: [
    { title: "Verified Account", subtitle: "Member since Jun 2024" },
    { title: "Escrow Eligible", subtitle: "Premium escrow unlocked" },
    { title: "Station Partner", subtitle: "Preferred drop-off rates" },
  ],
};

export const FAQ_ITEMS = [
  {
    q: "How does 48h escrow work?",
    a: "Buyer funds are held until the item is picked up and inspected. After confirmation—or automatically after 48 hours—funds release to the seller.",
  },
  {
    q: "How do seller ratings work?",
    a: "Ratings reflect completed trades, response time, and escrow history. Higher-rated sellers unlock Premium Escrow benefits.",
  },
  {
    q: "Where are ReBox Stations?",
    a: "Stations live inside Circle K and GS25 partners across HCMC and Hanoi. Use Contact → Physical Stations to find one near you.",
  },
  {
    q: "What if my item arrives damaged?",
    a: "Film a continuous unboxing video. Without video evidence, dispute claims may be restricted.",
  },
];

export const PROHIBITED_ITEMS = [
  { title: "Hazmat", desc: "Flammables, chemicals, batteries outside approved limits." },
  { title: "Perishables", desc: "Food, plants, or anything that spoils in transit." },
  { title: "Counterfeits", desc: "Replica goods or unauthorized branded merchandise." },
  { title: "Live Animals", desc: "No live pets or biological specimens." },
  { title: "Restricted", desc: "Weapons, controlled substances, adult content." },
  { title: "Cash/Value", desc: "Cash, gift cards, crypto hardware wallets with funds." },
];

export const STATIONS = [
  {
    city: "Ho Chi Minh",
    address: "Circle K Nguyễn Huệ, Q1",
    locker: "Smart Locker #A12",
    color: "red",
  },
  {
    city: "Hanoi",
    address: "GS25 Trần Hưng Đạo, Hoàn Kiếm",
    locker: "Smart Locker #HN-03",
    color: "blue",
  },
];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
}
