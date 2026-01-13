"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Check } from "lucide-react";
import type { Agent } from "@/components/agent-card";

interface SubmitTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialCoupon?: string;
  initialAgent?: string;
}

export function SubmitTaskDialog({ isOpen, onClose, initialCoupon, initialAgent }: SubmitTaskDialogProps) {
  const [taskForm, setTaskForm] = useState({
    user: "",
    prompt: "",
    task_type: "IMG",
    fee: "0",
    fee_unit: "RMB",
    coupon: "",
    agent_unique_id: ""
  });
  const [submittingTask, setSubmittingTask] = useState(false);
  const [couponVerified, setCouponVerified] = useState(false);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchAgents = async () => {
        try {
          setLoadingAgents(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ai-saas.deno.dev'}/v2/agents?actived=true`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch agents");
          }
          const data = await response.json();
          // Sort by up_votes descending (most popular first)
          const sortedData = (data as Agent[]).sort((a, b) => {
            return b.up_votes - a.up_votes;
          });
          setAgents(sortedData);
        } catch (error) {
          console.error("Error fetching agents:", error);
          toast.error("Failed to load agents");
        } finally {
          setLoadingAgents(false);
        }
      };

      fetchAgents();
    }
  }, [isOpen]);

  // Set initial coupon and agent values when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTaskForm(prevForm => {
        const updates: Partial<typeof prevForm> = {};
        
        if (initialCoupon) {
          updates.coupon = initialCoupon;
        }
        
        if (initialAgent) {
          updates.agent_unique_id = initialAgent;
          // Find the agent and set task_type to its type
          const agent = agents.find(a => a.unique_id === initialAgent);
          if (agent && agent.type) {
            console.log("Found agent:", agent.type);
            updates.task_type = agent.type;
          }
        }
        
        return {
          ...prevForm,
          ...updates,
        };
      });
    }
  }, [isOpen, initialCoupon, initialAgent, agents]);

  const handleCheckCoupon = async () => {
    if (!taskForm.coupon.trim()) {
      toast.error("Please enter a coupon address");
      return;
    }

    try {
      setCheckingCoupon(true);
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ai-saas.deno.dev'}/v2/check_coupon`;
      console.log("Checking coupon:", taskForm.coupon, "at", apiUrl);
      
      const response = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coupon: taskForm.coupon,
          }),
        }
      );

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Failed to verify coupon";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error("Coupon verification failed:", {
          status: response.status,
          statusText: response.statusText,
          message: errorMessage,
        });
        
        if (response.status === 404) {
          throw new Error("Coupon not found or already used");
        }
        throw new Error(errorMessage);
      }

      const couponData = await response.json();
      
      console.log("Coupon verified successfully:", couponData);
      
      // If the coupon has an associated agent, ensure it's in the agents list
      if (couponData.micro_ai_saas_agents) {
        const couponAgent = couponData.micro_ai_saas_agents;
        const agentExists = agents.some(agent => agent.unique_id === couponAgent.unique_id);
        
        // Add the agent to the list if it doesn't exist
        if (!agentExists) {
          setAgents(prevAgents => {
            // Check again in case state hasn't updated yet
            const alreadyExists = prevAgents.some(agent => agent.unique_id === couponAgent.unique_id);
            if (alreadyExists) return prevAgents;
            
            // Add the agent to the list and sort by up_votes
            const updatedAgents = [...prevAgents, couponAgent as Agent];
            return updatedAgents.sort((a, b) => b.up_votes - a.up_votes);
          });
        }
      }
      
      // Update fee and fee_unit with coupon data
      // Also set agent_unique_id from the coupon's associated agent if available
      setTaskForm(prevForm => ({
        ...prevForm,
        fee: couponData.fee_format || "0",
        fee_unit: couponData.fee_unit || "RMB",
        agent_unique_id: couponData.micro_ai_saas_agents?.unique_id || prevForm.agent_unique_id,
        task_type: couponData.micro_ai_saas_agents?.type || prevForm.task_type,
      }));

      setCouponVerified(true);
      toast.success("✅ Coupon verified successfully!");
    } catch (error: any) {
      console.error("Error checking coupon:", error);
      toast.error(error.message || "Failed to verify coupon");
      setCouponVerified(false);
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!taskForm.user.trim() || !taskForm.prompt.trim()) {
      toast.error("Please fill in user and prompt fields");
      return;
    }

    try {
      setSubmittingTask(true);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: taskForm.user,
            prompt: taskForm.prompt,
            task_type: taskForm.task_type,
            fee: parseFloat(taskForm.fee) || 0,
            fee_unit: taskForm.fee_unit,
            coupon: taskForm.coupon || null,
            agent_unique_id: taskForm.agent_unique_id || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit task");
      }

      const data = await response.json();
      
      toast.success("Task submitted successfully!");
      onClose();
      
      // Reset form
      setTaskForm({
        user: "",
        prompt: "",
        task_type: "IMG",
        fee: "0",
        fee_unit: "RMB",
        coupon: "",
        agent_unique_id: ""
      });
      
      // Optionally refresh the page or tasks list
      window.location.reload();
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Failed to submit task");
    } finally {
      setSubmittingTask(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            📝 Submit New Task
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              User *
            </label>
            <Input
              value={taskForm.user}
              onChange={(e) => setTaskForm({ ...taskForm, user: e.target.value })}
              placeholder="Your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Task Description / Prompt *
            </label>
            <textarea
              value={taskForm.prompt}
              onChange={(e) => setTaskForm({ ...taskForm, prompt: e.target.value })}
              placeholder="Describe your task in detail..."
              className="w-full min-h-[120px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Task Type
            </label>
            <select
              value={taskForm.task_type}
              onChange={(e) => setTaskForm({ ...taskForm, task_type: e.target.value })}
              disabled={couponVerified}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="IMG">Image Generation</option>
              <option value="LLM">Text Generation</option>
              <option value="CODE">Code Generation</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Agent (Optional)
            </label>
            {loadingAgents ? (
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Loading agents...</span>
              </div>
            ) : (
              <select
                value={taskForm.agent_unique_id}
                onChange={(e) => setTaskForm({ ...taskForm, agent_unique_id: e.target.value })}
                disabled={couponVerified}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select an agent (optional)</option>
                {agents.map((agent) => (
                  <option key={agent.unique_id} value={agent.unique_id}>
                    {agent.name} ({agent.type})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              The Coupon (Optional)(0x... format)
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <Input
                  value={taskForm.coupon}
                  onChange={(e) => {
                    setTaskForm({ ...taskForm, coupon: e.target.value });
                    setCouponVerified(false); // Reset verification when coupon changes
                  }}
                  placeholder="0x..."
                />

              </div>

              <Button
                type="button"
                onClick={handleCheckCoupon}
                disabled={checkingCoupon || !taskForm.coupon.trim() || couponVerified}
                variant="outline"
                className={`whitespace-nowrap ${couponVerified ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400' : ''}`}
              >
                {checkingCoupon ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Checking...
                  </>
                ) : couponVerified ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Verified
                  </>
                ) : (
                  "Check Coupon"
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fee (Optional)
              </label>
              <Input
                type="number"
                value={taskForm.fee}
                onChange={(e) => setTaskForm({ ...taskForm, fee: e.target.value })}
                placeholder="0"
                min="0"
                step="1"
                disabled={couponVerified}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Fee Unit (Optional)
              </label>
              <select
                value={taskForm.fee_unit}
                onChange={(e) => setTaskForm({ ...taskForm, fee_unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={couponVerified}
              >
                <option value="RMB">RMB</option>
                <option value="MOVE">MOVE</option>
                <option value="USDT">USDT</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>


          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={submittingTask}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submittingTask}
            >
              {submittingTask ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Task"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

