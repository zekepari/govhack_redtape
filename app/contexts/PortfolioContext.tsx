"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

// Types
export type ContextMode =
  | "business"
  | "student"
  | "housing"
  | "travel"
  | "corporate";

export interface BusinessInfo {
  abn?: string;
  businessName?: string;
  industry?: string;
  state?: string;
  employees?: number;
  vehicles?: number;
  apprentices?: number;
}

export interface IndividualInfo {
  visaType?: string;
  travelPlans?: string;
  incomeBand?: string;
  housingGoals?: string;
  studentStatus?: string;
}

export interface Portfolio {
  business?: BusinessInfo;
  individual?: IndividualInfo;
}

export interface MemoryUpdate {
  field: string;
  oldValue: string | number | undefined;
  newValue: string | number | undefined;
  timestamp: Date;
  confirmed: boolean;
}

interface PortfolioState {
  portfolio: Portfolio;
  contextMode: ContextMode;
  recentUpdates: MemoryUpdate[];
}

// Action types
type PortfolioAction =
  | {
      type: "UPDATE_PORTFOLIO";
      payload: { field: string; value: string | number | undefined };
    }
  | { type: "UPDATE_BUSINESS_INFO"; payload: Partial<BusinessInfo> }
  | { type: "UPDATE_INDIVIDUAL_INFO"; payload: Partial<IndividualInfo> }
  | { type: "SWITCH_CONTEXT"; payload: ContextMode }
  | { type: "CLEAR_PORTFOLIO" }
  | { type: "CONFIRM_UPDATE"; payload: { field: string } }
  | { type: "UNDO_UPDATE"; payload: { field: string } };

// Initial state
const initialState: PortfolioState = {
  portfolio: {},
  contextMode: "business",
  recentUpdates: [],
};

// Reducer
function portfolioReducer(
  state: PortfolioState,
  action: PortfolioAction
): PortfolioState {
  switch (action.type) {
    case "UPDATE_BUSINESS_INFO":
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          business: {
            ...state.portfolio.business,
            ...action.payload,
          },
        },
      };

    case "UPDATE_INDIVIDUAL_INFO":
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          individual: {
            ...state.portfolio.individual,
            ...action.payload,
          },
        },
      };

    case "SWITCH_CONTEXT":
      return {
        ...state,
        contextMode: action.payload,
      };

    case "CLEAR_PORTFOLIO":
      return {
        ...state,
        portfolio: {},
        recentUpdates: [],
      };

    default:
      return state;
  }
}

// Context
const PortfolioContext = createContext<{
  state: PortfolioState;
  dispatch: React.Dispatch<PortfolioAction>;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  updateIndividualInfo: (info: Partial<IndividualInfo>) => void;
  switchContext: (mode: ContextMode) => void;
  clearPortfolio: () => void;
} | null>(null);

// Provider
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  // Helper functions
  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    dispatch({ type: "UPDATE_BUSINESS_INFO", payload: info });
  };

  const updateIndividualInfo = (info: Partial<IndividualInfo>) => {
    dispatch({ type: "UPDATE_INDIVIDUAL_INFO", payload: info });
  };

  const switchContext = (mode: ContextMode) => {
    dispatch({ type: "SWITCH_CONTEXT", payload: mode });
  };

  const clearPortfolio = () => {
    if (
      window.confirm("Are you sure you want to clear all your portfolio data?")
    ) {
      dispatch({ type: "CLEAR_PORTFOLIO" });
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        state,
        dispatch,
        updateBusinessInfo,
        updateIndividualInfo,
        switchContext,
        clearPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

// Hook
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}
