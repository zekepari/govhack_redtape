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
  postcode?: string;
  localGov?: string;
  employees?: number;
  contractors?: number;
  vehicles?: number;
  apprentices?: number;
  interstate?: boolean;
  additionalInfo?: string;
}

export interface IndividualInfo {
  visaType?: string;
  visaSubclass?: string;
  studyStatus?: "student" | "graduated" | "prospective";
  workRights?: "unrestricted" | "limited" | "none";
  travelPlans?: string;
  incomeBand?: string;
  housingGoals?: string;
  dependants?: number;
  residencyStatus?: string;
}

export interface LocationContext {
  currentState?: string;
  currentPostcode?: string;
  intendedStates?: string[];
}

export interface Portfolio {
  // Core Identity
  userType?: "individual" | "business" | "both";

  // Business Details
  business?: BusinessInfo;

  // Individual Details
  individual?: IndividualInfo;

  // Location Context
  location?: LocationContext;

  // Contextual role modules
  roles?: {
    jobseeker?: {
      hasMyGov: boolean;
      previousIncome: string;
      dependents: string;
      housingStatus: string;
      dateAdded: Date;
    };
    carer?: {
      careType: string;
      hoursPerWeek: string;
      relationshipToCared: string;
      hasOtherIncome: boolean;
      dateAdded: Date;
    };
    student?: {
      studyType: string;
      workType: string;
      annualIncome: string;
      hasHECSDebt: boolean;
      dateAdded: Date;
    };
    businessOwner?: {
      businessName: string;
      abn: string;
      industry: string;
      employees: number;
      contractors: number;
      location: string;
      dateAdded: Date;
    };
  };
}

export interface MemoryUpdate {
  field: string;
  oldValue: string | number | undefined;
  newValue: string | number | undefined;
  timestamp: Date;
  confirmed: boolean;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  agency: string;
  priority: "high" | "medium" | "low";
  category: "tax" | "services" | "data" | "compliance";
  completed: boolean;
  addedAt: Date;
}

interface PortfolioState {
  portfolio: Portfolio;
  contextMode: ContextMode;
  recentUpdates: MemoryUpdate[];
  checklist: ChecklistItem[];
}

// Action types
type PortfolioAction =
  | {
      type: "UPDATE_PORTFOLIO";
      payload: { field: string; value: string | number | undefined };
    }
  | { type: "UPDATE_BUSINESS_INFO"; payload: Partial<BusinessInfo> }
  | { type: "UPDATE_INDIVIDUAL_INFO"; payload: Partial<IndividualInfo> }
  | { type: "UPDATE_LOCATION_INFO"; payload: Partial<LocationContext> }
  | { type: "SET_USER_TYPE"; payload: "individual" | "business" | "both" }
  | {
      type: "ADD_ROLE_MODULE";
      payload: { role: keyof NonNullable<Portfolio["roles"]>; data: any };
    }
  | {
      type: "REMOVE_ROLE_MODULE";
      payload: { role: keyof NonNullable<Portfolio["roles"]> };
    }
  | { type: "SWITCH_CONTEXT"; payload: ContextMode }
  | { type: "CLEAR_PORTFOLIO" }
  | {
      type: "ADD_CHECKLIST_ITEM";
      payload: Omit<ChecklistItem, "id" | "addedAt" | "completed">;
    }
  | { type: "TOGGLE_CHECKLIST_ITEM"; payload: { id: string } }
  | { type: "REMOVE_CHECKLIST_ITEM"; payload: { id: string } }
  | { type: "CONFIRM_UPDATE"; payload: { field: string } }
  | { type: "UNDO_UPDATE"; payload: { field: string } };

// Initial state
const initialState: PortfolioState = {
  portfolio: {},
  contextMode: "business",
  recentUpdates: [],
  checklist: [],
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

    case "UPDATE_LOCATION_INFO":
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          location: {
            ...state.portfolio.location,
            ...action.payload,
          },
        },
      };

    case "SET_USER_TYPE":
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          userType: action.payload,
        },
      };

    case "ADD_ROLE_MODULE":
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          roles: {
            ...state.portfolio.roles,
            [action.payload.role]: {
              ...action.payload.data,
              dateAdded: new Date(),
            },
          },
        },
      };

    case "REMOVE_ROLE_MODULE":
      const newRoles = { ...state.portfolio.roles };
      delete newRoles[action.payload.role];
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          roles: newRoles,
        },
      };

    case "ADD_CHECKLIST_ITEM":
      return {
        ...state,
        checklist: [
          ...state.checklist,
          {
            ...action.payload,
            id: Date.now().toString(),
            completed: false,
            addedAt: new Date(),
          },
        ],
      };

    case "TOGGLE_CHECKLIST_ITEM":
      return {
        ...state,
        checklist: state.checklist.map((item) =>
          item.id === action.payload.id
            ? { ...item, completed: !item.completed }
            : item
        ),
      };

    case "REMOVE_CHECKLIST_ITEM":
      return {
        ...state,
        checklist: state.checklist.filter(
          (item) => item.id !== action.payload.id
        ),
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
        checklist: [],
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
  updateLocationInfo: (info: Partial<LocationContext>) => void;
  setUserType: (type: "individual" | "business" | "both") => void;
  addRoleModule: (
    role: keyof NonNullable<Portfolio["roles"]>,
    data: any
  ) => void;
  removeRoleModule: (role: keyof NonNullable<Portfolio["roles"]>) => void;
  switchContext: (mode: ContextMode) => void;
  clearPortfolio: () => void;
  addChecklistItem: (
    item: Omit<ChecklistItem, "id" | "addedAt" | "completed">
  ) => void;
  toggleChecklistItem: (id: string) => void;
  removeChecklistItem: (id: string) => void;
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

  const updateLocationInfo = (info: Partial<LocationContext>) => {
    dispatch({ type: "UPDATE_LOCATION_INFO", payload: info });
  };

  const setUserType = (type: "individual" | "business" | "both") => {
    dispatch({ type: "SET_USER_TYPE", payload: type });
  };

  const addRoleModule = (
    role: keyof NonNullable<Portfolio["roles"]>,
    data: any
  ) => {
    dispatch({ type: "ADD_ROLE_MODULE", payload: { role, data } });
  };

  const removeRoleModule = (role: keyof NonNullable<Portfolio["roles"]>) => {
    dispatch({ type: "REMOVE_ROLE_MODULE", payload: { role } });
  };

  const switchContext = (mode: ContextMode) => {
    dispatch({ type: "SWITCH_CONTEXT", payload: mode });
  };

  const addChecklistItem = (
    item: Omit<ChecklistItem, "id" | "addedAt" | "completed">
  ) => {
    dispatch({ type: "ADD_CHECKLIST_ITEM", payload: item });
  };

  const toggleChecklistItem = (id: string) => {
    dispatch({ type: "TOGGLE_CHECKLIST_ITEM", payload: { id } });
  };

  const removeChecklistItem = (id: string) => {
    dispatch({ type: "REMOVE_CHECKLIST_ITEM", payload: { id } });
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
        updateLocationInfo,
        setUserType,
        addRoleModule,
        removeRoleModule,
        switchContext,
        clearPortfolio,
        addChecklistItem,
        toggleChecklistItem,
        removeChecklistItem,
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
