import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "./components/WalletContextProvider"; // Assuming this path is correct
import { Toaster } from "react-hot-toast"; // <-- 1. Import Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Solana Guestbook",
  description: "A simple guestbook on the Solana blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
          <Toaster /> {/* <-- 2. Add the component here */}
        </WalletContextProvider>
      </body>
    </html>
  );
}