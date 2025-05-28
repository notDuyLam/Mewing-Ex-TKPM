"use client";

import { useTranslation } from "react-i18next";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import jsPDF from "jspdf";

// Import font Roboto-Regular dưới dạng base64
// Giả sử bạn đã lưu chuỗi base64 trong file `@/fonts/Roboto-Regular.js`
import { robotoFont } from "@/fonts/Roboto-Regular";

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
  studentId,
}: {
  studentId: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isGradesOpen, setIsGradesOpen] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editDetails, setEditDetails] = useState<StudentDetails | null>(null);
  const [editIdentity, setEditIdentity] = useState<IdentityDocuments | null>(
    null
  );
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGradesLoading, setIsGradesLoading] = useState(false);

  const fetchStudent = async (studentId: string) => {
    try {
      const studentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!studentRes.ok) throw new Error("Failed to fetch student");
      const studentData: Student = await studentRes.json();

      const [deptRes, statusRes, progRes, detailsRes, identityRes] =
        await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/departments/${studentData.departmentId}`,
            { method: "GET" }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/statuses/${studentData.statusId}`,
            { method: "GET" }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/programs/${studentData.programId}`,
            { method: "GET" }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/student-details/${studentId}`,
            { method: "GET" }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-documents/student/${studentId}`,
            { method: "GET" }
          ),
        ]);

      const department = deptRes.ok
        ? await deptRes.json()
        : { id: studentData.departmentId, name: "N/A" };
      const status = statusRes.ok
        ? await statusRes.json()
        : { id: studentData.statusId, name: "N/A" };
      const program = progRes.ok
        ? await progRes.json()
        : { id: studentData.programId, name: "N/A" };
      const details = detailsRes.ok ? await detailsRes.json() : null;
      const identity = identityRes.ok ? await identityRes.json() : null;

      studentData.dateOfBirth = studentData.dateOfBirth.split("T")[0];
      if (identity) {
        identity.issueDate = identity.issueDate.split("T")[0];
        identity.expiryDate = identity.expiryDate.split("T")[0];
      }

      const fullStudent = {
        ...studentData,
        department,
        status,
        program,
        details,
        identity,
      };
      setStudent(fullStudent);
      setEditStudent(fullStudent);
      setEditDetails(
        details || {
          permanentAddressHouse: "",
          permanentAddressWard: "",
          permanentAddressDistrict: "",
          permanentAddressCity: "",
          permanentAddressCountry: "",
          temporaryAddress: "",
          mailingAddress: "",
          nationality: "",
        }
      );
      setEditIdentity(
        identity || {
          identityType: "",
          identityNumber: "",
          issueDate: "",
          issuePlace: "",
          expiryDate: "",
          chipAttached: false,
          issuingCountry: "",
          note: "",
        }
      );
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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/`, {
          method: "GET",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/statuses/`, {
          method: "GET",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/`, {
          method: "GET",
        }),
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/report/id/${studentId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch grades");
      const data = await response.json();
      setGrades(data.grades);
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error(t("lay_diem_that_bai"));
    } finally {
      setIsGradesLoading(false);
    }
  };

  const generateTranscriptPDF = () => {
    if (!student) return;

    const doc = new jsPDF();

    doc.addFileToVFS("Roboto-Regular.ttf", robotoFont);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(16);
    doc.text(t("bang_diem"), pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.setFontSize(12);
    doc.text(`${t("mssv")}: ${student.studentId}`, 20, y);
    y += 8;
    doc.text(`${t("ho_ten")}: ${student.fullName}`, 20, y);
    y += 8;
    doc.text(
      `${t("ngay_sinh")}: ${new Date(student.dateOfBirth).toLocaleDateString(
        "vi-VN"
      )}`,
      20,
      y
    );
    y += 8;
    doc.text(`${t("khoa")}: ${student.department?.name || "N/A"}`, 20, y);
    y += 8;
    doc.text(`${t("khoa_hoc")}: ${student.course || "N/A"}`, 20, y);
    y += 15;

    const completedCourses = grades.filter(
      (grade) => grade.status === "passed" && grade.grade !== null
    );

    doc.setFontSize(14);
    doc.text(t("mon_hoc_hoan_thanh"), 20, y);
    y += 10;

    if (completedCourses.length === 0) {
      doc.setFontSize(12);
      doc.text(t("chua_hoan_thanh_mon_nao"), 20, y);
    } else {
      doc.setFontSize(10);
      const headers = [
        t("ma_lop"),
        t("ten_mon_hoc"),
        t("tin_chi"),
        t("diem"),
        t("ky_hoc"),
      ];
      const colWidths = [30, 60, 20, 20, 50];
      let x = 20;

      headers.forEach((header, i) => {
        doc.text(header, x, y);
        x += colWidths[i];
      });
      y += 5;
      doc.line(20, y, pageWidth - 20, y);
      y += 5;

      completedCourses.forEach((grade) => {
        x = 20;
        const row = [
          grade.classId,
          grade.Class.Course.courseName,
          grade.Class.Course.credits.toString(),
          grade.grade!.toFixed(1),
          `${new Date(grade.Class.Semester.startDate).toLocaleDateString(
            "vi-VN"
          )} - ${new Date(grade.Class.Semester.endDate).toLocaleDateString(
            "vi-VN"
          )}`,
        ];

        row.forEach((cell, i) => {
          doc.text(cell, x, y);
          x += colWidths[i];
        });
        y += 8;
      });
    }

    doc.save(`transcript_${student.studentId}.pdf`);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchStudent(studentId);
      await fetchOptions();
    };
    loadData();
  }, [studentId]);

  const handleSave = async () => {
    if (!editStudent) return;
    setIsSaving(true);
    try {
      const studentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${editStudent.studentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editStudent),
        }
      );
      if (studentRes.status === 400) {
        const data = await studentRes.json();
        toast.info(data.message);
        return;
      }

      if (student?.details) {
        const detailsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/student-details/${editStudent.studentId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...editDetails,
              studentId: editStudent.studentId,
            }),
          }
        );
        if (!detailsRes.ok) throw new Error("Failed to update student details");
      } else if (Object.values(editDetails!).some((val) => val)) {
        const detailsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/student-details`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...editDetails,
              studentId: editStudent.studentId,
            }),
          }
        );
        if (!detailsRes.ok) throw new Error("Failed to create student details");
      }

      if (student?.identity) {
        if (editIdentity?.identityType) {
          const identityRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-documents/${editStudent?.identity?.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...editIdentity,
                studentId: editStudent.studentId,
              }),
            }
          );
          if (!identityRes.ok) {
            const _data = await identityRes;
            console.log(editStudent);
            return;
          }
        }
      } else if (editIdentity?.identityType) {
        const identityRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/identity-documents`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...editIdentity,
              studentId: editStudent.studentId,
            }),
          }
        );
        if (!identityRes.ok)
          throw new Error("Failed to create identity documents");
      }

      toast.success(t("cap_nhat_thanh_cong"));
      setIsEditOpen(false);
      fetchStudent(editStudent.studentId);
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error(t("cap_nhat_that_bai"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!student) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${student.studentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to delete student");

      toast.success(t("xoa_sinh_vien_thanh_cong"));
      router.push("/");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(t("xoa_sinh_vien_that_bai"));
    }
  };

  const handleEditOpen = async () => {
    setIsEditOpen(true);
    await fetchOptions();
  };

  const handleGradesOpen = async () => {
    setIsGradesOpen(true);
    await fetchGrades(studentId);
  };

  if (loading)
    return <div className="container mx-auto p-4">{t("dang_tai")}</div>;
  if (!student)
    return (
      <div className="container mx-auto p-4">
        {t("khong_tim_thay_sinh_vien")}
      </div>
    );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("chi_tiet_sv", { studentFullName: student.fullName })}
      </h1>
      <div className="grid grid-cols-2 gap-6 bg-white shadow-md rounded-lg p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            {t("thong_tin_co_ban")}
          </h2>
          <div className="space-y-2">
            <p>
              <strong>{t("mssv")}</strong> {student.studentId}
            </p>
            <p>
              <strong>{t("ho_ten")}</strong> {student.fullName}
            </p>
            <p>
              <strong>{t("ngay_sinh")}</strong>{" "}
              {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>{t("gioi_tinh")}</strong> {student.gender}
            </p>
            <p>
              <strong>{t("Email")}</strong> {student.email}
            </p>
            <p>
              <strong>{t("sdt")}</strong> {student.phoneNumber}
            </p>
            <p>
              <strong>{t("khoa")}</strong> {student.department?.name || "N/A"}
            </p>
            <p>
              <strong>{t("khoas")}</strong> {student.course || "N/A"}
            </p>
            <p>
              <strong>{t("trang_thai")}</strong> {student.status?.name || "N/A"}
            </p>
            <p>
              <strong>{t("chuong_trinh")}</strong>{" "}
              {student.program?.name || "N/A"}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            {t("thong_tin_bo_sung")}
          </h2>
          <div className="space-y-2">
            {student.details ? (
              <>
                <p>
                  <strong>{t("diachithuongtru")}</strong>{" "}
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
                  <strong>{t("diachitamtru")}</strong>{" "}
                  {student.details.temporaryAddress || "N/A"}
                </p>
                <p>
                  <strong>{t("diachinhanthu")}</strong>{" "}
                  {student.details.mailingAddress || "N/A"}
                </p>
                <p>
                  <strong>{t("quoctich")}</strong>{" "}
                  {student.details.nationality || "N/A"}
                </p>
              </>
            ) : (
              <p>{t("khongcothongtin")}</p>
            )}
          </div>
          <div className="space-y-2 pt-4 border-t">
            {student.identity ? (
              <>
                <p>
                  <strong>{t("loaigiayto")}</strong>{" "}
                  {student.identity.identityType}
                </p>
                <p>
                  <strong>{t("sogiayto")}</strong>{" "}
                  {student.identity.identityNumber}
                </p>
                <p>
                  <strong>{t("ngaycap")}</strong>{" "}
                  {student.identity.issueDate
                    ? new Date(student.identity.issueDate).toLocaleDateString(
                        "vi-VN"
                      )
                    : "N/A"}
                </p>
                <p>
                  <strong>{t("noicap")}</strong>{" "}
                  {student.identity.issuePlace || "N/A"}
                </p>
                <p>
                  <strong>{t("ngayhethan")}</strong>{" "}
                  {student.identity.expiryDate
                    ? new Date(student.identity.expiryDate).toLocaleDateString(
                        "vi-VN"
                      )
                    : "N/A"}
                </p>
                {student.identity.identityType === "CCCD" && (
                  <p>
                    <strong>{t("ganchip")}</strong>{" "}
                    {student.identity.chipAttached ? "Có" : "Không"}
                  </p>
                )}
                {student.identity.identityType === "Hộ chiếu" && (
                  <>
                    <p>
                      <strong>{t("quocgiacap")}</strong>{" "}
                      {student.identity.issuingCountry || "N/A"}
                    </p>
                    <p>
                      <strong>{t("ghichu")}</strong>{" "}
                      {student.identity.note || "N/A"}
                    </p>
                  </>
                )}
              </>
            ) : (
              <p>{t("khongcothongtin2")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => router.push("/")}>
          {t("trove")}
        </Button>
        <div className="flex gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleEditOpen}>{t("chinhsua")}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl">
              <DialogHeader>
                <DialogTitle>{t("chinhsua")}</DialogTitle>
              </DialogHeader>
              {editStudent && editDetails && editIdentity && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-4">
                    <Input
                      placeholder={t("mssv")}
                      value={editStudent.studentId}
                      onChange={(e) =>
                        setEditStudent({
                          ...editStudent,
                          studentId: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder={t("ho_ten")}
                      value={editStudent.fullName}
                      onChange={(e) =>
                        setEditStudent({
                          ...editStudent,
                          fullName: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <div className="flex items-center space-x-2">
                      <label>{t("ngay_sinh")}</label>
                      <Input
                        className="w-auto"
                        type="date"
                        value={editStudent.dateOfBirth}
                        onChange={(e) =>
                          setEditStudent({
                            ...editStudent,
                            dateOfBirth: e.target.value,
                          })
                        }
                        disabled={isSaving}
                      />
                    </div>
                    <select
                      value={editStudent.gender}
                      onChange={(e) =>
                        setEditStudent({
                          ...editStudent,
                          gender: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                      disabled={isSaving}
                    >
                      <option value="">
                        {t("chon_gioi_tinh") /* key mới */}
                      </option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                    <Input
                      placeholder="Email" /* chưa có trong bộ key, nên giữ nguyên */
                      value={editStudent.email}
                      onChange={(e) =>
                        setEditStudent({
                          ...editStudent,
                          email: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder={t("sdt")}
                      value={editStudent.phoneNumber}
                      onChange={(e) =>
                        setEditStudent({
                          ...editStudent,
                          phoneNumber: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <select
                      value={editStudent.departmentId}
                      onChange={(e) =>
                        setEditStudent({
                          ...editStudent,
                          departmentId: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border rounded"
                      disabled={isSaving || departments.length === 0}
                    >
                      <option value={0}>{t("chon_khoa") /* key mới */}</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editStudent.statusId}
                      onChange={(e) =>
                        setEditStudent({
                          ...editStudent,
                          statusId: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border rounded"
                      disabled={isSaving || statuses.length === 0}
                    >
                      <option value={0}>
                        {t("chon_trang_thai") /* key mới */}
                      </option>
                      {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editStudent.programId}
                      onChange={(e) =>
                        setEditStudent({
                          ...editStudent,
                          programId: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border rounded"
                      disabled={isSaving || programs.length === 0}
                    >
                      <option value={0}>
                        {t("chon_chuong_trinh") /* key mới */}
                      </option>
                      {programs.map((prog) => (
                        <option key={prog.id} value={prog.id}>
                          {prog.name}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder={t("khoas")}
                      value={editStudent.course}
                      onChange={(e) =>
                        setEditStudent({
                          ...editStudent,
                          course: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-4">
                    <Input
                      placeholder={t("add_student:so_nha")}
                      value={editDetails.permanentAddressHouse || ""}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          permanentAddressHouse: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder={t("add_student:phuong")}
                      value={editDetails.permanentAddressWard || ""}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          permanentAddressWard: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder={t("add_student:quan")}
                      value={editDetails.permanentAddressDistrict || ""}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          permanentAddressDistrict: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder={t("add_student:tinh")}
                      value={editDetails.permanentAddressCity || ""}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          permanentAddressCity: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder={t("add_student:quoc_gia")}
                      value={editDetails.permanentAddressCountry || ""}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          permanentAddressCountry: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder={t("diachitamtru")}
                      value={editDetails.temporaryAddress || ""}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          temporaryAddress: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder={t("diachinhanthu")}
                      value={editDetails.mailingAddress || ""}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          mailingAddress: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Input
                      placeholder={t("quoctich")}
                      value={editDetails.nationality || ""}
                      onChange={(e) =>
                        setEditDetails({
                          ...editDetails,
                          nationality: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-4">
                    <select
                      value={editIdentity.identityType}
                      onChange={(e) =>
                        setEditIdentity({
                          ...editIdentity,
                          identityType: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                      disabled={isSaving}
                    >
                      <option value="">{t("add_student:chon_giay_to")}</option>
                      <option value="CMND">CMND</option>
                      <option value="CCCD">CCCD</option>
                      <option value="Hộ chiếu">Hộ chiếu</option>
                    </select>
                    <Input
                      placeholder={
                        editIdentity.identityType === "CMND"
                          ? t("add_student:so_cmnd")
                          : editIdentity.identityType === "CCCD"
                          ? t("add_student:so_cccd")
                          : t("add_student:so_ho_chieu")
                      }
                      value={editIdentity.identityNumber}
                      onChange={(e) =>
                        setEditIdentity({
                          ...editIdentity,
                          identityNumber: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <div className="flex items-center space-x-2">
                      <label>{t("ngaycap")}</label>
                      <Input
                        type="date"
                        className="w-auto"
                        value={editIdentity.issueDate}
                        onChange={(e) =>
                          setEditIdentity({
                            ...editIdentity,
                            issueDate: e.target.value,
                          })
                        }
                        disabled={isSaving}
                      />
                    </div>
                    <Input
                      placeholder={t("noicap")}
                      value={editIdentity.issuePlace}
                      onChange={(e) =>
                        setEditIdentity({
                          ...editIdentity,
                          issuePlace: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    <div className="flex items-center space-x-2">
                      <label>{t("ngayhethan")}</label>
                      <Input
                        type="date"
                        className="w-auto"
                        value={editIdentity.expiryDate}
                        onChange={(e) =>
                          setEditIdentity({
                            ...editIdentity,
                            expiryDate: e.target.value,
                          })
                        }
                        disabled={isSaving}
                      />
                    </div>
                    {editIdentity.identityType === "CCCD" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={editIdentity.chipAttached}
                          onCheckedChange={(checked) =>
                            setEditIdentity({
                              ...editIdentity,
                              chipAttached: checked === true,
                            })
                          }
                          disabled={isSaving}
                        />
                        <label>{t("ganchip")}</label>
                      </div>
                    )}
                    {editIdentity.identityType === "Hộ chiếu" && (
                      <>
                        <Input
                          placeholder={t("quocgiacap")}
                          value={editIdentity.issuingCountry}
                          onChange={(e) =>
                            setEditIdentity({
                              ...editIdentity,
                              issuingCountry: e.target.value,
                            })
                          }
                          disabled={isSaving}
                        />
                        <Input
                          placeholder={t("ghichu")}
                          value={editIdentity.note}
                          onChange={(e) =>
                            setEditIdentity({
                              ...editIdentity,
                              note: e.target.value,
                            })
                          }
                          disabled={isSaving}
                        />
                      </>
                    )}
                  </div>

                  <div className="col-span-3 mt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full"
                    >
                      {isSaving ? t("dang_luu") : t("luu")}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">{t("xoa_sinhvien")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("xac_nhan_xoa")}</DialogTitle>
                <DialogDescription>
                  {t("confirm_delete_student", {
                    fullName: student.fullName,
                    studentId: student.studentId,
                  })}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("huy")}</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete}>
                  {t("xoa")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isGradesOpen} onOpenChange={setIsGradesOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleGradesOpen}>
                {t("xem_ket_qua_hoc_tap")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {t("ket_qua_hoc_tap_cua", { fullName: student?.fullName })}
                </DialogTitle>
              </DialogHeader>
              {isGradesLoading ? (
                <div className="flex justify-center p-4">
                  <p>{t("dang_tai")}</p>
                </div>
              ) : grades.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {t("khong_co_ket_qua_hoc_tap")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("ma_lop")}</TableHead>
                      <TableHead>{t("ten_mon_hoc")}</TableHead>
                      <TableHead>{t("so_tin_chi")}</TableHead>
                      <TableHead>{t("diem")}</TableHead>
                      <TableHead>{t("trang_thai")}</TableHead>
                      <TableHead>{t("ky_hoc")}</TableHead>
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
                            ? t("dang_hoc")
                            : grade.status === "passed"
                            ? t("da_hoan_thanh")
                            : t("chua_hoan_thanh")}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            grade.Class.Semester.startDate
                          ).toLocaleDateString("vi-VN")}{" "}
                          -{" "}
                          {new Date(
                            grade.Class.Semester.endDate
                          ).toLocaleDateString("vi-VN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <DialogFooter>
                <Button
                  onClick={generateTranscriptPDF}
                  disabled={isGradesLoading}
                >
                  {t("in_ban_diem")}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">{t("dong")}</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
