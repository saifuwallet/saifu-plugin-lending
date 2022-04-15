import useObligation from '@/hooks/useObligation';
import useSolend from '@/hooks/useSolend';
import { displayUSD, displayPercentage } from '@/lib/number';

import Card from './Card';
import Spinner from './Spinner';

export default function SummaryCard() {
  const solend = useSolend();
  const obligation = useObligation();
  return (
    <Card className="space-y-2" variant="highlight" size="md">
      <div>
        <p className="font-bold">Net Assets</p>
        <p className="text-2xl font-extrabold">
          {obligation.isLoading || solend.isLoading ? (
            <Spinner />
          ) : (
            `${displayUSD(obligation.data?.obligationStats?.netAccountValue)}`
          )}
        </p>
      </div>
      <ObligationInfoTable />
    </Card>
  );
}

const ObligationInfoTable = () => {
  const obligation = useObligation();
  return (
    <table className="table-auto w-full">
      <tbody>
        <tr>
          <td className="text-orange-200">Deposit Balance</td>
          <td className="text-right font-semibold">
            {displayUSD(obligation.data?.obligationStats.userTotalDeposit)}
          </td>
        </tr>
        <tr>
          <td className="text-orange-200">Borrow Balance</td>
          <td className="text-right font-semibold">
            {displayUSD(obligation.data?.obligationStats.userTotalBorrow)}
          </td>
        </tr>
        <tr>
          <td className="text-orange-200">Utilization</td>
          <td className="text-right font-semibold">
            {displayPercentage(obligation.data?.obligationStats.borrowUtilization)}
          </td>
        </tr>
        <tr>
          <td className="text-orange-200">Borrow Limit</td>
          <td className="text-right font-semibold">
            {displayUSD(obligation.data?.obligationStats.borrowLimit)}
          </td>
        </tr>
        <tr>
          <td className="text-orange-200">Liquidation Threshold</td>
          <td className="text-right font-semibold">
            {displayUSD(obligation.data?.obligationStats.liquidationThreshold)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
