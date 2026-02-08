use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX");

#[program]
pub mod zephyr {
    use super::*;

    pub fn initialize_agent(ctx: Context<InitializeAgent>, agent_id: u64) -> Result<()> {
        let agent_state = &mut ctx.accounts.agent_state;
        agent_state.authority = ctx.accounts.authority.key();
        agent_state.agent_id = agent_id;
        agent_state.balance = 0;
        agent_state.total_trades = 0;
        agent_state.profit_loss = 0;
        agent_state.risk_threshold = 5000; // 50% in basis points
        agent_state.bump = ctx.bumps.agent_state;
        
        emit!(AgentInitialized {
            authority: agent_state.authority,
            agent_id: agent_state.agent_id,
        });
        
        Ok(())
    }

    pub fn execute_trade(
        ctx: Context<ExecuteTrade>,
        amount_in: u64,
        minimum_amount_out: u64,
        trade_type: TradeType,
    ) -> Result<()> {
        let agent_state = &mut ctx.accounts.agent_state;
        
        // Execute token transfer
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.agent_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        );
        
        token::transfer(transfer_ctx, amount_in)?;
        
        // Update agent state
        agent_state.total_trades += 1;
        agent_state.balance += amount_in;
        
        emit!(TradeExecuted {
            agent_id: agent_state.agent_id,
            trade_type,
            amount_in,
            minimum_amount_out,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(agent_id: u64)]
pub struct InitializeAgent<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + AgentState::INIT_SPACE,
        seeds = [b"agent", authority.key().as_ref(), agent_id.to_le_bytes().as_ref()],
        bump
    )]
    pub agent_state: Account<'info, AgentState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    #[account(
        mut,
        seeds = [b"agent", authority.key().as_ref(), agent_state.agent_id.to_le_bytes().as_ref()],
        bump = agent_state.bump,
        has_one = authority
    )]
    pub agent_state: Account<'info, AgentState>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub agent_token_account: Account<'info, TokenAccount>,
    
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct AgentState {
    pub authority: Pubkey,
    pub agent_id: u64,
    pub balance: u64,
    pub total_trades: u64,
    pub profit_loss: i64,
    pub risk_threshold: u16,
    pub max_trade_size: u64,
    pub bump: u8,
}

impl AgentState {
    pub const INIT_SPACE: usize = 32 + 8 + 8 + 8 + 8 + 2 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub enum TradeType {
    Buy,
    Sell,
    Swap,
}

#[event]
pub struct AgentInitialized {
    pub authority: Pubkey,
    pub agent_id: u64,
}

#[event]
pub struct TradeExecuted {
    pub agent_id: u64,
    pub trade_type: TradeType,
    pub amount_in: u64,
    pub minimum_amount_out: u64,
}

#[error_code]
pub enum AgentError {
    #[msg("Invalid risk threshold")]
    InvalidRiskThreshold,
    #[msg("Risk threshold exceeded")]
    RiskThresholdExceeded,
    #[msg("Insufficient balance")]
    InsufficientBalance,
}