import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { LenisProvider } from "@/components/LenisProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Bodha Setu — AI-Powered Student Intelligence Platform by visiontriX AI",
  description:
    "Bodha Setu transforms classrooms with real-time engagement intelligence. Track student attention, detect learning gaps early, and enable AI-driven academic interventions at scale.",
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
    title: "Bodha Setu — Where AI Understands Learning",
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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LenisProvider>
        {children}
        </LenisProvider>
      </body>
    </html>
  );
}
