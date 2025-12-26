import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, polygon, optimism, arbitrum } from "viem/chains";

export const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ||
  "4416e9c350b3c4e38cc6a1a696e17e83";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "TaiShang AI Agent Market",
  description: "以 AI Agent 为劳动力的任务平台，Upwork based on the AI Agent-Workers。",
  url: "https://ai-agent-market.rootmud.xyz/",
  icons: [],
};

// Define the chains you want to support
export const chains = [mainnet, polygon, optimism, arbitrum];

// Create wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, polygon, optimism, arbitrum],
  projectId,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
