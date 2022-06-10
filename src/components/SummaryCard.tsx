import { Card, Spinner, Text } from '@saifuwallet/saifu-ui';

import useObligation from '@/hooks/useObligation';
import useSolend from '@/hooks/useSolend';
import { displayUSD, displayPercentage } from '@/lib/number';

export default function SummaryCard() {
  const solend = useSolend();
  const obligation = useObligation();
  return (
    <Card className="space-y-2 p-4">
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
    <table className="table-auto w-full p-4">
      <tbody>
        <tr>
          <td>
            <Text size="sm">Deposit Balance</Text>
          </td>
          <td className="text-right">
            <Text size="sm" weight="semibold">
              {displayUSD(obligation.data?.obligationStats.userTotalDeposit)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text size="sm">Borrow Balance</Text>
          </td>
          <td className="text-right">
            <Text size="sm" weight="semibold">
              {displayUSD(obligation.data?.obligationStats.userTotalBorrow)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text size="sm">Utilization</Text>
          </td>
          <td className="text-right">
            <Text size="sm" weight="semibold">
              {displayPercentage(obligation.data?.obligationStats.borrowUtilization)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text size="sm">Borrow Limit</Text>
          </td>
          <td className="text-right">
            <Text size="sm" weight="semibold">
              {displayUSD(obligation.data?.obligationStats.borrowLimit)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text size="sm">Liquidation Threshold</Text>
          </td>
          <td className="text-right">
            <Text size="sm" weight="semibold">
              {displayUSD(obligation.data?.obligationStats.liquidationThreshold)}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
