"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Vault,
  ArrowUp,
  ArrowDown,
  User,
} from "lucide-react";
import { api } from "@/lib/utils/services/api";
import { formatDate } from "@/lib/utils/format/format";
import { SortDirection, useTableData } from "@/lib/hooks/useTableData";
import { handleSort } from "@/lib/utils/table/tableUtils";

interface ApiRolePermissionItem {
  id: number;
  role: string;
  permission: string;
  status: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiRolePermissionItem[]; // langsung array
}

interface RolePermissionItem {
  id: number;
  role: string;
  permission: string;
  status: string;
  createdAt: string;
}

interface GroupedRolePermissionItem {
  role: string;
  permission: string[];
  status: string;
  createdAt: string;
}

const groupPermissionsByRole = (
  data: RolePermissionItem[]
): GroupedRolePermissionItem[] => {
  const grouped: Record<string, GroupedRolePermissionItem> = {};

  data.forEach((item) => {
    if (!grouped[item.role]) {
      grouped[item.role] = {
        role: item.role,
        permission: [item.permission],
        status: item.status,
        createdAt: item.createdAt,
      };
    } else {
      if (!grouped[item.role].permission.includes(item.permission)) {
        grouped[item.role].permission.push(item.permission);
      }

      // Optional: update createdAt to earliest date if needed
      const currentCreated = new Date(grouped[item.role].createdAt);
      const incomingCreated = new Date(item.createdAt);
      if (incomingCreated < currentCreated) {
        grouped[item.role].createdAt = item.createdAt;
      }
    }
  });

  return Object.values(grouped);
};

const transformApiData = (
  apiData: ApiRolePermissionItem[]
): RolePermissionItem[] => {
  return apiData.map((item) => ({
    id: item.id,
    role: item.role ?? "Unknown",
    permission: item.permission ?? "Unknown",
    status: item.status ? "Active" : "Inactive",
    createdAt: item.createdAt,
  }));
};

export default function RolePermission() {
  const [data, setData] = useState<GroupedRolePermissionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] =
    useState<keyof GroupedRolePermissionItem>("role");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        setLoading(true);
        setError(null);

        const cachedData = localStorage.getItem("permission_roles_cache");

        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          const grouped = groupPermissionsByRole(parsedData);
          setData(grouped);
          setLoading(false);
          return;
        }

        const response: ApiResponse = await api.get("/permission-roles");

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "API returned unsuccessful response"
          );
        }

        // const apiData: ApiRolePermissionItem[] = Array.isArray(response.data)
        //   ? response.data
        //   : [response.data];

        const apiData = transformApiData(response.data);
        localStorage.setItem("permission_roles_cache", JSON.stringify(apiData));
        const grouped = groupPermissionsByRole(apiData);
        setData(grouped);
      } catch (error) {
        console.error("Error fetching user roles:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, []);

  const { paginatedData, totalPages } = useTableData(data, {
    searchTerm,
    searchFields: ["role", "permission", "status"],
    sortField,
    sortDirection,
    currentPage,
    pageSize,
  });

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 items-center">
                {/* <Vault className="mr-3 h-8 w-8 text-blue-600" /> */}
                Role Permission
              </h1>
              <p className="text-gray-600 mt-2">
                Manage user roles and permissions
              </p>
            </div>
            <button
              //   onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Role & Permission</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Table Header with Search */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Role Permission ({data.length})
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {useTableData.length} shown
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-80"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center space-x-1 font-semibold text-gray-900 hover:text-blue-600"
                      onClick={() =>
                        handleSort(
                          "role",
                          sortField,
                          setSortField,
                          sortDirection,
                          setSortDirection
                        )
                      }
                    >
                      <span>Role</span>
                      {getSortIcon("role")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center space-x-1 font-semibold text-gray-900 hover:text-blue-600"
                      onClick={() =>
                        handleSort(
                          "permission",
                          sortField,
                          setSortField,
                          sortDirection,
                          setSortDirection
                        )
                      }
                    >
                      <span>Permission</span>
                      {getSortIcon("permission")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center space-x-1 font-semibold text-gray-900 hover:text-blue-600"
                      onClick={() =>
                        handleSort(
                          "status",
                          sortField,
                          setSortField,
                          sortDirection,
                          setSortDirection
                        )
                      }
                    >
                      <span>Status</span>
                      {getSortIcon("status")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center space-x-1 font-semibold text-gray-900 hover:text-blue-600"
                      onClick={() =>
                        handleSort(
                          "createdAt",
                          sortField,
                          setSortField,
                          sortDirection,
                          setSortDirection
                        )
                      }
                    >
                      <span>Created At</span>
                      {getSortIcon("createdAt")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((i) => (
                  <tr
                    key={i.role}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {i.role.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {i.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {i.permission.map((perm) => (
                          <span
                            key={perm}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          i.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 mr-1 rounded-full ${
                            i.status === "Active"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        ></span>
                        {i.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-500 text-sm">
                        {formatDate(i.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
