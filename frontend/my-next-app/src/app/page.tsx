"use client"
import { useState } from "react";
import StudentTable from "@/components/StudentTable";
import StudentModal from "@/components/StudentModal";
export default function StudentsPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [onStudentChange, setOnStudentChange] = useState();
    return (
        <div className="w-full px-8">
            <div className="flex mb-4">
                <input 
                    type="text" placeholder="Tìm kiếm theo MSSV hoặc Họ tên"
                    className="w-2/3 grow p-2 border border-gray-300 rounded-md"
                />
                <button className="ml-2 p-2 bg-blue-500 text-white rounded-md">Tìm kiếm</button>
                <button className="ml-2 p-2 bg-green-500 text-white rounded-md" onClick={() => setIsOpen(true)}>Thêm sinh viên</button>
            </div>
            <StudentTable />
            <StudentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
