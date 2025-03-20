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
import { Checkbox } from "@/components/ui/checkbox";

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
  course: string;
}

interface StudentDetails {
  studentId: string;
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
  studentId: string;
  identityType: string;
  identityNumber: string;
  issueDate: string;
  issuePlace: string;
  expiryDate: string;
  chipAttached: boolean;
  issuingCountry: string;
  note: string;
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
    departmentId: 0,
    statusId: 0,
    programId: 0,
    course: "",
  });
  const [newStudentDetails, setNewStudentDetails] = useState<StudentDetails>({
    studentId: "",
    permanentAddressHouse: "",
    permanentAddressWard: "",
    permanentAddressDistrict: "",
    permanentAddressCity: "",
    permanentAddressCountry: "",
    temporaryAddress: "",
    mailingAddress: "",
    nationality: "",
  });
  const [newIdentityDocuments, setNewIdentityDocuments] = useState<IdentityDocuments>({
    studentId: "",
    identityType: "",
    identityNumber: "",
    issueDate: "",
    issuePlace: "",
    expiryDate: "",
    chipAttached: false,
    issuingCountry: "",
    note: "",
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

    // Validate IdentityDocuments
    if (newIdentityDocuments.identityType) {
      if (!newIdentityDocuments.identityNumber.trim()) {
        toast.error("Số giấy tờ không được để trống");
        return false;
      }
    }

    return true;
  };

  const handleAddStudent = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Tạo Student
      const studentRes = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      if (!studentRes.ok) {
        const errorData = await studentRes.json();
        toast.error(errorData.message || "Failed to add student");
        return;
      }

      // Tạo StudentDetails
      const studentDetailsData = { ...newStudentDetails, studentId: newStudent.studentId };
      const detailsRes = await fetch("http://localhost:3000/student-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentDetailsData),
      });

      if (!detailsRes.ok) {
        const errorData = await detailsRes.json();
        toast.error(errorData.message || "Failed to add student details");
        return;
      }

      // Tạo IdentityDocuments (nếu có dữ liệu)
      if (newIdentityDocuments.identityType) {
        const identityDocumentsData = {
          ...newIdentityDocuments,
          studentId: newStudent.studentId,
        };
        const identityRes = await fetch("http://localhost:3000/identity-documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(identityDocumentsData),
        });

        if (!identityRes.ok) {
          const errorData = await identityRes.json();
          toast.error(errorData.message || "Failed to add identity documents");
          return;
        }
      }

      // Reset form
      setNewStudent({
        studentId: "",
        fullName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        phoneNumber: "",
        departmentId: 0,
        statusId: 0,
        programId: 0,
        course: "",
      });
      setNewStudentDetails({
        studentId: "",
        permanentAddressHouse: "",
        permanentAddressWard: "",
        permanentAddressDistrict: "",
        permanentAddressCity: "",
        permanentAddressCountry: "",
        temporaryAddress: "",
        mailingAddress: "",
        nationality: "",
      });
      setNewIdentityDocuments({
        studentId: "",
        identityType: "",
        identityNumber: "",
        issueDate: "",
        issuePlace: "",
        expiryDate: "",
        chipAttached: false,
        issuingCountry: "",
        note: "",
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
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Thêm Sinh viên Mới</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {/* Cột 1: Thông tin Student */}
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
            <div className="flex items-center space-x-2">
              <label>Ngày sinh:</label>
              <Input
                className="w-auto"
                type="date"
                value={newStudent.dateOfBirth}
                onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                disabled={isLoading}
              />
            </div>
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
              <option value={0}>Chọn khoa</option>
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
              <option value={0}>Chọn trạng thái</option>
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
              <option value={0}>Chọn chương trình</option>
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
          </div>

          {/* Cột 2: Thông tin StudentDetails */}
          <div className="space-y-4">
            <Input
              placeholder="Số nhà (Địa chỉ thường trú)"
              value={newStudentDetails.permanentAddressHouse}
              onChange={(e) =>
                setNewStudentDetails({
                  ...newStudentDetails,
                  permanentAddressHouse: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <Input
              placeholder="Phường/Xã (Địa chỉ thường trú)"
              value={newStudentDetails.permanentAddressWard}
              onChange={(e) =>
                setNewStudentDetails({
                  ...newStudentDetails,
                  permanentAddressWard: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <Input
              placeholder="Quận/Huyện (Địa chỉ thường trú)"
              value={newStudentDetails.permanentAddressDistrict}
              onChange={(e) =>
                setNewStudentDetails({
                  ...newStudentDetails,
                  permanentAddressDistrict: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <Input
              placeholder="Tỉnh/Thành phố (Địa chỉ thường trú)"
              value={newStudentDetails.permanentAddressCity}
              onChange={(e) =>
                setNewStudentDetails({
                  ...newStudentDetails,
                  permanentAddressCity: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <Input
              placeholder="Quốc gia (Địa chỉ thường trú)"
              value={newStudentDetails.permanentAddressCountry}
              onChange={(e) =>
                setNewStudentDetails({
                  ...newStudentDetails,
                  permanentAddressCountry: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <Input
              placeholder="Địa chỉ tạm trú"
              value={newStudentDetails.temporaryAddress}
              onChange={(e) =>
                setNewStudentDetails({
                  ...newStudentDetails,
                  temporaryAddress: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <Input
              placeholder="Địa chỉ nhận thư"
              value={newStudentDetails.mailingAddress}
              onChange={(e) =>
                setNewStudentDetails({
                  ...newStudentDetails,
                  mailingAddress: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <Input
              placeholder="Quốc tịch"
              value={newStudentDetails.nationality}
              onChange={(e) =>
                setNewStudentDetails({
                  ...newStudentDetails,
                  nationality: e.target.value,
                })
              }
              disabled={isLoading}
            />
          </div>

          {/* Cột 3: Thông tin IdentityDocuments */}
          <div className="space-y-4">
            <select
              value={newIdentityDocuments.identityType}
              onChange={(e) =>
                setNewIdentityDocuments({
                  ...newIdentityDocuments,
                  identityType: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              <option value="">Chọn loại giấy tờ</option>
              <option value="CMND">CMND</option>
              <option value="CCCD">CCCD</option>
              <option value="Hộ chiếu">Hộ chiếu</option>
            </select>
            <Input
              placeholder={
                newIdentityDocuments.identityType === "CMND"
                  ? "Số CMND"
                  : newIdentityDocuments.identityType === "CCCD"
                  ? "Số CCCD"
                  : "Số hộ chiếu"
              }
              value={newIdentityDocuments.identityNumber}
              onChange={(e) =>
                setNewIdentityDocuments({
                  ...newIdentityDocuments,
                  identityNumber: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <div className="flex items-center space-x-2">
              <label>Ngày cấp:</label>
              <Input
                type="date"
                className="w-auto"
                value={newIdentityDocuments.issueDate}
                onChange={(e) =>
                  setNewIdentityDocuments({
                    ...newIdentityDocuments,
                    issueDate: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>
            <Input
              placeholder="Nơi cấp"
              value={newIdentityDocuments.issuePlace}
              onChange={(e) =>
                setNewIdentityDocuments({
                  ...newIdentityDocuments,
                  issuePlace: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <div className="flex items-center space-x-2">
              <label>Ngày hết hạn:</label>
              <Input
                type="date"
                className="w-auto"
                value={newIdentityDocuments.expiryDate}
                onChange={(e) =>
                  setNewIdentityDocuments({
                    ...newIdentityDocuments,
                    expiryDate: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>
            {newIdentityDocuments.identityType === "CCCD" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newIdentityDocuments.chipAttached}
                  onCheckedChange={(checked) =>
                    setNewIdentityDocuments({
                      ...newIdentityDocuments,
                      chipAttached: checked === true,
                    })
                  }
                  disabled={isLoading}
                />
                <label>Gắn chip</label>
              </div>
            )}
            {newIdentityDocuments.identityType === "Hộ chiếu" && (
              <>
                <Input
                  placeholder="Quốc gia cấp"
                  value={newIdentityDocuments.issuingCountry}
                  onChange={(e) =>
                    setNewIdentityDocuments({
                      ...newIdentityDocuments,
                      issuingCountry: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
                <Input
                  placeholder="Ghi chú"
                  value={newIdentityDocuments.note}
                  onChange={(e) =>
                    setNewIdentityDocuments({
                      ...newIdentityDocuments,
                      note: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
              </>
            )}
          </div>

          {/* Nút Thêm */}
          <div className="col-span-3 mt-4">
            <Button onClick={handleAddStudent} disabled={isLoading} className="w-full">
              {isLoading ? "Đang thêm..." : "Thêm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}