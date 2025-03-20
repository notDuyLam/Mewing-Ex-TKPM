// components/AddStudentButton.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
  course: string; // Thêm trường course
}

interface AddStudentButtonProps {
  onStudentAdded: () => void;
}

export default function AddStudentButton({ onStudentAdded }: AddStudentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Student>({
    studentId: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    departmentId: 1,
    statusId: 1,
    programId: 1,
    course: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, statusRes, progRes] = await Promise.all([
          fetch("http://localhost:3000/departments/", { method: "GET" }),
          fetch("http://localhost:3000/statuses/", { method: "GET" }),
          fetch("http://localhost:3000/programs/", { method: "GET" }),
        ]);

        if (!deptRes.ok || !statusRes.ok || !progRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const departmentsData = await deptRes.json();
        const statusesData = await statusRes.json();
        const programsData = await progRes.json();

        setDepartments(departmentsData);
        setStatuses(statusesData);
        setPrograms(programsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validateForm = (): boolean => {
    // Kiểm tra rỗng
    if (!newStudent.studentId.trim()) {
      toast.error("Mã sinh viên không được để trống");
      return false;
    }
    if (!newStudent.fullName.trim()) {
      toast.error("Họ tên không được để trống");
      return false;
    }
    if (!newStudent.dateOfBirth) {
      toast.error("Ngày sinh không được để trống");
      return false;
    }
    if (!newStudent.gender) {
      toast.error("Giới tính không được để trống");
      return false;
    }
    if (!newStudent.email.trim()) {
      toast.error("Email không được để trống");
      return false;
    }
    if (!newStudent.phoneNumber.trim()) {
      toast.error("Số điện thoại không được để trống");
      return false;
    }
    if (!newStudent.departmentId) {
      toast.error("Khoa không được để trống");
      return false;
    }
    if (!newStudent.statusId) {
      toast.error("Trạng thái không được để trống");
      return false;
    }
    if (!newStudent.programId) {
      toast.error("Chương trình không được để trống");
      return false;
    }
    if (!newStudent.course.trim()) {
      toast.error("Khóa không được để trống");
      return false;
    }

    // Kiểm tra định dạng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      toast.error("Email không đúng định dạng");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newStudent.phoneNumber)) {
      toast.error("Số điện thoại phải là 10 chữ số");
      return false;
    }

    return true;
  };

  const handleAddStudent = async () => {
    if (!validateForm()) return; // Kiểm tra validation trước khi gửi

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to add student");
        return;
      }

      setNewStudent({
        studentId: "",
        fullName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        phoneNumber: "",
        departmentId: 1,
        statusId: 1,
        programId: 1,
        course: "",
      });
      setIsOpen(false);
      onStudentAdded();
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Thêm Sinh viên</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm Sinh viên Mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Mã sinh viên"
            value={newStudent.studentId}
            onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
            disabled={isLoading}
          />
          <Input
            placeholder="Họ tên"
            value={newStudent.fullName}
            onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
            disabled={isLoading}
          />
          <Input
            type="date"
            value={newStudent.dateOfBirth}
            onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
            disabled={isLoading}
          />
          <select
            value={newStudent.gender}
            onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <Input
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            disabled={isLoading}
          />
          <Input
            placeholder="Số điện thoại"
            value={newStudent.phoneNumber}
            onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
            disabled={isLoading}
          />
          <select
            value={newStudent.departmentId}
            onChange={(e) =>
              setNewStudent({ ...newStudent, departmentId: Number(e.target.value) })
            }
            className="w-full p-2 border rounded"
            disabled={isLoading || departments.length === 0}
          >
            <option value="">Chọn khoa</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <select
            value={newStudent.statusId}
            onChange={(e) =>
              setNewStudent({ ...newStudent, statusId: Number(e.target.value) })
            }
            className="w-full p-2 border rounded"
            disabled={isLoading || statuses.length === 0}
          >
            <option value="">Chọn trạng thái</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
          <select
            value={newStudent.programId}
            onChange={(e) =>
              setNewStudent({ ...newStudent, programId: Number(e.target.value) })
            }
            className="w-full p-2 border rounded"
            disabled={isLoading || programs.length === 0}
          >
            <option value="">Chọn chương trình</option>
            {programs.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name}
              </option>
            ))}
          </select>
          <Input
            placeholder="Khóa (ví dụ: K45)"
            value={newStudent.course}
            onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
            disabled={isLoading}
          />
          <Button onClick={handleAddStudent} disabled={isLoading}>
            {isLoading ? "Đang thêm..." : "Thêm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}