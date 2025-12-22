"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ================= INTERFACES ================= */

interface Banner {
  id: number;
  image: string;
  link?: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  images: (string | { url: string })[];
}

/* ================= PAGE ================= */

export default function Page() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const getOriginalPrice = (price: number) => {
    return Math.round(price * 1.3);
  };

  /* ================= BANNERS ================= */
  useEffect(() => {
    setBanners([
      { id: 1, image: "/winter.png", link: "/shop/winter" },
      { id: 2, image: "/fashion .png", link: "/shop/fashion" },
      { id: 3, image: "/shoes.png", link: "/shop/sneakers" },
      { id: 4, image: "/Elec.png", link: "/shop/electronics" },
      { id: 5, image: "/Gun.png", link: "/shop/gadgets" },
      { id: 6, image: "/Home.png", link: "/shop/home-decor" },
    ]);
  }, []);

  /* ================= FEATURED PRODUCTS ================= */
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products) {
          setFeaturedProducts(data.products.slice(0, 8));
        }
      })
      .catch(console.error);
  }, []);

  /* ================= IMAGE HANDLER ================= */
  const getProductImage = (product: Product) => {
    if (!product.images?.length) return "/placeholder.png";
    const img = product.images[0];
    return typeof img === "string" ? img : img.url || "/placeholder.png";
  };

  return (
    <>
      {/* ================= MAIN SLIDER ================= */}
      <div className="w-full relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <a href={banner.link || "#"}>
                <div className="relative w-full h-[200px] sm:h-[300px] md:h-[420px] lg:h-[520px]">
                  <Image
                    src={banner.image}
                    alt="Banner"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Slider Arrows (desktop only) */}
        <div
          ref={prevRef}
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-3 z-40
                     w-9 h-9 bg-sky-500/80 hover:bg-white rounded-full
                     items-center justify-center cursor-pointer text-xl shadow"
        >
          ‹
        </div>
        <div
          ref={nextRef}
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-3 z-40
                     w-9 h-9 bg-sky-500/80 hover:bg-white rounded-full
                     items-center justify-center cursor-pointer text-xl shadow"
        >
          ›
        </div>
      </div>

      {/* ================= HEADING ================= */}
      <div className="text-center max-w-3xl mx-auto mt-12 mb-8 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-lime-500">
          Discover What’s Trending
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Fresh arrivals and exclusive deals curated just for you.
        </p>
      </div>

      {/* ================= SPECIAL BANNERS ================= */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 px-4 mb-16">
        <a href="/special-sale" className="group">
          <div className="relative w-full h-[200px] sm:h-[220px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/special.png"
              alt="Special Sale"
              fill
              className="object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
              <h3 className="text-white text-xl sm:text-2xl font-bold">
                Special Sale
              </h3>
              <p className="text-white text-sm mt-1">
                Up to 70% Off
              </p>
            </div>
          </div>
        </a>

        <a href="/new-product" className="group">
          <div className="relative w-full h-[200px] sm:h-[220px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/new.png"
              alt="New Arrival"
              fill
              className="object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white px-6 py-3 rounded-lg shadow text-center">
                <h3 className="font-bold">New Arrival</h3>
                <p className="text-xs text-gray-500">
                  Trending Collection
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* ================= FEATURED PRODUCTS ================= */}
      <div className="max-w-7xl mx-auto px-4 mb-24">
        <h2 className="text-xl sm:text-2xl font-bold mb-1">
          Featured Products
        </h2>
        <p className="text-md text-gray-500 mb-6">
          Handpicked items just for you
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-7">
          {featuredProducts.map((product) => (
            <a
              key={product._id}
              href={`/product/${product._id}`}
              className="bg-white rounded-md shadow hover:shadow-xl transition
                         overflow-hidden flex flex-col h-full border"
            >
              <div className="relative w-full h-[180px] sm:h-[240px] md:h-[300px]">
                <Image
                  src={getProductImage(product)}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-semibold line-clamp-2 min-h-[40px]">
                  {product.title}
                </h3>

                <div className="mt-auto">
                  <span className="text-lime-600 font-bold block">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-red-500 line-through">
                    MRP ₹{getOriginalPrice(product.price)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ================= FULL WIDTH FASHION BANNER ================= */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden mb-24">
        <a href="/shop/fashion">
          <div className="relative w-full h-[160px] sm:h-[240px] md:h-[300px] lg:h-[360px]">
            <Image
              src="/Fash.webp"
              alt="Fashion Banner"
              fill
              priority
              className="object-cover"
            />
          </div>
        </a>
      </div>

      {/* ================= TRUST FEATURES ================= */}
      <div className="max-w-7xl mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* FAST DELIVERY */}
          <div className="flex items-center gap-4 p-6 bg-lime-200 rounded-xl shadow">
            <div className="w-16 h-16 rounded-full bg-lime-600 flex items-center justify-center text-2xl">
              🚚
            </div>
            <div>
              <h3 className="font-bold">Fast Delivery</h3>
              <p className="text-sm text-gray-600">
                Quick & reliable shipping
              </p>
            </div>
          </div>

          {/* GENUINE */}
          <div className="flex items-center gap-4 p-6 bg-sky-200 rounded-xl shadow">
            <div className="w-16 h-16 rounded-full bg-sky-700 flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <h3 className="font-bold">Genuine Products</h3>
              <p className="text-sm text-gray-600">
                100% original products
              </p>
            </div>
          </div>

          {/* REFUND */}
          <div className="flex items-center gap-4 p-6 bg-pink-200 rounded-xl shadow">
            <div className="w-16 h-16 rounded-full bg-rose-800 flex items-center justify-center text-2xl">
              💸
            </div>
            <div>
              <h3 className="font-bold">Easy Refund</h3>
              <p className="text-sm text-gray-600">
                Hassle-free returns
              </p>
            </div>
          </div>
        
        {/* ================= Customer Review ================= */}
        
      
        
        
        
        
        </div>
      </div>
    </>
  );
}
