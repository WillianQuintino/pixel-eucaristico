import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Pixel Eucarístico",
  description: "Software e Games com valores cristãos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="retro" suppressHydrationWarning>
      <body
        className={`${pressStart2P.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <footer className="footer footer-center p-4 bg-base-300 text-base-content border-t-4 border-base-content">
          <aside>
            <p>Copyright © {new Date().getFullYear()} - Pixel Eucarístico</p>
          </aside>
        </footer>
      </body>
    </html>
  );
}
