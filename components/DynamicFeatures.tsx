"use client";

import dynamic from "next/dynamic";

const FeaturesSection = dynamic(() => import("./FeaturesSection"), { 
  ssr: false,
});

export default function DynamicFeatures() {
  return <FeaturesSection />;
}
