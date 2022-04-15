import useObligation from '@/hooks/useObligation';

import DepositCard from './DepositCard';
import Spinner from './Spinner';

export default function DepositList() {
  const obligation = useObligation();
  return (
    <div className="space-y-2">
      {obligation.isLoading ? (
        <Spinner />
      ) : (
        obligation.data?.deposits?.map((deposit, i) => <DepositCard key={i} position={deposit} />)
      )}
    </div>
  );
}
