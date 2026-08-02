import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { Splash } from "@/components/Splash";
import { NotificationToast } from "@/components/NotificationToast";
import { Providers } from "@/context/Providers";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL !== "") {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL && process.env.VERCEL_URL !== "") {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Skillogram",
  description: "The ultimate platform for skill exchange and growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
            <Splash />
            <Navigation />
            <NotificationToast />
            <main className="main-content">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
        </Providers>
      </body>
    </html>
  );
}
