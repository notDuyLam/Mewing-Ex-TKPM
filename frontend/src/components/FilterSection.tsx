// components/FilterSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Department {
  id: number;
  name: string;
}

interface FilterSectionProps {
  onSearch: (filters: { fullName: string; studentId: string; departmentId: string }) => void;
}

export default function FilterSection({ onSearch }: FilterSectionProps) {
  const [filters, setFilters] = useState({
    fullName: "",
    studentId: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data: Department[] = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSearch = () => {
    setIsFetching(true);
    onSearch(filters);
    setTimeout(() => setIsFetching(false), 500); // Giả lập loading
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
    setTimeout(() => setIsFetching(false), 500); // Giả lập loading
  };

  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Tìm theo họ tên"
        value={filters.fullName}
        onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
        onKeyPress={handleKeyPress}
        className="w-1/3"
        disabled={isFetching}
      />
      <Input
        placeholder="Tìm theo MSSV"
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
        <option value="">Tất cả khoa</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
      <Button onClick={handleSearch} disabled={isFetching}>
        {isFetching ? "Đang tìm..." : "Tìm kiếm"}
      </Button>
    </div>
  );
}