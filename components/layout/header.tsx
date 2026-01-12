"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface HeaderProps {
  showLogo?: boolean;
  titleClassName?: string;
}

export function Header({ showLogo = true, titleClassName = "" }: HeaderProps) {
  const setOpen = useSidebarStore((state) => state.setOpen);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { data: session } = useSession();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-saas.deno.dev";


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-transparent backdrop-blur-md supports-[backdrop-filter]:bg-transparent">
      <div className="container mx-auto px-4 flex h-14 items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
          {/* {showLogo && (
            <Link className="flex items-center space-x-2" href="/">
              <Image
                src="/logo.png"
                alt="TaiShang AI Agent Market Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="font-bold">TaiShang AI Agent Market</span>
            </Link>
          )} */}
        </div>
        {/* {!isHomePage && ( */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* <div className="w-full max-w-sm">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8" />
              </div>
            </div> */}
          {session?.user?.isSystemAdmin && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-sm"
            >
              <Link
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            </Button>
          )}
          <Link
            className="flex items-center space-x-2"
            href={`${backendUrl}/v2/whitepaper/cn/html/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <Image
              src="/logo.png"
              alt="TaiShang AI Agent Market Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            /> */}
            <span className={`font-bold ${titleClassName}`}>
              TaiShang AI Agent Market
            </span>
          </Link>
        </div>
        {/* )} */}
      </div>
    </header>
  );
}
