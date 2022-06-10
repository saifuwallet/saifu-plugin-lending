import { Card, Spinner } from '@saifuwallet/saifu-ui';

import useObligation from '@/hooks/useObligation';

import DepositCard from './DepositCard';

export default function DepositList() {
  const obligation = useObligation();
  return (
    <Card>
      <div className="overflow-hidden rounded-lg">
        {obligation.isLoading ? (
          <Spinner />
        ) : (
          obligation.data?.deposits?.map((deposit, i) => <DepositCard key={i} position={deposit} />)
        )}
      </div>
    </Card>
  );
}
