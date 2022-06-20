import { SolendMarket } from '@solendprotocol/solend-sdk';
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

  async onload(): Promise<void> {
    this.addView({
      id: 'overview',
      title: 'Lending',
      component: Solend,
      icon: <SolendIcon className="h-5 w-5" />,
    });
  }

  async getOpportunities(ctx: AppContext) {
    if (!this.markets) {
      this.markets = await SolendMarket.initialize(ctx.connection);
      await this.markets.loadRewards();
    }

    const opportunities = this.markets?.reserves.map((reserve) => ({
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
    if (!this.markets) {
      this.markets = await SolendMarket.initialize(ctx.connection);
      await this.markets.loadRewards();
    }

    const m = mint === 'sol' ? 'So11111111111111111111111111111111111111112' : mint;

    const reserve = this.markets?.reserves.find((res) => res.config.mintAddress === m);

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
    if (!this.markets) {
      this.markets = await SolendMarket.initialize(ctx.connection);
      await this.markets.loadRewards();
    }

    if (ctx.publicKey) {
      const m =
        opportunity.mint === 'sol'
          ? 'So11111111111111111111111111111111111111112'
          : opportunity.mint;

      const obligations = await this.markets.fetchObligationByWallet(ctx.publicKey);

      const foundDeposit = obligations?.deposits.find((deposit) => deposit.mintAddress === m);

      if (foundDeposit) {
        return foundDeposit.amount.toNumber();
      }
    }

    return 0;
  }
}

export default LendingPlugin;
