import { useState } from "react";

export default function StudentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;
    const serverPath = process.env.NEXT_PUBLIC_SERVER_PATH;
    console.log(serverPath);

    const [student, setStudent] = useState({
        id: "",
        name: "",
        dob: "",
        gender: "Nam",
        faculty: "Khoa Luật",
        schoolYear: "",
        program: "",
        address: "",
        email: "",
        phone: "",
        status: "Đang học",
    });

    const [error, setError] = useState("");

    // Cập nhật giá trị form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setStudent({ ...student, [e.target.id]: e.target.value });
    };

    // Kiểm tra hợp lệ dữ liệu
    const validateForm = () => {
        if (!student.id || !student.name || !student.dob || !student.email || !student.phone || !student.schoolYear) {
            setError("Vui lòng nhập đầy đủ các trường bắt buộc.");
            return false;
        }

        // Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(student.email)) {
            setError("Email không hợp lệ.");
            return false;
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(student.phone)) {
            setError("Số điện thoại phải có 10 chữ số.");
            return false;
        }

        setError(""); // Xóa lỗi nếu hợp lệ
        return true;
    };

    // Gửi dữ liệu lên backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await fetch(serverPath + "/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(student),
            });

            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi gửi dữ liệu.");
            }

            alert("Thêm sinh viên thành công!");
            onClose(); // Đóng modal sau khi thành công
        } catch (error) {
            setError("Lỗi khi gửi dữ liệu lên server.");
        }
    };

    return (
        <div id="studentModal" className="fixed z-10 inset-0 overflow-y-auto w-full h-full bg-black/50">
            <div className="bg-white my-16 mx-auto border border-gray-300 rounded-md w-4/5 p-10">
                <span className="text-2xl font-bold cursor-pointer float-end" onClick={onClose}>
                    &times;
                </span>
                <h2 id="modalTitle" className="text-2xl font-bold mb-4">Thêm sinh viên mới</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form id="studentForm" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="id">Mã số sinh viên *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="text" id="id" required onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="name">Họ tên *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="text" id="name" required onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dob">Ngày tháng năm sinh *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="date" id="dob" required onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="gender">Giới tính *</label>
                            <select className="border border-gray-300 w-full p-2 round-sm" id="gender" required onChange={handleChange}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="faculty">Khoa *</label>
                            <select className="border border-gray-300 w-full p-2 round-sm" id="faculty" required onChange={handleChange}>
                                <option value="Khoa Luật">Khoa Luật</option>
                                <option value="Khoa Tiếng Anh thương mại">Khoa Tiếng Anh thương mại</option>
                                <option value="Khoa Tiếng Nhật">Khoa Tiếng Nhật</option>
                                <option value="Khoa Tiếng Pháp">Khoa Tiếng Pháp</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="schoolYear">Khóa *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="text" id="schoolYear" required onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="program">Chương trình</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="text" id="program" onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="address">Địa chỉ</label>
                            <textarea className="border border-gray-300 w-full p-2 round-sm" id="address" rows={3} onChange={handleChange}></textarea>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email">Email *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="email" id="email" required onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone">Số điện thoại *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="tel" id="phone" required onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="status">Tình trạng sinh viên *</label>
                            <select className="border border-gray-300 w-full p-2 round-sm" id="status" required onChange={handleChange}>
                                <option value="Đang học">Đang học</option>
                                <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                                <option value="Đã thôi học">Đã thôi học</option>
                                <option value="Tạm dừng học">Tạm dừng học</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 mt-5 flex gap-4">
                        <button type="submit" className="py-2 px-4 bg-green-500 text-white cursor-pointer">Lưu</button>
                        <button type="button" className="py-2 px-4 bg-red-500 text-white cursor-pointer" onClick={onClose}>Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
