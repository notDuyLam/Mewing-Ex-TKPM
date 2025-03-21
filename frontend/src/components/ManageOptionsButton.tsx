// components/ManageOptionsButton.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

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

interface ManageOptionsButtonProps {
  onOptionsUpdated: () => void;
}

export default function ManageOptionsButton({ onOptionsUpdated }: ManageOptionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newProgram, setNewProgram] = useState("");
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [editStatus, setEditStatus] = useState<Status | null>(null);
  const [editProgram, setEditProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      const [deptRes, statusRes, progRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/`, { method: "GET" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/statuses/`, { method: "GET" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/`, { method: "GET" }),
      ]);

      if (!deptRes.ok || !statusRes.ok || !progRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const departmentsData = await deptRes.json();
      const statusesData = await statusRes.json();
      const programsData = await progRes.json();

      setDepartments(departmentsData);
      setStatuses(statusesData);
      setPrograms(programsData);
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error("Failed to load options");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Thêm mới
  const handleAdd = async (type: "department" | "status" | "program") => {
    setIsLoading(true);
    let url = "";
    let data = {};
    let setNewValue: (value: string) => void;

    switch (type) {
      case "department":
        if (!newDepartment.trim()) {
          toast.error("Tên khoa không được để trống");
          setIsLoading(false);
          return;
        }
        url = `${process.env.NEXT_PUBLIC_API_URL}/departments/`;
        data = { name: newDepartment };
        setNewValue = setNewDepartment;
        break;
      case "status":
        if (!newStatus.trim()) {
          toast.error("Tên trạng thái không được để trống");
          setIsLoading(false);
          return;
        }
        url = `${process.env.NEXT_PUBLIC_API_URL}/statuses/`;
        data = { name: newStatus };
        setNewValue = setNewStatus;
        break;
      case "program":
        if (!newProgram.trim()) {
          toast.error("Tên chương trình không được để trống");
          setIsLoading(false);
          return;
        }
        url = `${process.env.NEXT_PUBLIC_API_URL}/programs/`;
        data = { name: newProgram };
        setNewValue = setNewProgram;
        break;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || `Failed to add ${type}`);
        return;
      }

      setNewValue("");
      await fetchData(); // Làm mới toàn bộ danh sách
      onOptionsUpdated();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`);
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Chỉnh sửa
  const handleEdit = async (type: "department" | "status" | "program") => {
    setIsLoading(true);
    let url = "";
    let data: Department | Status | Program | null = null;

    switch (type) {
      case "department":
        if (!editDepartment?.name.trim()) {
          toast.error("Tên khoa không được để trống");
          setIsLoading(false);
          return;
        }
        url = `${process.env.NEXT_PUBLIC_API_URL}/departments/${editDepartment?.id}`;
        data = editDepartment;
        break;
      case "status":
        if (!editStatus?.name.trim()) {
          toast.error("Tên trạng thái không được để trống");
          setIsLoading(false);
          return;
        }
        url = `${process.env.NEXT_PUBLIC_API_URL}/statuses/${editStatus?.id}`;
        data = editStatus;
        break;
      case "program":
        if (!editProgram?.name.trim()) {
          toast.error("Tên chương trình không được để trống");
          setIsLoading(false);
          return;
        }
        url = `${process.env.NEXT_PUBLIC_API_URL}/programs/${editProgram?.id}`;
        data = editProgram;
        break;
    }

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || `Failed to update ${type}`);
        return;
      }

      await fetchData(); // Làm mới toàn bộ danh sách
      setEditDepartment(null);
      setEditStatus(null);
      setEditProgram(null);
      onOptionsUpdated();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Quản lý Tùy chọn</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>Quản lý Khoa, Trạng thái, Chương trình</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6">
          {/* Khoa */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Khoa</h3>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Tên khoa mới"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleAdd("department")}
                disabled={isLoading}
              >
                Thêm
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between py-1"
                >
                  {editDepartment?.id === dept.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editDepartment.name}
                        onChange={(e) =>
                          setEditDepartment({ ...editDepartment, name: e.target.value })
                        }
                        className="flex-grow"
                        disabled={isLoading}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleEdit("department")}
                        disabled={isLoading}
                      >
                        Lưu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditDepartment(null)}
                        disabled={isLoading}
                      >
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span>{dept.name}</span>
                      <Pencil
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => setEditDepartment(dept)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Trạng thái</h3>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Tên trạng thái mới"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={() => handleAdd("status")} disabled={isLoading}>
                Thêm
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {statuses.map((status) => (
                <div
                  key={status.id}
                  className="flex items-center justify-between py-1"
                >
                  {editStatus?.id === status.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editStatus.name}
                        onChange={(e) =>
                          setEditStatus({ ...editStatus, name: e.target.value })
                        }
                        className="flex-grow"
                        disabled={isLoading}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleEdit("status")}
                        disabled={isLoading}
                      >
                        Lưu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditStatus(null)}
                        disabled={isLoading}
                      >
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span>{status.name}</span>
                      <Pencil
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => setEditStatus(status)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chương trình */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Chương trình</h3>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Tên chương trình mới"
                value={newProgram}
                onChange={(e) => setNewProgram(e.target.value)}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleAdd("program")}
                disabled={isLoading}
              >
                Thêm
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {programs.map((prog) => (
                <div
                  key={prog.id}
                  className="flex items-center justify-between py-1"
                >
                  {editProgram?.id === prog.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editProgram.name}
                        onChange={(e) =>
                          setEditProgram({ ...editProgram, name: e.target.value })
                        }
                        className="flex-grow"
                        disabled={isLoading}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleEdit("program")}
                        disabled={isLoading}
                      >
                        Lưu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditProgram(null)}
                        disabled={isLoading}
                      >
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span>{prog.name}</span>
                      <Pencil
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => setEditProgram(prog)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}