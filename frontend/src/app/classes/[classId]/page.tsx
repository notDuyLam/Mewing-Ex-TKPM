"use client";

import { useState, useEffect } from "react";
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
        toast.error(_data.message || "Không thể tải thông tin lớp học!");
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
      toast.error("Không thể tải thông tin lớp học!");
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
        toast.error(_data.message || "Không thể tải danh sách sinh viên!");
        return;
      }

      const data: ClassStudent[] = await res.json();
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Không thể tải danh sách sinh viên!");
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
        toast.error(_data.message || "Không thể tải danh sách sinh viên!");
        return;
      }

      const data: any = await res.json();
      const _data = data.data;
      // Filter out students already enrolled in this class
      const enrolledStudentIds = students.map((s) => s.studentId);
      const available = _data.filter(
        (student : Student) => !enrolledStudentIds.includes(student.studentId)
      );
      setAvailableStudents(available || []);
    } catch (error) {
      console.error("Error fetching available students:", error);
      toast.error("Không thể tải danh sách sinh viên!");
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
      toast.error("Vui lòng chọn sinh viên!");
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
        toast.error(_data.message || "Không thể đăng ký sinh viên!");
        return;
      }

      toast.success("Đăng ký sinh viên thành công!");
      setSelectedStudentId("");
      setIsAddDialogOpen(false);
      await Promise.all([fetchStudents(), fetchAvailableStudents()]);
    } catch (error) {
      console.error("Error registering student:", error);
      toast.error("Không thể đăng ký sinh viên!");
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
        toast.error(_data.message || "Không thể hủy đăng ký sinh viên!");
        return;
      }

      toast.success("Hủy đăng ký sinh viên thành công!");
      await Promise.all([fetchStudents(), fetchAvailableStudents()]);
    } catch (error) {
      console.error("Error deregistering student:", error);
      toast.error("Không thể hủy đăng ký sinh viên!");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch {
      return "Invalid Date";
    }
  };

  const getSemesterDisplay = (semester: Semester) => {
    return `${formatDate(semester.startDate)} - ${formatDate(semester.endDate)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Chi tiết Lớp học</h1>
        {isLoading ? (
          <div className="text-center">Đang tải dữ liệu...</div>
        ) : !classData ? (
          <div className="text-center">Không tìm thấy lớp học</div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin Lớp học</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Mã Lớp học:</strong> {classData.classId}
                  </p>
                  <p>
                    <strong>Khóa học:</strong>{" "}
                    {classData.Course?.courseName || "N/A"}
                  </p>
                  <p>
                    <strong>Mô tả khóa học:</strong>{" "}
                    {classData.Course?.description || "N/A"}
                  </p>
                  <p>
                    <strong>Số tín chỉ:</strong>{" "}
                    {classData.Course?.credits || "N/A"}
                  </p>
                  <p>
                    <strong>Trạng thái khóa học:</strong>{" "}
                    {classData.Course?.status || "N/A"}
                  </p>
                  <p>
                    <strong>Năm học:</strong> {classData.year}
                  </p>
                  <p>
                    <strong>Học kỳ:</strong>{" "}
                    {classData.Semester
                      ? getSemesterDisplay(classData.Semester)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Giáo viên:</strong>{" "}
                    {classData.Teacher?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Số sinh viên tối đa:</strong>{" "}
                    {classData.maxStudent}
                  </p>
                  <p>
                    <strong>Lịch học:</strong> {classData.schedule}
                  </p>
                  <p>
                    <strong>Phòng học:</strong> {classData.room}
                  </p>
                  <p>
                    <strong>Ngày tạo:</strong> {formatDate(classData.createdAt)}
                  </p>
                  <p>
                    <strong>Ngày cập nhật:</strong>{" "}
                    {formatDate(classData.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/classes">
                  <Button variant="outline">Quay lại</Button>
                </Link>
                {canModify && (
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>Thêm Sinh viên</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Đăng ký Sinh viên</DialogTitle>
                        <DialogDescription>
                          Chọn sinh viên để đăng ký vào lớp học.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="studentId" className="text-right">
                            Sinh viên
                          </label>
                          <Select
                            value={selectedStudentId}
                            onValueChange={setSelectedStudentId}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Chọn sinh viên" />
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
                                  Không có sinh viên nào
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Hủy</Button>
                        </DialogClose>
                        <Button
                          onClick={handleRegisterStudent}
                          disabled={!selectedStudentId}
                        >
                          Đăng ký
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Danh sách Sinh viên
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Sinh viên</TableHead>
                    <TableHead>Họ và Tên</TableHead>
                    <TableHead>Khóa học</TableHead>
                    <TableHead>Khoa</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    {canModify && <TableHead>Hành động</TableHead>}
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
                              Xóa
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
                        Không có sinh viên nào
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