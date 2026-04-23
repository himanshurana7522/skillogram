import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { Splash } from "@/components/Splash";
import { NotificationToast } from "@/components/NotificationToast";
import { AppProvider } from "@/context/AppContext";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
        <AppProvider>
          <Splash />
          <Navigation />
          <NotificationToast />
          <main className="main-content">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
