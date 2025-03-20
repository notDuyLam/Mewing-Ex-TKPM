// app/students/[studentId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

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
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editDetails, setEditDetails] = useState<StudentDetails | null>(null);
  const [editIdentity, setEditIdentity] = useState<IdentityDocuments | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchStudent = async (studentId: string) => {
    try {
      const studentRes = await fetch(`http://localhost:3000/students/${studentId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!studentRes.ok) throw new Error("Failed to fetch student");
      const studentData: Student = await studentRes.json();

      const [deptRes, statusRes, progRes, detailsRes, identityRes] = await Promise.all([
        fetch(`http://localhost:3000/departments/${studentData.departmentId}`, { method: "GET" }),
        fetch(`http://localhost:3000/statuses/${studentData.statusId}`, { method: "GET" }),
        fetch(`http://localhost:3000/programs/${studentData.programId}`, { method: "GET" }),
        fetch(`http://localhost:3000/student-details/${studentId}`, { method: "GET" }),
        fetch(`http://localhost:3000/identity-documents/student/${studentId}`, { method: "GET" }),
      ]);

      const department = deptRes.ok ? await deptRes.json() : { id: studentData.departmentId, name: "N/A" };
      const status = statusRes.ok ? await statusRes.json() : { id: studentData.statusId, name: "N/A" };
      const program = progRes.ok ? await progRes.json() : { id: studentData.programId, name: "N/A" };
      const details = detailsRes.ok ? await detailsRes.json() : null;
      const identity = identityRes.ok ? await identityRes.json() : null;

      studentData.dateOfBirth = studentData.dateOfBirth.split("T")[0];
      if(identity) {
        identity.issueDate = identity.issueDate.split("T")[0];
        identity.expiryDate = identity.expiryDate.split("T")[0];
      }

      console.log(identity);

      const fullStudent = { ...studentData, department, status, program, details, identity };
      setStudent(fullStudent);
      setEditStudent(fullStudent);
      setEditDetails(details || {
        permanentAddressHouse: "", permanentAddressWard: "", permanentAddressDistrict: "",
        permanentAddressCity: "", permanentAddressCountry: "", temporaryAddress: "",
        mailingAddress: "", nationality: ""
      });
      setEditIdentity(identity || {
        identityType: "", identityNumber: "", issueDate: "", issuePlace: "",
        expiryDate: "", chipAttached: false, issuingCountry: "", note: ""
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
        fetch("http://localhost:3000/departments/", { method: "GET" }),
        fetch("http://localhost:3000/statuses/", { method: "GET" }),
        fetch("http://localhost:3000/programs/", { method: "GET" }),
      ]);
      setDepartments(deptRes.ok ? await deptRes.json() : []);
      setStatuses(statusRes.ok ? await statusRes.json() : []);
      setPrograms(progRes.ok ? await progRes.json() : []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
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
      // Cập nhật Student
      const studentRes = await fetch(`http://localhost:3000/students/${editStudent.studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editStudent),
      });
      if (!studentRes.ok) throw new Error("Failed to update student");

      // Xử lý StudentDetails
      if (student?.details) {
        // Nếu đã tồn tại, cập nhật
        const detailsRes = await fetch(`http://localhost:3000/student-details/${editStudent.studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editDetails, studentId: editStudent.studentId }),
        });
        if (!detailsRes.ok) throw new Error("Failed to update student details");
      } else if (Object.values(editDetails!).some(val => val)) {
        // Nếu chưa tồn tại và có dữ liệu, thêm mới
        const detailsRes = await fetch(`http://localhost:3000/student-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editDetails, studentId: editStudent.studentId }),
        });
        if (!detailsRes.ok) throw new Error("Failed to create student details");
      }

      // Xử lý IdentityDocuments
      if (student?.identity) {
        // Nếu đã tồn tại, cập nhật
        if (editIdentity?.identityType) {
          const identityRes = await fetch(`http://localhost:3000/identity-documents/student/${editStudent.studentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...editIdentity, studentId: editStudent.studentId }),
          });
          if (!identityRes.ok) throw new Error("Failed to update identity documents");
        }
      } else if (editIdentity?.identityType) {
        // Nếu chưa tồn tại và có dữ liệu, thêm mới
        const identityRes = await fetch(`http://localhost:3000/identity-documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editIdentity, studentId: editStudent.studentId }),
        });
        if (!identityRes.ok) throw new Error("Failed to create identity documents");
      }

      toast.success("Cập nhật thành công!");
      setIsEditOpen(false);
      fetchStudent(editStudent.studentId); // Refresh data
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsSaving(false);
    }
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
            <p><strong>MSSV:</strong> {student.studentId}</p>
            <p><strong>Họ tên:</strong> {student.fullName}</p>
            <p><strong>Ngày sinh:</strong> {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}</p>
            <p><strong>Giới tính:</strong> {student.gender}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Số điện thoại:</strong> {student.phoneNumber}</p>
            <p><strong>Khoa:</strong> {student.department?.name || "N/A"}</p>
            <p><strong>Khóa:</strong> {student.course || "N/A"}</p>
            <p><strong>Trạng thái:</strong> {student.status?.name || "N/A"}</p>
            <p><strong>Chương trình:</strong> {student.program?.name || "N/A"}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Thông tin bổ sung</h2>
          <div className="space-y-2">
            {student.details ? (
              <>
                <p><strong>Địa chỉ thường trú:</strong> {[
                  student.details.permanentAddressHouse, student.details.permanentAddressWard,
                  student.details.permanentAddressDistrict, student.details.permanentAddressCity,
                  student.details.permanentAddressCountry
                ].filter(Boolean).join(", ") || "N/A"}</p>
                <p><strong>Địa chỉ tạm trú:</strong> {student.details.temporaryAddress || "N/A"}</p>
                <p><strong>Địa chỉ nhận thư:</strong> {student.details.mailingAddress || "N/A"}</p>
                <p><strong>Quốc tịch:</strong> {student.details.nationality || "N/A"}</p>
              </>
            ) : <p>Không có thông tin chi tiết</p>}
          </div>
          <div className="space-y-2 pt-4 border-t">
            {student.identity ? (
              <>
                <p><strong>Loại giấy tờ:</strong> {student.identity.identityType}</p>
                <p><strong>Số giấy tờ:</strong> {student.identity.identityNumber}</p>
                <p><strong>Ngày cấp:</strong> {student.identity.issueDate ? new Date(student.identity.issueDate).toLocaleDateString("vi-VN") : "N/A"}</p>
                <p><strong>Nơi cấp:</strong> {student.identity.issuePlace || "N/A"}</p>
                <p><strong>Ngày hết hạn:</strong> {student.identity.expiryDate ? new Date(student.identity.expiryDate).toLocaleDateString("vi-VN") : "N/A"}</p>
                {student.identity.identityType === "CCCD" && (
                  <p><strong>Gắn chip:</strong> {student.identity.chipAttached ? "Có" : "Không"}</p>
                )}
                {student.identity.identityType === "Hộ chiếu" && (
                  <>
                    <p><strong>Quốc gia cấp:</strong> {student.identity.issuingCountry || "N/A"}</p>
                    <p><strong>Ghi chú:</strong> {student.identity.note || "N/A"}</p>
                  </>
                )}
              </>
            ) : <p>Không có thông tin giấy tờ</p>}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => router.push("/")}>Trở về</Button>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button>Chỉnh sửa</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-6xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa Sinh viên</DialogTitle>
            </DialogHeader>
            {editStudent && editDetails && editIdentity && (
              <div className="grid grid-cols-3 gap-4">
                {/* Cột 1: Thông tin Student */}
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
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
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
                      <option key={status.id} value={status.id}>{status.name}</option>
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
                      <option key={prog.id} value={prog.id}>{prog.name}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Khóa (ví dụ: K45)"
                    value={editStudent.course}
                    onChange={(e) => setEditStudent({ ...editStudent, course: e.target.value })}
                    disabled={isSaving}
                  />
                </div>

                {/* Cột 2: Thông tin StudentDetails */}
                <div className="space-y-4">
                  <Input
                    placeholder="Số nhà (Địa chỉ thường trú)"
                    value={editDetails.permanentAddressHouse}
                    onChange={(e) => setEditDetails({ ...editDetails, permanentAddressHouse: e.target.value })}
                    disabled={isSaving}
                  />
                  <Input
                    placeholder="Phường/Xã (Địa chỉ thường trú)"
                    value={editDetails.permanentAddressWard}
                    onChange={(e) => setEditDetails({ ...editDetails, permanentAddressWard: e.target.value })}
                    disabled={isSaving}
                  />
                  <Input
                    placeholder="Quận/Huyện (Địa chỉ thường trú)"
                    value={editDetails.permanentAddressDistrict}
                    onChange={(e) => setEditDetails({ ...editDetails, permanentAddressDistrict: e.target.value })}
                    disabled={isSaving}
                  />
                  <Input
                    placeholder="Tỉnh/Thành phố (Địa chỉ thường trú)"
                    value={editDetails.permanentAddressCity}
                    onChange={(e) => setEditDetails({ ...editDetails, permanentAddressCity: e.target.value })}
                    disabled={isSaving}
                  />
                  <Input
                    placeholder="Quốc gia (Địa chỉ thường trú)"
                    value={editDetails.permanentAddressCountry}
                    onChange={(e) => setEditDetails({ ...editDetails, permanentAddressCountry: e.target.value })}
                    disabled={isSaving}
                  />
                  <Input
                    placeholder="Địa chỉ tạm trú"
                    value={editDetails.temporaryAddress}
                    onChange={(e) => setEditDetails({ ...editDetails, temporaryAddress: e.target.value })}
                    disabled={isSaving}
                  />
                  <Input
                    placeholder="Địa chỉ nhận thư"
                    value={editDetails.mailingAddress}
                    onChange={(e) => setEditDetails({ ...editDetails, mailingAddress: e.target.value })}
                    disabled={isSaving}
                  />
                  <Input
                    placeholder="Quốc tịch"
                    value={editDetails.nationality}
                    onChange={(e) => setEditDetails({ ...editDetails, nationality: e.target.value })}
                    disabled={isSaving}
                  />
                </div>

                {/* Cột 3: Thông tin IdentityDocuments */}
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
                      editIdentity.identityType === "CMND" ? "Số CMND" :
                      editIdentity.identityType === "CCCD" ? "Số CCCD" : "Số hộ chiếu"
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
                        onCheckedChange={(checked) => setEditIdentity({ ...editIdentity, chipAttached: checked === true })}
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
                        onChange={(e) => setEditIdentity({ ...editIdentity, issuingCountry: e.target.value })}
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

                {/* Nút Lưu */}
                <div className="col-span-3 mt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="w-full">
                    {isSaving ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}