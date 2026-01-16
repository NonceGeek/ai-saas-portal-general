/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useSearch, type SearchResult } from "@/lib/api/search";
import { toast } from "sonner";
import { Search, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { EditCorpusDialog } from "@/components/dialogs/edit-corpus-dialog";
import { ContactCouponDialog } from "@/components/dialogs/contact-coupon-dialog";
import { SubmitTaskDialog } from "@/components/dialogs/submit-task-dialog";
import { AgentCard, type Agent } from "@/components/agent-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Task interfaces
interface Task {
  id: number;
  unique_id: string;
  user: string;
  solver: string | null;
  prompt: string;
  task_type: string;
  fee: string;
  fee_unit: string;
  fee_format: string;
  coupon: string | null;
  solution: string | null;
  optimized_prompt: string | null;
  review: string | null;
  created_at: string;
}

interface TasksResponse {
  data: Task[];
  pagination: {
    limit: number;
    cursor: number | null;
    nextCursor: number | null;
    hasMore: boolean;
  };
}

// TasksContainer Component
function TasksContainer() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [loadingAgent, setLoadingAgent] = useState(false);

  const fetchTasks = async (currentCursor: number | null = null) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "20",
        ascend: "false",
      });
      
      if (currentCursor !== null) {
        params.append("cursor", currentCursor.toString());
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/tasks?${params.toString()}`
      );
      const data: TasksResponse = await response.json();
      
      if (currentCursor === null) {
        setTasks(data.data);
      } else {
        setTasks(prev => [...prev, ...data.data]);
      }
      
      setCursor(data.pagination.nextCursor);
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const loadMore = () => {
    if (hasMore && !loading && cursor !== null) {
      fetchTasks(cursor);
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleViewAgent = async (uniqueId: string) => {
    try {
      setLoadingAgent(true);
      setShowAgentModal(true);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/agent?unique_id=${uniqueId}`
      );
      const data = await response.json();
      
      setSelectedAgent(data);
    } catch (error) {
      console.error("Error fetching agent:", error);
      toast.error("Failed to fetch agent details");
      setShowAgentModal(false);
    } finally {
      setLoadingAgent(false);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pb-8">
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No tasks available yet.
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.unique_id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                          {task.task_type}
                        </span>
                        {task.solution ? (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                            ✅ Solved 已解决
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium">
                            ⏳ Waiting to be solved 待解决
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {task.prompt}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {task.fee_format} {task.fee_unit}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span>User:</span>
                        <button
                          onClick={() => handleCopyAddress(task.user)}
                          className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title={copiedAddress === task.user ? "Copied!" : "Click to copy"}
                        >
                          <span className="font-mono">{task.user}</span>
                          {copiedAddress === task.user ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                      {task.solver && (
                        <div className="flex items-center gap-2">
                          <span>Solver:</span>
                          <button
                            onClick={() => handleViewAgent(task.solver!)}
                            className="inline-flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                            title="Click to view agent details"
                          >
                            <span className="font-mono underline decoration-dotted">{task.solver}&nbsp;&nbsp;👈&nbsp;点击查看 agent 信息！&nbsp;&nbsp;</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyAddress(task.solver!);
                            }}
                            className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            title={copiedAddress === task.solver ? "Copied!" : "Click to copy address"}
                          >

                            {copiedAddress === task.solver ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      {new Date(task.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {task.optimized_prompt && (
                    <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                      <div className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1">
                        🔧 Optimized Prompt:
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {task.optimized_prompt}
                      </div>
                    </div>
                  )}
                  
                  {task.solution && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                        ✅ Solution:
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {task.solution}
                      </div>
                    </div>
                  )}
                  
                  {task.review && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                        📝 Review:
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {task.review}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={loadMore}
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Agent Details Modal */}
      <Dialog open={showAgentModal} onOpenChange={setShowAgentModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              🤖 Agent Details
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {loadingAgent ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : selectedAgent ? (
              <AgentCard agent={selectedAgent} />
            ) : (
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                Failed to load agent details.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function HomePage() {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { mutate: search, isPending } = useSearch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<SearchResult | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<string>("all");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // Fetch available categories
  // get all categories from the backend
  
  // Check if URL path is /submit_task or has submit_task query parameter
  useEffect(() => {
    if (pathname === "/submit_task" || searchParams.get("submit_task") !== null) {
      setShowTaskModal(true);
      // If it's a pathname route, redirect to home after opening modal
      if (pathname === "/submit_task") {
        router.replace("/", { scroll: false });
      }
    }
    // if there's a agent parameter, also open the task modal
    if (searchParams.get("agent") !== null) {
      setShowTaskModal(true);
    }
    // If there's a coupon parameter, also open the task modal
    if (searchParams.get("coupon") !== null) {
      setShowTaskModal(true);
    }
  }, [pathname, searchParams, router]);

  // 从URL参数读取搜索关键词
  useEffect(() => {
    const keyword = searchParams.get("q");

    // 当URL变为根路径时，重置页面状态
    if (!keyword) {
      if (searchPrompt || results) {
        setSearchPrompt("");
        setResults(null);
        setCurrentPage(1);
      }
      setIsInitialLoad(false);
      return;
    }

    // 只有在初始加载或有新的搜索关键词时才执行搜索
    if (isInitialLoad || keyword !== searchPrompt) {
      setSearchPrompt(keyword);
      setIsInitialLoad(false);
      // 自动执行搜索
      search(
        { keyword, category: selectedDataset },
        {
          onSuccess: (data: SearchResult[]) => {
            setResults(data);
          },
          onError: (error: Error) => {
            console.error("Search failed:", error);
            toast.error("Search failed", {
              description: error.message,
            });
          },
        }
      );
    }
  }, [searchParams, search, isInitialLoad, selectedDataset]);

  const handleSearch = () => {
    if (!searchPrompt.trim()) return;
    setCurrentPage(1);

    // 更新URL参数
    const params = new URLSearchParams();
    params.set("q", searchPrompt.trim());
    router.push(`/?${params.toString()}`, { scroll: false });

    // 直接执行搜索，不依赖useEffect
    search(
      { keyword: searchPrompt, category: selectedDataset },
      {
        onSuccess: (data: SearchResult[]) => {
          setResults(data);
        },
        onError: (error: Error) => {
          console.error("Search failed:", error);
          toast.error("Search failed", {
            description: error.message,
          });
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 更新示例搜索的点击处理函数
  const handleExampleSearch = (prompt: string) => {
    setSearchPrompt(prompt);
    setCurrentPage(1);

    // 更新URL参数
    const params = new URLSearchParams();
    params.set("q", prompt);
    router.push(`/?${params.toString()}`, { scroll: false });

    // 直接执行搜索，不依赖useEffect
    search(
      { keyword: prompt, category: selectedDataset },
      {
        onSuccess: (data: SearchResult[]) => {
          setResults(data);
        },
        onError: (error: Error) => {
          console.error("Search failed:", error);
          toast.error("Search failed", {
            description: error.message,
          });
        },
      }
    );
  };

  // 返回首页函数
  const handleBackToHome = () => {
    router.push("/", { scroll: false });
    setSearchPrompt("");
    setResults(null);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((results?.length || 0) / itemsPerPage);
  const currentResults =
    results?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  return (
    <>
      {/* <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <Header showLogo />
      </div> */}
      <motion.div
        className="container mx-auto p-6 flex flex-col h-[calc(100vh-140px)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="flex flex-col items-center w-full h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Header Section - Fixed */}
          <div className="flex flex-col items-center space-y-4 mb-6 flex-shrink-0">
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Tasks Board: 任务面板
            </motion.h1>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              {/* HINT: click this button,to show a modal with two contact way: 微信: 197626581(which is copiable); twitter(x): https://x.com/0xleeduckgo(which is clickable) */}
              👉 🎟️ 我要优惠券！I want a coupon! 👈
            </button>

            <button
              onClick={() => setShowTaskModal(true)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              👉 🎟️ 我要发任务！I want to post a task! 👈
            </button>
          </div>

          {/* Scrollable Tasks Section */}
          <motion.div
            className="w-full flex-1 overflow-y-auto px-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <TasksContainer />
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Update Dialog */}
      <EditCorpusDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        editingResult={editingResult}
      />
      
      {/* Contact Coupon Dialog */}
      <ContactCouponDialog 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />

      {/* Task Submission Modal */}
      <SubmitTaskDialog 
        isOpen={showTaskModal} 
        onClose={() => setShowTaskModal(false)}
        initialCoupon={searchParams.get("coupon") || undefined}
        initialAgent={searchParams.get("agent") || undefined}
      />
    </>
  );
}
