import { Inter, JetBrains_Mono } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/footer";
import FloatingActionMenu from "@/components/ui/FloatingActionMenu";
import AnnouncementBar from "@/components/global/AnnouncementBar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import MobileAppPrompt from "@/components/ui/MobileAppPrompt";
import CanonicalUrl from "@/components/global/CanonicalUrl";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SuccessVan - Van Hire & Rental in London | Last Minute Bookings",
  description:
    "Premium van hire and rental services in North West London. Book your van today with SuccessVan - serving Cricklewood, Golders Green, Hampstead, Hendon, Mill Hill, Wembley and more.",
  keywords:
    "van hire London, van rental, last minute van hire, North West London, Cricklewood, Golders Green, Hampstead, Hendon, Mill Hill, Wembley",
  authors: [{ name: "SuccessVan" }],
  creator: "SuccessVan",
  publisher: "SuccessVan",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://successvanhire.co.uk/",
    siteName: "SuccessVan",
    title: "SuccessVan - Van Hire & Rental in London",
    description: "Premium van hire and rental services in North West London",
    images: [
      {
        url: "https://successvanhire.co.uk/android-chrome-192x192.png",
        width: 1200,
        height: 630,
        alt: "SuccessVan - Van Hire London",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SuccessVan - Van Hire & Rental in London",
    description: "Premium van hire and rental services in North West London",
    images: ["https://successvanhire.co.uk/android-chrome-192x192.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased custom-scrollbar`}
      >
        <AuthProvider>
          <AnnouncementBar />
          <Navbar />
          <CanonicalUrl />
          <Toaster position="bottom-center" />
          <MobileAppPrompt />

          {children}
          <Footer />
          <FloatingActionMenu />
        </AuthProvider>
      </body>
    </html>
  );
}
