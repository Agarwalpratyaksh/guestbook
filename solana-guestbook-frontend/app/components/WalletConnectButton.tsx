"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the WalletMultiButton with SSR turned off
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const WalletConnectButton = () => {
    return (
        <WalletMultiButtonDynamic style={{ backgroundColor: '#512da8' }} />
    );
};

export default WalletConnectButton;