// components/ImportButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface onDoneProps {
    onOptionsUpdated: () => void;
}
  

export default function ImportButton({onOptionsUpdated} : onDoneProps ) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file để import!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/students/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import students");
      }

      toast.success("Import thành công!");
      onOptionsUpdated();
      setFile(null); // Reset file sau khi import
    } catch (error : any) {
      console.error("Error importing students:", error);
      toast.error(error.message || "Import thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileChange}
        disabled={isLoading}
        className="w-auto"
      />
      <Button onClick={handleImport} disabled={isLoading}>
        {isLoading ? "Đang import..." : "Import"}
      </Button>
    </div>
  );
}