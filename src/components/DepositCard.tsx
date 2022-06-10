import { Box, Text, TokenLogo } from '@saifuwallet/saifu-ui';
import { Position } from '@solendprotocol/solend-sdk';
import { useMemo } from 'react';
import { useTokenInfos, usePrice } from 'saifu';

import useSolend from '@/hooks/useSolend';
import { displayPercentage, lamportsToSol, lamportsToUSD } from '@/lib/number';

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
    <Box
      className="bg-white bg-origin-content"
      start={<TokenLogo size="sm" className="my-auto mr-4" url={tokenInfo?.logoURI} />}
    >
      <div className="flex leading-5">
        <div className="grow">
          <div>
            <Text weight="semibold">{tokenInfo?.symbol}</Text>
          </div>
          <div>
            <Text
              size="sm"
              variant="secondary"
              placeholderCharLength={10}
              isLoading={solend.isLoading}
            >
              {lamportsToSol(position.amount.toNumber(), tokenInfo?.decimals)}
            </Text>
          </div>
        </div>
        <div className="flex-none text-right">
          <div>
            <Text isLoading={price.isLoading} weight="medium" placeholderCharLength={10}>
              {lamportsToUSD(position.amount.toNumber(), price.data || 0, tokenInfo?.decimals)}
            </Text>
          </div>
          <div>
            <Text
              variant="secondary"
              size="sm"
              isLoading={price.isLoading}
              placeholderCharLength={10}
            >
              {displayPercentage(supplyAPY)}
            </Text>
          </div>
        </div>
      </div>
    </Box>
  );
}
