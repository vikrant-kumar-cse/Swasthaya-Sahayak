import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, UserCheck, Trash2, RefreshCw } from "lucide-react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/all-users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:8080/auth/update-role/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      } else {
        alert("Failed to update role");
      }
    } catch (err) {
      alert("Server error while updating role");
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      const response = await fetch(
        `http://localhost:8080/auth/delete-user/${userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      alert("Server error while deleting user");
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const stats = {
    total: users.length,
    experts: users.filter((u) => u.role === "medical expert").length,
    patients: users.filter((u) => u.role === "patient").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0f7fa] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#00796b] animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-[#004d40]">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e0f7fa] flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 rounded-2xl shadow-lg">
          <p className="text-xl font-semibold text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f7fa] to-[#b2ebf2] p-4 md:p-8 mt-[100px] md:mt-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-12 h-12 text-[#004d40]" />
            <h1 className="text-4xl md:text-5xl font-bold text-[#004d40] font-['Roboto Slab']">
              User Management
            </h1>
          </div>
          <p className="text-lg text-[#004d40]/80 max-w-2xl mx-auto">
            Manage user roles and permissions for your health platform
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#00acc1]/20 rounded-full">
                <Users className="w-8 h-8 text-[#00796b]" />
              </div>
              <div>
                <p className="text-sm text-[#004d40]/70">Total Users</p>
                <p className="text-3xl font-bold text-[#004d40]">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-[#004d40]/70">Medical Experts</p>
                <p className="text-3xl font-bold text-[#004d40]">{stats.experts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-[#004d40]/70">Patients</p>
                <p className="text-3xl font-bold text-[#004d40]">{stats.patients}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#00acc1] focus:ring-2 focus:ring-[#00acc1]/20 focus:outline-none transition-all"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-x-auto border border-white/20"
        >
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No users found</p>
              {searchTerm && (
                <p className="text-gray-500 mt-2">Try adjusting your search</p>
              )}
            </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-[#00acc1]/20 to-[#00796b]/20">
                  <th className="py-4 px-6 text-left font-semibold text-[#004d40]">Name</th>
                  <th className="py-4 px-6 text-left font-semibold text-[#004d40]">Email</th>
                  <th className="py-4 px-6 text-left font-semibold text-[#004d40]">Role</th>
                  <th className="py-4 px-6 text-left font-semibold text-[#004d40]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b border-gray-200/50 hover:bg-white/50 transition-colors ${
                      user.role === "medical expert" ? "bg-gradient-to-r from-green-50/50 to-transparent" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00acc1] to-[#00796b] flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#004d40]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#004d40]">{user.email}</td>
                    <td className="py-4 px-6">
                      <div className="relative">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="appearance-none bg-white/80 border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:border-[#00acc1] focus:ring-2 focus:ring-[#00acc1]/20 focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="patient" className="text-gray-700">Patient</option>
                          <option value="medical expert" className="text-green-600 font-medium">Medical Expert</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center text-sm text-[#004d40]/70"
        >
          <p>
            Medical Experts have elevated privileges and can provide verified health advice.
            All role changes are logged for security purposes.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AllUsers;