"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

// Pre-render the circle SVG to avoid creating it on each render
const CircleSVG = React.memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-3.5 w-3.5 fill-primary"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
));

// Memoized indicator component to prevent unnecessary re-renders
const RadioIndicator = React.memo(() => (
  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
    <CircleSVG />
  </RadioGroupPrimitive.Indicator>
));

// Optimized RadioGroup component
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    onValueChange?: (value: string) => void;
  }
>(({ className, onValueChange, ...props }, ref) => {
  // Optimized value change handler that uses requestAnimationFrame
  const handleValueChange = React.useCallback(
    (value: string) => {
      if (onValueChange) {
        // Use requestAnimationFrame to ensure the change happens in the next paint cycle
        requestAnimationFrame(() => {
          onValueChange(value);
        });
      }
    },
    [onValueChange]
  );

  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      onValueChange={handleValueChange}
      {...props}
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

// Optimized RadioGroupItem component
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        // Add will-change to optimize animations
        "will-change-[background-color,border-color] transition-[background-color,border-color] duration-100",
        className
      )}
      {...props}
    >
      <RadioIndicator />
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// Memoize the components
const MemoizedRadioGroup = React.memo(RadioGroup);
const MemoizedRadioGroupItem = React.memo(RadioGroupItem);

// Export the components
export { 
  MemoizedRadioGroup as RadioGroup, 
  MemoizedRadioGroupItem as RadioGroupItem 
};
