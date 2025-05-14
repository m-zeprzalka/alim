"use client";

import * as React from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ClickableRadioOptionProps {
  value: string;
  id: string;
  label: string;
  description?: string;
  hasInput?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputPlaceholder?: string;
  selected?: boolean;
  className?: string;
}

export const ClickableRadioOption = React.forwardRef<
  HTMLDivElement,
  ClickableRadioOptionProps
>(
  (
    {
      value,
      id,
      label,
      description,
      hasInput = false,
      inputValue = "",
      onInputChange,
      inputPlaceholder = "",
      selected = false,
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Prevent clicks on the input from triggering the radio selection
    const handleInputClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    }; // Handle radio selection
    const handleDivClick = (e: React.MouseEvent) => {
      // If clicked on input and it's already selected, don't do anything
      if (
        (e.target as HTMLElement).tagName === "INPUT" &&
        selected &&
        hasInput
      ) {
        return;
      }

      // Manually trigger the RadioGroupItem
      const radioInput = document.getElementById(id) as HTMLInputElement;
      if (radioInput && !selected) {
        radioInput.click();
      }

      // If this option has an input and is being selected, focus the input
      if (hasInput && selected) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "p-3 border-2 rounded-lg transition-colors cursor-pointer",
          selected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-300",
          className
        )}
        {...props}
        onClick={handleDivClick}
      >
        <div className="flex items-start gap-3 cursor-pointer">
          {/* We'll hide the actual radio visually but keep it in the DOM for accessibility */}
          <div className="relative mt-1">
            {" "}
            <RadioGroupItem
              value={value}
              id={id}
              className="pointer-events-auto absolute opacity-0"
            />
          </div>
          <div className="w-full">
            <Label htmlFor={id} className="font-medium cursor-pointer">
              {label}
            </Label>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            {hasInput && selected && (
              <div className="mt-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => onInputChange?.(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="w-full"
                  onClick={handleInputClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ClickableRadioOption.displayName = "ClickableRadioOption";
