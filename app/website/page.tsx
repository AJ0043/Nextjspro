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
          setFeaturedProducts(data.products.slice(0, 9));
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
                <div className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px]">
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

        {/* Slider Arrows */}
        <div
          ref={prevRef}
          className="absolute top-1/2 -translate-y-1/2 left-3 z-40
                     w-9 h-9 bg-sky-500/80 hover:bg-white rounded-full
                     flex items-center justify-center cursor-pointer text-xl shadow"
        >
          ‹
        </div>
        <div
          ref={nextRef}
          className="absolute top-1/2 -translate-y-1/2 right-3 z-40
                     w-9 h-9 bg-sky-500/80 hover:bg-white rounded-full
                     flex items-center justify-center cursor-pointer text-xl shadow"
        >
          ›
        </div>
      </div>

      {/* ================= HEADING ================= */}
      <div className="text-center max-w-3xl mx-auto mt-16 mb-8 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-lime-500">
          Discover What’s Trending
        </h2>
        <p className="mt-2 text-gray-600">
          Fresh arrivals and exclusive deals curated just for you.
        </p>
      </div>

      {/* ================= SPECIAL BANNERS ================= */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 px-4 mb-16">
        <a href="/special-sale" className="group">
          <div className="relative w-full h-[220px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/special.png"
              alt="Special Sale"
              fill
              className="object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
              <h3 className="text-white text-2xl font-bold">
                Special Sale
              </h3>
              <p className="text-white text-sm mt-1">
                Up to 70% Off
              </p>
            </div>
          </div>
        </a>

        <a href="/new-product" className="group">
          <div className="relative w-full h-[220px] rounded-xl overflow-hidden shadow-lg">
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

      {/* ================= FEATURED PRODUCTS (SAME HEIGHT) ================= */}
      <div className="max-w-7xl mx-auto px-4 mb-24">
        <h2 className="text-2xl font-bold mb-1">
          Featured Products
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Handpicked items just for you
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-7">
          {featuredProducts.map((product) => (
            <a
              key={product._id}
              href={`/product/${product._id}`}
             className="bg-white rounded-xl shadow hover:shadow-xl transition
           overflow-hidden flex flex-col h-full group
           border border-gray-300"

            >
              {/* IMAGE */}
              <div className="relative w-full h-[300px] bg-teal-300">
                <Image
                  src={getProductImage(product)}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-semibold line-clamp-2 min-h-[40px]">
                  {product.title}
                </h3>

                <div className="mt-auto flex items-center gap-2">
                {/* Discounted Price */}
                 <span className="text-lime-600 font-bold text-base font-serif">
                  Originalprice:- ₹{product.price}|
                 </span>

                 {/* Original Price */}
                  <span className="text-red-500 text-sm line-through">
                    MRP ₹{getOriginalPrice(product.price)}
                  </span>
             </div>
              </div>
            </a>
          ))}
        </div>
     
     
     
     
     {/* ================= FULL WIDTH FASHION BANNER ================= */}
<div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-16 mb-24 overflow-hidden">
  <a href="/shop/fashion" className="group block">
    <div
      className="
        relative
        w-full
        h-[180px]        /* Mobile */
        sm:h-[240px]    /* Small */
        md:h-[300px]    /* Medium */
        lg:h-[360px]    /* Large */
        mt-20
      "
    >
      {/* Banner Image */}
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


{/*===================================== Next Banner ===============================*/}
{/* ================= TRUST FEATURES SECTION ================= */}
<div className="max-w-7xl mx-auto px-4 mb-24 mt-50">
  <div
    className="
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      gap-8
    "
  >
    {/* FAST DELIVERY */}
    <div
      className="
        flex items-center gap-5 p-7
        bg-lime-200 rounded-xl border border-gray-200
        shadow-sm hover:shadow-xl transition
      "
    >
      <div
        className="
          w-20 h-20 rounded-full
          bg-lime-600 text-lime-600
          flex items-center justify-center
          text-3xl
        "
      >
        🚚
      </div>
      <div>
        <h3 className="font-bold text-xl">
          Fast Delivery
        </h3>
        <p className="text-base text-gray-600 mt-1">
          Quick & reliable shipping all over India
        </p>
      </div>
    </div>

    {/* GENUINE PRODUCT */}
    <div
      className="
        flex items-center gap-5 p-7
        bg-sky-200 rounded-xl border border-gray-200
        shadow-sm hover:shadow-xl transition
      "
    >
      <div
        className="
          w-20 h-20 rounded-full
          bg-sky-700 text-sky-600
          flex items-center justify-center
          text-3xl 
        "
      >
        ✅
      </div>
      <div>
        <h3 className="font-bold text-xl">
          Genuine Products
        </h3>
        <p className="text-base text-gray-600 mt-1">
          100% original & quality assured items
        </p>
      </div>
    </div>

    {/* EASY REFUND */}
    <div
      className="
        flex items-center gap-5 p-7
        bg-pink-200 rounded-xl border border-gray-200
        shadow-sm hover:shadow-xl transition
      "
    >
      <div
        className="
          w-20 h-20 rounded-full
          bg-rose-800 text-rose-600
          flex items-center justify-center
          text-3xl
        "
      >
        💸
      </div>
      <div>
        <h3 className="font-bold text-xl">
          Easy Refund
        </h3>
        <p className="text-base text-gray-600 mt-1">
          Hassle-free returns & quick refunds
        </p>
      </div>
    </div>
  </div>
</div>


      </div>
    </>
  );
}
