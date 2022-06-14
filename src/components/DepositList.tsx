import { Card } from '@saifuwallet/saifu-ui';

import useObligation from '@/hooks/useObligation';

import DepositCard from './DepositCard';

export default function DepositList() {
  const obligation = useObligation();
  return (
    <Card>
      <div className="overflow-hidden rounded-lg">
        {obligation.isLoading || obligation.isIdle ? (
          <>
            <DepositCard skeleton />
            <DepositCard skeleton />
            <DepositCard skeleton />
          </>
        ) : (
          obligation.data?.deposits?.map((deposit, i) => <DepositCard key={i} position={deposit} />)
        )}
      </div>
    </Card>
  );
}
