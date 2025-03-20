// components/StudentTable.tsx
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
    department?: Department;
    status?: Status;
    program?: Program;
    departmentId?: number;
    statusId?: number;
    programId?: number;
    course?: string;
  }
  
  interface StudentTableProps {
    students: Student[];
  }
  
  export default function StudentTable({ students }: StudentTableProps) {

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MSSV</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Khoa</TableHead>
            <TableHead>Khóa</TableHead>
            <TableHead>Chương trình</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Tình trạng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>
                  {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>
                  {student.department?.name || student.departmentId || "N/A"}
                </TableCell>
                <TableCell>{student.course || "N/A"}</TableCell>
                <TableCell>
                  {student.program?.name || student.programId || "N/A"}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phoneNumber}</TableCell>
                <TableCell>
                  {student.status?.name || student.statusId || "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }