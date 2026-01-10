import {
  Home,
  Bot,
  AppWindow,
  Compass,
  FileCode2,
  UserCircle,
  Settings,
  CreditCard,
  Key,
  History,
  Construction
} from "lucide-react";
import { Role } from "@prisma/client";

interface MenuItemWithRoles {
  icon: any;
  label: string;
  href: string;
  roles?: Role[];
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-saas.deno.dev";

export const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Bot, label: "Agents", href: "/agents" },
  { icon: FileCode2, label: "Docs", href: `${backendUrl}/v2/docs/html` },
  { icon: Construction, label: "Scaffold-Agent-Workers", href: `https://scaffold-agent-workers.leeduckgo.com` },
  { icon: FileCode2, label: "Whitepaper(cn)", href: `${backendUrl}/v2/whitepaper/cn/html` },
  { icon: FileCode2, label: "Whitepaper(en)", href: `${backendUrl}/v2/whitepaper/en/html` },
];

const baseAccountSubmenuItems: MenuItemWithRoles[] = [
  { icon: UserCircle, label: "My Account", href: "/account/profile" },
  { icon: History, label: "My Record", href: "/account/my-record" },
  // { icon: Settings, label: "Preferences", href: "/account/preferences" },
  // { icon: CreditCard, label: "Purchases", href: "/account/purchases" },
  { icon: FileCode2, label: "Data Annotation", href: "/account/data-annotation", roles: [Role.TAGGER_PARTNER, Role.TAGGER_OUTSOURCING] },
];

export const getAccountSubmenuItems = (userRole?: Role) => {
  return baseAccountSubmenuItems.filter(item => 
    !item.roles || (userRole && item.roles.includes(userRole))
  );
};

// For backward compatibility - returns all items without role filtering
export const accountSubmenuItems = baseAccountSubmenuItems.filter(item => !item.roles);

export const workplaceSubmenuItems = [
  { icon: Key, label: "API", href: "/workplace/api" },
]; 