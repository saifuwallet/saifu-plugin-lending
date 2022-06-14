import { Box, Text, TokenLogo } from '@saifuwallet/saifu-ui';
import { Position } from '@solendprotocol/solend-sdk';
import { useMemo } from 'react';
import { useTokenInfos, usePrice } from 'saifu';

import useSolend from '@/hooks/useSolend';
import { displayPercentage, lamportsToSol, lamportsToUSD } from '@/lib/number';

export default function DepositCard({
  position,
  skeleton,
}: {
  position?: Position;
  skeleton?: boolean;
}) {
  const tokenInfos = useTokenInfos();
  const solend = useSolend();
  const tokenInfo = useMemo(
    () => position && tokenInfos.find((t) => t.address === position.mintAddress),
    [position?.mintAddress, tokenInfos]
  );

  const supplyAPY = useMemo(
    () =>
      position &&
      solend.data?.reserves
        ?.find((r) => r.config.mintAddress === position.mintAddress)
        ?.totalSupplyAPY().totalAPY,
    [position, solend.data]
  );

  const price = usePrice(tokenInfo);
  return (
    <Box
      start={
        <TokenLogo
          isLoading={skeleton}
          size="sm"
          className="my-auto mr-4"
          url={tokenInfo?.logoURI}
        />
      }
    >
      <div className="flex leading-5">
        <div className="grow">
          <div>
            <Text weight="semibold" isLoading={skeleton}>
              {tokenInfo?.symbol}
            </Text>
          </div>
          <div>
            <Text
              size="sm"
              variant="secondary"
              placeholderCharLength={10}
              isLoading={solend.isLoading || skeleton}
            >
              {lamportsToSol(position?.amount.toNumber(), tokenInfo?.decimals)}
            </Text>
          </div>
        </div>
        <div className="flex-none text-right">
          <div>
            <Text
              isLoading={price.isLoading || skeleton}
              weight="medium"
              placeholderCharLength={10}
            >
              {position &&
                lamportsToUSD(position?.amount.toNumber(), price.data || 0, tokenInfo?.decimals)}
            </Text>
          </div>
          <div>
            <Text
              variant="secondary"
              size="sm"
              isLoading={price.isLoading || skeleton}
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
