"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Info } from "lucide-react";
import { CircleEllipsis } from "lucide-react";
interface InfoTooltipProps {
  content: React.ReactNode;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Więcej informacji"
          >
            <CircleEllipsis />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="center"
          className="max-w-[calc(100vw-32px)] sm:max-w-sm p-4 bg-slate-900 text-white text-[13px] leading-5 shadow-lg z-50"
          sideOffset={5}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
