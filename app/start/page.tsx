"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSteps, Steps } from "../../context/StepsContext";

import { Native } from "../../hooks/Native";
import { useBlockchain } from "@/context/BlockchainProvider";

import Step1 from "../../components/steps/S1Main";
import Step2 from "../../components/steps/S2Username";
import Step3 from "../../components/steps/S3Web2Items";
import Step4 from "../../components/steps/S4Web3Items";
import Step5 from "../../components/steps/S5Preview";
import EllipsifiedWalletAddress from "@/components/EllipsifiedAddress";
import { ZeroAddress } from "ethers";

export default function Home() {
  const { currentStep } = useSteps();
  const { getNativeBalance } = Native();
  const { signer, isConnected, handleDisconnectWallet } = useBlockchain();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (isConnected && signer) {
      if (signer.address != ZeroAddress)
        getNativeBalance()
          .then(setBalance)
          .catch((err) => {
            toast.error(err);
          });
      else {
        handleDisconnectWallet();
      }
    }
  }, [isConnected, signer]);

  return (
    <main className="pt-6 xl:text-4xl md:text-2xl">
      {currentStep === Steps.Main && <Step1 />}
      {currentStep === Steps.Username && <Step2 />}
      {currentStep === Steps.Web2Addresses && <Step3 />}
      {currentStep === Steps.Web3Addresses && <Step4 />}
      {currentStep === Steps.Preview && <Step5 />}

      {isConnected && (
        <div className="flex text-left pt-20">
          <div>
            <EllipsifiedWalletAddress walletAddress={signer?.address} />
            {balance && balance > 0 ? (
              <p className="text-xs pt-2 pb-4 text-center">
                <strong>Balance</strong>: {balance} $ETH
              </p>
            ) : (
              <p
                className="text-sm text-red-400"
                title="You need ~$0.1 ETH to reserve your profile"
              >
                🔴 Low Balance! Top up $0.01 worth of ETH on Soneium L2 to mint.
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
