import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Content Aggregator for UX Designers",
  description:
    "Curated AI articles, tools, podcasts, and resources for UX designers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                AI Content
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                for UX
              </span>
            </div>
            <nav className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <a href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                Browse
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 py-6 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 text-center text-xs text-zinc-400 sm:px-6">
            AI Content Aggregator for UX Designers
          </div>
        </footer>
      </body>
    </html>
  );
}
