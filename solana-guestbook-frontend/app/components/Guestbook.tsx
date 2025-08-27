"use client";

import { useState, useEffect } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, Idl } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast'; // <-- 1. Import toast

import idl from '@/app/lib/guestbook.json'; 
import { Guestbook } from '../lib/guestbook';

interface Message {
  account: {
    user: PublicKey;
    timestamp: anchor.BN;
    message: string;
  };
  publicKey: PublicKey;
}

const GUESTBOOK_PROGRAM_ID = new PublicKey("8tf51wycCRM21mqVBWGvB1tpJ5QVcb8PtTaLuAHyMwib");

export default function GuestbookPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const getProgram = () => {
    if (!wallet) throw new Error("Wallet not connected");
    const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
    return new Program<Guestbook>(idl , provider);
  };

  const fetchMessages = async () => {
    try {
      const program = getProgram();
      const fetchedMessages = (await program.account.messageAccount.all()) as Message[];
      fetchedMessages.sort((a, b) => b.account.timestamp.cmp(a.account.timestamp));
      setMessages(fetchedMessages);
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [wallet, connection]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!wallet) {
      setError("Please connect your wallet to sign the guestbook.");
      return;
    }
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    if (message.length > 200) {
      setError("Message cannot be longer than 200 characters.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const program = getProgram();
      const [messagePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("message"), wallet.publicKey.toBuffer()],
        program.programId
      );

      // ✨ --- START OF CHANGES --- ✨

      // 2. Capture the transaction signature from the rpc() call
      const txSignature = await program.methods
        .writeMessage(message)
        .accounts({
          messageAccount: messagePDA,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // 3. Create a function to handle copying to clipboard
      const handleCopy = () => {
        navigator.clipboard.writeText(txSignature);
        toast.success("Copied to clipboard!", { id: "clipboard" });
      };
      
      // 4. Show a custom success toast with the clickable transaction ID
      toast.success(
        (t) => (
          <div className="flex flex-col items-center gap-1">
            <span>Transaction successful!</span>
            <span 
              onClick={handleCopy} 
              className="text-purple-300 font-mono text-xs underline cursor-pointer hover:text-purple-200"
            >
              {`${txSignature.slice(0, 10)}...${txSignature.slice(-10)}`}
            </span>
          </div>
        ), {
          id: 'tx-success', // Use an ID to prevent duplicate toasts
        }
      );

      // ✨ --- END OF CHANGES --- ✨

      setMessage('');
      await fetchMessages();

    } catch (err: any) {
      console.error("Transaction failed:", err);
      // Show an error toast
      toast.error("Transaction failed!"); 
      const errMsg = err.toString();
      if (errMsg.includes("Message is too long")) {
         setError("Message is too long. Please keep it under 200 characters.");
      } else if (errMsg.includes("Account already in use")) {
        setError("You have already left a message. Each user can only sign once.");
      } else {
        setError("An error occurred during the transaction.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatKey = (key: PublicKey) => {
      const str = key.toBase58();
      return `${str.slice(0, 4)}...${str.slice(-4)}`;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-xl">
        {wallet ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className=''>

            <h2 className="text-xl font-semibold text-white">Sign the Guestbook</h2>
            <h6 className='text-sm text-white/50'>(NOTE: YOU CAN ONLY SEND ONE MSG PER WALLET)</h6>
            </div>
            <textarea
              className="bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              rows={4}
              placeholder="Leave your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Sign Guestbook'}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-300">Please connect your wallet to get started.</p>
        )}
      </div>

      <div className="w-full max-w-2xl mt-8">
        <h3 className="text-2xl font-bold text-white mb-4">Messages</h3>
        <div className="space-y-4">
            {messages.length > 0 ? (
                messages.map((msg, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <p className="text-white break-words">{msg.account.message}</p>
                        <div className="text-xs text-gray-400 mt-2 flex justify-between">
                           <span>From: {formatKey(msg.account.user)}</span>
                           <span>{new Date(msg.account.timestamp.toNumber() * 1000).toLocaleString()}</span>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-400 text-center">No messages yet. Be the first to sign!</p>
            )}
        </div>
      </div>
    </div>
  );
}