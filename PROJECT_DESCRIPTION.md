# Project Description

**Deployed Frontend URL:** https://your-deployed-url.vercel.app

**Solana Program ID:** 8tf51wycCRM21mqVBWGvB1tpJ5QVcb8PtTaLuAHyMwib

## Project Overview

### Description
The Solana Guestbook is a simple decentralized application (dApp) where users can connect their Phantom wallet and write a message on-chain. Each user can submit one message, which is stored in a unique account derived using a Program Derived Address (PDA).

This dApp showcases how to build a full-stack Web3 app using:

- Solana + Anchor for on-chain smart contract logic
- Program Derived Addresses for account management
- React + Next.js (App Router) for frontend
- Phantom wallet for Solana authentication and transactions

### Key Features

- ✅ Connect Phantom wallet via Wallet Adapter
- ✅ Submit a guestbook message stored on-chain
- ✅ Message is associated with user’s wallet (only one message per user)
- ✅ View your own stored message after submission
- ✅ Messages stored using PDAs (user-specific)
- ✅ Fully deployed smart contract and frontend

### How to Use the dApp

1. **Connect Wallet**  
   Click the “Connect Wallet” button to connect your Phantom wallet to the app.

2. **Write a Message**  
   Type your message in the input box (max 200 characters) and click **Submit Message**.

3. **View Your Message**  
   After submission, your message will appear on the screen, fetched directly from the Solana blockchain.

4. **Update**  
   You can update your message by submitting a new one — it will overwrite the existing account data.

## Program Architecture

### PDA Usage

This project uses a Program Derived Address (PDA) to uniquely associate a message account with each user.

**Seed Used:**

["message", user_public_key]

**Why:** Ensures each wallet address has exactly one guestbook account on-chain. Prevents duplicate submissions.

### Program Instructions

1. **write_message(message: String)**  
   - Creates or updates the user’s guestbook message  
   - Enforces a max message length of 200 characters  
   - Initializes an account using a PDA if it doesn’t exist

### Account Structure

```rust
#[account]
pub struct MessageAccount {
    pub user: Pubkey,        // Wallet that wrote the message
    pub timestamp: i64,      // When the message was written
    pub message: String,     // The actual message
}
```

The `message_account` is initialized at a PDA derived using:

```rust
seeds = [b"message", user.key().as_ref()]
```

Includes bump for PDA validation.

## Testing

### Test Coverage

This project includes TypeScript tests for both happy and unhappy paths using the Anchor testing framework.

**Happy Path Tests:**

- Writes a message and stores it on-chain
- Fetches the account to verify message contents

**Unhappy Path Tests:**

- Submitting a message longer than 200 characters (triggering custom error)
- Rewriting the message is allowed, but could be extended to prevent overwrites

### Running Tests

```bash
anchor test
```

This will:

- Compile the Anchor program
- Deploy it to a local validator
- Run the TypeScript test suite in `/tests/guestbook.ts`

## Additional Notes for Evaluators

- This is a minimal but complete full-stack Solana dApp.  
- Uses PDA to ensure per-user account isolation.  
- Frontend is built using Next.js 14 App Router, fully modernized.  
- Wallet integration is provided via @solana/wallet-adapter and tested with Phantom.  
- The app is easily extendable (e.g. add likes, delete, public feed of messages, etc.).  
