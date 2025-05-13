"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

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
  onSelectStudents: (studentIds: string[]) => void; // Renamed for clarity
}

export default function StudentTable({
  students,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onSelectStudents,
}: StudentTableProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      setSelectedStudents([]);
      onSelectStudents([]);
    }
  };

  const handleCheckboxChange = (studentId: string, checked: boolean) => {
    let updatedSelection = [...selectedStudents];
    if (checked) {
      updatedSelection = [...updatedSelection, studentId];
    } else {
      updatedSelection = updatedSelection.filter((id) => id !== studentId);
    }
    setSelectedStudents(updatedSelection);
    onSelectStudents(updatedSelection); // Pass selected IDs to parent
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selectedStudents.length === students.length && students.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    const allIds = students.map((student) => student.studentId);
                    setSelectedStudents(allIds);
                    onSelectStudents(allIds);
                  } else {
                    setSelectedStudents([]);
                    onSelectStudents([]);
                  }
                }}
              />
            </TableHead>
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
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.includes(student.studentId)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(student.studentId, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>
                  <Link className="text-gray-800 underline" href={`/students/${student.studentId}`}>
                    {student.fullName}
                  </Link>
                </TableCell>
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
              <TableCell colSpan={11} className="text-center">
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
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}