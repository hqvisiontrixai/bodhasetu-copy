import type { Metadata } from "next";
import "./globals.css";
import { Inter, Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { LenisProvider } from "@/components/LenisProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const metadata: Metadata = {
  title: "Glint IQ — AI-Powered Student Intelligence Platform by visiontriX AI",
  description:
    "Glint IQ transforms classrooms with real-time engagement intelligence. Track student attention, detect learning gaps early, and enable AI-driven academic interventions at scale.",
  keywords: [
    "AI education",
    "student monitoring",
    "learning analytics",
    "edtech",
    "engagement detection",
    "visiontriX AI",
  ],
  icons: {
    icon: "/visiontrix_logo.png",
    shortcut: "/visiontrix_logo.png",
    apple: "/visiontrix_logo.png",
  },
  openGraph: {
    title: "Glint IQ — Where AI Understands Learning",
    description:
      "AI-powered student monitoring and academic intelligence platform for educational institutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, outfit.variable)}>
      <head>
        {/* Fonts are now handled via next/font */}
      </head>
      <body className="antialiased">
        <LenisProvider>
        {children}
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
