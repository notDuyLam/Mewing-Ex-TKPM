// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import StudentTable from "@/components/StudentTable";
import FilterSection from "@/components/FilterSection";

interface Department {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
}

interface Program {
  id: number;
  name: string;
}

interface Student {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  departmentId: number;
  statusId: number;
  programId: number;
  department: Department;
  status: Status;
  program: Program;
}

interface ApiResponse {
  message: string;
  data: Student[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async (filters = { fullName: "", studentId: "", departmentId: "" }) => {
    try {
      const query = new URLSearchParams({
        ...(filters.fullName && { fullName: filters.fullName }),
        ...(filters.studentId && { studentId: filters.studentId }),
        ...(filters.departmentId && { departmentId: filters.departmentId }),
      }).toString();

      const res = await fetch(`http://localhost:3000/students${query ? `?${query}` : ""}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 404) {
        setStudents([]);
        return; // Giữ nguyên dữ liệu cũ
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch students: ${res.statusText}`);
      }

      const data: ApiResponse = await res.json();
      setStudents(data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents(); // Lấy toàn bộ danh sách khi load lần đầu
  }, []);

  const handleSearch = (filters: { fullName: string; studentId: string; departmentId: string }) => {
    fetchStudents(filters); // Không set loading để tránh nhấp nháy
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách Sinh viên</h1>
      <FilterSection onSearch={handleSearch} />
      <StudentTable students={students} />
    </div>
  );
}