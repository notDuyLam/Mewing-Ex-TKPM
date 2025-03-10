document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const studentForm = document.getElementById('studentForm');
    const studentTable = document.getElementById('studentTable');
    const studentList = document.getElementById('studentList');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const studentModal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const editMode = document.getElementById('editMode');
    const notification = document.getElementById('notification');

    // Load students
    loadStudents();

    // Event Listeners
    addStudentBtn.addEventListener('click', openAddStudentModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    studentForm.addEventListener('submit', saveStudent);
    searchBtn.addEventListener('click', searchStudents);
    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            searchStudents();
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === studentModal) {
            closeModal();
        }
    });

    // Functions
    function loadStudents(filteredStudents) {
        // Clear current list
        studentList.innerHTML = '';

        // Use filtered list or all students
        const studentsToDisplay = filteredStudents || students;

        if (studentsToDisplay.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="8" style="text-align: center;">Không có sinh viên nào</td>';
            studentList.appendChild(emptyRow);
            return;
        }

        // Add each student to the table
        studentsToDisplay.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.mssv}</td>
                <td>${student.fullName}</td>
                <td>${formatDate(student.dob)}</td>
                <td>${student.gender}</td>
                <td>${student.faculty}</td>
                <td>${student.class}</td>
                <td>${student.status}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${student.mssv}">Sửa</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${student.mssv}">Xóa</button>
                </td>
            `;
            studentList.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const mssv = this.getAttribute('data-id');
                editStudent(mssv);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const mssv = this.getAttribute('data-id');
                deleteStudent(mssv);
            });
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    function openAddStudentModal() {
        modalTitle.textContent = 'Thêm sinh viên mới';
        editMode.value = 'false';
        studentForm.reset();
        studentModal.style.display = 'block';
        document.getElementById('mssv').removeAttribute('readonly');
    }

    function closeModal() {
        studentModal.style.display = 'none';
    }

    function saveStudent(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        const isEditMode = editMode.value === 'true';
        const studentData = {
            mssv: document.getElementById('mssv').value,
            fullName: document.getElementById('fullName').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            faculty: document.getElementById('faculty').value,
            class: document.getElementById('class').value,
            program: document.getElementById('program').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            status: document.getElementById('status').value
        };

        if (isEditMode) {
            // Update existing student
            const index = students.findIndex(s => s.mssv === studentData.mssv);
            if (index !== -1) {
                students[index] = studentData;
                showNotification('Thông tin sinh viên đã được cập nhật thành công!', 'success');
            }
        } else {
            // Check if MSSV already exists
            if (students.some(s => s.mssv === studentData.mssv)) {
                showNotification('Mã số sinh viên đã tồn tại!', 'error');
                return;
            }

            // Add new student
            students.push(studentData);
            showNotification('Sinh viên mới đã được thêm thành công!', 'success');
        }

        // Save to localStorage and update the table
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
        closeModal();
    }

    function validateForm() {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = document.getElementById('email').value;
        if (!emailRegex.test(email)) {
            showNotification('Email không hợp lệ!', 'error');
            return false;
        }

        // Validate phone number (Vietnam phone number format)
        const phoneRegex = /^(0|\+84)(\d{9,10})$/;
        const phone = document.getElementById('phone').value;
        if (!phoneRegex.test(phone)) {
            showNotification('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam hợp lệ (VD: 0912345678 hoặc +84912345678)', 'error');
            return false;
        }

        return true;
    }

    function editStudent(mssv) {
        const student = students.find(s => s.mssv === mssv);
        if (student) {
            modalTitle.textContent = 'Cập nhật thông tin sinh viên';
            editMode.value = 'true';

            // Fill the form with student data
            document.getElementById('mssv').value = student.mssv;
            document.getElementById('mssv').setAttribute('readonly', true);
            document.getElementById('fullName').value = student.fullName;
            document.getElementById('dob').value = student.dob;
            document.getElementById('gender').value = student.gender;
            document.getElementById('faculty').value = student.faculty;
            document.getElementById('class').value = student.class;
            document.getElementById('program').value = student.program || '';
            document.getElementById('address').value = student.address || '';
            document.getElementById('email').value = student.email;
            document.getElementById('phone').value = student.phone;
            document.getElementById('status').value = student.status;

            studentModal.style.display = 'block';
        }
    }

    function deleteStudent(mssv) {
        if (confirm('Bạn có chắc muốn xóa sinh viên này?')) {
            students = students.filter(s => s.mssv !== mssv);
            localStorage.setItem('students', JSON.stringify(students));
            loadStudents();
            showNotification('Sinh viên đã được xóa thành công!', 'success');
        }
    }

    function searchStudents() {
        const searchValue = searchInput.value.toLowerCase();

        if (!searchValue.trim()) {
            loadStudents();
            return;
        }

        const filteredStudents = students.filter(student => {
            return student.mssv.toLowerCase().includes(searchValue) ||
                student.fullName.toLowerCase().includes(searchValue);
        });

        loadStudents(filteredStudents);
    }

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hide');

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('hide');
        }, 3000);
    }
});
