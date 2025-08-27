"use client";

import dynamic from "next/dynamic";
import React from "react";
import WalletConnectButtonCustom from "./WalletConnectButton";
import { WalletConnectButton } from "@solana/wallet-adapter-react-ui";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const AppBar = () => {
  return (
    <header className="bg-gray-900 p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold text-white">Solana Guestbook</h1>
      {/* <WalletMultiButtonDynamic style={{ backgroundColor: '#512da8' }} /> */}
      <WalletConnectButtonCustom />
      <WalletConnectButton />

    </header>
  );
};

export default AppBar;