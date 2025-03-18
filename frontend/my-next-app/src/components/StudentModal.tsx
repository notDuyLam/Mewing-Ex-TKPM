export default function StudentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div id="studentModal" className="fixed z-10 inset-0 overflow-y-auto w-full h-full bg-black/50">
            <div className="bg-white my-16 mx-auto border border-gray-300 rounded-md w-4/5 p-10">
                <span className="text-2xl font-bold cursor-pointer float-end" onClick={onClose}>&times;</span>
                <h2 id="modalTitle" className="text-2xl font-bold mb-4">Thêm sinh viên mới</h2>

                <form id="studentForm">
                    <input className="border border-gray-300 w-full p-2 round-sm" type="hidden" id="editMode" value="false"/>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="id">Mã số sinh viên *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="text" id="id" required/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="fullName">Họ tên *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="text" id="name" required/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="dob">Ngày tháng năm sinh *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="date" id="dob" required/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="gender">Giới tính *</label>
                            <select className="border border-gray-300 w-full p-2 round-sm" id="gender" required>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="faculty">Khoa *</label>
                            <select className="border border-gray-300 w-full p-2 round-sm" id="faculty" required>
                                <option value="Khoa Luật">Khoa Luật</option>
                                <option value="Khoa Tiếng Anh thương mại">Khoa Tiếng Anh thương mại</option>
                                <option value="Khoa Tiếng Nhật">Khoa Tiếng Nhật</option>
                                <option value="Khoa Tiếng Pháp">Khoa Tiếng Pháp</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="schoolYear">Khóa *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="text" id="schoolYear" required/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="program">Chương trình</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="text" id="program"/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="address">Địa chỉ</label>
                            <textarea className="border border-gray-300 w-full p-2 round-sm" id="address" rows={3} ></textarea>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email">Email *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="email" id="email" required/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone">Số điện thoại *</label>
                            <input className="border border-gray-300 w-full p-2 round-sm" type="tel" id="phone" required/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="status">Tình trạng sinh viên *</label>
                            <select className="border border-gray-300 w-full p-2 round-sm" id="status" required>
                                <option value="Đang học">Đang học</option>
                                <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                                <option value="Đã thôi học">Đã thôi học</option>
                                <option value="Tạm dừng học">Tạm dừng học</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 mt-5 flex gap-4">
                        <button type="submit" className="py-2 px-4 bg-green-500 text-white cursor-pointer">Lưu</button>
                        <button type="button" className="py-2 px-4 bg-red-500 text-white cursor-pointer" id="cancelBtn">Hủy</button>
                    </div>
                </form>
            </div>
    </div>
  );
}
