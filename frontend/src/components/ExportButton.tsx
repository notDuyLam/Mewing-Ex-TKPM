"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ExportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState<"csv" | "excel">("csv");

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/export/${format}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to export students");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `students_export_${new Date().toISOString()}.${format === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Export thành công!");
    } catch (error : any) {
      console.error("Error exporting students:", error);
      toast.error(error.message || "Export thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={format} onValueChange={(value: "csv" | "excel") => setFormat(value)}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Chọn định dạng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="excel">Excel</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleExport} disabled={isLoading}>
        {isLoading ? "Đang export..." : "Export"}
      </Button>
    </div>
  );
}