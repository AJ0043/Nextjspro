"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";

interface ButtonloadingProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string; // <-- ADD THIS
}

export default function Buttonloading({
  isLoading = false,
  children = "Submit",
  className = "",
}: ButtonloadingProps) {
  return (
    <Button
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    >
      {isLoading && <Spinner />}  
      {isLoading ? "Loading..." : children}
    </Button>
  );
}
