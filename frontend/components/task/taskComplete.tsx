"use client";

import React, { useState } from "react";

import Button from "@mui/material/Button";
import * as anchor from "@coral-xyz/anchor";
import { toast } from "sonner";
import { useProgram } from "./hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTransactionToast } from "./hooks/useTransactionToast";
import { SystemProgram, PublicKey } from "@solana/web3.js";

/**
 * IncrementButton component that handles its own transaction logic
 * for incrementing the counter.
 */
export function TaskConfirm() {
  // Get program and wallet information from the hook
  const { program, publicKey, connected } = useProgram();
  const taskId = new anchor.BN(70);
  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);

  // Use transaction toast hook
  useTransactionToast({ transactionSignature });

  const { wallet } = useWallet();
  // Handle increment button click
  const confirmTask = async () => {
    const publicKey = wallet?.adapter?.publicKey;
    if (!publicKey) return;
    // 生成 PDA
    const [taskPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("task"), taskId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    const [configPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("initialize")],
      program.programId
    );

    // Create task if it doesn't exist yet
    try {
      await program.account.task.fetch(taskPDA);
    } catch (e) {
      console.log("Task account doesn't exist, creating it first...");
      const tx1 = await program.methods
        .completeTask({
          taskId: taskId,
          taskName: "Test Task",
          taskDescription: "This is a test task description",
        })
        .accounts({
          payer: publicKey,
        })
        .rpc();
      setTransactionSignature(tx1);
    }
  };

  return (
    <Button
      onClick={confirmTask}
      disabled={isLoading || !connected}
      variant="outlined"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-purple-200/50 border-t-purple-200 animate-spin mr-2"></div>
          <span>Processing...</span>
        </div>
      ) : (
        "completed Task"
      )}
    </Button>
  );
}
