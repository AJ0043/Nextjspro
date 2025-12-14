"use client";

import * as React from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: string }
  | { type: "UPDATE_TOAST"; toast: Toast }
  | { type: "DISMISS_TOAST"; id?: string }
  | { type: "REMOVE_ALL_TOASTS" };

const toastTimeout = 3000;

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case "ADD_TOAST":
      return [...state, action.toast];
    case "UPDATE_TOAST":
      return state.map((t) => (t.id === action.toast.id ? action.toast : t));
    case "DISMISS_TOAST":
      return state.filter((t) => t.id !== action.id);
    case "REMOVE_TOAST":
      return state.filter((t) => t.id !== action.id);
    case "REMOVE_ALL_TOASTS":
      return [];
    default:
      return state;
  }
}

const ToastContext = React.createContext<{
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
} | null>(null);

export function ToastProviderPrimitive({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = React.useReducer(toastReducer, []);

  const toast = (props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    dispatch({
      type: "ADD_TOAST",
      toast: { id, ...props },
    });

    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", id });
    }, toastTimeout);
  };

  const dismiss = (id: string) => {
    dispatch({ type: "REMOVE_TOAST", id });
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProviderPrimitive");
  }

  return context;
}
