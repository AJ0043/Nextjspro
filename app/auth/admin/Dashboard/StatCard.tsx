"use client";

import React from "react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  gradient: string;
}

export default function StatCard({
  title,
  value,
  icon,
  href,
  gradient,
}: StatCardProps) {
  return (
    <Link href={href}>
      <div
        className={`text-white rounded-lg p-5 shadow-lg hover:shadow-xl hover:scale-[1.03] transition cursor-pointer bg-gradient-to-r ${gradient}`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">{title}</p>
            <h2 className="text-3xl font-bold">{value}</h2>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );
}
