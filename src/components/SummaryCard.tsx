import { Card, Text } from '@saifuwallet/saifu-ui';

import useObligation from '@/hooks/useObligation';
import { displayUSD, displayPercentage } from '@/lib/number';

export default function SummaryCard() {
  const obligation = useObligation();
  return (
    <Card className="space-y-2 p-4">
      <div>
        <Text as="p" weight="bold">
          Net Assets
        </Text>
        <div>
          <Text isLoading={obligation.isLoading || obligation.isIdle} size="2xl" weight="bold">
            {displayUSD(obligation.data?.obligationStats?.netAccountValue)}
          </Text>
        </div>
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
            <Text isLoading={obligation.isLoading || obligation.isIdle} size="sm" weight="semibold">
              {displayUSD(obligation.data?.obligationStats.userTotalDeposit)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text size="sm">Borrow Balance</Text>
          </td>
          <td className="text-right">
            <Text isLoading={obligation.isLoading || obligation.isIdle} size="sm" weight="semibold">
              {displayUSD(obligation.data?.obligationStats.userTotalBorrow)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text size="sm">Utilization</Text>
          </td>
          <td className="text-right">
            <Text size="sm" isLoading={obligation.isLoading || obligation.isIdle} weight="semibold">
              {displayPercentage(obligation.data?.obligationStats.borrowUtilization)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text size="sm">Borrow Limit</Text>
          </td>
          <td className="text-right">
            <Text size="sm" isLoading={obligation.isLoading || obligation.isIdle} weight="semibold">
              {displayUSD(obligation.data?.obligationStats.borrowLimit)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text size="sm">Liquidation Threshold</Text>
          </td>
          <td className="text-right">
            <Text size="sm" isLoading={obligation.isLoading || obligation.isIdle} weight="semibold">
              {displayUSD(obligation.data?.obligationStats.liquidationThreshold)}
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
