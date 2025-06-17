"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface Department {
  id: number;
  name: string;
}

interface Course {
  courseId: string;
  courseName: string;
  credits: number;
  departmentId: number;
  description: string;
  preCourseId: string | null;
  status: string;
  Department?: Department;
}

interface ApiResponse {
  message: string;
  data: Course[];
}

export default function Courses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [createFormData, setCreateFormData] = useState({
    courseId: "",
    courseName: "",
    credits: 0,
    departmentId: "",
    description: "",
    preCourseId: "",
  });
  const [editFormData, setEditFormData] = useState({
    courseId: "",
    courseName: "",
    credits: 0,
    departmentId: "",
    description: "",
    preCourseId: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [deleteDialogMessage, setDeleteDialogMessage] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 404) {
        setCourses([]);
        return;
      }

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      const data: Course[] = await res.json();
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      const data = await res.json();
      setDepartments(data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  const checkCourseClasses = async (courseId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/classes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      console.error("Error checking course classes:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createFormData,
          credits: String(createFormData.credits),
          departmentId: String(createFormData.departmentId),
          preCourseId: createFormData.preCourseId || null,
        }),
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      fetchCourses();
      toast.success(t("courses:khoa_hoc_tao_thanh_cong"));
      setCreateFormData({
        courseId: "",
        courseName: "",
        credits: 0,
        departmentId: "",
        description: "",
        preCourseId: "",
      });
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(t("courses:khong_the_tao_khoa_hoc"));
    }
  };

  const handleUpdate = async () => {
    if (!selectedCourseId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${selectedCourseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editFormData,
          credits: Number(editFormData.credits),
          departmentId: Number(editFormData.departmentId),
          preCourseId: editFormData.preCourseId || null,
        }),
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      fetchCourses();
      toast.success(t("courses:khoa_hoc_cap_nhat_thanh_cong"));
      setEditFormData({
        courseId: "",
        courseName: "",
        credits: 0,
        departmentId: "",
        description: "",
        preCourseId: "",
      });
      setIsEditDialogOpen(false);
      setSelectedCourseId(null);
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(t("courses:khong_the_cap_nhat_khoa_hoc"));
    }
  };

  const handleEdit = (course: Course) => {
    setEditFormData({
      courseId: course.courseId,
      courseName: course.courseName,
      credits: course.credits,
      departmentId: course.departmentId.toString(),
      description: course.description,
      preCourseId: course.preCourseId || "",
    });
    setSelectedCourseId(course.courseId);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirm = async (courseId: string) => {
    try {
      const hasClasses = await checkCourseClasses(courseId);
      setDeleteDialogMessage(
        hasClasses
          ? t("courses:co_lop_mo")
          : t("courses:ban_co_muon_xoa")
      );
      setSelectedCourseId(courseId);
      setIsDeleteDialogOpen(true);
    } catch (error) {
      console.error("Error checking course classes:", error);
      toast.error(t("courses:khong_the_kiem_tra_lop_hoc"));
    }
  };

  const handleDelete = async () => {
    if (!selectedCourseId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${selectedCourseId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      fetchCourses();
      toast.success(t("courses:khoa_hoc_xoa_thanh_cong"));
      setIsDeleteDialogOpen(false);
      setSelectedCourseId(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(t("courses:khong_the_xoa_khoa_hoc"));
    }
  };

  const handleActivateConfirm = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsActivateDialogOpen(true);
  };

  const handleActivate = async () => {
    if (!selectedCourseId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/active/${selectedCourseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      fetchCourses();
      toast.success(t("courses:khoa_hoc_kich_hoat_thanh_cong"));
      setIsActivateDialogOpen(false);
      setSelectedCourseId(null);
    } catch (error) {
      console.error("Error activating course:", error);
      toast.error(t("courses:khong_the_kich_hoat_khoa_hoc"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationMenu className="bg-white shadow-md p-4 max-w-full">
        <NavigationMenuList className="flex justify-between items-center container mx-auto">
          <div className="flex items-center gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="text-lg font-semibold text-gray-100 bg-gray-800">
                {t("courses:quan_ly_sinh_vien")}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/courses" className="text-lg font-semibold text-gray-100 bg-gray-800">
                {t("courses:quan_ly_khoa_hoc")}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/classes" className="text-lg font-semibold text-gray-100 bg-gray-800">
                {t("courses:quan_ly_lop_hoc")}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("courses:danh_sach_khoa_hoc")}</h1>
        <div className="flex justify-between mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>{t("courses:them_khoa_hoc")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("courses:them_khoa_hoc")}</DialogTitle>
                <DialogDescription>
                  {t("courses:dien_thong_tin_khoa_hoc")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="courseId" className="text-right">
                    {t("courses:ma_khoa_hoc")}
                  </label>
                  <Input
                    id="courseId"
                    value={createFormData.courseId}
                    onChange={(e) => setCreateFormData({ ...createFormData, courseId: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="courseName" className="text-right">
                    {t("courses:ten_khoa_hoc")}
                  </label>
                  <Input
                    id="courseName"
                    value={createFormData.courseName}
                    onChange={(e) => setCreateFormData({ ...createFormData, courseName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="credits" className="text-right">
                    {t("courses:so_tin_chi")}
                  </label>
                  <Input
                    id="credits"
                    type="number"
                    value={createFormData.credits}
                    onChange={(e) => setCreateFormData({ ...createFormData, credits: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="departmentId" className="text-right">
                    {t("courses:khoa")}
                  </label>
                  <Select
                    value={createFormData.departmentId}
                    onValueChange={(value) => setCreateFormData({ ...createFormData, departmentId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("courses:chon_khoa")} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.length > 0 ? (
                        departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          {t("courses:khong_co_khoa")}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="preCourseId" className="text-right">
                    {t("courses:khoa_hoc_tien_quyet")}
                  </label>
                  <Input
                    id="preCourseId"
                    value={createFormData.preCourseId}
                    onChange={(e) => setCreateFormData({ ...createFormData, preCourseId: e.target.value })}
                    className="col-span-3"
                    placeholder={t("courses:de_trong_neu_khong_co")}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right">
                    {t("courses:mo_ta")}
                  </label>
                  <Textarea
                    id="description"
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("courses:huy")}</Button>
                </DialogClose>
                <Button onClick={handleCreate}>{t("courses:luu")}</Button>
              </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("courses:ma_khoa_hoc")}</TableHead>
                <TableHead>{t("courses:ten_khoa_hoc")}</TableHead>
                <TableHead>{t("courses:so_tin_chi")}</TableHead>
                <TableHead>{t("courses:khoa")}</TableHead>
                <TableHead>{t("courses:trang_thai")}</TableHead>
                <TableHead>{t("courses:hanh_dong")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.courseId}>
                    <TableCell>{course.courseId}</TableCell>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{course.Department?.name || "N/A"}</TableCell>
                    <TableCell>
                      {course.status === "activate"
                        ? t("courses:dang_hoat_dong")
                        : t("courses:khong_con_duoc_mo")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => handleEdit(course)}>
                              {t("courses:sua")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t("courses:cap_nhat_khoa_hoc")}</DialogTitle>
                              <DialogDescription>
                                {t("courses:cap_nhat_thong_tin_khoa_hoc")}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="editCourseName" className="text-right">
                                  {t("courses:ten_khoa_hoc")}
                                </label>
                                <Input
                                  id="editCourseName"
                                  value={editFormData.courseName}
                                  onChange={(e) =>
                                    setEditFormData({ ...editFormData, courseName: e.target.value })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="editCredits" className="text-right">
                                  {t("courses:so_tin_chi")}
                                </label>
                                <Input
                                  id="editCredits"
                                  type="number"
                                  value={editFormData.credits}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      credits: Number(e.target.value),
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="editDepartmentId" className="text-right">
                                  {t("courses:khoa")}
                                </label>
                                <Select
                                  value={editFormData.departmentId}
                                  onValueChange={(value) =>
                                    setEditFormData({ ...editFormData, departmentId: value })
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t("courses:chon_khoa")} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {departments.length > 0 ? (
                                      departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id.toString()}>
                                          {dept.name}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="0" disabled>
                                        {t("courses:khong_co_khoa")}
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="editPreCourseId" className="text-right">
                                  {t("courses:khoa_hoc_tien_quyet")}
                                </label>
                                <Input
                                  id="editPreCourseId"
                                  value={editFormData.preCourseId}
                                  onChange={(e) =>
                                    setEditFormData({ ...editFormData, preCourseId: e.target.value })
                                  }
                                  className="col-span-3"
                                  placeholder={t("courses:de_trong_neu_khong_co")}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="editDescription" className="text-right">
                                  {t("courses:mo_ta")}
                                </label>
                                <Textarea
                                  id="editDescription"
                                  value={editFormData.description}
                                  onChange={(e) =>
                                    setEditFormData({ ...editFormData, description: e.target.value })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">{t("courses:huy")}</Button>
                              </DialogClose>
                              <Button onClick={handleUpdate}>{t("courses:luu")}</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {course.status !== "deactivate" && (
                          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteConfirm(course.courseId)}
                              >
                                {t("courses:xoa")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t("courses:xoa_khoa_hoc")}</DialogTitle>
                                <DialogDescription>{deleteDialogMessage}</DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">{t("courses:huy")}</Button>
                                </DialogClose>
                                <Button variant="destructive" onClick={handleDelete}>
                                  {t("courses:co")}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {course.status !== "active" && (
                          <Dialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
                            <DialogTrigger asChild>
                              <Button onClick={() => handleActivateConfirm(course.courseId)}>
                                {t("courses:kich_hoat")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t("courses:kich_hoat_khoa_hoc")}</DialogTitle>
                                <DialogDescription>
                                  {t("courses:ban_co_muon_kich_hoat")}
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">{t("courses:huy")}</Button>
                                </DialogClose>
                                <Button onClick={handleActivate}>{t("courses:co")}</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {t("courses:khong_co_khoa_hoc")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      );
    </div>
  )
};