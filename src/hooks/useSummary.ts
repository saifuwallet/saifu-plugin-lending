import { BalanceSummaryHook } from 'saifu';

import { displayUSD } from '@/lib/number';

import useObligation from './useObligation';

const useSummary: BalanceSummaryHook = () => {
  const obligation = useObligation();
  return {
    isLoading: obligation.isLoading,
    data: [
      {
        title: 'Solend Balance',
        subtitle: 'Borrow Amount',
        value1: displayUSD(obligation?.data?.obligationStats.userTotalDeposit),
        value2: displayUSD((obligation.data?.obligationStats.userTotalBorrow || 0) * -1),
        iconUrl:
          'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp/logo.png',
      },
      {
        title: 'Solend Balance',
        subtitle: 'Borrow Amount',
        value1: displayUSD(obligation?.data?.obligationStats.userTotalDeposit),
        value2: displayUSD((obligation.data?.obligationStats.userTotalBorrow || 0) * -1),
        iconUrl:
          'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp/logo.png',
      },
    ],
  };
};

export default useSummary;
