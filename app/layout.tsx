import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import { AdminAuthProvider } from "@/lib/admin-auth";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZeeBundu - Multi-Business Platform",
  description: "Discover exceptional businesses across multiple industries - from gas stations to luxury hotels, organic farms to healthcare services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <AdminAuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AdminAuthProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
