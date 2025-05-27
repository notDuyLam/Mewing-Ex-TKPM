"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Department {
  id: number;
  name: string;
}

interface FilterSectionProps {
  onSearch: (filters: {
    fullName: string;
    studentId: string;
    departmentId: string;
  }) => void;
}

export default function FilterSection({ onSearch }: FilterSectionProps) {
  const { t } = useTranslation("filter");

  const [filters, setFilters] = useState({
    fullName: "",
    studentId: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/departments/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch departments");
        const data: Department[] = await res.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSearch = () => {
    setIsFetching(true);
    onSearch(filters);
    setTimeout(() => setIsFetching(false), 500); // Fake loading
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDepartmentId = e.target.value;
    const newFilters = { ...filters, departmentId: newDepartmentId };
    setFilters(newFilters);
    setIsFetching(true);
    onSearch(newFilters);
    setTimeout(() => setIsFetching(false), 500); // Fake loading
  };

  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder={t("tim_ho_ten")}
        value={filters.fullName}
        onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
        onKeyPress={handleKeyPress}
        className="w-1/3"
        disabled={isFetching}
      />
      <Input
        placeholder={t("tim_mssv")}
        value={filters.studentId}
        onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
        onKeyPress={handleKeyPress}
        className="w-1/3"
        disabled={isFetching}
      />
      <select
        value={filters.departmentId}
        onChange={handleDepartmentChange}
        className="w-1/3 p-2 border rounded"
        disabled={isFetching || departments.length === 0}
      >
        <option value="">{t("tat_ca_khoa")}</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
      <Button onClick={handleSearch} disabled={isFetching}>
        {isFetching ? t("dang_tim") : t("tim")}
      </Button>
    </div>
  );
}
