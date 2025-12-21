"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Banner {
  id: number;
  image: string;
  link?: string;
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

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

  return (
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
        className="w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a href={banner.link || "#"} className="block w-full">
              <div
                className="
                  relative w-full 
                  h-[220px] 
                  sm:h-[300px] 
                  md:h-[420px] 
                  lg:h-[520px] 
                  xl:h-[580px] 
                  overflow-hidden
                "
              >
                <Image
                  src={banner.image}
                  alt="Banner"
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* LEFT ARROW */}
      <div
        ref={prevRef}
        className="
          absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-50
          w-8 h-8 sm:w-10 sm:h-10
          bg-sky-500/80 hover:bg-white
          rounded-full shadow-lg
          flex items-center justify-center
          cursor-pointer text-xl
        "
      >
        ‹
      </div>

      {/* RIGHT ARROW */}
      <div
        ref={nextRef}
        className="
          absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-50
          w-8 h-8 sm:w-10 sm:h-10
          bg-sky-500/80 hover:bg-white
          rounded-full shadow-lg
          flex items-center justify-center
          cursor-pointer text-xl
        "
      >
        ›
      </div>
    </div>
  );
}
