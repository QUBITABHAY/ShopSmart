import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Shield,
  CreditCard,
  Headphones,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  ShoppingCart,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Container } from "../components/layout";
import { ProductGrid, QuickView } from "../components/product";
import { productService } from "../services/product.service";
import { Loader } from "../components/common";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatters";
import { cn } from "../lib/utils";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getAll({ limit: 8 });
        setFeaturedProducts(data.products || data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Mock data for demo
        setFeaturedProducts([
          {
            id: 1,
            name: "Premium Wireless Headphones",
            price: 24999,
            originalPrice: 32999,
            imageUrl:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            category: "Electronics",
            rating: 4.8,
            reviewCount: 234,
            stock: 5,
          },
          {
            id: 2,
            name: "Smart Fitness Watch",
            price: 15999,
            imageUrl:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            category: "Electronics",
            rating: 4.6,
            reviewCount: 189,
            stock: 12,
          },
          {
            id: 3,
            name: "Leather Messenger Bag",
            price: 4499,
            imageUrl:
              "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
            category: "Accessories",
            rating: 4.9,
            reviewCount: 156,
            stock: 8,
          },
          {
            id: 4,
            name: "Minimalist Desk Lamp",
            price: 2999,
            imageUrl:
              "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
            category: "Home",
            rating: 4.7,
            reviewCount: 98,
            stock: 15,
          },
          {
            id: 5,
            name: "Organic Cotton T-Shirt",
            price: 999,
            imageUrl:
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            category: "Clothing",
            rating: 4.5,
            reviewCount: 312,
            stock: 25,
          },
          {
            id: 6,
            name: "Ceramic Pour-Over Set",
            price: 2499,
            imageUrl:
              "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
            category: "Kitchen",
            rating: 4.8,
            reviewCount: 87,
            stock: 10,
          },
          {
            id: 7,
            name: "Wireless Charging Pad",
            price: 1499,
            imageUrl:
              "https://images.unsplash.com/photo-1586816879360-004f5b0c1e1c?w=400",
            category: "Electronics",
            rating: 4.4,
            reviewCount: 145,
            stock: 30,
          },
          {
            id: 8,
            name: "Bamboo Sunglasses",
            price: 1999,
            imageUrl:
              "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
            category: "Accessories",
            rating: 4.6,
            reviewCount: 76,
            stock: 18,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: "On orders over ₹500",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      desc: "100% secure checkout",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: CreditCard,
      title: "Easy Returns",
      desc: "30-day return policy",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Dedicated support",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300",
      count: 120,
    },
    {
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300",
      count: 85,
    },
    {
      name: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300",
      count: 64,
    },
    {
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1461896836934- voices-of-hope?w=300",
      count: 42,
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Verified Buyer",
      text: "Amazing quality and fast shipping! Will definitely shop here again.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "James K.",
      role: "Verified Buyer",
      text: "Great customer service. They helped me find exactly what I needed.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
      name: "Emily R.",
      role: "Verified Buyer",
      text: "Best prices I've found online. The products are top-notch quality.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=3",
    },
  ];

  const heroSlides = [
    {
      title: "Summer Collection 2024",
      subtitle: "Up to 40% off on selected items",
      cta: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      color: "from-blue-600 to-indigo-700",
    },
    {
      title: "Tech Essentials",
      subtitle: "Latest gadgets at unbeatable prices",
      cta: "Explore",
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200",
      color: "from-purple-600 to-pink-600",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220%22 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        <Container className="relative py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                New Collection Available
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Premium Products at{" "}
                <span className="text-amber-400">Unbeatable Prices</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-lg">
                Shop the latest trends with confidence. Quality products, fast
                shipping, and exceptional customer service.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products?sale=true"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  View Sale Items
                </Link>
              </div>
              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i}`}
                      alt=""
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-blue-100">
                    Trusted by 50k+ customers
                  </span>
                </div>
              </div>
            </div>
            {/* Hero Image/Products */}
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative grid grid-cols-2 gap-4">
                {featuredProducts.slice(0, 2).map((product, i) => (
                  <div
                    key={product.id}
                    className={cn(
                      "bg-white rounded-2xl shadow-2xl overflow-hidden transform",
                      i === 1 ? "translate-y-8" : "",
                    )}
                  >
                    <div className="aspect-square">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-blue-600 font-bold">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
        {/* Wave Divider */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#f9fafb"
              d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-white border-b">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    feature.color,
                  )}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-16">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Shop by Category
              </h2>
              <p className="text-gray-500 mt-1">
                Browse our most popular categories
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-sm text-white/80">{cat.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Trending Now
                </h2>
                <p className="text-gray-500">Most popular products this week</p>
              </div>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.originalPrice && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                          -
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100,
                          )}
                          %
                        </span>
                      )}
                      {product.stock <= 5 && (
                        <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Only {product.stock}{" "}
                          left
                        </span>
                      )}
                    </div>
                    {/* Quick Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-5 h-5 text-gray-700" />
                      </button>
                      <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        <Heart className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => addItem(product, 1)}
                        className="p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating)
                              ? "text-amber-400 fill-current"
                              : "text-gray-200",
                          )}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Banner */}
      <section className="py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%220.1%22 fill-rule=%22evenodd%22%3E%3Cpath d=%22M0 40L40 0H20L0 20M40 40V20L20 40%22/%3E%3C/g%3E%3C/svg%3E')]" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Get 20% Off Your First Order
                </h2>
                <p className="text-indigo-100 mb-6">
                  Subscribe to our newsletter and unlock exclusive deals, new
                  arrivals, and insider-only discounts.
                </p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
              <div className="hidden md:flex justify-end">
                <div className="text-8xl">🎁</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-500">
              Join thousands of satisfied shoppers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{t.name}</p>
                    <p className="text-sm text-green-600">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default Home;
