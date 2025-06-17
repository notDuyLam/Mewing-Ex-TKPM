"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface Semester {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  cancelDeadline: string;
}

interface Course {
  courseId: string;
  courseName: string;
  status: string;
}

interface Teacher {
  teacherId: string;
  name: string;
}

interface Class {
  classId: string;
  courseId: string;
  year: number;
  semesterId: string;
  teacherId: string;
  maxStudent: number;
  schedule: string;
  room: string;
  Course?: Course;
  Semester?: Semester;
  Teacher?: Teacher;
}

export default function Classes() {
  const { t } = useTranslation();
  const [classes, setClasses] = useState<Class[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createFormData, setCreateFormData] = useState({
    classId: "",
    courseId: "",
    year: new Date().getFullYear(),
    semesterId: "",
    teacherId: "",
    maxStudent: 0,
    schedule: "",
    room: "",
  });
  const [editFormData, setEditFormData] = useState({
    classId: "",
    courseId: "",
    year: 0,
    semesterId: "",
    teacherId: "",
    maxStudent: 0,
    schedule: "",
    room: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showCreateSemesterForm, setShowCreateSemesterForm] = useState(false);
  const [showEditSemesterForm, setShowEditSemesterForm] = useState(false);
  const [newSemesterData, setNewSemesterData] = useState({
    year: new Date().getFullYear().toString(),
    startDate: "",
    endDate: "",
    cancelDeadline: "",
  });

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 404) {
        setClasses([]);
        return;
      }

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      const data: Class[] = await res.json();
      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
      toast.error(t("classes:khong_tai_duoc_danh_sach_lop_hoc"));
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      const data: Semester[] = await res.json();
      const uniqueSemesters = Array.from(
        new Map(data.map((s: Semester) => [s.id, s])).values()
      );
      setSemesters(uniqueSemesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      setSemesters([]);
      toast.error(t("classes:khong_tai_duoc_danh_sach_hoc_ky"));
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      const data = await res.json();
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
      toast.error(t("classes:khong_tai_duoc_danh_sach_khoa_hoc"));
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      const data = await res.json();
      setTeachers(data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
      toast.error(t("classes:khong_tai_duoc_danh_sach_giao_vien"));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchClasses(),
        fetchSemesters(),
        fetchCourses(),
        fetchTeachers(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const getSemesterDisplay = (semester: Semester) => {
    try {
      const startDate = new Date(semester.startDate);
      const endDate = new Date(semester.endDate);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return t("classes:ngay_khong_hop_le2");
      }
      const formatDate = (date: Date) =>
        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return `${formatDate(startDate)}-${formatDate(endDate)}`;
    } catch {
      return t("classes:ngay_khong_hop_le2");
    }
  };

  const validateFormData = (data: typeof createFormData) => {
    if (
      !data.classId ||
      !data.courseId ||
      !data.semesterId ||
      !data.teacherId ||
      !data.schedule ||
      !data.room
    ) {
      toast.error(t("classes:dien_day_du_cac_truong"));
      return false;
    }

    const classId = String(data.classId).trim();
    const courseId = String(data.courseId).trim();
    const semesterId = String(data.semesterId).trim();
    const teacherId = String(data.teacherId).trim();
    const schedule = String(data.schedule).trim();
    const room = String(data.room).trim();

    if (
      classId === "" ||
      courseId === "" ||
      semesterId === "" ||
      teacherId === "" ||
      schedule === "" ||
      room === ""
    ) {
      toast.error(t("classes:cac_truong_khong_duoc_trong"));
      return false;
    }

    if (!/^\d{2}:\d{2}$/.test(schedule)) {
      toast.error(t("classes:lich_hoc_khong_hop_le"));
      return false;
    }

    if (data.maxStudent <= 0) {
      toast.error(t("classes:so_sinh_vien_phai_lon_hon_0"));
      return false;
    }

    return true;
  };

  const validateSemesterData = (data: typeof newSemesterData) => {
    if (
      !data.year ||
      !data.startDate ||
      !data.endDate ||
      !data.cancelDeadline
    ) {
      toast.error(t("classes:dien_day_du_truong_hoc_ky"));
      return false;
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const cancelDeadline = new Date(data.cancelDeadline);

    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime()) ||
      isNaN(cancelDeadline.getTime())
    ) {
      toast.error(t("classes:ngay_khong_hop_le"));
      return false;
    }

    if (endDate <= startDate) {
      toast.error(t("classes:ngay_ket_thuc_sau_ngay_bat_dau"));
      return false;
    }

    if (cancelDeadline > endDate) {
      toast.error(t("classes:han_huy_truoc_ngay_ket_thuc"));
      return false;
    }

    if (!/^\d{4}$/.test(data.year)) {
      toast.error(t("classes:nam_4_chu_so"));
      return false;
    }

    return true;
  };

  const handleCreateSemester = async (isEditDialog: boolean) => {
    if (!validateSemesterData(newSemesterData)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSemesterData),
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message || t("classes:khong_the_tao_hoc_ky"));
        return;
      }

      const newSemester: Semester = await res.json();
      await fetchSemesters();
      toast.success(t("classes:hoc_ky_tao_thanh_cong"));

      const semesterId = String(newSemester.id);
      if (isEditDialog) {
        setEditFormData({ ...editFormData, semesterId });
      } else {
        setCreateFormData({
          ...createFormData,
          semesterId,
        });
      }

      setNewSemesterData({
        year: new Date().getFullYear().toString(),
        startDate: "",
        endDate: "",
        cancelDeadline: "",
      });
      setShowCreateSemesterForm(false);
      setShowEditSemesterForm(false);
    } catch (error) {
      console.error("Error creating semester:", error);
      toast.error(t("classes:khong_the_tao_hoc_ky"));
    }
  };

  const handleCreate = async () => {
    if (!validateFormData(createFormData)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createFormData,
          year: Number(createFormData.year),
          maxStudent: Number(createFormData.maxStudent),
        }),
      });

      if (!res.ok) {
        const _data = await res.json();
        if (_data.message.includes("Course not found")) {
          toast.error(t("classes:khoa_hoc_khong_ton_tai"));
        } else if (_data.message.includes("Class already exists")) {
          toast.error(t("classes:lop_hoc_da_ton_tai"));
        } else if (_data.message.includes("deactivate")) {
          toast.error(t("classes:khoa_hoc_da_vo_hieu_hoa"));
        } else {
          toast.error(_data.message);
        }
        return;
      }

      await fetchClasses();
      toast.success(t("classes:lop_hoc_tao_thanh_cong"));
      setCreateFormData({
        classId: "",
        courseId: "",
        year: new Date().getFullYear(),
        semesterId: "",
        teacherId: "",
        maxStudent: 0,
        schedule: "",
        room: "",
      });
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error(t("classes:khong_the_tao_lop_hoc"));
    }
  };

  const handleUpdate = async () => {
    if (!selectedClassId || !validateFormData(editFormData)) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/${selectedClassId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editFormData,
            year: Number(editFormData.year),
            maxStudent: Number(editFormData.maxStudent),
          }),
        }
      );

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      await fetchClasses();
      toast.success(t("classes:lop_hoc_cap_nhat_thanh_cong"));
      setEditFormData({
        classId: "",
        courseId: "",
        year: 0,
        semesterId: "",
        teacherId: "",
        maxStudent: 0,
        schedule: "",
        room: "",
      });
      setIsEditDialogOpen(false);
      setSelectedClassId(null);
    } catch (error) {
      console.error("Error updating class:", error);
      toast.error(t("classes:khong_the_cap_nhat_lop_hoc"));
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditFormData({
      classId: classItem.classId,
      courseId: classItem.courseId,
      year: classItem.year,
      semesterId: String(classItem.semesterId),
      teacherId: classItem.teacherId,
      maxStudent: classItem.maxStudent,
      schedule: classItem.schedule,
      room: classItem.room,
    });
    setSelectedClassId(classItem.classId);
    setIsEditDialogOpen(true);
  };

  const isFormValid = () =>
    semesters.length > 0 && courses.length > 0 && teachers.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationMenu className="bg-white shadow-md p-4 max-w-full">
        <NavigationMenuList className="flex justify-between items-center container mx-auto">
          <div className="flex items-center gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className="text-lg font-semibold text-gray-100 bg-gray-800 px-4 py-2 rounded"
              >
                {t("classes:quan_ly_sinh_vien")}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/courses"
                className="text-lg font-semibold text-gray-100 bg-gray-800 px-4 py-2 rounded"
              >
                {t("classes:quan_ly_khoa_hoc")}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/classes"
                className="text-lg font-semibold text-gray-100 bg-gray-800 px-4 py-2 rounded"
              >
                {t("classes:quan_ly_lop_hoc")}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("classes:danh_sach_lop_hoc")}</h1>
        {isLoading ? (
          <div className="text-center">{t("classes:dang_tai_du_lieu")}</div>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={!isFormValid()}>
                    {t("classes:them_lop_hoc")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("classes:them_lop_hoc")}</DialogTitle>
                    <DialogDescription>
                      {t("classes:dien_thong_tin_lop_hoc")}
                    </DialogDescription>
                  </DialogHeader>
                  {showCreateSemesterForm ? (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="semesterYear" className="text-right">
                          {t("classes:nam")}
                        </label>
                        <Input
                          id="semesterYear"
                          value={newSemesterData.year}
                          onChange={(e) =>
                            setNewSemesterData({
                              ...newSemesterData,
                              year: e.target.value,
                            })
                          }
                          className="col-span-3"
                          placeholder="VD: 2024"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="startDate" className="text-right">
                          {t("classes:ngay_bat_dau")}
                        </label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newSemesterData.startDate}
                          onChange={(e) =>
                            setNewSemesterData({
                              ...newSemesterData,
                              startDate: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="endDate" className="text-right">
                          {t("classes:ngay_ket_thuc")}
                        </label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newSemesterData.endDate}
                          onChange={(e) =>
                            setNewSemesterData({
                              ...newSemesterData,
                              endDate: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="cancelDeadline" className="text-right">
                          {t("classes:han_huy")}
                        </label>
                        <Input
                          id="cancelDeadline"
                          type="date"
                          value={newSemesterData.cancelDeadline}
                          onChange={(e) =>
                            setNewSemesterData({
                              ...newSemesterData,
                              cancelDeadline: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowCreateSemesterForm(false)}
                        >
                          {t("classes:huy")}
                        </Button>
                        <Button onClick={() => handleCreateSemester(false)}>
                          {t("classes:luu_hoc_ky")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="classId" className="text-right">
                          {t("classes:ma_lop_hoc")}
                        </label>
                        <Input
                          id="classId"
                          value={createFormData.classId}
                          onChange={(e) =>
                            setCreateFormData({
                              ...createFormData,
                              classId: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="courseId" className="text-right">
                          {t("classes:khoa_hoc")}
                        </label>
                        <Select
                          value={createFormData.courseId}
                          onValueChange={(value) =>
                            setCreateFormData({
                              ...createFormData,
                              courseId: value,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder={t("classes:chon_khoa_hoc")} />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.length > 0 ? (
                              courses.map((course) => (
                                <SelectItem
                                  key={course.courseId}
                                  value={course.courseId}
                                >
                                  {course.courseName}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="0" disabled>
                                {t("classes:khong_co_khoa_hoc")}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="year" className="text-right">
                          {t("classes:nam_hoc")}
                        </label>
                        <Input
                          id="year"
                          type="number"
                          value={createFormData.year}
                          onChange={(e) =>
                            setCreateFormData({
                              ...createFormData,
                              year: Number(e.target.value),
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="semesterId" className="text-right">
                          {t("classes:hoc_ky")}
                        </label>
                        <div className="col-span-3 flex gap-2">
                          <Select
                            value={createFormData.semesterId}
                            onValueChange={(value) =>
                              setCreateFormData({
                                ...createFormData,
                                semesterId: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("classes:chon_hoc_ky")} />
                            </SelectTrigger>
                            <SelectContent>
                              {semesters.length > 0 ? (
                                semesters.map((semester) => (
                                  <SelectItem
                                    key={`create-${semester.id}`}
                                    value={semester.id}
                                  >
                                    {getSemesterDisplay(semester)}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="0" disabled>
                                  {t("classes:khong_co_hoc_ky")}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            onClick={() => setShowCreateSemesterForm(true)}
                          >
                            {t("classes:them_hoc_ky")}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="teacherId" className="text-right">
                          {t("classes:giao_vien")}
                        </label>
                        <Select
                          value={createFormData.teacherId}
                          onValueChange={(value) =>
                            setCreateFormData({
                              ...createFormData,
                              teacherId: value,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder={t("classes:chon_giao_vien")} />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.length > 0 ? (
                              teachers.map((teacher) => (
                                <SelectItem
                                  key={teacher.teacherId}
                                  value={teacher.teacherId}
                                >
                                  {teacher.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="0" disabled>
                                {t("classes:khong_co_giao_vien")}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="maxStudent" className="text-right">
                          {t("classes:so_sinh_vien_toi_da")}
                        </label>
                        <Input
                          id="maxStudent"
                          type="number"
                          value={createFormData.maxStudent}
                          onChange={(e) =>
                            setCreateFormData({
                              ...createFormData,
                              maxStudent: Number(e.target.value),
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="schedule" className="text-right">
                          {t("classes:lich_hoc")}
                        </label>
                        <Input
                          id="schedule"
                          value={createFormData.schedule}
                          onChange={(e) =>
                            setCreateFormData({
                              ...createFormData,
                              schedule: e.target.value,
                            })
                          }
                          className="col-span-3"
                          placeholder="VD: 08:00"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="room" className="text-right">
                          {t("classes:phong_hoc")}
                        </label>
                        <Input
                          id="room"
                          value={createFormData.room}
                          onChange={(e) =>
                            setCreateFormData({
                              ...createFormData,
                              room: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">{t("classes:huy")}</Button>
                    </DialogClose>
                    {!showCreateSemesterForm && (
                      <Button onClick={handleCreate} disabled={!isFormValid()}>
                        {t("classes:luu")}
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("classes:ma_lop_hoc")}</TableHead>
                  <TableHead>{t("classes:khoa_hoc")}</TableHead>
                  <TableHead>{t("classes:nam_hoc")}</TableHead>
                  <TableHead>{t("classes:hoc_ky")}</TableHead>
                  <TableHead>{t("classes:giao_vien")}</TableHead>
                  <TableHead>{t("classes:so_sinh_vien_toi_da")}</TableHead>
                  <TableHead>{t("classes:lich_hoc")}</TableHead>
                  <TableHead>{t("classes:phong_hoc")}</TableHead>
                  <TableHead>{t("classes:hanh_dong")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.length > 0 ? (
                  classes.map((classItem) => (
                    <TableRow key={classItem.classId}>
                      <TableCell>
                        <Link
                          href={`/classes/${classItem.classId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {classItem.classId}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {classItem.Course?.courseName || "N/A"}
                      </TableCell>
                      <TableCell>{classItem.year}</TableCell>
                      <TableCell>
                        {classItem.Semester
                          ? getSemesterDisplay(classItem.Semester)
                          : "N/A"}
                      </TableCell>
                      <TableCell>{classItem.Teacher?.name || "N/A"}</TableCell>
                      <TableCell>{classItem.maxStudent}</TableCell>
                      <TableCell>{classItem.schedule}</TableCell>
                      <TableCell>{classItem.room}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => handleEdit(classItem)}
                              >
                                {t("classes:sua")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t("classes:cap_nhat_lop_hoc")}</DialogTitle>
                                <DialogDescription>
                                  {t("classes:cap_nhat_thong_tin_lop_hoc")}
                                </DialogDescription>
                              </DialogHeader>
                              {showEditSemesterForm ? (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="semesterYear"
                                      className="text-right"
                                    >
                                      {t("classes:nam")}
                                    </label>
                                    <Input
                                      id="semesterYear"
                                      value={newSemesterData.year}
                                      onChange={(e) =>
                                        setNewSemesterData({
                                          ...newSemesterData,
                                          year: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                      placeholder="VD: 2024"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="startDate"
                                      className="text-right"
                                    >
                                      {t("classes:ngay_bat_dau")}
                                    </label>
                                    <Input
                                      id="startDate"
                                      type="date"
                                      value={newSemesterData.startDate}
                                      onChange={(e) =>
                                        setNewSemesterData({
                                          ...newSemesterData,
                                          startDate: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="endDate"
                                      className="text-right"
                                    >
                                      {t("classes:ngay_ket_thuc")}
                                    </label>
                                    <Input
                                      id="endDate"
                                      type="date"
                                      value={newSemesterData.endDate}
                                      onChange={(e) =>
                                        setNewSemesterData({
                                          ...newSemesterData,
                                          endDate: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="cancelDeadline"
                                      className="text-right"
                                    >
                                      {t("classes:han_huy")}
                                    </label>
                                    <Input
                                      id="cancelDeadline"
                                      type="date"
                                      value={newSemesterData.cancelDeadline}
                                      onChange={(e) =>
                                        setNewSemesterData({
                                          ...newSemesterData,
                                          cancelDeadline: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setShowEditSemesterForm(false)
                                      }
                                    >
                                      {t("classes:huy")}
                                    </Button>
                                    <Button
                                      onClick={() => handleCreateSemester(true)}
                                    >
                                      {t("classes:luu_hoc_ky")}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="editClassId"
                                      className="text-right"
                                    >
                                      {t("classes:ma_lop_hoc")}
                                    </label>
                                    <Input
                                      id="editClassId"
                                      value={editFormData.classId}
                                      onChange={(e) =>
                                        setEditFormData({
                                          ...editFormData,
                                          classId: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                      disabled
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="editCourseId"
                                      className="text-right"
                                    >
                                      {t("classes:khoa_hoc")}
                                    </label>
                                    <Select
                                      value={editFormData.courseId}
                                      onValueChange={(value) =>
                                        setEditFormData({
                                          ...editFormData,
                                          courseId: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder={t("classes:chon_khoa_hoc")} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {courses.length > 0 ? (
                                          courses.map((course) => (
                                            <SelectItem
                                              key={course.courseId}
                                              value={course.courseId}
                                            >
                                              {course.courseName}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <SelectItem value="0" disabled>
                                            {t("classes:khong_co_khoa_hoc")}
                                          </SelectItem>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="editYear"
                                      className="text-right"
                                    >
                                      {t("classes:nam_hoc")}
                                    </label>
                                    <Input
                                      id="editYear"
                                      type="number"
                                      value={editFormData.year}
                                      onChange={(e) =>
                                        setEditFormData({
                                          ...editFormData,
                                          year: Number(e.target.value),
                                        })
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="editSemesterId"
                                      className="text-right"
                                    >
                                      {t("classes:hoc_ky")}
                                    </label>
                                    <div className="col-span-3 flex gap-2">
                                      <Select
                                        value={editFormData.semesterId}
                                        onValueChange={(value) =>
                                          setEditFormData({
                                            ...editFormData,
                                            semesterId: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder={t("classes:chon_hoc_ky")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {semesters.length > 0 ? (
                                            semesters.map((semester) => (
                                              <SelectItem
                                                key={`edit-${semester.id}`}
                                                value={semester.id}
                                              >
                                                {getSemesterDisplay(semester)}
                                              </SelectItem>
                                            ))
                                          ) : (
                                            <SelectItem value="0" disabled>
                                              {t("classes:khong_co_hoc_ky")}
                                            </SelectItem>
                                          )}
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setShowEditSemesterForm(true)
                                        }
                                      >
                                        {t("classes:them_hoc_ky")}
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="editTeacherId"
                                      className="text-right"
                                    >
                                      {t("classes:giao_vien")}
                                    </label>
                                    <Select
                                      value={editFormData.teacherId}
                                      onValueChange={(value) =>
                                        setEditFormData({
                                          ...editFormData,
                                          teacherId: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder={t("classes:chon_giao_vien")} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {teachers.length > 0 ? (
                                          teachers.map((teacher) => (
                                            <SelectItem
                                              key={teacher.teacherId}
                                              value={teacher.teacherId}
                                            >
                                              {teacher.name}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <SelectItem value="0" disabled>
                                            {t("classes:khong_co_giao_vien")}
                                          </SelectItem>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="editMaxStudent"
                                      className="text-right"
                                    >
                                      {t("classes:so_sinh_vien_toi_da")}
                                    </label>
                                    <Input
                                      id="editMaxStudent"
                                      type="number"
                                      value={editFormData.maxStudent}
                                      onChange={(e) =>
                                        setEditFormData({
                                          ...editFormData,
                                          maxStudent: Number(e.target.value),
                                        })
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="editSchedule"
                                      className="text-right"
                                    >
                                      {t("classes:lich_hoc")}
                                    </label>
                                    <Input
                                      id="editSchedule"
                                      value={editFormData.schedule}
                                      onChange={(e) =>
                                        setEditFormData({
                                          ...editFormData,
                                          schedule: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                      placeholder="VD: 08:00"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="editRoom"
                                      className="text-right"
                                    >
                                      {t("classes:phong_hoc")}
                                    </label>
                                    <Input
                                      id="editRoom"
                                      value={editFormData.room}
                                      onChange={(e) =>
                                        setEditFormData({
                                          ...editFormData,
                                          room: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">{t("classes:huy")}</Button>
                                </DialogClose>
                                {!showEditSemesterForm && (
                                  <Button
                                    onClick={handleUpdate}
                                    disabled={!isFormValid()}
                                  >
                                    {t("classes:luu")}
                                  </Button>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      {t("classes:khong_co_lop_hoc")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
}