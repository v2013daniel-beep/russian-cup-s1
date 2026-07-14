"use client";

import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
  leftElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, rightElement, leftElement, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dota-muted mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dota-muted">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-dota-surface border border-dota-muted/20 rounded-lg px-4 py-3 text-dota-text placeholder:text-dota-muted/50 transition-all duration-200",
              error && "border-dota-red focus:border-dota-red",
              leftElement && "pl-10",
              rightElement && "pr-12",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-dota-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
