import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TechnologySection from "@/components/TechnologySection";
import AnalyticsSection from "@/components/AnalyticsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* Persistent animated canvas background */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navbar />

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

        {/* Technology Stack */}
        {/* <TechnologySection /> */}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#2D5351]/20 to-transparent mx-6 md:mx-20" />

        {/* Analytics / GlitchGrid Demo */}
        {/* <AnalyticsSection /> */}

        {/* Final CTA */}
        {/* <CTASection /> */}

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
