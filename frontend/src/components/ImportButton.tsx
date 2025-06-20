"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface onDoneProps {
    onOptionsUpdated: () => void;
}

export default function ImportButton({ onOptionsUpdated }: onDoneProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error(t("import_file:khong_co_file"));
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/import`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("import_file:nhap_that_bai"));
      }

      toast.success(t("import_file:nhap_thanh_cong"));
      onOptionsUpdated();
      setFile(null); // Reset file sau khi import
    } catch (error: any) {
      console.error("Error importing students:", error);
      toast.error(error.message || t("import_file:nhap_that_bai"));
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
        {isLoading ? t("import_file:dang_nhap") : t("import_file:nhap")}
      </Button>
    </div>
  );
}