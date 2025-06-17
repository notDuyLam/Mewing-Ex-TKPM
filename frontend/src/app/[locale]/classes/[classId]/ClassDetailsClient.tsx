"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

interface Semester {
  id: number;
  year: string;
  startDate: string;
  endDate: string;
  cancelDeadline: string;
}

interface Course {
  courseId: string;
  courseName: string;
  credits: number;
  departmentId: number;
  description: string;
  preCourseId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Teacher {
  teacherId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  course: string;
  email: string;
  phoneNumber: string;
  departmentId: number;
  statusId: number;
  programId: number;
  createdAt: string;
  updatedAt: string;
}

interface Class {
  classId: string;
  courseId: string;
  year: number;
  semesterId: number;
  teacherId: string;
  maxStudent: number;
  schedule: string;
  room: string;
  createdAt: string;
  updatedAt: string;
  Course?: Course;
  Semester?: Semester;
  Teacher?: Teacher;
}

interface ClassStudent {
  id: number;
  studentId: string;
  classId: string;
  registerBy: number;
  registerAt: string;
  grade: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  Student: Student;
}

export default function ClassDetail() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [canModify, setCanModify] = useState(false);

  const fetchClass = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/${classId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message || t("class_detail:khong_the_tai_thong_tin_lop_hoc"));
        return;
      }

      const data: Class = await res.json();
      setClassData(data);

      // Check if current date is before semester start date
      if (data.Semester) {
        const currentDate = new Date();
        const startDate = new Date(data.Semester.startDate);
        setCanModify(currentDate < startDate);
      }
    } catch (error) {
      console.error("Error fetching class:", error);
      toast.error(t("class_detail:khong_the_tai_thong_tin_lop_hoc"));
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/${classId}/students`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message || t("class_detail:khong_the_tai_danh_sach_sinh_vien"));
        return;
      }

      const data: ClassStudent[] = await res.json();
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error(t("class_detail:khong_the_tai_danh_sach_sinh_vien"));
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message || t("class_detail:khong_the_tai_danh_sach_sinh_vien"));
        return;
      }

      const data: any = await res.json();
      const _data = data.data;
      // Filter out students already enrolled in this class
      const enrolledStudentIds = students.map((s) => s.studentId);
      const available = _data.filter(
        (student: Student) => !enrolledStudentIds.includes(student.studentId)
      );
      setAvailableStudents(available || []);
    } catch (error) {
      console.error("Error fetching available students:", error);
      toast.error(t("class_detail:khong_the_tai_danh_sach_sinh_vien"));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchClass(), fetchStudents()]);
      await fetchAvailableStudents();
      setIsLoading(false);
    };
    loadData();
  }, [classId]);

  const handleRegisterStudent = async () => {
    if (!selectedStudentId) {
      toast.error(t("class_detail:vui_long_chon_sinh_vien"));
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          studentId: selectedStudentId,
        }),
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message || t("class_detail:khong_the_dang_ky_sinh_vien"));
        return;
      }

      toast.success(t("class_detail:dang_ky_sinh_vien_thanh_cong"));
      setSelectedStudentId("");
      setIsAddDialogOpen(false);
      await Promise.all([fetchStudents(), fetchAvailableStudents()]);
    } catch (error) {
      console.error("Error registering student:", error);
      toast.error(t("class_detail:khong_the_dang_ky_sinh_vien"));
    }
  };

  const handleDeregisterStudent = async (studentId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrollments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          studentId,
        }),
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message || t("class_detail:khong_the_huy_dang_ky_sinh_vien"));
        return;
      }

      toast.success(t("class_detail:huy_dang_ky_sinh_vien_thanh_cong"));
      await Promise.all([fetchStudents(), fetchAvailableStudents()]);
    } catch (error) {
      console.error("Error deregistering student:", error);
      toast.error(t("class_detail:khong_the_huy_dang_ky_sinh_vien"));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return t("class_detail:ngay_khong_hop_le");
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch {
      return t("class_detail:ngay_khong_hop_le");
    }
  };

  const getSemesterDisplay = (semester: Semester) => {
    return `${formatDate(semester.startDate)} - ${formatDate(semester.endDate)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("class_detail:chi_tiet_lop_hoc")}</h1>
        {isLoading ? (
          <div className="text-center">{t("class_detail:dang_tai_du_lieu")}</div>
        ) : !classData ? (
          <div className="text-center">{t("class_detail:khong_tim_thay_lop_hoc")}</div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">{t("class_detail:thong_tin_lop_hoc")}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>{t("class_detail:ma_lop_hoc")}:</strong> {classData.classId}
                  </p>
                  <p>
                    <strong>{t("class_detail:khoa_hoc")}:</strong>{" "}
                    {classData.Course?.courseName || "N/A"}
                  </p>
                  <p>
                    <strong>{t("class_detail:mo_ta_khoa_hoc")}:</strong>{" "}
                    {classData.Course?.description || "N/A"}
                  </p>
                  <p>
                    <strong>{t("class_detail:so_tin_chi")}:</strong>{" "}
                    {classData.Course?.credits || "N/A"}
                  </p>
                  <p>
                    <strong>{t("class_detail:trang_thai_khoa_hoc")}:</strong>{" "}
                    {classData.Course?.status || "N/A"}
                  </p>
                  <p>
                    <strong>{t("class_detail:nam_hoc")}:</strong> {classData.year}
                  </p>
                  <p>
                    <strong>{t("class_detail:hoc_ky")}:</strong>{" "}
                    {classData.Semester
                      ? getSemesterDisplay(classData.Semester)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>{t("class_detail:giao_vien")}:</strong>{" "}
                    {classData.Teacher?.name || "N/A"}
                  </p>
                  <p>
                    <strong>{t("class_detail:so_sinh_vien_toi_da")}:</strong>{" "}
                    {classData.maxStudent}
                  </p>
                  <p>
                    <strong>{t("class_detail:lich_hoc")}:</strong> {classData.schedule}
                  </p>
                  <p>
                    <strong>{t("class_detail:phong_hoc")}:</strong> {classData.room}
                  </p>
                  <p>
                    <strong>{t("class_detail:ngay_tao")}:</strong> {formatDate(classData.createdAt)}
                  </p>
                  <p>
                    <strong>{t("class_detail:ngay_cap_nhat")}:</strong>{" "}
                    {formatDate(classData.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/classes">
                  <Button variant="outline">{t("class_detail:quay_lai")}</Button>
                </Link>
                {canModify && (
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>{t("class_detail:them_sinh_vien")}</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("class_detail:dang_ky_sinh_vien")}</DialogTitle>
                        <DialogDescription>
                          {t("class_detail:chon_sinh_vien")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="studentId" className="text-right">
                            {t("class_detail:sinh_vien")}
                          </label>
                          <Select
                            value={selectedStudentId}
                            onValueChange={setSelectedStudentId}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder={t("class_detail:chon_sinh_vien")} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStudents.length > 0 ? (
                                availableStudents.map((student) => (
                                  <SelectItem
                                    key={student.studentId}
                                    value={student.studentId}
                                  >
                                    {student.fullName} ({student.studentId})
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="0" disabled>
                                  {t("class_detail:khong_co_sinh_vien")}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">{t("class_detail:huy")}</Button>
                        </DialogClose>
                        <Button
                          onClick={handleRegisterStudent}
                          disabled={!selectedStudentId}
                        >
                          {t("class_detail:dang_ky")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">{t("class_detail:danh_sach_sinh_vien")}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("class_detail:ma_sinh_vien")}</TableHead>
                    <TableHead>{t("class_detail:ho_va_ten")}</TableHead>
                    <TableHead>{t("class_detail:khoa_hoc_sinh_vien")}</TableHead>
                    <TableHead>{t("class_detail:khoa")}</TableHead>
                    <TableHead>{t("class_detail:ngay_dang_ky")}</TableHead>
                    <TableHead>{t("class_detail:trang_thai")}</TableHead>
                    {canModify && <TableHead>{t("class_detail:hanh_dong")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.Student.fullName}</TableCell>
                        <TableCell>{student.Student.course}</TableCell>
                        <TableCell>
                          {student.Student.departmentId || "N/A"}
                        </TableCell>
                        <TableCell>{formatDate(student.registerAt)}</TableCell>
                        <TableCell>{student.status}</TableCell>
                        {canModify && (
                          <TableCell>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeregisterStudent(student.studentId)
                              }
                            >
                              {t("class_detail:xoa")}
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={canModify ? 7 : 6}
                        className="text-center"
                      >
                        {t("class_detail:khong_co_sinh_vien")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}