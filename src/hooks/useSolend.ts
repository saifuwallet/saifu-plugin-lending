import { SolendMarket } from '@solendprotocol/solend-sdk';
import { useConnection, useQuery } from 'saifu';

const useSolend = () => {
  const connection = useConnection();

  return useQuery('solendMarket.initialize', async () => {
    const market = await SolendMarket.initialize(connection);
    await market.loadRewards();
    return market;
  });
};

export default useSolend;
