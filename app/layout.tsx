import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RedTape - Navigate Australian Compliance",
  description:
    "Your AI-powered guide through Australian laws, regulations, and compliance requirements. Get personalized answers for business, housing, travel, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="redtape">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100 text-neutral`}
        >
          <PortfolioProvider>{children}</PortfolioProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
