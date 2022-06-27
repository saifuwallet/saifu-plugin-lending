import { Transaction } from '@solana/web3.js';
import { SolendAction, SolendMarket } from '@solendprotocol/solend-sdk';
import { AppContext, EarnProvider, Opportunity, Plugin } from 'saifu';

import SolendIcon from '@/components/SolendIcon';

import DepositList from './components/DepositList';
import SummaryCard from './components/SummaryCard';

const Solend = () => {
  return (
    <div className="space-y-4">
      <SummaryCard />
      <DepositList />
    </div>
  );
};

class LendingPlugin extends Plugin implements EarnProvider {
  id = 'lending';
  markets: SolendMarket | undefined;

  async ensureSolendMarkets(ctx: AppContext) {
    if (!this.markets) {
      this.markets = await SolendMarket.initialize(ctx.connection);
      await this.markets.loadRewards();
    }

    return this.markets;
  }

  async onload(): Promise<void> {
    this.addView({
      id: 'overview',
      title: 'Lending',
      component: Solend,
      icon: <SolendIcon className="h-5 w-5" />,
    });
  }

  async getOpportunityWithdrawTransactions(
    ctx: AppContext,
    op: Opportunity,
    amount: string
  ): Promise<Transaction[]> {
    const markets = await this.ensureSolendMarkets(ctx);

    if (!ctx.publicKey) {
      return [];
    }

    const m = op.mint === 'sol' ? 'So11111111111111111111111111111111111111112' : op.mint;

    const reserve = markets.reserves.find((res) => res.config.mintAddress === m);
    reserve?.config.symbol;

    console.log('found reserve', reserve);

    if (!reserve) {
      return [];
    }

    await reserve.load();

    console.log('reserve loaded');

    const solendAction = await SolendAction.buildWithdrawTxns(
      ctx.connection,
      amount,
      reserve?.config.symbol,
      ctx.publicKey,
      'production'
    );

    const txs = await solendAction.getTransactions();
    console.log('txs', txs);

    return [txs.preLendingTxn, txs.lendingTxn, txs.postLendingTxn].filter(
      (x) => !!x
    ) as Transaction[];
  }

  async getOpportunityDepositTransactions(
    ctx: AppContext,
    op: Opportunity,
    amount: string
  ): Promise<Transaction[]> {
    const markets = await this.ensureSolendMarkets(ctx);

    if (!ctx.publicKey) {
      return [];
    }

    const m = op.mint === 'sol' ? 'So11111111111111111111111111111111111111112' : op.mint;

    const reserve = markets.reserves.find((res) => res.config.mintAddress === m);
    reserve?.config.symbol;

    if (!reserve) {
      return [];
    }

    const solendAction = await SolendAction.buildDepositTxns(
      ctx.connection,
      amount,
      reserve?.config.symbol,
      ctx.publicKey,
      'production'
    );

    const txs = await solendAction.getTransactions();
    return [txs.preLendingTxn, txs.lendingTxn, txs.postLendingTxn].filter(
      (x) => !!x
    ) as Transaction[];
  }

  async getOpportunities(ctx: AppContext) {
    const markets = await this.ensureSolendMarkets(ctx);

    const opportunities = markets.reserves.map((reserve) => ({
      id: reserve.config.address,
      title: `Solend ${reserve.config.name}`,
      mint:
        reserve.config.mintAddress === 'So11111111111111111111111111111111111111112'
          ? 'sol'
          : reserve.config.mintAddress,
      rate: (reserve?.totalSupplyAPY().totalAPY ?? 0) * 100 * 100,
    }));

    return opportunities ?? [];
  }

  async getOpportunitiesForMint(ctx: AppContext, mint: string) {
    const markets = await this.ensureSolendMarkets(ctx);

    const m = mint === 'sol' ? 'So11111111111111111111111111111111111111112' : mint;

    const reserve = markets.reserves.find((res) => res.config.mintAddress === m);

    if (!reserve) {
      return [];
    }

    await reserve.load();

    return [
      {
        id: reserve?.config.address,
        title: `Solend ${reserve?.config.name}`,
        mint: mint,
        rate: (reserve?.totalSupplyAPY().totalAPY ?? 0) * 100 * 100,
      },
    ];
  }

  async getOpportunityBalance(ctx: AppContext, opportunity: Opportunity) {
    const markets = await this.ensureSolendMarkets(ctx);

    console.log('pk ', ctx.publicKey);

    if (!ctx.publicKey) {
      return '0';
    }

    const m =
      opportunity.mint === 'sol' ? 'So11111111111111111111111111111111111111112' : opportunity.mint;

    console.log('mint ', m);

    const obligations = await markets.fetchObligationByWallet(ctx.publicKey);

    console.log(obligations);

    const foundDeposit = obligations?.deposits.find((deposit) => deposit.mintAddress === m);

    if (foundDeposit) {
      return foundDeposit.amount.toString();
    }

    return '0';
  }
}

export default LendingPlugin;
