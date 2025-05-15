"use client";

import { AlertCircle } from "lucide-react";

type FormErrorAlertProps = {
  message: string | null;
  className?: string;
};

export function FormErrorAlert({
  message,
  className = "",
}: FormErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      className={`bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start gap-2 ${className}`}
    >
      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
