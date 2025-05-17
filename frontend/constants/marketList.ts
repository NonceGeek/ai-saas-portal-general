import { COIN } from "bucket-protocol-sdk";

export const TOKEN_LIST: {
  // You can use key in COIN for more token
  [key in any]: any;
} = {
  SUI: {
    token: "SUI",
    symbol: "SUI",
    iconPath: "/images/coins/sui-icon.svg",
  },
  BUCK: {
    token: "BUCK",
    symbol: "BUCK",
    iconPath: "/images/coins/buck-icon.png",
  },
  USDC: {
    token: "USDC",
    symbol: "USDC",
    iconPath: "/images/coins/usdc-icon.png",
  },
  USDT: {
    token: "USDT",
    symbol: "USDT",
    iconPath: "/images/coins/usdt-light.png",
  },
};

export const getTokenSymbol = (coin: any) => {
  return TOKEN_LIST[coin].symbol ?? "";
};
