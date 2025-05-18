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

// Komponent owinięty w React.memo dla optymalizacji ponownego renderowania
export const ClickableRadioOption = React.memo(
  React.forwardRef<HTMLDivElement, ClickableRadioOptionProps>(
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
      const handleInputClick = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
      }, []);

      // Handle radio selection
      const handleDivClick = React.useCallback(
        (e: React.MouseEvent) => {
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
        },
        [id, selected, hasInput]
      );

      return (
        <div
          ref={ref}
          className={cn(
            "p-4 border-2 rounded-lg transition-colors cursor-pointer",
            selected
              ? "border-sky-950 bg-sky-50"
              : "border-gray-200 hover:borde-sky-500",
            className
          )}
          {...props}
          onClick={handleDivClick}
        >
          <div className="flex items-start cursor-pointer">
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
                <p className="text-xs text-gray-500 mt-2">{description}</p>
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
  ),
  // Funkcja porównująca props dla memo - renderuj ponownie tylko gdy istotne props się zmieniły
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.selected === nextProps.selected &&
      prevProps.label === nextProps.label &&
      prevProps.description === nextProps.description &&
      prevProps.inputValue === nextProps.inputValue
    );
  }
);

ClickableRadioOption.displayName = "ClickableRadioOption";
