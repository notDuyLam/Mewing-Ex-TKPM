"use client";

import { useState, useEffect } from "react";
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

interface Semester {
  semesterId: string;
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
  const [classes, setClasses] = useState<Class[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
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
      // Ensure unique semesters by semesterId
      const uniqueSemesters = Array.from(
        new Map(data.map((s: Semester) => [s.semesterId, s])).values()
      );
      setSemesters(uniqueSemesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      setSemesters([]);
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
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSemesters();
    fetchCourses();
    fetchTeachers();
  }, []);

  const getSemesterDisplay = (semester: Semester) => {
    const year = new Date(semester.year).getFullYear();
    const semestersInYear = semesters.filter(
      (s) => new Date(s.year).getFullYear() === year
    );
    if (semestersInYear.length <= 1) {
      return `Học kỳ 1 - ${year}`;
    }
    const sortedSemesters = semestersInYear.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    const index = sortedSemesters.findIndex(
      (s) => s.semesterId === semester.semesterId
    );
    return `Học kỳ ${index + 1} - ${year}`;
  };

  const validateFormData = (data: typeof createFormData) => {
    // Check for missing required fields
    if (
      !data.classId ||
      !data.courseId ||
      !data.semesterId ||
      !data.teacherId ||
      !data.schedule ||
      !data.room
    ) {
      toast.error("Missing required fields");
      return false;
    }

    // Check for empty fields after trimming
    if (
      (typeof data.classId === "string" && data.classId.trim() === "") ||
      (typeof data.courseId === "string" && data.courseId.trim() === "") ||
      (typeof data.semesterId === "string" && data.semesterId.trim() === "") ||
      (typeof data.teacherId === "string" && data.teacherId.trim() === "") ||
      (typeof data.schedule === "string" && data.schedule.trim() === "") ||
      (typeof data.room === "string" && data.room.trim() === "")
    ) {
      toast.error("Fields cannot be empty");
      return false;
    }

    // Validate schedule format
    if (typeof data.schedule === "string" && !/^\d{2}:\d{2}$/.test(data.schedule)) {
      toast.error("Schedule must be a valid time (e.g., 08:00)");
      return false;
    }

    // Validate maxStudent
    if (data.maxStudent <= 0) {
      toast.error("Maximum students must be greater than 0");
      return false;
    }

    return true;
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
          toast.error("Course not found");
        } else if (_data.message.includes("Class already exists")) {
          toast.error("Class already exists");
        } else if (_data.message.includes("deactivate")) {
          toast.error("Course has been deactivated");
        } else {
          toast.error(_data.message);
        }
        return;
      }

      fetchClasses();
      toast.success("Lớp học đã được tạo thành công!");
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
      toast.error("Không thể tạo lớp học!");
    }
  };

  const handleUpdate = async () => {
    if (!selectedClassId || !validateFormData(editFormData)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${selectedClassId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editFormData,
          year: Number(editFormData.year),
          maxStudent: Number(editFormData.maxStudent),
        }),
      });

      if (!res.ok) {
        const _data = await res.json();
        toast.error(_data.message);
        return;
      }

      fetchClasses();
      toast.success("Lớp học đã được cập nhật thành công!");
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
      toast.error("Không thể cập nhật lớp học!");
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditFormData({
      classId: classItem.classId,
      courseId: classItem.courseId,
      year: classItem.year,
      semesterId: classItem.semesterId,
      teacherId: classItem.teacherId,
      maxStudent: classItem.maxStudent,
      schedule: classItem.schedule,
      room: classItem.room,
    });
    setSelectedClassId(classItem.classId);
    setIsEditDialogOpen(true);
  };

  return (
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
              <NavigationMenuLink href="/classes" className="text-lg font-semibold text-gray-100 bg-gray-800">
                Quản lý Lớp học
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Danh sách Lớp học</h1>
        <div className="flex justify-between mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Thêm Lớp học</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Lớp học</DialogTitle>
                <DialogDescription>
                  Điền thông tin lớp học bên dưới. Nhấn Lưu khi hoàn tất.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="classId" className="text-right">
                    Mã Lớp học
                  </label>
                  <Input
                    id="classId"
                    value={createFormData.classId}
                    onChange={(e) => setCreateFormData({ ...createFormData, classId: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="courseId" className="text-right">
                    Khóa học
                  </label>
                  <Select
                    value={createFormData.courseId}
                    onValueChange={(value) => setCreateFormData({ ...createFormData, courseId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn khóa học" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <SelectItem key={course.courseId} value={course.courseId}>
                            {course.courseName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          Không có khóa học nào
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="year" className="text-right">
                    Năm học
                  </label>
                  <Input
                    id="year"
                    type="number"
                    value={createFormData.year}
                    onChange={(e) => setCreateFormData({ ...createFormData, year: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="semesterId" className="text-right">
                    Học kỳ
                  </label>
                  <Select
                    value={createFormData.semesterId}
                    onValueChange={(value) => setCreateFormData({ ...createFormData, semesterId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn học kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.length > 0 ? (
                        semesters.map((semester) => (
                          <SelectItem
                            key={`create-${semester.semesterId}`}
                            value={semester.semesterId}
                          >
                            {getSemesterDisplay(semester)}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          Không có học kỳ nào
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="teacherId" className="text-right">
                    Giáo viên
                  </label>
                  <Select
                    value={createFormData.teacherId}
                    onValueChange={(value) => setCreateFormData({ ...createFormData, teacherId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn giáo viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.length > 0 ? (
                        teachers.map((teacher) => (
                          <SelectItem key={teacher.teacherId} value={teacher.teacherId}>
                            {teacher.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          Không có giáo viên nào
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="maxStudent" className="text-right">
                    Số sinh viên tối đa
                  </label>
                  <Input
                    id="maxStudent"
                    type="number"
                    value={createFormData.maxStudent}
                    onChange={(e) => setCreateFormData({ ...createFormData, maxStudent: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="schedule" className="text-right">
                    Lịch học
                  </label>
                  <Input
                    id="schedule"
                    value={createFormData.schedule}
                    onChange={(e) => setCreateFormData({ ...createFormData, schedule: e.target.value })}
                    className="col-span-3"
                    placeholder="VD: 08:00"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="room" className="text-right">
                    Phòng học
                  </label>
                  <Input
                    id="room"
                    value={createFormData.room}
                    onChange={(e) => setCreateFormData({ ...createFormData, room: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Hủy</Button>
                </DialogClose>
                <Button onClick={handleCreate}>Lưu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã Lớp học</TableHead>
              <TableHead>Khóa học</TableHead>
              <TableHead>Năm học</TableHead>
              <TableHead>Học kỳ</TableHead>
              <TableHead>Giáo viên</TableHead>
              <TableHead>Số sinh viên tối đa</TableHead>
              <TableHead>Lịch học</TableHead>
              <TableHead>Phòng học</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <TableRow key={classItem.classId}>
                  <TableCell>{classItem.classId}</TableCell>
                  <TableCell>{classItem.Course?.courseName || "N/A"}</TableCell>
                  <TableCell>{classItem.year}</TableCell>
                  <TableCell>
                    {classItem.Semester ? getSemesterDisplay(classItem.Semester) : "N/A"}
                  </TableCell>
                  <TableCell>{classItem.Teacher?.name || "N/A"}</TableCell>
                  <TableCell>{classItem.maxStudent}</TableCell>
                  <TableCell>{classItem.schedule}</TableCell>
                  <TableCell>{classItem.room}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => handleEdit(classItem)}>
                            Sửa
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cập nhật Lớp học</DialogTitle>
                            <DialogDescription>
                              Cập nhật thông tin lớp học bên dưới. Nhấn Lưu khi hoàn tất.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="editClassId" className="text-right">
                                Mã Lớp học
                              </label>
                              <Input
                                id="editClassId"
                                value={editFormData.classId}
                                onChange={(e) => setEditFormData({ ...editFormData, classId: e.target.value })}
                                className="col-span-3"
                                disabled
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="editCourseId" className="text-right">
                                Khóa học
                              </label>
                              <Select
                                value={editFormData.courseId}
                                onValueChange={(value) => setEditFormData({ ...editFormData, courseId: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Chọn khóa học" />
                                </SelectTrigger>
                                <SelectContent>
                                  {courses.length > 0 ? (
                                    courses.map((course) => (
                                      <SelectItem key={course.courseId} value={course.courseId}>
                                        {course.courseName}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="0" disabled>
                                      Không có khóa học nào
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="editYear" className="text-right">
                                Năm học
                              </label>
                              <Input
                                id="editYear"
                                type="number"
                                value={editFormData.year}
                                onChange={(e) => setEditFormData({ ...editFormData, year: Number(e.target.value) })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="editSemesterId" className="text-right">
                                Học kỳ
                              </label>
                              <Select
                                value={editFormData.semesterId}
                                onValueChange={(value) => setEditFormData({ ...editFormData, semesterId: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Chọn học kỳ" />
                                </SelectTrigger>
                                <SelectContent>
                                  {semesters.length > 0 ? (
                                    semesters.map((semester) => (
                                      <SelectItem
                                        key={`edit-${semester.semesterId}`}
                                        value={semester.semesterId}
                                      >
                                        {getSemesterDisplay(semester)}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="0" disabled>
                                      Không có học kỳ nào
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="editTeacherId" className="text-right">
                                Giáo viên
                              </label>
                              <Select
                                value={editFormData.teacherId}
                                onValueChange={(value) => setEditFormData({ ...editFormData, teacherId: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Chọn giáo viên" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teachers.length > 0 ? (
                                    teachers.map((teacher) => (
                                      <SelectItem key={teacher.teacherId} value={teacher.teacherId}>
                                        {teacher.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="0" disabled>
                                      Không có giáo viên nào
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="editMaxStudent" className="text-right">
                                Số sinh viên tối đa
                              </label>
                              <Input
                                id="editMaxStudent"
                                type="number"
                                value={editFormData.maxStudent}
                                onChange={(e) => setEditFormData({ ...editFormData, maxStudent: Number(e.target.value) })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="editSchedule" className="text-right">
                                Lịch học
                              </label>
                              <Input
                                id="editSchedule"
                                value={editFormData.schedule}
                                onChange={(e) => setEditFormData({ ...editFormData, schedule: e.target.value })}
                                className="col-span-3"
                                placeholder="VD: 08:00"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="editRoom" className="text-right">
                                Phòng học
                              </label>
                              <Input
                                id="editRoom"
                                value={editFormData.room}
                                onChange={(e) => setEditFormData({ ...editFormData, room: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Hủy</Button>
                            </DialogClose>
                            <Button onClick={handleUpdate}>Lưu</Button>
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
                  Không có lớp học nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}