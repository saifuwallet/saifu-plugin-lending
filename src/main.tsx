import { Plugin, AppContext, ViewProps } from '@saifuwallet/saifu';
import { Position, SolendMarket, SolendObligation } from '@solendprotocol/solend-sdk';
import { FunctionComponent } from 'react';

import Card from '@/components/Card';
import SolendIcon from '@/components/SolendIcon';
import Spinner from '@/components/Spinner';
import TokenLogo from '@/components/TokenLogo';
import useSolend from '@/hooks/useSolend';
import { displayPercentage, displayUSD, lamportsToSol, lamportsToUSD } from '@/lib/number';

const Solend: FunctionComponent<ViewProps> = ({ app }) => {
  const solend = useSolend(app);

  return (
    <div>
      <div className="space-y-4">
        <div>
          <SummaryCard isLoading={solend.isLoading} obligation={solend.obligations} />
        </div>
        <DepositList market={solend.market} app={app} obligation={solend.obligations} />
      </div>
    </div>
  );
};

const DepositList = ({
  obligation,
  app,
  market,
}: {
  app: AppContext;
  obligation?: SolendObligation | null;
  market?: SolendMarket;
}) => {
  return (
    <div className="space-y-2">
      {obligation?.deposits?.map((deposit, i) => (
        <PositionCard market={market} app={app} key={i} position={deposit} />
      ))}
    </div>
  );
};

const PositionCard = ({
  position,
  app,
  market,
}: {
  market?: SolendMarket;
  position: Position;
  app: AppContext;
}) => {
  const tokenInfos = app.hooks.useTokenInfos();
  const tokenInfo = tokenInfos.find((t) => t.address === position.mintAddress);

  const price = app.hooks.usePrice(tokenInfo);
  return (
    <Card className="flex space-x-2">
      <div className="flex-none">
        <TokenLogo url={tokenInfo?.logoURI} alt={position.mintAddress} />
      </div>
      <div className="flex-grow text-left">
        <p className="font-bold">{tokenInfo?.symbol} </p>
        <p>
          {displayPercentage(
            market?.reserves?.find((r) => r.config.mintAddress === position.mintAddress)?.stats
              ?.supplyInterestAPY
          )}
        </p>
      </div>
      <div className="flex-none text-right">
        <p className="font-bold">
          {lamportsToSol(position.amount.toNumber(), tokenInfo?.decimals)}
        </p>
        <p className="">
          {lamportsToUSD(position.amount.toNumber(), price.data || 0, tokenInfo?.decimals)}
        </p>
      </div>
    </Card>
  );
};

const SummaryCard = ({
  obligation,
  isLoading,
}: {
  isLoading: boolean;
  obligation?: SolendObligation | null;
}) => {
  return (
    <Card className="space-y-2" variant="highlight" size="md">
      <div>
        <p className="font-bold">Net Assets</p>
        <p className="text-2xl font-extrabold">
          {isLoading ? <Spinner /> : `${displayUSD(obligation?.obligationStats?.netAccountValue)}`}
        </p>
      </div>
      <ObligationInfoTable isLoading={isLoading} obligation={obligation} />
    </Card>
  );
};

const ObligationInfoTable = ({
  obligation,
}: {
  obligation?: SolendObligation | null;
  isLoading: boolean;
}) => (
  <table className="table-auto w-full">
    <tbody>
      <tr>
        <td className="text-orange-200">Deposit Balance</td>
        <td className="text-right font-semibold">
          {displayUSD(obligation?.obligationStats.userTotalDeposit)}
        </td>
      </tr>
      <tr>
        <td className="text-orange-200">Borrow Balance</td>
        <td className="text-right font-semibold">
          {displayUSD(obligation?.obligationStats.userTotalBorrow)}
        </td>
      </tr>
      <tr>
        <td className="text-orange-200">Utilization</td>
        <td className="text-right font-semibold">
          {displayPercentage(obligation?.obligationStats.borrowUtilization)}
        </td>
      </tr>
      <tr>
        <td className="text-orange-200">Borrow Limit</td>
        <td className="text-right font-semibold">
          {displayUSD(obligation?.obligationStats.borrowLimit)}
        </td>
      </tr>
      <tr>
        <td className="text-orange-200">Liquidation Threshold</td>
        <td className="text-right font-semibold">
          {displayUSD(obligation?.obligationStats.liquidationThreshold)}
        </td>
      </tr>
    </tbody>
  </table>
);

class SolendPlugin extends Plugin {
  name = 'Solend View';
  description = 'Plugin to view your Solend Obligations';
  id = 'solend-plugin';

  async onload(): Promise<void> {
    this.addView({
      title: 'Solend',
      id: 'overview',
      component: Solend,
      icon: <SolendIcon className="h-5 w-5" variant="white" />,
    });
  }
}

export default SolendPlugin;
