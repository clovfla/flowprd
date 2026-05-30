export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "ecommerce",
    name: "E-Commerce",
    description: "Online store dengan katalog, cart, checkout",
    icon: "🛒",
    prompt: "Platform e-commerce untuk jual beli produk online dengan fitur katalog produk, keranjang belanja, checkout dengan payment gateway, sistem review dan rating, serta dashboard admin untuk manajemen produk dan pesanan.",
  },
  {
    id: "saas",
    name: "SaaS Platform",
    description: "Software-as-a-Service dengan subscription",
    icon: "☁️",
    prompt: "Platform SaaS dengan sistem subscription (free tier, pro, enterprise), dashboard analytics, manajemen user dan team, API untuk integrasi pihak ketiga, serta billing dan invoice management.",
  },
  {
    id: "mobile",
    name: "Mobile App",
    description: "Aplikasi mobile iOS/Android",
    icon: "📱",
    prompt: "Aplikasi mobile cross-platform (iOS dan Android) dengan push notification, offline mode, social login, real-time sync, dan integrasi dengan native features seperti kamera dan GPS.",
  },
  {
    id: "api",
    name: "API / Backend",
    description: "REST/GraphQL API service",
    icon: "⚡",
    prompt: "Backend API service dengan RESTful endpoints, autentikasi JWT, rate limiting, database dengan ORM, caching layer, logging dan monitoring, serta dokumentasi API yang lengkap.",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Admin panel dan analytics",
    icon: "📊",
    prompt: "Dashboard admin dengan visualisasi data (charts, graphs), manajemen user, role-based access control, export data, real-time updates, dan responsive design untuk desktop dan tablet.",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description: "Platform multi-vendor",
    icon: "🏪",
    prompt: "Platform marketplace multi-vendor dengan sistem vendor registration, komisi management, product listing, order management, escrow payment, dispute resolution, dan rating system untuk vendor dan buyer.",
  },
  {
    id: "social",
    name: "Social Media",
    description: "Platform komunitas dan social",
    icon: "💬",
    prompt: "Platform social media dengan fitur posting (text, image, video), follow/followers, news feed dengan algorithm, direct messaging, notification system, content moderation, dan discover/explore page.",
  },
  {
    id: "landing",
    name: "Landing Page",
    description: "Website marketing dan conversion",
    icon: "🚀",
    prompt: "Landing page website dengan hero section, features showcase, pricing table, testimonial, FAQ, contact form, blog section, SEO optimization, dan analytics integration untuk tracking conversion.",
  },
];
