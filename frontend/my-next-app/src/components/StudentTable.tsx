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
    const serverPath = process.env.NEXT_PUBLIC_SERVER_PATH;
    useEffect(() => {
        fetch(serverPath + "")
            .then((res) => res.json())
            .then((data) => setStudents(data));
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(serverPath + `/api/students/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setStudents(students.filter((student) => student.id !== id));
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const handleChange = async (id: string) => {
        try {
            const response = await fetch(serverPath + `/api/students/${id}`, {
                method: "PUT",
            });
            if (response.ok) {
                const newStudent = await response.json();
                setStudents(newStudent);
            }
        } catch (error) {
            console.error("Error changing student status:", error);
        }
    }

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
                            <td className="px-4 py-3 text-left">{student.id}</td>
                            <td className="px-4 py-3 text-center">{student.name}</td>
                            <td className="px-4 py-3 text-center">{new Date(student.dob).toLocaleDateString('vi-VN')}</td>
                            <td className="px-4 py-3 text-center">{student.gender}</td>
                            <td className="px-4 py-3 text-center">{student.faculty}</td>
                            <td className="px-4 py-3 text-center">{student.schoolYear}</td>
                            <td className="px-4 py-3 text-center">{student.status}</td>
                            <td className="flex justify-center gap-4 px-4 py-3">
                                <button className="py-2 px-4 bg-green-500 text-white cursor-pointer rounded-lg" onClick={()=>handleChange(student.id)}>Sửa</button>
                                <button className="py-2 px-4 bg-red-500 text-white cursor-pointer rounded-lg" onClick={() => handleDelete(student.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
