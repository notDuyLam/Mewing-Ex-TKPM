"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import jsPDF from "jspdf";

// Import font Roboto-Regular dưới dạng base64
// Giả sử bạn đã lưu chuỗi base64 trong file `@/fonts/Roboto-Regular.js`
import {robotoFont} from "@/fonts/Roboto-Regular";

// Nếu bạn chưa có file Roboto-Regular.js, bạn cần tạo file này với nội dung:
// export default "data:font/truetype;base64,AEAAA..."; (chuỗi base64 của font Roboto-Regular.ttf)

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
  id: string;
  identityType: string;
  identityNumber: string;
  issueDate: string;
  issuePlace: string;
  expiryDate: string;
  chipAttached: boolean;
  issuingCountry: string;
  note: string;
}

interface Course {
  courseId: string;
  courseName: string;
  credits: number;
  departmentId: number;
  description: string;
  preCourseId: string | null;
  status: string;
}

interface Semester {
  id: number;
  year: string;
  startDate: string;
  endDate: string;
  cancelDeadline: string;
}

interface Class {
  classId: string;
  courseId: string;
  year: number;
  maxStudent: number;
  schedule: string;
  room: string;
  teacherId: string;
  semesterId: number;
  Course: Course;
  Semester: Semester;
}

interface Grade {
  id: number;
  studentId: string;
  classId: string;
  registerBy: number;
  registerAt: string;
  grade: number | null;
  status: string;
  Class: Class;
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
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isGradesOpen, setIsGradesOpen] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editDetails, setEditDetails] = useState<StudentDetails | null>(null);
  const [editIdentity, setEditIdentity] = useState<IdentityDocuments | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGradesLoading, setIsGradesLoading] = useState(false);

  const fetchStudent = async (studentId: string) => {
    try {
      const studentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!studentRes.ok) throw new Error("Failed to fetch student");
      const studentData: Student = await studentRes.json();

      const [deptRes, statusRes, progRes, detailsRes, identityRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/${studentData.departmentId}`, { method: "GET" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/statuses/${studentData.statusId}`, { method: "GET" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${studentData.programId}`, { method: "GET" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/student-details/${studentId}`, { method: "GET" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/identity-documents/student/${studentId}`, { method: "GET" }),
      ]);

      const department = deptRes.ok ? await deptRes.json() : { id: studentData.departmentId, name: "N/A" };
      const status = statusRes.ok ? await statusRes.json() : { id: studentData.statusId, name: "N/A" };
      const program = progRes.ok ? await progRes.json() : { id: studentData.programId, name: "N/A" };
      const details = detailsRes.ok ? await detailsRes.json() : null;
      const identity = identityRes.ok ? await identityRes.json() : null;

      studentData.dateOfBirth = studentData.dateOfBirth.split("T")[0];
      if (identity) {
        identity.issueDate = identity.issueDate.split("T")[0];
        identity.expiryDate = identity.expiryDate.split("T")[0];
      }

      const fullStudent = { ...studentData, department, status, program, details, identity };
      setStudent(fullStudent);
      setEditStudent(fullStudent);
      setEditDetails(details || {
        permanentAddressHouse: "",
        permanentAddressWard: "",
        permanentAddressDistrict: "",
        permanentAddressCity: "",
        permanentAddressCountry: "",
        temporaryAddress: "",
        mailingAddress: "",
        nationality: "",
      });
      setEditIdentity(identity || {
        identityType: "",
        identityNumber: "",
        issueDate: "",
        issuePlace: "",
        expiryDate: "",
        chipAttached: false,
        issuingCountry: "",
        note: "",
      });
    } catch (error) {
      console.error("Error fetching student details:", error);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [deptRes, statusRes, progRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/`, { method: "GET" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/statuses/`, { method: "GET" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/`, { method: "GET" }),
      ]);
      setDepartments(deptRes.ok ? await deptRes.json() : []);
      setStatuses(statusRes.ok ? await statusRes.json() : []);
      setPrograms(progRes.ok ? await progRes.json() : []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchGrades = async (studentId: string) => {
    setIsGradesLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/report/id/${studentId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch grades");
      const data = await response.json();
      setGrades(data.grades);
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Không thể tải kết quả học tập");
    } finally {
      setIsGradesLoading(false);
    }
  };

  const generateTranscriptPDF = () => {
    if (!student) return;

    const doc = new jsPDF();

    // Thêm font Roboto để hỗ trợ tiếng Việt
    doc.addFileToVFS("Roboto-Regular.ttf", robotoFont);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Title
    doc.setFontSize(16);
    doc.text("BẢNG ĐIỂM SINH VIÊN", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Student Info
    doc.setFontSize(12);
    doc.text(`MSSV: ${student.studentId}`, 20, y);
    y += 8;
    doc.text(`Họ tên: ${student.fullName}`, 20, y);
    y += 8;
    doc.text(`Ngày sinh: ${new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}`, 20, y);
    y += 8;
    doc.text(`Khoa: ${student.department?.name || "N/A"}`, 20, y);
    y += 8;
    doc.text(`Khóa: ${student.course || "N/A"}`, 20, y);
    y += 15;

    // Completed Courses
    const completedCourses = grades.filter((grade) => grade.status === "passed" && grade.grade !== null);

    doc.setFontSize(14);
    doc.text("Các môn học đã hoàn thành", 20, y);
    y += 10;

    if (completedCourses.length === 0) {
      doc.setFontSize(12);
      doc.text("Sinh viên chưa hoàn thành khóa học nào", 20, y);
    } else {
      // Table Header
      doc.setFontSize(10);
      const headers = ["Mã lớp", "Tên môn học", "Tín chỉ", "Điểm", "Kỳ học"];
      const colWidths = [30, 60, 20, 20, 50];
      let x = 20;

      headers.forEach((header, i) => {
        doc.text(header, x, y);
        x += colWidths[i];
      });
      y += 5;
      doc.line(20, y, pageWidth - 20, y);
      y += 5;

      // Table Rows
      completedCourses.forEach((grade) => {
        x = 20;
        const row = [
          grade.classId,
          grade.Class.Course.courseName,
          grade.Class.Course.credits.toString(),
          grade.grade!.toFixed(1),
          `${new Date(grade.Class.Semester.startDate).toLocaleDateString("vi-VN")} - ${new Date(
            grade.Class.Semester.endDate
          ).toLocaleDateString("vi-VN")}`,
        ];

        row.forEach((cell, i) => {
          doc.text(cell, x, y);
          x += colWidths[i];
        });
        y += 8;
      });
    }

    // Save PDF
    doc.save(`transcript_${student.studentId}.pdf`);
  };

  useEffect(() => {
    const loadParams = async () => {
      const { studentId } = await params;
      await fetchStudent(studentId);
      await fetchOptions();
    };
    loadParams();
  }, [params]);

  const handleSave = async () => {
    if (!editStudent) return;
    setIsSaving(true);
    try {
      const studentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${editStudent.studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editStudent),
      });
      if (studentRes.status === 400) {
        const data = await studentRes.json();
        toast.info(data.message);
        return;
      }

      if (student?.details) {
        const detailsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student-details/${editStudent.studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editDetails, studentId: editStudent.studentId }),
        });
        if (!detailsRes.ok) throw new Error("Failed to update student details");
      } else if (Object.values(editDetails!).some((val) => val)) {
        const detailsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editDetails, studentId: editStudent.studentId }),
        });
        if (!detailsRes.ok) throw new Error("Failed to create student details");
      }

      if (student?.identity) {
        if (editIdentity?.identityType) {
          const identityRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-documents/${editStudent?.identity?.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...editIdentity, studentId: editStudent.studentId }),
            }
          );
          if (!identityRes.ok) {
            const _data = await identityRes;
            console.log(editStudent);
            return;
          }
        }
      } else if (editIdentity?.identityType) {
        const identityRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/identity-documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editIdentity, studentId: editStudent.studentId }),
        });
        if (!identityRes.ok) throw new Error("Failed to create identity documents");
      }

      toast.success("Cập nhật thành công!");
      setIsEditOpen(false);
      fetchStudent(editStudent.studentId);
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!student) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${student.studentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to delete student");

      toast.success("Xóa sinh viên thành công!");
      router.push("/");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Xóa thất bại!");
    }
  };

  const handleEditOpen = async () => {
    setIsEditOpen(true);
    await fetchOptions();
  };

  const handleGradesOpen = async () => {
    setIsGradesOpen(true);
    const { studentId } = await params;
    await fetchGrades(studentId);
  };

  if (loading) return <div className="container mx-auto p-4">Đang tải...</div>;
  if (!student) return <div className="container mx-auto p-4">Không tìm thấy sinh viên</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Chi tiết Sinh viên: {student.fullName}</h1>
      <div className="grid grid-cols-2 gap-6 bg-white shadow-md rounded-lg p-6">
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
              <strong>Ngày sinh:</strong> {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
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
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => router.push("/")}>
          Trở về
        </Button>
        <div className="flex gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleEditOpen}>Chỉnh sửa</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa Sinh viên</DialogTitle>
              </DialogHeader>
              {editStudent && editDetails && editIdentity && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-4">
                    <Input
                      placeholder="Mã sinh viên"
                      value={editStudent.studentId}
                      onChange={(e) => setEditStudent({ ...editStudent, studentId: e.target.value })}
                      disabled={isSaving}
                    />
                    <Input
                      placeholder="Họ tên"
                      value={editStudent.fullName}
                      onChange={(e) => setEditStudent({ ...editStudent, fullName: e.target.value })}
                      disabled={isSaving}
                    />
                    <div className="flex items-center space-x-2">
                      <label>Ngày sinh:</label>
                      <Input
                        className="w-auto"
                        type="date"
                        value={editStudent.dateOfBirth}
                        onChange={(e) => setEditStudent({ ...editStudent, dateOfBirth: e.target.value })}
                        disabled={isSaving}
                      />
                    </div>
                    <select
                      value={editStudent.gender}
                      onChange={(e) => setEditStudent({ ...editStudent, gender: e.target.value })}
                      className="w-full p-2 border rounded"
                      disabled={isSaving}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                    <Input
                      placeholder="Email"
                      value={editStudent.email}
                      onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                      disabled={isSaving}
                    />
                    <Input
                      placeholder="Số điện thoại"
                      value={editStudent.phoneNumber}
                      onChange={(e) => setEditStudent({ ...editStudent, phoneNumber: e.target.value })}
                      disabled={isSaving}
                    />
                    <select
                      value={editStudent.departmentId}
                      onChange={(e) => setEditStudent({ ...editStudent, departmentId: Number(e.target.value) })}
                      className="w-full p-2 border rounded"
                      disabled={isSaving || departments.length === 0}
                    >
                      <option value={0}>Chọn khoa</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editStudent.statusId}
                      onChange={(e) => setEditStudent({ ...editStudent, statusId: Number(e.target.value) })}
                      className="w-full p-2 border rounded"
                      disabled={isSaving || statuses.length === 0}
                    >
                      <option value={0}>Chọn trạng thái</option>
                      {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editStudent.programId}
                      onChange={(e) => setEditStudent({ ...editStudent, programId: Number(e.target.value) })}
                      className="w-full p-2 border rounded"
                      disabled={isSaving || programs.length === 0}
                    >
                      <option value={0}>Chọn chương trình</option>
                      {programs.map((prog) => (
                        <option key={prog.id} value={prog.id}>
                          {prog.name}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="Khóa (ví dụ: K45)"
                      value={editStudent.course}
                      onChange={(e) => setEditStudent({ ...editStudent, course: e.target.value })}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-4">
                    <Input
                      placeholder="Số nhà (Địa chỉ thường trú)"
                      value={editDetails.permanentAddressHouse || ""}
                      onChange={(e) =>
                        setEditDetails({ ...editDetails, permanentAddressHouse: e.target.value })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder="Phường/Xã (Địa chỉ thường trú)"
                      value={editDetails.permanentAddressWard || ""}
                      onChange={(e) => setEditDetails({ ...editDetails, permanentAddressWard: e.target.value })}
                      disabled={isSaving}
                    />
                    <Input
                      placeholder="Quận/Huyện (Địa chỉ thường trú)"
                      value={editDetails.permanentAddressDistrict || ""}
                      onChange={(e) =>
                        setEditDetails({ ...editDetails, permanentAddressDistrict: e.target.value })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder="Tỉnh/Thành phố (Địa chỉ thường trú)"
                      value={editDetails.permanentAddressCity || ""}
                      onChange={(e) => setEditDetails({ ...editDetails, permanentAddressCity: e.target.value })}
                      disabled={isSaving}
                    />
                    <Input
                      placeholder="Quốc gia (Địa chỉ thường trú)"
                      value={editDetails.permanentAddressCountry || ""}
                      onChange={(e) =>
                        setEditDetails({ ...editDetails, permanentAddressCountry: e.target.value })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder="Địa chỉ tạm trú"
                      value={editDetails.temporaryAddress || ""}
                      onChange={(e) => setEditDetails({ ...editDetails, temporaryAddress: e.target.value })}
                      disabled={isSaving}
                    />
                    <Input
                      placeholder="Địa chỉ nhận thư"
                      value={editDetails.mailingAddress || ""}
                      onChange={(e) => setEditDetails({ ...editDetails, mailingAddress: e.target.value })}
                      disabled={isSaving}
                    />
                    <Input
                      placeholder="Quốc tịch"
                      value={editDetails.nationality || ""}
                      onChange={(e) => setEditDetails({ ...editDetails, nationality: e.target.value })}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-4">
                    <select
                      value={editIdentity.identityType}
                      onChange={(e) => setEditIdentity({ ...editIdentity, identityType: e.target.value })}
                      className="w-full p-2 border rounded"
                      disabled={isSaving}
                    >
                      <option value="">Chọn loại giấy tờ</option>
                      <option value="CMND">CMND</option>
                      <option value="CCCD">CCCD</option>
                      <option value="Hộ chiếu">Hộ chiếu</option>
                    </select>
                    <Input
                      placeholder={
                        editIdentity.identityType === "CMND"
                          ? "Số CMND"
                          : editIdentity.identityType === "CCCD"
                          ? "Số CCCD"
                          : "Số hộ chiếu"
                      }
                      value={editIdentity.identityNumber}
                      onChange={(e) => setEditIdentity({ ...editIdentity, identityNumber: e.target.value })}
                      disabled={isSaving}
                    />
                    <div className="flex items-center space-x-2">
                      <label>Ngày cấp:</label>
                      <Input
                        type="date"
                        className="w-auto"
                        value={editIdentity.issueDate}
                        onChange={(e) => setEditIdentity({ ...editIdentity, issueDate: e.target.value })}
                        disabled={isSaving}
                      />
                    </div>
                    <Input
                      placeholder="Nơi cấp"
                      value={editIdentity.issuePlace}
                      onChange={(e) => setEditIdentity({ ...editIdentity, issuePlace: e.target.value })}
                      disabled={isSaving}
                    />
                    <div className="flex items-center space-x-2">
                      <label>Ngày hết hạn:</label>
                      <Input
                        type="date"
                        className="w-auto"
                        value={editIdentity.expiryDate}
                        onChange={(e) => setEditIdentity({ ...editIdentity, expiryDate: e.target.value })}
                        disabled={isSaving}
                      />
                    </div>
                    {editIdentity.identityType === "CCCD" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={editIdentity.chipAttached}
                          onCheckedChange={(checked) =>
                            setEditIdentity({ ...editIdentity, chipAttached: checked === true })
                          }
                          disabled={isSaving}
                        />
                        <label>Gắn chip</label>
                      </div>
                    )}
                    {editIdentity.identityType === "Hộ chiếu" && (
                      <>
                        <Input
                          placeholder="Quốc gia cấp"
                          value={editIdentity.issuingCountry}
                          onChange={(e) =>
                            setEditIdentity({ ...editIdentity, issuingCountry: e.target.value })
                          }
                          disabled={isSaving}
                        />
                        <Input
                          placeholder="Ghi chú"
                          value={editIdentity.note}
                          onChange={(e) => setEditIdentity({ ...editIdentity, note: e.target.value })}
                          disabled={isSaving}
                        />
                      </>
                    )}
                  </div>

                  <div className="col-span-3 mt-4">
                    <Button onClick={handleSave} disabled={isSaving} className="w-full">
                      {isSaving ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Xóa sinh viên</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogDescription>
                  Bạn có chắc muốn xóa sinh viên {student.fullName} ({student.studentId})? Hành động này
                  không thể hoàn tác.
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

          <Dialog open={isGradesOpen} onOpenChange={setIsGradesOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleGradesOpen}>Xem kết quả học tập</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Kết quả học tập của {student?.fullName}</DialogTitle>
              </DialogHeader>
              {isGradesLoading ? (
                <div className="flex justify-center p-4">
                  <p>Đang tải...</p>
                </div>
              ) : grades.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Không có kết quả học tập</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã lớp</TableHead>
                      <TableHead>Tên môn học</TableHead>
                      <TableHead>Số tín chỉ</TableHead>
                      <TableHead>Điểm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Kỳ học</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell>{grade.classId}</TableCell>
                        <TableCell>{grade.Class.Course.courseName}</TableCell>
                        <TableCell>{grade.Class.Course.credits}</TableCell>
                        <TableCell>{grade.grade ?? "N/A"}</TableCell>
                        <TableCell>
                          {grade.status === "active"
                            ? "Đang học"
                            : grade.status === "passed"
                            ? "Đã hoàn thành"
                            : "Chưa hoàn thành"}
                        </TableCell>
                        <TableCell>
                          {new Date(grade.Class.Semester.startDate).toLocaleDateString("vi-VN")} -{" "}
                          {new Date(grade.Class.Semester.endDate).toLocaleDateString("vi-VN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <DialogFooter>
                <Button onClick={generateTranscriptPDF} disabled={isGradesLoading}>
                  In bản điểm
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Đóng</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}