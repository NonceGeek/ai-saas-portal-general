"use client";

import { useState, useEffect } from "react";
// import { Header } from "@/components/layout/header";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactCouponDialog } from "@/components/dialogs/contact-coupon-dialog";

interface Agent {
  id: number;
  created_at: string;
  addr: string;
  owner_addr: string;
  type: string;
  homepage: string | null;
  source_url: string | null;
  solved_times: number;
  unique_id: string;
  description: string;
  task_request_api: string | null;
  crons: any[];
  addrs: Record<string, any>;
  up_votes: number;
  down_votes: number;
  name: string;
  addr_type: string;
  owner_addr_type: string;
}

// Create a client component for the book card
import Image from "next/image";

function AgentCard({ agent }: { agent: Agent }) {
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedOwner, setCopiedOwner] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleCopyAddr = () => {
    navigator.clipboard.writeText(agent.addr);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleCopyOwner = () => {
    navigator.clipboard.writeText(agent.owner_addr);
    setCopiedOwner(true);
    setTimeout(() => setCopiedOwner(false), 2000);
  };

  // Convert cron expression to human-readable format
  const cronToReadable = (cron: string) => {
    const parts = cron.split(" ");
    if (parts.length !== 5) return cron;

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    let result = "";

    // Handle hour
    if (hour === "*") {
      result = "Every hour";
    } else {
      result = `At ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    }

    // Handle day
    if (dayOfMonth !== "*") {
      result += ` on day ${dayOfMonth}`;
    }

    if (dayOfWeek !== "*") {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      result += ` on ${days[parseInt(dayOfWeek)] || dayOfWeek}`;
    } else if (dayOfMonth === "*" && month === "*") {
      result += " every day";
    }

    return result;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {agent.name}
          </h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium">
            {agent.type}
          </span>
        </div>

        <div className="text-gray-600 dark:text-gray-300 mb-3 max-h-24 overflow-y-auto pr-2 text-sm [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-700">
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => (
                <p className="mb-1 last:mb-0" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold" {...props} />
              ),
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              code: ({ node, ...props }) => (
                <code
                  className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs"
                  {...props}
                />
              ),
              br: () => <br />,
            }}
          >
            {agent.description}
          </ReactMarkdown>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span>👍</span>
              <span>{agent.up_votes}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>👎</span>
              <span>{agent.down_votes}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>📊Solve Times:</span>
              <span>{agent.solved_times}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {agent.homepage && (
            <a
              href={agent.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 text-sm font-medium"
            >
              🌐 Homepage
            </a>
          )}
          {agent.source_url && (
            <a
              href={agent.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 text-sm font-medium"
            >
              📦 Source
            </a>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 dark:text-gray-400">Address:</span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium uppercase">
                {agent.addr_type}
              </span>
              <button
                onClick={handleCopyAddr}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-mono inline-flex items-center gap-1"
                title={copiedAddr ? "Copied!" : "Click to copy full address"}
              >
                {agent.addr.slice(0, 6)}...{agent.addr.slice(-4)}
                {copiedAddr ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 dark:text-gray-400">Owner:</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs font-medium uppercase">
                {agent.owner_addr_type}
              </span>
              <button
                onClick={handleCopyOwner}
                className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-mono inline-flex items-center gap-1"
                title={copiedOwner ? "Copied!" : "Click to copy full address"}
              >
                {agent.owner_addr.slice(0, 6)}...{agent.owner_addr.slice(-4)}
                {copiedOwner ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              {agent.crons && agent.crons.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowSchedule(true)}
                    className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    📅 View Schedule - 查看日程
                  </button>
                </div>
              )}
              <br></br>
              <button
                onClick={() => {
                  // Navigate to home page with agent parameter or trigger task creation
                  window.location.href = `/?agent=${agent.addr}`;
                }}
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                🚀 Solve Problem! 帮我解决问题~
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
        <DialogContent className="w-[90vw] max-w-none max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              📅 Agent Schedule - {agent.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {agent.crons && agent.crons.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold">
                        Task Name
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold">
                        Schedule(UTC 时间)
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold">
                        Cron Expression(UTC 时间)
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {agent.crons.map((cronJob: any, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">
                          {cronJob.name}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          {cronToReadable(cronJob.cron)}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-sm">
                          {cronJob.cron}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm">
                          {cronJob.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No scheduled tasks for this agent.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Keep the main page component as a server component
export default function LibraryPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/v2/agents"
        );
        const data = await response.json();
        console.log(data);
        // Sort by up_votes descending (most popular first)
        const sortedData = (data as Agent[]).sort((a, b) => {
          return b.up_votes - a.up_votes;
        });
        setAgents(sortedData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <>
      <div className="h-full p-6 overflow-auto">
        <div className="flex flex-col items-center justify-center w-full mb-8 gap-2">
          <h1 className="text-4xl font-bold text-center">
            Agents Market — 智能体劳动力市场
          </h1>

          <button
            onClick={() => setShowContactModal(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            {/* TODO: click this button,to show a modal with two contact way: 微信: 197626581(which is copiable); twitter(x): https://x.com/0xleeduckgo(which is clickable) */}
            👉 🎟️ 我要优惠券！I want a coupon! 👈
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agentItem: Agent) => (
              <AgentCard key={agentItem.id} agent={agentItem} />
            ))}
          </div>
        )}
      </div>
      {/* TODO: not necessary for now. */}
      {/* <div className="h-full p-6 overflow-auto">
        <div className="flex items-center justify-center w-full mb-8">
          <h1 className="text-4xl font-bold text-center">图书馆</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 1,
              title: "全粤语三国演义",
              author: "李沛聪",
              coverImage:
                "https://dimsum-utils.oss-cn-guangzhou.aliyuncs.com/images.jpeg",
              description:
                "從《三國演義》原著中精選五十回內容，用粵語方言文字重新演繹，令讀者體會原汁原味的粵語故事。",
              likes: 0,
              comments: 0,
              created_at: "2025-06-19 11:20:58.940891+00",
              updated_at: "2025-06-19 11:20:58.940891",
              link: "https://item.jd.com/10069527822270.html",
            },
          ].map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div> */}

      {/* Contact Modal for Coupon */}
      <ContactCouponDialog 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </>
  );
}
