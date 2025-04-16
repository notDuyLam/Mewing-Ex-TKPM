"use client";

import { useState, useEffect } from "react";
import StudentTable from "@/components/StudentTable";
import FilterSection from "@/components/FilterSection";
import AddStudentButton from "@/components/AddStudentButton";
import ManageOptionsButton from "@/components/ManageOptionsButton";
import ExportButton from "@/components/ExportButton";
import ImportButton from "@/components/ImportButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

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
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students?${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 404) {
        setStudents([]);
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
    fetchStudents(pagination.currentPage, filters);
  }, []);

  const handleSearch = (newFilters: { fullName: string; studentId: string; departmentId: string }) => {
    setFilters(newFilters);
    fetchStudents(1, newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchStudents(page, filters);
    setSelectedStudents([]);
  };

  const handleStudentAdded = () => {
    fetchStudents(pagination.currentPage, filters);
  };

  const handleOptionsUpdated = () => {
    fetchStudents(pagination.currentPage, filters);
  };

  const handleDelete = async () => {
    try {
      const deletePromises = selectedStudents.map((studentId) =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to delete student ${studentId}`);
          }
          return studentId;
        })
      );

      const deletedIds = await Promise.all(deletePromises);

      setStudents(students.filter((student) => !deletedIds.includes(student.studentId)));
      setSelectedStudents([]);
      if (students.length === deletedIds.length && pagination.currentPage > 1) {
        fetchStudents(pagination.currentPage - 1, filters);
      } else {
        fetchStudents(pagination.currentPage, filters);
      }
      toast.success(`Đã xóa ${deletedIds.length} sinh viên thành công!`);
    } catch (error) {
      console.error("Error deleting students:", error);
      toast.error("Xóa thất bại!");
    }
  };

  return (
    // Nav-menu
    <div className="min-h-screen bg-gray-100">
      <NavigationMenu className="bg-white shadow-md p-4 max-w-full">
        <NavigationMenuList className="flex justify-between items-center container mx-auto">
          <div className="flex items-center gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="text-lg font-semibold text-gray-100 bg-gray-800">
                Quản lý Sinh viên
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href="/courses" className="text-lg font-semibold text-gray-100 bg-gray-800">
                Quản lý Khóa học
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="text-lg font-semibold text-gray-100 bg-gray-800">
                Quản lý Lớp học
              </NavigationMenuLink>
            </NavigationMenuItem>
            
          </div>
        </NavigationMenuList>
      </NavigationMenu>
      {/* Nav - menu --- */}

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Danh sách Sinh viên</h1>
        <div className="flex justify-between mb-4 flex-col">
          <FilterSection onSearch={handleSearch} />
          
          <div className="flex gap-4 mb-4">
            <AddStudentButton onStudentAdded={handleStudentAdded} />
            <ManageOptionsButton onOptionsUpdated={handleOptionsUpdated} />
            {selectedStudents.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Xóa {selectedStudents.length} sinh viên</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc muốn xóa {selectedStudents.length} sinh viên đã chọn? Hành động này không thể hoàn tác.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Hủy</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                      Xóa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        <StudentTable
          students={students}
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onDelete={setSelectedStudents}
        />
        
        <div className="flex gap-4 float-end mb-4">
          <ExportButton />
          <ImportButton onOptionsUpdated={handleOptionsUpdated} />
        </div>
      </div>
    </div>
  );
}