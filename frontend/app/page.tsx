"use client";

import { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import Button from "@mui/material/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PendingCard, AIAgentCard } from "@/components/uiWrapper/Card";
import { DID_ROOTMUD_URL } from "../lib/utils/constants";
import { NavBar } from "@/components/NavBar";
import { WalletButton } from "@/components/counter/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import BalanceWrapper from "@/hooks/useBanlance";
import {
  ConnectButton,
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { bcs } from "@mysten/sui/bcs";

export default function Home() {
  const { mutateAsync: signTransaction } = useSignTransaction();
  const { walletAddress } = useContext(AppContext);
  const [unsolvedTasks, setUnsolvedTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    prompt: "",
    task_type: "llm",
    fee: "",
    fee_unit: "SUI",
    agent_id: "",
  });
  const rpcUrl = getFullnodeUrl("devnet");

  // create a client connected to devnet
  const client = new SuiClient({ url: rpcUrl });
  const [taskRequestApi, setTaskRequestApi] = useState("");

  const [taskId, setTaskId] = useState("");

  // Add this useEffect after other useEffect declarations
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("https://ai-saas.deno.dev/agents");
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast.error("Failed to fetch agents");
      }
    };
    const fetchTasks = async () => {
      try {
        const response = await fetch("https://ai-saas.deno.dev/task_unsolved");
        const data = await response.json();
        setUnsolvedTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
    fetchAgents();
  }, []);

  const handleSubmitTask = async (address: string) => {
    try {
      const response = await fetch("https://ai-saas.deno.dev/add_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: address,
          ...taskForm,
        }),
      });
      console.log(
        JSON.stringify({
          user: address,
          ...taskForm,
        })
      );
      if (!response.ok) throw new Error("Failed to submit task" + response);

      toast.success("Task submitted successfully!");
      setIsModalOpen(false);
      const tasksResponse = await fetch(
        "https://ai-saas.deno.dev/task_unsolved"
      );
      const data = await tasksResponse.json();
      setUnsolvedTasks(data);
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error(
        "Failed to submit task" +
          JSON.stringify({
            user: address,
            ...taskForm,
          })
      );
    }
  };

  // Add this function near other async functions
  const assignTaskToAgent = async (taskId: any, taskRequestApi: string) => {
    try {
      // First, create the task assignment transaction
      const tx = new Transaction();
      const serializedData = bcs.U8.serialize(taskId);

      // Add a move call to your task contract
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_TASK_PACKAGE_ID}::task::assign_task`,
        arguments: [
          tx.pure(serializedData), // task ID
        ],
      });

      // // Execute ransaction
      await signTransaction({
        transaction:( tx ? tx : new Transaction()as any),
        chain: "sui:testnet",
      });

      // After successful transaction, make the API call
      const response = await fetch(
        taskRequestApi + "?task_id=" + taskId + "&chain=solana"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Task assignment successful!");
      toast.success("Task assigned successfully!");
      setIsAssignTaskModalOpen(false);
      setTaskId("");

      // Refresh the tasks list
      const tasksResponse = await fetch(
        "https://ai-saas.deno.dev/task_unsolved"
      );
      const tasksData = await tasksResponse.json();
      setUnsolvedTasks(tasksData);
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error(
        "Failed to assign task to agent: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <main className="flex flex-col w-full max-w-[1000px] p-[12px] md:px-8 ">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex items-center justify-between border-b-1 border-yellow-200">
        <a href="http://ai-saas.rootmud.xyz" target="_blank" rel="noreferrer">
          <Image
            src="/logo.png"
            width={64}
            height={64}
            style={{ padding: "12px" }}
            alt="logo"
          />
        </a>
        <div className="flex items-center gap-2">
          <NavBar />
          <WalletButton />
          <ThemeToggle />
        </div>
      </div>
      <div className="text-3xl lg:text-6xl mt-14 mb-6 h-36 lg:h-48 rounded-lg text-center">
        <p className="text-3xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mt-10">
          Leverage AI agents as your business workforce
        </p>
        <p className="text-xl pt-[8px] pl-[20px] pr-[20px] text-gray-400 mb-10">
          Assign each an on-chain identity {`</>`}
        </p>
      </div>
      {/* TODO: copy the things in basicContainer to here */}
      <div className="w-full flex-shrink-0 mt-10">
        <center>
          <h3 className="text-xl md:text-2xl font-semibold mb-4 mt-6">
            Your Sui Balance
          </h3>
        </center>
        <BalanceWrapper />
      </div>
      <div className="w-full flex-shrink-0 mt-10">
        <center>
          <h3 className="text-xl md:text-2xl font-semibold mb-4 mt-6">
            Data Panel
          </h3>
        </center>
        <div className="w-full grid grid-cols-3 gap-4 mb-4 mt-4 text-center">
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/15 rounded-md">
            <CardHeader>
              <CardTitle className="text-sm lg:text-lg">Agent Alive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{agents.length.toString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500/15 to-blue-500/20 rounded-md">
            <CardHeader>
              <CardTitle className="text-sm lg:text-lg">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {(unsolvedTasks.length + 6).toString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/15 rounded-md">
            <CardHeader>
              <CardTitle className="text-sm lg:text-lg">
                Unsolved Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {unsolvedTasks.length.toString()}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* TODO: copy the things in basicContainer about Unsolved Tasks Stack Here. */}
      </div>

      <div className="w-full mt-16">
        <div className="w-full flex-shrink-0">
          <center>
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              Unsolved Tasks Stack
            </h3>
          </center>

          <div className="w-full flex flex-wrap justify-center gap-4 mb-4">
            {unsolvedTasks.map((task: any) => (
              <div
                key={task.unique_id}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
              >
                <PendingCard
                  id={task?.id}
                  user={task?.user}
                  task_type={task?.task_type}
                  prompt={task?.prompt}
                  fee={task?.fee}
                  fee_unit={task?.fee_unit}
                  created_at={task?.created_at}
                  unique_id={task?.unique_id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        {true ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-[40%] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-11 text-base font-medium rounded-md"
          >
            Submit New Task
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
          >
            Connect Wallet to Submit Task
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-2xl font-semibold mb-4">Submit New Task</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Task Type
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={taskForm.task_type}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, task_type: e.target.value })
                  }
                  disabled={!!taskForm.agent_id}
                >
                  <option value="llm">LLM</option>
                  <option value="img">IMG</option>
                  <option value="trade">TRADE</option>
                </select>
                {taskForm.agent_id && (
                  <p className="mt-1 text-sm text-gray-500">
                    Task type is locked to match agent capabilities
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Task Description
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  rows={4}
                  value={taskForm.prompt}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, prompt: e.target.value })
                  }
                  placeholder={
                    taskForm.agent_id
                      ? "Describe your task for this specific agent..."
                      : "Describe your task..."
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fee (Optional)
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={taskForm.fee}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, fee: e.target.value })
                  }
                />
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                  value={taskForm.fee_unit}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, fee_unit: e.target.value })
                  }
                >
                  <option value="SUI">SUI</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTaskForm({
                    prompt: "",
                    task_type: "llm",
                    fee: "",
                    fee_unit: "SUI",
                    agent_id: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (walletAddress) {
                    handleSubmitTask(walletAddress);
                  } else {
                    toast.error("Please connect your wallet first");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TODO: copy the AI Agents part in basicContainer to here */}
      <center>
        <h3 className="text-3xl font-semibold mt-16 mb-4">AI Agents</h3>
      </center>

      <div className="w-full flex flex-wrap justify-center gap-4 mb-4">
        {agents.map((agent: any) => (
          <div
            key={agent.unique_id}
            className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <AIAgentCard
              description={agent.description}
              type={agent.type}
              addr={agent.addr}
              owner_addr={agent.owner_addr}
              unique_id={agent.unique_id}
              chat_url={agent.chat_url}
              assignTaskDom={
                <Button
                  style={{ marginTop: "10px" }}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setIsAssignTaskModalOpen(true);
                    setTaskRequestApi(agent.task_request_api);
                  }}
                >
                  Assign Task
                </Button>
              }
            />
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center">
        <button
          onClick={() => setIsAgentModalOpen(true)}
          className="w-[40%] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-11 text-base font-medium rounded-md"
        >
          New Agent Register Guide
        </button>
      </div>

      {isAssignTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              Assign Task to This Agent
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Task Id
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-blue-500"
                rows={1}
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => assignTaskToAgent(taskId, taskRequestApi)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!taskId.trim()}
              >
                Request
              </button>
              <button
                onClick={() => setIsAssignTaskModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isAgentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-2xl font-semibold mb-4 text-black">
              How to Register Your AI Agent
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="font-medium mb-2">Step 1:</p>
                <p className="flex items-center">
                  Git Clone The Template From:
                  <a
                    href="https://github.com/NonceGeek/tai-shang-micro-ai-saas/tree/main/agents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    Templates
                  </a>
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="font-medium mb-2">Step 2:</p>
                <p>Deploy AI Agent on Deno</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="font-medium mb-2">Step3:</p>
                <p>Run Register with Agent: https://YOUR_AGENT_URL/register</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="font-medium mb-2">Step4:</p>
                <p>
                  Give Agent a MoveDID:{" "}
                  <a
                    href={DID_ROOTMUD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    DID Manager
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsAgentModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto text-center py-4 text-gray-600">
        Powered by DIMSUM AI Lab@2025
      </footer>
    </main>
  );
}
