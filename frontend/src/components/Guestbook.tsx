/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import type { Guestbook as GuestbookProgram } from '../types/guestbook';
import idl from '../idl/guestbook.json';

// Your program's public key
const programId = new PublicKey('8tf51wycCRM21mqVBWGvB1tpJ5QVcb8PtTaLuAHyMwib');

// Define a more structured type for the fetched account data
interface MessageEntry {
    publicKey: PublicKey;
    account: {
        user: PublicKey;
        timestamp: anchor.BN;
        message: string;
    }
}

export const Guestbook = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [program, setProgram] = useState<Program<GuestbookProgram> | null>(null);
    const [message, setMessage] = useState('');
    const [messagePda, setMessagePda] = useState<PublicKey | null>(null);

    // --- NEW STATE for all messages ---
    const [allMessages, setAllMessages] = useState<MessageEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Set up the Anchor program instance
    useEffect(() => {
        if (wallet.publicKey) {
            const provider = new anchor.AnchorProvider(connection, wallet as any, {
                preflightCommitment: 'processed',
            });
            const programInstance = new Program<GuestbookProgram>(idl as any, provider);
            setProgram(programInstance);
        }
    }, [connection, wallet]);

    // Find the PDA for the current user's message
    useEffect(() => {
        if (wallet.publicKey) {
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from('message'), wallet.publicKey.toBuffer()],
                programId
            );
            setMessagePda(pda);
        }
    }, [wallet.publicKey]);
    
    // --- NEW FUNCTION to fetch all messages ---
    const fetchAllMessages = async () => {
        if (!program) return;
        setLoading(true);
        try {
            const messages = await program.account.messageAccount.all();
            // Sort messages by timestamp, newest first
            messages.sort((a, b) => b.account.timestamp.cmp(a.account.timestamp));
            setAllMessages(messages as MessageEntry[]);
        } catch (e) {
            console.error("Error fetching messages:", e);
            setAllMessages([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all messages when the program is initialized
    useEffect(() => {
        fetchAllMessages();
    }, [program]);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!program || !wallet.publicKey || !messagePda) {
            setError('Please connect your wallet and try again.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await program.methods
                .writeMessage(message)
                .accounts({
                    // messageAccount: messagePda,
                    user: wallet.publicKey,
                    // systemProgram: SystemProgram.programId,
                })
                .rpc();

            setMessage(''); // Clear input field
            // --- REFRESH the list after submitting ---
            await fetchAllMessages();

        } catch (err: any) {
            console.error('Transaction error:', err);
            if (err.toString().includes('Message is too long')) {
                setError('Error: The message is too long (max 200 characters).');
            } else {
                setError('An error occurred during the transaction.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Find the current user's message from the allMessages list
    const currentUserMessage = allMessages.find(
      (msg) => msg.account.user.equals(wallet.publicKey!)
    );

    return (
        <div className="guestbook-container">
            <form onSubmit={handleSubmit} className="guestbook-form">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={currentUserMessage ? "Write a new message to update yours..." : "Write your message here..."}
                    maxLength={200}
                    required
                />
                <button type="submit" disabled={loading || !message}>
                    {loading ? 'Submitting...' : (currentUserMessage ? 'Update Message' : 'Write Message')}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            
            {/* --- NEW SECTION to display all messages --- */}
            <div className="all-messages-section">
                <h2>Guestbook Entries 🚀</h2>
                 <button onClick={fetchAllMessages} disabled={loading} className="refresh-button">
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                {loading && <p>Loading messages...</p>}
                {!loading && allMessages.length === 0 && <p>No messages yet. Be the first!</p>}
                
                <div className="message-list">
                    {allMessages.map((entry) => (
                        <div key={entry.publicKey.toBase58()} className="message-card">
                            <p className="message-content">"{entry.account.message}"</p>
                            <p className="message-meta">
                                From: {entry.account.user.toBase58().substring(0, 4)}...{entry.account.user.toBase58().slice(-4)}
                                <br />
                                At: {new Date(entry.account.timestamp.toNumber() * 1000).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};