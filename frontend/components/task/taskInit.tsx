"use client";

import React, { useState } from "react";

import * as anchor from "@coral-xyz/anchor";
import Button from "@mui/material/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { useProgram } from "./hooks/useProgram";
import { useTransactionToast } from "./hooks/useTransactionToast";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
/**
 * IncrementButton component that handles its own transaction logic
 * for incrementing the counter.
 */
export function TaskInit() {
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
  const initTask = async () => {
    const taskId = new anchor.BN(70);
    if (!publicKey) return;
    // 生成 PDA
    const [taskPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("task"), taskId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("initialize")],
      program.programId
    );

    setIsLoading(true);
    // Send the transaction
    const account = await program.account.config.fetch(configPda);
    if (!account) {
      const account = await program.methods
        .initialize({ taskManager: null, delegate: null })
        .accounts({
          payer: publicKey,
        })
        .rpc();
      setTransactionSignature(account);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={initTask} disabled={isLoading || !connected} className="">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-purple-200/50 border-t-purple-200 animate-spin mr-2"></div>
          <span>Processing...</span>
        </div>
      ) : (
        "init"
      )}
    </Button>
  );
}
