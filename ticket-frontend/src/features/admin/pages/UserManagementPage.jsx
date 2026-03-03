import React, { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import AdminUsersTable from "../components/AdminTicketsTable";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft,UserPlus } from "lucide-react";
import CreateAdminModal from "../components/CreateAdminModel";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
      alert(error.response?.data?.message || error.response?.data || "Failed to delete user");
    }
  };

return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-slate-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              User Management
            </h1>
            <p className="text-slate-500 mt-1">
              Manage system access and roles.
            </p>
          </div>
        </div>

        {/* Button to open the Modal */}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add New Admin
        </Button>
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <AdminUsersTable
          users={users}
          loading={loading}
          onDelete={handleDeleteUser}
        />
      </div>

      {/* Modal Component */}
      <CreateAdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchUsers} // Refreshes the table when a new admin is created
      />
    </div>
  );
};

export default UserManagementPage;
