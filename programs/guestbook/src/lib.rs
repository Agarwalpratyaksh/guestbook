use anchor_lang::prelude::*;

declare_id!("8tf51wycCRM21mqVBWGvB1tpJ5QVcb8PtTaLuAHyMwib");

#[program]
pub mod guestbook {
    use super::*;

     pub fn write_message(ctx: Context<WriteMessage>, message: String) -> Result<()> {
        let msg = &mut ctx.accounts.message_account;

        require!(message.len() <= 200, GuestbookError::MessageTooLong);

        msg.user = ctx.accounts.user.key();
        msg.message = message;
        msg.timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(message: String)]
pub struct WriteMessage<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 4 + 200, // discriminator + pubkey + timestamp + string prefix + max msg
        seeds = [b"message", user.key().as_ref()],
        bump
    )]
    pub message_account: Account<'info, MessageAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct MessageAccount {
    pub user: Pubkey,
    pub timestamp: i64,
    pub message: String,
}

#[error_code]
pub enum GuestbookError {
    #[msg("Message is too long")]
    MessageTooLong,
}