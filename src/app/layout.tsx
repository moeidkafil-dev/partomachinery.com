import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Parto Plastic Machinery — HTE75 Twin-Screw Compounding & Pelletizing Line",
  description:
    "Parto Plastic Machinery builds twin-screw compounding and pelletizing lines. Travel the HTE75 line in a scroll-driven cinematic experience built from real factory-floor footage. Verified datasheets on request.",
  keywords: [
    "Parto Plastic",
    "HTE75",
    "twin-screw extruder",
    "compounding",
    "pelletizing line",
    "plastic machinery",
  ],
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "Parto Plastic Machinery — HTE75 Line",
    description:
      "A cinematic, scroll-driven tour of the HTE75 twin-screw compounding & pelletizing line, built from actual factory footage.",
    images: ["/media/posters/og_image.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000F08",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${body.variable} ${display.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
