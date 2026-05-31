import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "L'Aroma Premium 3D - Crafted Coffee Experience",
  description: "Immerse yourself in a luxurious, scroll-triggered 3D journey celebrating coffee craftsmanship. Explore our hand-picked single-origin roasts and masterfully brewed blends.",
  keywords: ["coffee", "3D coffee website", "single origin", "specialty coffee", "aroma", "premium coffee blend"],
  authors: [{ name: "L'Aroma Specialty Coffee" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="bg-coffee-espresso text-coffee-textPrimary font-inter antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
