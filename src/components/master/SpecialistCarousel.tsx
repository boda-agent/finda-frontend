"use client";

import MasterCard from "./MasterCard";
import { MOCK_MASTERS } from "@/types";

export default function SpecialistCarousel() {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 px-4 -mx-4">
      {MOCK_MASTERS.slice(0, 6).map((master) => (
        <MasterCard
          key={master.id}
          name={master.name}
          service={master.service}
          rating={master.rating}
          reviewCount={master.reviewCount}
          minPrice={master.minPrice}
          verified={master.verified}
          online={master.online}
        />
      ))}
    </div>
  );
}
