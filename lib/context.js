import { createContext } from "react";

export const userContext = createContext({
    account: "",
    setAccount: () => {},
  });


export const agentContext = createContext({
    agent: "",
    setAgent: () => {},
  });
