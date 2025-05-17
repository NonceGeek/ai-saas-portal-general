"use client";

import React, { useState } from "react";
import * as anchor from "@coral-xyz/anchor";

import Button from "@mui/material/Button";
import { toast } from "sonner";
import { useProgram } from "./hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTransactionToast } from "./hooks/useTransactionToast";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
/**
 * IncrementButton component that handles its own transaction logic
 * for incrementing the counter.
 */
export function Claim() {
  // Get program and wallet information from the hook
  const { program, connected } = useProgram();
  const { wallet } = useWallet();
  const publicKey = wallet?.adapter?.publicKey;
  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);

  // Use transaction toast hook
  useTransactionToast({ transactionSignature });

  // Handle increment button click
  const claimTask = async () => {
    const taskId = new anchor.BN(70);
    if (!publicKey) return;
    // 生成 PDA
    const [taskPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("task"), new BN(70).toArrayLike(Buffer, "le", 8)],
      SystemProgram.programId
    );
    const [configPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      SystemProgram.programId
    );

    try {
      setIsLoading(true);
      // Send the transaction
      const tx = await program.methods
        .claimTask({
          taskId: taskId,
        })
        .accounts({
          payer: publicKey,
        })
        .rpc();
    } catch (err) {
      console.error("Error task confirm:", err);
      toast.error("task confirm", {
        description: `${err}`,
        style: {
          border: "1px solid rgba(239, 68, 68, 0.3)",
          background:
            "linear-gradient(to right, rgba(40, 27, 27, 0.95), rgba(28, 23, 23, 0.95))",
        },
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={claimTask}
      // disabled={isLoading || !connected}
      style={{ marginLeft: 8 }}
      variant="contained"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-purple-200/50 border-t-purple-200 animate-spin mr-2"></div>
          <span>Processing...</span>
        </div>
      ) : (
        "Claim"
      )}
    </Button>
  );
}
