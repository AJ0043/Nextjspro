"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Banner {
  id: number;
  title?: string;
  subtitle?: string;
  image: string;
  link?: string; // optional, clickable
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    setBanners([
      { id: 1, subtitle: "Up to 50% Off", image: "/winter.png", link: "/shop/winter" },
      { id: 2, subtitle: "50% OFF", image: "/fashion .png", link: "/shop/fashion" },
      { id: 3, subtitle: "Up to 30% Off", image: "/shoes.png", link: "/shop/sneakers" },
      { id: 4, subtitle: "Shop Now", image: "/Elec.png", link: "/shop/electronics" },
      { id: 5, subtitle: "Up to 40% Off", image: "/Gun.png", link: "/shop/gadgets" },
      { id: 6, subtitle: "50% OFF", image: "/Home.png", link: "/shop/home-decor" },
    ]);
  }, []);

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a href={banner.link || "#"} className="block w-full">
              <div className="relative w-full h-[500px] md:h-[600px] lg:h-[600px]">
                <Image
                  src={banner.image}
                  alt={banner.title || "Banner"}
                  fill
                  className="object-cover w-full h-full"
                  priority
                  sizes="100vw"
                />

                {/* Optional Title/SubTitle on top of image */}
                {banner.title && (
                  <div className="absolute top-6 left-6 text-white">
                    <h2 className="text-2xl md:text-4xl font-bold">{banner.title}</h2>
                    {banner.subtitle && <p className="text-md md:text-xl mt-2">{banner.subtitle}</p>}
                  </div>
                )}
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
