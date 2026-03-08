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
  metadataBase: new URL('https://pixel-eucaristico.vercel.app'),
  title: {
    default: "Pixel Eucarístico | Games e Software Católicos",
    template: "%s | Pixel Eucarístico"
  },
  description: "Produtora de jogos e softwares focada em criar experiências digitais com propósito e valores cristãos. Evangelização através da tecnologia.",
  keywords: ["games católicos", "software católico", "evangelização digital", "carlo acutis", "são maximiliano kolbe", "tecnologia e fé", "pixel art", "jogos cristãos"],
  authors: [{ name: "Willian Quintino" }],
  creator: "Willian Quintino",
  publisher: "Pixel Eucarístico",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://pixel-eucaristico.vercel.app",
    title: "Pixel Eucarístico | Games e Software Católicos",
    description: "Onde a Fé encontra a Tecnologia. Jogos e softwares para evangelizar.",
    siteName: "Pixel Eucarístico",
    images: [
      {
        url: "/images/rycerz_niepokalanej.jpg",
        width: 1200,
        height: 630,
        alt: "Pixel Eucarístico - Evangelização através da tecnologia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Eucarístico | Games e Software Católicos",
    description: "Onde a Fé encontra a Tecnologia. Jogos e softwares para evangelizar.",
    images: ["/images/rycerz_niepokalanej.jpg"],
    creator: "@willianquintino",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="light" suppressHydrationWarning>
      <body
        className={`${pressStart2P.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <footer className="footer footer-center px-6 py-8 md:p-10 bg-base-300 text-base-content rounded-none border-t-4 border-base-content">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/games" className="link link-hover">Games</a>
            <a href="/software" className="link link-hover">Software</a>
            <a href="/about" className="link link-hover">Sobre Nós</a>
          </div>
          <div className="flex justify-center gap-4">
            <a href="https://github.com/Pixel-Eucaristico" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/willian-quintino" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="fill-current"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="mailto:williancustodioquintino@gmail.com" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="fill-current"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-11.174l4.623 5.462zm2.157-1.227l3.22 3.804 3.221-3.804 7.561 8.929h-21.563l7.561-8.929zm7.297 3.294l4.923-5.35v10.912l-4.923-5.562z"/></svg>
            </a>
          </div>
          <div className="text-center">
            <p className="font-bold">Pixel Eucarístico</p>
            <p className="text-sm mt-1 break-all">williancustodioquintino@gmail.com | (19) 99226-4821</p>
            <p className="text-sm mt-2">Copyright © {new Date().getFullYear()} - Todos os direitos reservados</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
