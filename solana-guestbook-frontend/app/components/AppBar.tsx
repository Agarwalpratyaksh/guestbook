"use client";

import dynamic from "next/dynamic";
import React from "react";
import WalletConnectButton from "./WalletConnectButton";

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
      <WalletConnectButton />

    </header>
  );
};

export default AppBar;