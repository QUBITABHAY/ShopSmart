import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Shield,
  User,
  XCircle,
  Mail,
  Calendar,
} from "lucide-react";
import { userService } from "../../services/user.service";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUpdating, setIsUpdating] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAll({
        page,
        search: searchTerm,
        limit: 10,
      });
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "CUSTOMER" ? "ADMIN" : "CUSTOMER";
    setIsUpdating(userId);
    try {
      await userService.updateRole(userId, newRole);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (error) {
      console.error("Error updating user role:", error);
      alert(error.response?.data?.message || "Failed to update user role");
    } finally {
      setIsUpdating(null);
    }
  };

  if (currentUser?.role !== "MASTER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">
          Access Denied
        </h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
          You do not have the required permissions to access User Management.
          This section is restricted to Master Administrators only.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95 font-heading"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage customer accounts and administrative privileges.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full sm:w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-6 py-8">
                        <div className="h-10 bg-gray-100 rounded-lg"></div>
                      </td>
                    </tr>
                  ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border text-lg font-bold",
                            user.role === "MASTER_ADMIN"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : user.role === "ADMIN"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-gray-100 text-gray-500",
                          )}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            ID: {user.id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-xs text-gray-500">
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.role === "MASTER_ADMIN" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                            <Shield className="w-3.5 h-3.5" />
                            Master Admin
                          </span>
                        ) : user.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <Shield className="w-3.5 h-3.5" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
                            <User className="w-3.5 h-3.5" />
                            Customer
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        {currentUser?.role === "MASTER_ADMIN" &&
                          user.role !== "MASTER_ADMIN" && (
                            <button
                              onClick={() =>
                                handleRoleToggle(user.id, user.role)
                              }
                              disabled={isUpdating === user.id}
                              className={cn(
                                "btn-sm flex items-center gap-2",
                                user.role === "ADMIN"
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-primary hover:bg-primary/5",
                              )}
                            >
                              {isUpdating === user.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              ) : user.role === "ADMIN" ? (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="w-4 h-4" />
                                  Make Admin
                                </>
                              )}
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-gray-900 font-bold">
                        No users found
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Try adjusting your search terms.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing page{" "}
              <span className="font-semibold text-gray-900">{page}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border rounded-xl text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 transition-all font-heading shadow-sm"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded-xl text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 transition-all font-heading shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
