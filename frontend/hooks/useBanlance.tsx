import { useContext, useMemo } from "react";
import {
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { AppContext } from "@/context/AppContext";

const BalanceWrapper = () => {
  const { walletAddress } = useContext(AppContext);
  const { data: suiBalance, isLoading } = useSuiClientQuery("getBalance", {
    owner: walletAddress ?? "",
  });

  const userBalance = useMemo(() => {
    if (suiBalance?.totalBalance) {
      return Math.floor(Number(suiBalance?.totalBalance) / 10 ** 9);
    }
    return 0;
  }, [suiBalance]);

  if (isLoading) {
    return (
      <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text text-center">
      {userBalance} SUI
    </div>
  );
};

export default BalanceWrapper;
