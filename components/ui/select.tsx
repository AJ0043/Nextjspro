"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

type PrimitiveTriggerProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>;
type PrimitiveContentProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;
type PrimitiveItemProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  PrimitiveTriggerProps
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  PrimitiveContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn("z-50 min-w-[200px] overflow-hidden rounded-md border bg-white p-1 shadow-lg", className)}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = "SelectContent";

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1 pl-2 text-xs font-medium text-gray-700", className)} {...props} />
));
SelectLabel.displayName = "SelectLabel";

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  PrimitiveItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm text-gray-800 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = "SelectItem";

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("my-1 h-px bg-gray-100", className)} {...props} />
));
SelectSeparator.displayName = "SelectSeparator";
