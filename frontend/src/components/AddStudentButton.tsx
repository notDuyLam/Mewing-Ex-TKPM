// components/AddStudentButton.tsx
"use client";

import { useTranslation } from "react-i18next";
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

export default function AddStudentButton({
  onStudentAdded,
}: AddStudentButtonProps) {
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
  const [newIdentityDocuments, setNewIdentityDocuments] =
    useState<IdentityDocuments>({
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
    let isPhoneNumberValid = false;
    const validationPhoneNumber = JSON.parse(
      process.env.NEXT_PUBLIC_ALLOWED_PHONE_NUMBERS || "[]"
    );
    for (let i = 0; i < validationPhoneNumber.length; i++) {
      const phoneRegex = new RegExp(validationPhoneNumber[i].regex);
      if (phoneRegex.test(newStudent.phoneNumber)) {
        isPhoneNumberValid = true;
      }
    }
    if (!isPhoneNumberValid) {
      const allowedCountries = validationPhoneNumber.map((e: any) => e.name);
      toast.error(
        `Số điện thoại không hợp lệ hoặc không thuộc vùng: ${allowedCountries.join(
          ", "
        )}`
      );
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
      const studentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        }
      );

      if (!studentRes.ok) {
        const errorData = await studentRes.json();
        toast.error(errorData.message || "Failed to add student");
        return;
      }

      // Tạo StudentDetails
      const studentDetailsData = {
        ...newStudentDetails,
        studentId: newStudent.studentId,
      };
      const detailsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student-details`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentDetailsData),
        }
      );

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
        const identityRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/identity-documents`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(identityDocumentsData),
          }
        );

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

  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{t("add_student:them_sv")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>{t("add_student:them_sv_moi")}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {/* Cột 1: Thông tin Student */}
          <div className="space-y-4">
            <Input
              placeholder={t("add_student:ma_sv")}
              value={newStudent.studentId}
              onChange={(e) =>
                setNewStudent({ ...newStudent, studentId: e.target.value })
              }
              disabled={isLoading}
            />
            <Input
              placeholder={t("add_student:hoten")}
              value={newStudent.fullName}
              onChange={(e) =>
                setNewStudent({ ...newStudent, fullName: e.target.value })
              }
              disabled={isLoading}
            />
            <div className="flex items-center space-x-2">
              <label>{t("add_student:ngay_sinh")}:</label>
              <Input
                className="w-auto"
                type="date"
                value={newStudent.dateOfBirth}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, dateOfBirth: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <select
              value={newStudent.gender}
              onChange={(e) =>
                setNewStudent({ ...newStudent, gender: e.target.value })
              }
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              <option value="">{t("add_student:chon_gioi_tinh")}</option>
              <option value="Nam">{t("add_student:nam")}</option>
              <option value="Nữ">{t("add_student:nu")}</option>
            </select>
            <Input
              placeholder="Email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
              disabled={isLoading}
            />
            <Input
              placeholder={t("add_student:sdt")}
              value={newStudent.phoneNumber}
              onChange={(e) =>
                setNewStudent({ ...newStudent, phoneNumber: e.target.value })
              }
              disabled={isLoading}
            />
            <select
              value={newStudent.departmentId}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  departmentId: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              disabled={isLoading || departments.length === 0}
            >
              <option value={0}>{t("add_student:chon_khoa")}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <select
              value={newStudent.statusId}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  statusId: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              disabled={isLoading || statuses.length === 0}
            >
              <option value={0}>{t("add_student:chon_trang_thai")}</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
            <select
              value={newStudent.programId}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  programId: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              disabled={isLoading || programs.length === 0}
            >
              <option value={0}>{t("add_student:chon_chuong_trinh")}</option>
              {programs.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
            </select>
            <Input
              placeholder={t("add_student:chon_khoa")}
              value={newStudent.course}
              onChange={(e) =>
                setNewStudent({ ...newStudent, course: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          {/* Cột 2: Thông tin StudentDetails */}
          <div className="space-y-4">
            <Input
              placeholder={t("add_student:so_nha")}
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
              placeholder={t("add_student:phuong")}
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
              placeholder={t("add_student:quan")}
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
              placeholder={t("add_student:tinh")}
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
              placeholder={t("add_student:quoc_gia")}
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
              placeholder={t("add_student:tam_tru")}
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
              placeholder={t("add_student:nhan_thu")}
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
              placeholder={t("add_student:quoc_tich")}
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
              <option value="">{t("add_student:chon_giay_to")}</option>
              <option value="CMND">{t("add_student:cmnd")}</option>
              <option value="CCCD">{t("add_student:cccd")}</option>
              <option value="Hộ chiếu">{t("add_student:ho_chieu")}</option>
            </select>
            <Input
              placeholder={
                newIdentityDocuments.identityType === "CMND"
                  ? t("add_student:so_cmnd")
                  : newIdentityDocuments.identityType === "CCCD"
                  ? t("add_student:so_cccd")
                  : t("add_student:so_ho_chieu")
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
              <label>{t("add_student:ngay_cap")}</label>
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
              placeholder={t("add_student:noi_cap")}
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
              <label>{t("add_student:ngay_het_han")}</label>
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
                <label>{t("add_student:gan_chip")}</label>
              </div>
            )}
            {newIdentityDocuments.identityType === "Hộ chiếu" && (
              <>
                <Input
                  placeholder={t("add_student:quoc_gia_cap")}
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
                  placeholder={t("add_student:ghi_chu")}
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
            <Button
              onClick={handleAddStudent}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? t("add_student:dang_them") : t("add_student:them")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
