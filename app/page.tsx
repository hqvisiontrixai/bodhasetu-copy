import AnimatedBackground from "@/components/AnimatedBackground";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection2";
import Footer from "@/components/Footer";
import Form from "@/components/Form";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* Persistent animated canvas background */}
      <AnimatedBackground />

      {/* Page content */}
      <div className="relative z-10">
        {/* Hero */}
        <HeroSection />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#A27B3D]/20 to-transparent mx-6 md:mx-20" />

        {/* Features: 7 Intelligence Layers */}
        <FeaturesSection />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#B76A32]/20 to-transparent mx-6 md:mx-20" />

        <Form />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#B76A32]/20 to-transparent mx-6 md:mx-20" />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
