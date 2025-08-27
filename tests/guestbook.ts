import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Guestbook } from "../target/types/guestbook";
import { assert } from "chai";


describe("guestbook", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Guestbook as Program<Guestbook>;

  const user = provider.wallet;

  it("Writes a guestbook message", async () => {
    const [messagePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("message"), user.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .writeMessage("Hello, Solana Guestbook!")
      .accounts({
        messageAccount: messagePDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction:", tx);

    const messageAccount = await program.account.messageAccount.fetch(messagePDA);
    assert.strictEqual(messageAccount.message, "Hello, Solana Guestbook!");
  });

  it("Fails on long message", async () => {
    const longMessage = "a".repeat(201);

    const [messagePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("message"), user.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .writeMessage(longMessage)
        .accounts({
          messageAccount: messagePDA,
          user: user.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      assert.fail("Expected error for long message");
    } catch (err: any) {
      const errMsg = "Message is too long";
      assert.ok(err.toString().includes(errMsg));
    }
  });
});