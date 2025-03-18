"use client"; 

import "@/globals.css";
import { useEffect, useState } from "react";
import Link from "next/link";

type Student = {
    id: string;
    name: string;
    dob: string;
    gender: string;
    faculty: string;
    schoolYear: string;
    status: string;
};

export default function StudentTable() {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        fetch("/api/students")
            .then((res) => res.json())
            .then((data) => setStudents(data));
    }, []);

    return (
        <div className="w-full">
            <table className="w-full">
                <thead>
                    <tr className="bg-blue-500">
                        <th className="p-4 text-center text-white bg-blue-500">MSSV</th>
                        <th className="p-4 text-center text-white bg-blue-500">Họ tên</th>
                        <th className="p-4 text-center text-white bg-blue-500">Ngày sinh</th>
                        <th className="p-4 text-center text-white bg-blue-500">Giới tính</th>
                        <th className="p-4 text-center text-white bg-blue-500">Khoa</th>
                        <th className="p-4 text-center text-white bg-blue-500">Khóa</th>
                        <th className="p-4 text-center text-white bg-blue-500">Tình trạng</th>
                        <th className="p-4 text-center text-white bg-blue-500">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.dob}</td>
                            <td>{student.gender}</td>
                            <td>{student.faculty}</td>
                            <td>{student.schoolYear}</td>
                            <td>{student.status}</td>
                            <td>
                                <Link href={`/students/${student.id}`} className="btn btn-primary">
                                    Xem
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
