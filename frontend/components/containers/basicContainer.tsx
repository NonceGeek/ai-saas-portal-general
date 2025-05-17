// "use client";
// import Button from "@mui/material/Button";
// import BasicDataField from "../fields/basicDataField";
// import BasicInputField from "../fields/basicInputField";
// import ActionButton from "../buttons/actionButton";
// import Typography from "@mui/material/Typography";
// import { useContext, useMemo, useState, useEffect } from "react";
// import {
//   useAccounts,
//   useSignAndExecuteTransaction,
//   useSuiClient,
//   useSuiClientQuery,
// } from "@mysten/dapp-kit";
// import TextField from "@mui/material/TextField";
// import { Transaction } from "@mysten/sui/transactions";
// import { AppContext } from "@/context/AppContext";
// import { toast } from "react-toastify";
// import LinksContainer from "./linkContainer";
// import { AIAgentCard, PendingCard } from "../uiWrapper/Card";
// import BasicModal from "../uiWrapper/Modal";
// import BasicSelect from "../uiWrapper/Select";

// const BasicContainer = () => {
//   const { walletAddress, suiName } = useContext(AppContext);
//   const { data: suiBalance } = useSuiClientQuery("getBalance", {
//     owner: walletAddress ?? "",
//   });
//   const [selectedToken, setSelectedToken] = useState<string>("SUI");
//   const [input, setInput] = useState<string>("");
//   const client = useSuiClient();
//   const [account] = useAccounts();
//   const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
//   const [unsolvedTasks, setUnsolvedTasks] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [taskForm, setTaskForm] = useState({
//     prompt: "",
//     task_type: "llm",
//     fee: "",
//     fee_unit: "SUI",
//   });
//   const [agents, setAgents] = useState([]);
//   const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
//   const [agentForm, setAgentForm] = useState({
//     addr: "",
//     owner_addr: "",
//     type: "llm",
//     chat_url: "",
//     source_url: "",
//   });

//   const userBalance = useMemo(() => {
//     if (suiBalance?.totalBalance) {
//       return Math.floor(Number(suiBalance?.totalBalance) / 10 ** 9);
//     } else {
//       return 0;
//     }
//   }, [suiBalance]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await fetch("https://ai-saas.deno.dev/task_unsolved");
//         const data = await response.json();
//         setUnsolvedTasks(data);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         toast.error("Failed to fetch tasks");
//       }
//     };

//     const fetchAgents = async () => {
//       try {
//         const response = await fetch("https://ai-saas.deno.dev/agents");
//         const data = await response.json();
//         setAgents(data);
//       } catch (error) {
//         console.error("Error fetching agents:", error);
//         toast.error("Failed to fetch agents");
//       }
//     };

//     fetchTasks();
//     fetchAgents();
//   }, []);

//   const handleSubmitTask = async () => {
//     try {
//       const response = await fetch("https://ai-saas.deno.dev/add_task", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           user: walletAddress,
//           ...taskForm,
//         }),
//       });
//       console.log(
//         JSON.stringify({
//           user: walletAddress,
//           ...taskForm,
//         })
//       );
//       if (!response.ok) throw new Error("Failed to submit task" + response);

//       toast.success("Task submitted successfully!");
//       setIsModalOpen(false);
//       const tasksResponse = await fetch(
//         "https://ai-saas.deno.dev/task_unsolved"
//       );
//       const data = await tasksResponse.json();
//       setUnsolvedTasks(data);
//     } catch (error) {
//       console.error("Error submitting task:", error);
//       toast.error(
//         "Failed to submit task" +
//           JSON.stringify({
//             user: walletAddress,
//             ...taskForm,
//           })
//       );
//     }
//   };

//   const handleSubmitAgent = async () => {
//     try {
//       const response = await fetch("https://ai-saas.deno.dev/add_agent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(agentForm),
//       });

//       if (!response.ok) throw new Error("Failed to submit agent");

//       toast.success("Agent submitted successfully!");
//       setIsAgentModalOpen(false);
//       const agentsResponse = await fetch("https://ai-saas.deno.dev/agents");
//       const data = await agentsResponse.json();
//       setAgents(data);
//     } catch (error) {
//       console.error("Error submitting agent:", error);
//       toast.error("Failed to submit agent");
//     }
//   };

//   // async function handleTx() {
//   //   console.log(input);
//   //   const tx = new Transaction();

//   //   // PTB part

//   //   // Dry run
//   //   tx.setSender(account.address);
//   //   const dryRunRes = await client.dryRunTransactionBlock({
//   //     transactionBlock: await tx.build({ client }),
//   //   });
//   //   if (dryRunRes.effects.status.status === "failure") {
//   //     toast.error(dryRunRes.effects.status.error);
//   //     return;
//   //   }

//   //   // Execute
//   //   signAndExecuteTransaction(
//   //     {
//   //       transaction: tx,
//   //     },
//   //     {
//   //       onSuccess: async (txRes) => {
//   //         const finalRes = await client.waitForTransaction({
//   //           digest: txRes.digest,
//   //           options: {
//   //             showEffects: true,
//   //           },
//   //         });
//   //         toast.success("Tx Success!");
//   //         console.log(finalRes);
//   //       },
//   //       onError: (err) => {
//   //         toast.error(err.message);
//   //         console.log(err);
//   //       },
//   //     }
//   //   );
//   // }

//   return (
//     <div className="w-[100%] sm:w-[100%] md:w-[90%] lg:w-[80%] mt-20 overflow-y-auto flex flex-col items-center gap-4 p-0 lg:p-4">
//       <LinksContainer />
//       {/* Header section for agent and task status */}
//       <div className="w-full flex-shrink-0 p-4 mb-2 lg:mb-10">
//         <center>
//           <h3 className="text-3xl font-semibold mb-4">Data Panel</h3>
//         </center>
//         <div className="w-full grid grid-cols-2 gap-4 mb-2 text-nowrap">
//           {/* <div></div> */}
//           <BasicDataField
//             label="Agent Alive"
//             value={agents.length.toString()}
//             spaceWithUnit={false}
//           />
//           <BasicDataField
//             label="Unsolved Tasks"
//             value={unsolvedTasks.length.toString()} // Display actual count of unsolved tasks
//             spaceWithUnit={false}
//           />
//         </div>
//       </div>

//       <div className="w-full flex-shrink-0 mb-10">
//         <center>
//           <h3 className="text-xl md:text-2xl font-semibold mb-4">
//             Unsolved Tasks Stack
//           </h3>
//         </center>

//         <div className="w-full flex flex-wrap justify-center gap-4">
//           {unsolvedTasks.map((task: any) => (
//             <div
//               key={task.unique_id}
//               className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
//             >
//               <PendingCard
//                 id={task?.id}
//                 user={task?.user}
//                 task_type={task?.task_type}
//                 prompt={task?.prompt}
//                 fee={task?.fee}
//                 fee_unit={task?.fee_unit}
//                 created_at={task?.created_at}
//                 solution={task?.solution}
//                 solver_type={task?.solver_type}
//                 unique_id={task?.unique_id}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="w-full flex justify-center mt-4">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
//           >
//             Submit New Task
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <BasicModal>
//           <h3 className="text-2xl font-semibold mb-4">Submit New Task</h3>

//           <div className="space-y-4">
//             <div>
//               <BasicSelect
//                 label="Task Type"
//                 value={taskForm.task_type}
//                 handleChange={(e: any) =>
//                   setTaskForm({ ...taskForm, task_type: e.target.value })
//                 }
//                 items={[
//                   { value: "llm", label: "LLM" },
//                   { value: "img", label: "IMG" },
//                   { value: "trade", label: "TRADE" },
//                 ]}
//               />
//             </div>

//             <div>
//               <TextField
//                 fullWidth
//                 id="standard-prompt"
//                 size="small"
//                 label="Task Description"
//                 autoComplete="off"
//                 value={taskForm.prompt}
//                 onChange={(e) =>
//                   setTaskForm({ ...taskForm, prompt: e.target.value })
//                 }
//               />
//             </div>

//             <div className="flex items-center space-x-4">
//               <TextField
//                 fullWidth
//                 type="number"
//                 id="standard-prompt"
//                 size="small"
//                 label="Fee (Optional)"
//                 autoComplete="off"
//                 value={taskForm.fee}
//                 onChange={(e) =>
//                   setTaskForm({ ...taskForm, fee: e.target.value })
//                 }
//               />
//               <BasicSelect
//                 label="Fee (Optional)"
//                 value={taskForm.fee_unit}
//                 handleChange={(e: any) =>
//                   setTaskForm({ ...taskForm, fee_unit: e.target.value })
//                 }
//                 items={[
//                   { value: "SUI", label: "SUI" },
//                   { value: "USDC", label: "USDC" },
//                 ]}
//               />
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end space-x-3">
//             <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="contained" onClick={handleSubmitTask}>
//               Submit
//             </Button>
//           </div>
//         </BasicModal>
//       )}

//       <div className="w-full flex-shrink-0 mb-8">
//         <center>
//           <h3 className="text-xl md:text-2xl font-semibold mb-4">AI Agents</h3>
//         </center>
//         <div className="w-full flex flex-wrap justify-center gap-4">
//           {agents.map((agent: any) => (
//             <div
//               key={agent.unique_id}
//               className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
//             >
//               <AIAgentCard
//                 id={agent.id}
//                 description={agent.description}
//                 type={agent.type}
//                 addr={agent.addr}
//                 owner_addr={agent.owner_addr}
//                 source_url={agent.source_url}
//                 solved_times={agent.solved_times}
//                 created_at={agent.created_at}
//                 unique_id={agent.unique_id}
//               />
//             </div>
//           ))}
//         </div>
//         <div className="w-full flex justify-center">
//           <button
//             onClick={() => setIsAgentModalOpen(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-4"
//           >
//             Submit New Agent
//           </button>
//         </div>
//       </div>

//       {/* Add new Agent Modal */}
//       {isAgentModalOpen && (
//         <BasicModal>
//           <h3 className="text-2xl font-semibold mb-4">Submit New Agent</h3>

//           <div className="space-y-4">
//             <TextField
//               key={"Agent Address"}
//               fullWidth
//               id="standard-basic"
//               size="small"
//               label="Agent Address"
//               autoComplete="off"
//               value={agentForm.addr}
//               onChange={(e) =>
//                 setAgentForm({ ...agentForm, addr: e.target.value })
//               }
//             />
//             <TextField
//               key={"Owner Address"}
//               fullWidth
//               id="standard-basic"
//               size="small"
//               label="Owner Address"
//               autoComplete="off"
//               value={agentForm.owner_addr}
//               onChange={(e) =>
//                 setAgentForm({ ...agentForm, owner_addr: e.target.value })
//               }
//             />
//             <BasicSelect
//               key={"Agent Type"}
//               label="Agent Type"
//               value={agentForm.type}
//               handleChange={(e: any) =>
//                 setAgentForm({ ...agentForm, type: e.target.value })
//               }
//               items={[
//                 { value: "llm", label: "LLM" },
//                 { value: "img", label: "IMG" },
//                 { value: "trade", label: "TRADE" },
//               ]}
//             />
//             <TextField
//               key={"Chat URL (Optional)"}
//               fullWidth
//               id="standard-basic"
//               size="small"
//               label="Chat URL (Optional)"
//               autoComplete="off"
//               value={agentForm.chat_url}
//               onChange={(e) =>
//                 setAgentForm({ ...agentForm, chat_url: e.target.value })
//               }
//             />
//             <TextField
//               key={"Source URL (Optional)"}
//               fullWidth
//               id="standard-basic"
//               size="small"
//               label="Source URL (Optional)"
//               autoComplete="off"
//               value={agentForm.source_url}
//               onChange={(e) =>
//                 setAgentForm({ ...agentForm, source_url: e.target.value })
//               }
//             />
//           </div>

//           <div className="mt-6 flex justify-end space-x-3">
//             <Button
//               variant="outlined"
//               onClick={() => setIsAgentModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button variant="contained" onClick={handleSubmitAgent}>
//               Submit
//             </Button>
//           </div>
//         </BasicModal>
//       )}
//     </div>
//   );
// };

// export default BasicContainer;
