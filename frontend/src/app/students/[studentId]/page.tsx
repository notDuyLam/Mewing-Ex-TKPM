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

interface StudentDetails {
  permanentAddressHouse: string;
  permanentAddressWard: string;
  permanentAddressDistrict: string;
  permanentAddressCity: string;
  permanentAddressCountry: string;
  temporaryAddress: string;
  mailingAddress: string;
  nationality: string;
}

interface IdentityDocuments {
  identityType: string;
  identityNumber: string;
  issueDate: string;
  issuePlace: string;
  expiryDate: string;
  chipAttached: boolean;
  issuingCountry: string;
  note: string;
}

interface Student {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  departmentId: number;
  course: string;
  statusId: number;
  programId: number;
  department?: Department;
  status?: Status;
  program?: Program;
  details?: StudentDetails;
  identity?: IdentityDocuments;
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

      // Fetch department, status, program
      const [deptRes, statusRes, progRes, detailsRes, identityRes] = await Promise.all([
        fetch(`http://localhost:3000/departments/${studentData.departmentId}`, {
          method: "GET",
        }),
        fetch(`http://localhost:3000/statuses/${studentData.statusId}`, {
          method: "GET",
        }),
        fetch(`http://localhost:3000/programs/${studentData.programId}`, {
          method: "GET",
        }),
        fetch(`http://localhost:3000/student-details/${studentId}`, {
          method: "GET",
        }),
        fetch(`http://localhost:3000/identity-documents/${studentId}`, {
          method: "GET",
        }),
      ]);

      const department = deptRes.ok ? await deptRes.json() : { id: studentData.departmentId, name: "N/A" };
      const status = statusRes.ok ? await statusRes.json() : { id: studentData.statusId, name: "N/A" };
      const program = progRes.ok ? await progRes.json() : { id: studentData.programId, name: "N/A" };
      const details = detailsRes.ok ? await detailsRes.json() : null;
      const identity = identityRes.ok ? await identityRes.json() : null;

      // Gộp dữ liệu
      setStudent({
        ...studentData,
        department,
        status,
        program,
        details,
        identity,
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
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Chi tiết Sinh viên: {student.fullName}</h1>
      <div className="grid grid-cols-2 gap-6 bg-white shadow-md rounded-lg p-6">
        {/* Cột trái: Thông tin cơ bản */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Thông tin cơ bản</h2>
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

        {/* Cột phải: Thông tin bổ sung */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Thông tin bổ sung</h2>
          <div className="space-y-2">
            {student.details ? (
              <>
                <p>
                  <strong>Địa chỉ thường trú:</strong>{" "}
                  {[
                    student.details.permanentAddressHouse,
                    student.details.permanentAddressWard,
                    student.details.permanentAddressDistrict,
                    student.details.permanentAddressCity,
                    student.details.permanentAddressCountry,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </p>
                <p>
                  <strong>Địa chỉ tạm trú:</strong> {student.details.temporaryAddress || "N/A"}
                </p>
                <p>
                  <strong>Địa chỉ nhận thư:</strong> {student.details.mailingAddress || "N/A"}
                </p>
                <p>
                  <strong>Quốc tịch:</strong> {student.details.nationality || "N/A"}
                </p>
              </>
            ) : (
              <p>Không có thông tin chi tiết</p>
            )}
          </div>
          <div className="space-y-2 pt-4 border-t">
            {student.identity ? (
              <>
                <p>
                  <strong>Loại giấy tờ:</strong> {student.identity.identityType}
                </p>
                <p>
                  <strong>Số giấy tờ:</strong> {student.identity.identityNumber}
                </p>
                <p>
                  <strong>Ngày cấp:</strong>{" "}
                  {student.identity.issueDate
                    ? new Date(student.identity.issueDate).toLocaleDateString("vi-VN")
                    : "N/A"}
                </p>
                <p>
                  <strong>Nơi cấp:</strong> {student.identity.issuePlace || "N/A"}
                </p>
                <p>
                  <strong>Ngày hết hạn:</strong>{" "}
                  {student.identity.expiryDate
                    ? new Date(student.identity.expiryDate).toLocaleDateString("vi-VN")
                    : "N/A"}
                </p>
                {student.identity.identityType === "CCCD" && (
                  <p>
                    <strong>Gắn chip:</strong> {student.identity.chipAttached ? "Có" : "Không"}
                  </p>
                )}
                {student.identity.identityType === "Hộ chiếu" && (
                  <>
                    <p>
                      <strong>Quốc gia cấp:</strong> {student.identity.issuingCountry || "N/A"}
                    </p>
                    <p>
                      <strong>Ghi chú:</strong> {student.identity.note || "N/A"}
                    </p>
                  </>
                )}
              </>
            ) : (
              <p>Không có thông tin giấy tờ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}