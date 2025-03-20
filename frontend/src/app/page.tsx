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
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState({
    fullName: "",
    studentId: "",
    departmentId: "",
  });

  const fetchStudents = async (
    page: number = 1,
    filterParams = { fullName: "", studentId: "", departmentId: "" }
  ) => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        ...(filterParams.fullName && { fullName: filterParams.fullName }),
        ...(filterParams.studentId && { studentId: filterParams.studentId }),
        ...(filterParams.departmentId && { departmentId: filterParams.departmentId }),
      }).toString();

      const res = await fetch(`http://localhost:3000/students?${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 404) {
        setStudents([]); // Không tìm thấy thì trả về trống
        setPagination({ ...pagination, totalPages: 1, currentPage: page });
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch students: ${res.statusText}`);
      }

      const data: ApiResponse = await res.json();
      setStudents(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setPagination({ ...pagination, totalPages: 1, currentPage: page });
    }
  };

  useEffect(() => {
    fetchStudents(pagination.currentPage, filters); // Lấy dữ liệu lần đầu
  }, []);

  const handleSearch = (newFilters: { fullName: string; studentId: string; departmentId: string }) => {
    setFilters(newFilters); // Lưu filters mới
    fetchStudents(1, newFilters); // Tìm kiếm từ trang 1
  };

  const handlePageChange = (page: number) => {
    fetchStudents(page, filters); // Gọi API với trang mới, giữ filters hiện tại
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách Sinh viên</h1>
      <FilterSection onSearch={handleSearch} />
      <StudentTable
        students={students}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}