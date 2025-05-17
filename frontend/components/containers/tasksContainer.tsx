"use client";
// import BasicDataField from "../fields/basicDataField";
import { useState, useEffect,useContext } from "react";
import { AppContext } from "@/context/AppContext";
// import LinksContainer from "./linkContainer";
import { toast } from "react-toastify";
import { CompletedCard } from "../uiWrapper/Card";

const TasksContainer = () => {
  const { walletAddress } = useContext(AppContext);
  const [unsolvedTasks, setUnsolvedTasks] = useState([]);
  const [yourTasks, setYourTasks] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("https://ai-saas.deno.dev/tasks");
        const data = await response.json();
        setUnsolvedTasks(data);
        const yourTasks = data.filter((task: any) => task.user === walletAddress);
        setYourTasks(yourTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks");
      }
    };

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

    fetchTasks();
    fetchAgents();
  }, [walletAddress]);

  return (
    <div className="w-[100%] sm:w-[100%] md:w-[90%] lg:w-[80%] overflow-y-auto flex flex-col items-center gap-4 p-0 lg:p-4">
      {/* Header section for agent and task status */}
      <div className="w-full flex-shrink-0 p-4 mb-2 lg:mb-10"></div>
      {/* <TaskInit /> */}
      <h3 className="text-3xl font-semibold mb-4">Your Tasks</h3>

      <div className="columns-1 gap-4 space-y-4">
        {yourTasks.map((task: any) => (
          <div key={task.unique_id} className="break-inside-auto w-full">
            <CompletedCard
              isNeedConfirmation={true}
              id={task?.id}
              user={task?.user}
              task_type={task?.task_type}
              prompt={task?.prompt}
              fee={task?.fee}
              fee_unit={task?.fee_unit}
              created_at={task?.created_at}
              solution={task?.solution}
              solver_type={task?.solver_type}
              unique_id={task?.unique_id}
            />
          </div>
        ))}
      </div>
      <h3 className="text-3xl font-semibold mb-4">All Tasks</h3>

      <div className="columns-1 gap-4 space-y-4">
        {unsolvedTasks.map((task: any) => (
          <div key={task.unique_id} className="break-inside-avoid w-full ">
            <CompletedCard
              id={task?.id}
              user={task?.user}
              task_type={task?.task_type}
              prompt={task?.prompt}
              fee={task?.fee}
              fee_unit={task?.fee_unit}
              created_at={task?.created_at}
              solution={task?.solution}
              solver_type={task?.solver_type}
              unique_id={task?.unique_id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksContainer;
