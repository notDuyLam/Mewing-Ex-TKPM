"use client";
import { useState, useEffect } from "react";
import StudentTable from "@/components/StudentTable";
import StudentModal from "@/components/StudentModal";
type Student = {
    id: string;
    name: string;
    dob: string;
    gender: string;
    faculty: string;
    schoolYear: string;
    status: string;
};

const initialStudent = {id: "", name: "", dob: "", gender: "Nam", faculty: "Khoa Luật", schoolYear: "",
    program: "", address: "", email: "", phone: "", status: "Đang học",}
export default function StudentsPage() {
    const serverPath = process.env.NEXT_PUBLIC_SERVER_PATH;

    const [isOpen, setIsOpen] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectStudent, setSelectStudent] = useState(initialStudent);

    const getStudents = async () => {
        fetch(serverPath + "").then((res) => res.json()).then((data) => setStudents(data));
    }
    const searchStudent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
        console.log(query);
        fetch(`${serverPath}/api/search?q=${query}`).then((res) => res.json()).then((data) => setStudents(data));
    }
    const handleUpdateStudent = async (id : string) => {
        const response = await fetch(`${serverPath}/api/students/${id}`, {method: "GET"});
        const student = await response.json();
        setSelectStudent(student);
        setIsOpen(true);
    }
    const handleDeleteStudent = async (id: string) => {
        const response = await fetch(`${serverPath}/api/students/${id}`, {method: "DELETE"});
        setStudents(students.filter((student) => student.id !== id));
    }
    useEffect(() => {
       getStudents();
    }, []);
    return (
        <div className="w-full px-8">
            <div className="flex mb-4">
                <form className="flex grow" onSubmit={searchStudent}>
                    <input 
                        type="text" placeholder="Tìm kiếm theo MSSV hoặc Họ tên"
                        name="search"
                        className="w-2/3 grow p-2 border border-gray-300 rounded-md"
                    />
                    <button className="ml-2 p-2 bg-blue-500 text-white rounded-md">Tìm kiếm</button>
                </form>
                <button className="ml-2 p-2 bg-green-500 text-white rounded-md" onClick={() => {setIsOpen(true); setSelectStudent(initialStudent);}}>Thêm sinh viên</button>
            </div>
            <StudentTable students={students} updateStudent={handleUpdateStudent} deleteStudent={handleDeleteStudent}/>
            <StudentModal isOpen={isOpen} onClose={() => {setSelectStudent(initialStudent); setIsOpen(false); getStudents();}} initialStudent={selectStudent} />
        </div>
    );
}
