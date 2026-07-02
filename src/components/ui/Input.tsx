"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dota-muted mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-dota-surface border border-dota-muted/20 rounded-lg px-4 py-3 text-dota-text placeholder:text-dota-muted/50 transition-all duration-200",
            error && "border-dota-red focus:border-dota-red",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-dota-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
