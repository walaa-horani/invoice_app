"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button variant="outline" className="flex items-center gap-2" onClick={handlePrint}>
      <Printer className="w-4 h-4" />
      <span>Print Invoice</span>
    </Button>
  );
}
