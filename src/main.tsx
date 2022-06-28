import { Transaction } from '@solana/web3.js';
import { SolendAction, SolendMarket } from '@solendprotocol/solend-sdk';
import { AppContext, BalanceProvider, BalanceType, EarnProvider, Opportunity, Plugin } from 'saifu';

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

class LendingPlugin extends Plugin implements EarnProvider, BalanceProvider {
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

  async getBalances(ctx: AppContext) {
    if (!ctx.publicKey) {
      return [];
    }

    const markets = await this.ensureSolendMarkets(ctx);
    const obligation = await markets.fetchObligationByWallet(ctx.publicKey);
    const balances = obligation?.deposits?.map((obl) => ({
      mint: obl.mintAddress,
      balance: obl.amount.toString(),
      type: BalanceType.Earn,
    }));

    return balances ?? [];
  }

  async getBalanceForMint(ctx: AppContext, mint: string) {
    const m = mint === 'sol' ? 'So11111111111111111111111111111111111111112' : mint;
    return (await this.getBalances(ctx)).find((balance) => balance.mint === m) ?? null;
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

    if (!reserve) {
      return [];
    }

    await reserve.load();

    const solendAction = await SolendAction.buildWithdrawTxns(
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

    if (!ctx.publicKey) {
      return '0';
    }

    const m =
      opportunity.mint === 'sol' ? 'So11111111111111111111111111111111111111112' : opportunity.mint;

    const obligations = await markets.fetchObligationByWallet(ctx.publicKey);
    const foundDeposit = obligations?.deposits.find((deposit) => deposit.mintAddress === m);

    if (foundDeposit) {
      return foundDeposit.amount.toString();
    }

    return '0';
  }
}

export default LendingPlugin;
