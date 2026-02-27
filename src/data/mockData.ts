export const stats = [
  { label: "Active Farmers", value: 50000, suffix: "+", prefix: "" },
  { label: "Transactions", value: 1200000, suffix: "+", prefix: "" },
  { label: "Savings Generated", value: 500, suffix: " Cr+", prefix: "₹" },
  { label: "Districts Covered", value: 350, suffix: "+", prefix: "" },
];

export const features = [
  {
    title: "AI Price Discovery",
    description:
      "Real-time market price predictions powered by machine learning algorithms analyzing crop data, weather, and demand patterns.",
    icon: "brain",
    color: "#16a34a",
  },
  {
    title: "Token Wallet",
    description:
      "Secure digital wallet for seamless token-based transactions. Instant settlements with zero intermediary fees.",
    icon: "wallet",
    color: "#22c55e",
  },
  {
    title: "Trust Score",
    description:
      "Blockchain-verified reputation system ensuring transparent and reliable trade partnerships across the marketplace.",
    icon: "shield",
    color: "#15803d",
  },
  {
    title: "Logistics Matching",
    description:
      "AI-powered logistics optimization connecting farmers with the most efficient transport routes and providers.",
    icon: "truck",
    color: "#059669",
  },
  {
    title: "Mortgage System",
    description:
      "Crop-backed lending with competitive interest rates. Unlock capital using your harvest as collateral.",
    icon: "landmark",
    color: "#10b981",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Comprehensive insights into market trends, transaction history, and performance metrics at your fingertips.",
    icon: "chart",
    color: "#34d399",
  },
];

export const howItWorks = [
  {
    step: 1,
    title: "Register & Verify",
    description:
      "Create your account and complete KYC verification to start trading on the platform.",
    icon: "user-plus",
  },
  {
    step: 2,
    title: "List or Browse",
    description:
      "List your agricultural products or browse the marketplace for what you need.",
    icon: "search",
  },
  {
    step: 3,
    title: "AI-Matched Trading",
    description:
      "Our AI matches you with the best buyers or sellers based on price, location, and trust scores.",
    icon: "zap",
  },
  {
    step: 4,
    title: "Secure Settlement",
    description:
      "Complete transactions with escrow protection and instant token-based settlements.",
    icon: "check-circle",
  },
];

export const products = [
  {
    id: 1,
    name: "Organic Basmati Rice",
    category: "Grains",
    price: 85,
    unit: "kg",
    location: "Punjab",
    rating: 4.8,
    seller: "Rajinder Singh",
    trustScore: 95,
    image: "🌾",
  },
  {
    id: 2,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 40,
    unit: "kg",
    location: "Maharashtra",
    rating: 4.6,
    seller: "Anita Patil",
    trustScore: 88,
    image: "🍅",
  },
  {
    id: 3,
    name: "Tractor - 45HP",
    category: "Equipment",
    price: 625000,
    unit: "unit",
    location: "Haryana",
    rating: 4.9,
    seller: "AgriMech Solutions",
    trustScore: 97,
    image: "🚜",
  },
  {
    id: 4,
    name: "Organic Wheat Flour",
    category: "Grains",
    price: 55,
    unit: "kg",
    location: "Madhya Pradesh",
    rating: 4.7,
    seller: "Kisan Organic Farms",
    trustScore: 92,
    image: "🌿",
  },
  {
    id: 5,
    name: "Fresh Green Chillies",
    category: "Vegetables",
    price: 120,
    unit: "kg",
    location: "Andhra Pradesh",
    rating: 4.5,
    seller: "Lakshmi Farms",
    trustScore: 85,
    image: "🌶️",
  },
  {
    id: 6,
    name: "Drip Irrigation Kit",
    category: "Equipment",
    price: 18500,
    unit: "set",
    location: "Gujarat",
    rating: 4.8,
    seller: "GreenTech Agri",
    trustScore: 94,
    image: "💧",
  },
];

export const testimonials = [
  {
    name: "Ramesh Kumar",
    role: "Wheat Farmer, Punjab",
    quote:
      "Navonmesh transformed how I sell my produce. The AI pricing helped me get 30% better rates than the local mandi.",
    rating: 5,
    avatar: "RK",
  },
  {
    name: "Sunita Devi",
    role: "Organic Farmer, Rajasthan",
    quote:
      "The trust score system gave me confidence to trade with buyers across states. My income has doubled in one season.",
    rating: 5,
    avatar: "SD",
  },
  {
    name: "Arjun Reddy",
    role: "AgriTech Entrepreneur, Telangana",
    quote:
      "The logistics matching feature alone saved our cooperative ₹50 lakhs in transportation costs last quarter.",
    rating: 5,
    avatar: "AR",
  },
  {
    name: "Priya Sharma",
    role: "Vegetable Trader, UP",
    quote:
      "Escrow protection means I never worry about payment defaults anymore. The platform has truly modernized agri-commerce.",
    rating: 4,
    avatar: "PS",
  },
];

export const transactions = [
  { id: "TXN-2847", item: "Basmati Rice", amount: 42500, status: "completed", date: "2 hours ago" },
  { id: "TXN-2846", item: "Organic Wheat", amount: 28750, status: "completed", date: "5 hours ago" },
  { id: "TXN-2845", item: "Fresh Tomatoes", amount: 15200, status: "pending", date: "1 day ago" },
  { id: "TXN-2844", item: "Drip Kit", amount: 18500, status: "completed", date: "2 days ago" },
  { id: "TXN-2843", item: "Green Chillies", amount: 9600, status: "completed", date: "3 days ago" },
];

export const chartData = {
  monthly: [
    { month: "Jul", value: 32 },
    { month: "Aug", value: 45 },
    { month: "Sep", value: 58 },
    { month: "Oct", value: 42 },
    { month: "Nov", value: 68 },
    { month: "Dec", value: 75 },
    { month: "Jan", value: 88 },
  ],
  categories: [
    { name: "Grains", percentage: 42 },
    { name: "Vegetables", percentage: 28 },
    { name: "Equipment", percentage: 18 },
    { name: "Seeds", percentage: 12 },
  ],
};

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Marketplace", href: "#marketplace" },
  { label: "Logistics", href: "#logistics" },
  { label: "Dispute", href: "#dispute" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Contact", href: "#footer" },
];

export const footerLinks = {
  Platform: [
    { label: "Marketplace", href: "#marketplace" },
    { label: "AI Pricing", href: "#features" },
    { label: "Token Wallet", href: "#dashboard" },
    { label: "Trust Scores", href: "#trust" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Case Studies", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Contact", href: "#" },
  ],
};
