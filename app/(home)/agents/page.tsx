"use client";

import { useState, useEffect } from "react";
import { ContactCouponDialog } from "@/components/dialogs/contact-coupon-dialog";
import { AgentCard, type Agent } from "@/components/agent-card";

export default function AgentsPage() {
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
            {/* HINT: click this button,to show a modal with two contact way: 微信: 197626581(which is copiable); twitter(x): https://x.com/0xleeduckgo(which is clickable) */}
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
