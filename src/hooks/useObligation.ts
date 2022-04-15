import { usePublicKey, useQuery } from 'saifu';

import useSolend from './useSolend';

export default function useObligation() {
  const publicKey = usePublicKey();
  const solend = useSolend();
  return useQuery(
    ['fetchObligationByWallet', publicKey?.toString()],
    async () => {
      if (!solend.data || !publicKey) {
        return;
      }
      await solend.data.loadAll();
      const obligation = await solend.data.fetchObligationByWallet(publicKey);
      return obligation || undefined;
    },
    { enabled: !!publicKey && !!solend.data }
  );
}
