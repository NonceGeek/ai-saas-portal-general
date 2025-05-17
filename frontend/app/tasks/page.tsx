import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { NavBar } from "@/components/NavBar";
import Image from "next/image";
import { WalletButton } from "@/components/counter/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import TasksContainer from "@/components/containers/tasksContainer";

const inter = Inter({ subsets: ["latin"] });

export default function Tasks() {
  return (
    <main
      className={cn(
        "relative w-full min-h-svh h-full max-w-360 flex flex-col items-center justify-center mx-auto py-5 px-4 bg-gray-800",
        inter.className
      )}
    >
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
      <TasksContainer />
      {/* <Footer /> */}
    </main>
  );
}
