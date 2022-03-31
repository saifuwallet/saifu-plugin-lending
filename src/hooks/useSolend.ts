import { AppContext } from '@saifuwallet/saifu';
import { SolendMarket, SolendObligation } from '@solendprotocol/solend-sdk';
import { useEffect, useState } from 'react';

export default function useSolend(app: AppContext) {
  const publicKey = app.hooks.usePublicKey();
  const connection = app.hooks.useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [market, setMarket] = useState<SolendMarket>();
  const [obligations, setObligations] = useState<SolendObligation>();
  useEffect(() => {
    async function initSolend() {
      if (!publicKey) {
        return;
      }
      setIsLoading(true);
      const market = await SolendMarket.initialize(connection);
      setMarket(market);
      const obligations = await market.fetchObligationByWallet(publicKey);
      setObligations(obligations !== null ? obligations : undefined);
      setIsLoading(false);
    }

    initSolend();
  }, [connection, publicKey]);

  return {
    isLoading,
    market,
    obligations,
  };
}

export function useObligations(app: AppContext) {
  const publicKey = app.hooks.usePublicKey();
  const solend = useSolend(app);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SolendObligation>();
  useEffect(() => {
    async function fetchObligations() {
      if (!publicKey) {
        return;
      }
      setIsLoading(true);
      const data = await solend.market?.fetchObligationByWallet(publicKey);
      setData(data !== null ? data : undefined);
      setIsLoading(false);
    }

    fetchObligations();
  }, [publicKey]);

  return {
    isLoading,
    data,
  };
}
