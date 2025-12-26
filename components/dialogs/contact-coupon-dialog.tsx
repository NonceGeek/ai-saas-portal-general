"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactCouponDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactCouponDialog({ isOpen, onClose }: ContactCouponDialogProps) {
  const [copiedWechat, setCopiedWechat] = useState(false);

  const handleCopyWechat = () => {
    navigator.clipboard.writeText("197626581");
    setCopiedWechat(true);
    setTimeout(() => setCopiedWechat(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            🎟️ 获取优惠券 Get Coupon
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          {/* WeChat Contact */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💬</span>
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                微信 WeChat
              </h3>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-lg font-semibold">
                197626581
              </span>
              <button
                onClick={handleCopyWechat}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                title={copiedWechat ? "已复制！" : "点击复制"}
              >
                {copiedWechat ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Twitter Contact */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">𝕏</span>
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                Twitter (X)
              </h3>
            </div>
            <a
              href="https://x.com/0xleeduckgo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>💬 私信 @0xleeduckgo</span>
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Click to visit profile and send a message
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            联系获取优惠券😊 Contact us for coupons! 🎉
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

