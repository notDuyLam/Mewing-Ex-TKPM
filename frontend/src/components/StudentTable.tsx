// components/StudentTable.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  
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
    totalPages: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  }
  
  export default function StudentTable({
    students,
    totalPages,
    currentPage,
    pageSize,
    onPageChange,
  }: StudentTableProps) {
    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    };
  
    return (
      <div>
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
  
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    );
  }