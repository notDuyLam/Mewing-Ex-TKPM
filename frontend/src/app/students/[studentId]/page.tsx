// app/students/[studentId]/page.tsx
"use client";

import { useState, useEffect } from "react";

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
  course: string,
  statusId: number;
  programId: number;
  department?: Department;
  status?: Status;
  program?: Program;
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = async (studentId: string) => {
    try {
      // Fetch thông tin sinh viên
      const studentRes = await fetch(`http://localhost:3000/students/${studentId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!studentRes.ok) {
        throw new Error("Failed to fetch student");
      }
      const studentData: Student = await studentRes.json();

      // Fetch department, status, program dựa trên ID
      const [deptRes, statusRes, progRes] = await Promise.all([
        fetch(`http://localhost:3000/departments/${studentData.departmentId}`, {
          method: "GET",
        }),
        fetch(`http://localhost:3000/statuses/${studentData.statusId}`, {
          method: "GET",
        }),
        fetch(`http://localhost:3000/programs/${studentData.programId}`, {
          method: "GET",
        }),
      ]);

      const department = deptRes.ok ? await deptRes.json() : { id: studentData.departmentId, name: "N/A" };
      const status = statusRes.ok ? await statusRes.json() : { id: studentData.statusId, name: "N/A" };
      const program = progRes.ok ? await progRes.json() : { id: studentData.programId, name: "N/A" };

      // Gộp dữ liệu
      setStudent({
        ...studentData,
        department,
        status,
        program,
      });
    } catch (error) {
      console.error("Error fetching student details:", error);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadParams = async () => {
      const { studentId } = await params;
      fetchStudent(studentId);
    };
    loadParams();
  }, [params]);

  if (loading) {
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  if (!student) {
    return <div className="container mx-auto p-4">Không tìm thấy sinh viên</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết Sinh viên: {student.fullName}</h1>
      <div className="space-y-2">
        <p>
          <strong>MSSV:</strong> {student.studentId}
        </p>
        <p>
          <strong>Họ tên:</strong> {student.fullName}
        </p>
        <p>
          <strong>Ngày sinh:</strong>{" "}
          {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
        </p>
        <p>
          <strong>Giới tính:</strong> {student.gender}
        </p>
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {student.phoneNumber}
        </p>
        <p>
          <strong>Khoa:</strong> {student.department?.name || "N/A"}
        </p>
        <p>
          <strong>Khóa:</strong> {student.course || "N/A"}
        </p>
        <p>
          <strong>Trạng thái:</strong> {student.status?.name || "N/A"}
        </p>
        <p>
          <strong>Chương trình:</strong> {student.program?.name || "N/A"}
        </p>
      </div>
    </div>
  );
}