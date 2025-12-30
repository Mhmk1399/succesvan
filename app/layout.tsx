import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/footer";
import FloatingActionMenu from "@/components/ui/FloatingActionMenu";
import SmoothScrollProvider from "@/components/ui/smoothScrollProvider.tsx";
 import AnnouncementBar from "@/components/global/AnnouncementBar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased custom-scrollbar`}
      >
        <AuthProvider>
          <AnnouncementBar />
          <Navbar />
          <Toaster position="bottom-center" />

           <SmoothScrollProvider />
          {children}
          <Footer />
          <FloatingActionMenu />
        </AuthProvider>
      </body>
    </html>
  );
}
