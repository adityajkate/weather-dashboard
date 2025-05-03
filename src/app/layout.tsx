import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Weather Dashboard by AdityaKate",
  description: "Real-time weather dashboard with forecasts and visualizations",
  keywords: ["weather", "forecast", "dashboard", "real-time", "meteorology"],
  authors: [{ name: "AdityaKate" }],
  creator: "AdityaKate",
  metadataBase: new URL("https://weather-byaditya.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://weather-byaditya.vercel.app",
    title: "Weather Dashboard by AdityaKate",
    description: "Real-time weather dashboard with forecasts and visualizations",
    siteName: "Weather Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Weather Dashboard by AdityaKate"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather Dashboard by AdityaKate",
    description: "Real-time weather dashboard with forecasts and visualizations",
    images: ["/og-image.png"]
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${roboto.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
