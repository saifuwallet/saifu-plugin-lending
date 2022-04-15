import { Position } from '@solendprotocol/solend-sdk';
import { useMemo } from 'react';
import { useTokenInfos, usePrice } from 'saifu';

import useSolend from '@/hooks/useSolend';
import { displayPercentage, lamportsToSol, lamportsToUSD } from '@/lib/number';

import Card from './Card';
import TokenLogo from './TokenLogo';

export default function DepositCard({ position }: { position: Position }) {
  const tokenInfos = useTokenInfos();
  const solend = useSolend();
  const tokenInfo = useMemo(
    () => tokenInfos.find((t) => t.address === position.mintAddress),
    [position.mintAddress, tokenInfos]
  );

  const supplyAPY = useMemo(
    () =>
      solend.data?.reserves
        ?.find((r) => r.config.mintAddress === position.mintAddress)
        ?.totalSupplyAPY().totalAPY,
    [position, solend.data]
  );

  const price = usePrice(tokenInfo);
  return (
    <Card className="flex space-x-2">
      <div className="flex-none">
        <TokenLogo url={tokenInfo?.logoURI} alt={position.mintAddress} />
      </div>
      <div className="flex-grow text-left">
        <p className="font-bold">{tokenInfo?.symbol} </p>
        <p className="font-bold text-gray-400">{displayPercentage(supplyAPY)}</p>
      </div>
      <div className="flex-none text-right">
        <p className="font-bold">
          {lamportsToSol(position.amount.toNumber(), tokenInfo?.decimals)}
        </p>
        <p className="">
          {lamportsToUSD(position.amount.toNumber(), price.data || 0, tokenInfo?.decimals)}
        </p>
      </div>
    </Card>
  );
}
