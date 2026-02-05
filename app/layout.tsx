import { Inter, JetBrains_Mono } from "next/font/google";
import { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/footer";
import FloatingActionMenu from "@/components/ui/FloatingActionMenu";
import AnnouncementBar from "@/components/global/AnnouncementBar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import MobileAppPrompt from "@/components/ui/MobileAppPrompt";
import CanonicalUrl from "@/components/global/CanonicalUrl";
import Script from "next/script";

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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#fe9a00",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#fe9a00" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="SuccessVan" />
        <meta name="msapplication-TileColor" content="#fe9a00" />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          (function(w,d,s,l,i){w[l]=w[l]=[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-54WH9BWV');
        `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased custom-scrollbar`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-54WH9BWV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AuthProvider>
          <AnnouncementBar />
          <Navbar />
          <CanonicalUrl />
          <Toaster position="bottom-center" />
          <MobileAppPrompt />

          <main id="main-content">{children}</main>
          <Footer />
          <FloatingActionMenu />
        </AuthProvider>
      </body>
    </html>
  );
}
