"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { role } from "@/lib/utils/data/data";
import { logout } from "@/lib/utils/services/auth";
import * as Icons from "lucide-react";
import { api } from "@/lib/utils/services/api";
import { usePathname } from "next/navigation"; // ✅ untuk highlight menu aktif

interface ApiMenuItem {
  menus_id: number;
  menus_name: string;
  menus_icon: string;
  menus_path: string;
  menus_parent_id: number | null;
  menus_order: number;
  menus_stat: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiMenuItem | ApiMenuItem[];
}

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  action?: string;
  visible: string[];
}

interface MenuSection {
  id: number;
  title: string;
  icon: string; // ✅ tambahkan icon parent
  items: MenuItem[];
}

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.HelpCircle;
};

const transformApiData = (apiData: ApiMenuItem[]): MenuSection[] => {
  const parentMenus = apiData.filter((item) => item.menus_parent_id === null);
  const childMenus = apiData.filter((item) => item.menus_parent_id !== null);

  if (parentMenus.length > 0) {
    return parentMenus.map((parent) => ({
      id: parent.menus_id,
      title: parent.menus_name,
      icon: parent.menus_icon, // ✅ simpan icon parent
      items: childMenus
        .filter((child) => child.menus_parent_id === parent.menus_id)
        .filter((child) => child.menus_stat)
        .map((child) => ({
          icon: child.menus_icon,
          label: child.menus_name,
          href: child.menus_path,
          action:
            child.menus_name.toLowerCase() === "logout" ? "logout" : undefined,
          visible: ["admin", "teacher", "student", "parent"],
        }))
        .sort((a, b) => {
          const orderA =
            childMenus.find((c) => c.menus_name === a.label)?.menus_order || 0;
          const orderB =
            childMenus.find((c) => c.menus_name === b.label)?.menus_order || 0;
          return orderA - orderB;
        }),
    }));
  }

  return [
    {
      id: 0,
      title: "MENU",
      icon: "Folder", // fallback default
      items: apiData
        .filter((item) => item.menus_stat)
        .map((item) => ({
          icon: item.menus_icon,
          label: item.menus_name,
          href: item.menus_path,
          action:
            item.menus_name.toLowerCase() === "logout" ? "logout" : undefined,
          visible: ["admin", "teacher", "student", "parent"],
        }))
        .sort((a, b) => {
          const orderA =
            apiData.find((i) => i.menus_name === a.label)?.menus_order || 0;
          const orderB =
            apiData.find((i) => i.menus_name === b.label)?.menus_order || 0;
          return orderA - orderB;
        }),
    },
  ];
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<number[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result: ApiResponse = await api.get("/menus");

        if (!result.success) {
          throw new Error(
            result.message || "API returned unsuccessful response"
          );
        }

        let apiData: ApiMenuItem[];

        if (Array.isArray(result.data)) {
          apiData = result.data;
        } else if (result.data) {
          apiData = [result.data];
        } else {
          throw new Error("No data received from API");
        }

        const transformedData = transformApiData(apiData);
        setMenuItems(transformedData);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case "logout":
        logout();
        break;
      default:
        console.log("Unknown action:", actionType);
    }
  };

  const toggleSection = (id: number) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="mt-4 text-sm text-gray-300">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && menuItems.length === 0) {
    return (
      <div className="mt-4 text-sm text-red-400">
        Failed to load menu: {error}
      </div>
    );
  }

  return (
    <div className="mt-4 text-sm text-gray-300">
      {menuItems.length > 0 ? (
        menuItems.map((section) => {
          const isOpen = openSections.includes(section.id);

          return (
            <div key={section.id} className="flex flex-col gap-2">
              {/* Parent */}
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <div className="flex items-center gap-2">
                  {/* Icon parent */}
                  {(() => {
                    const IconComp = getIconComponent(section.icon);
                    return <IconComp size={18} />;
                  })()}

                  {/* Label parent → hidden di layar kecil */}
                  <span className="font-medium uppercase tracking-wide hidden md:inline">
                    {section.title}
                  </span>
                </div>

                {/* Chevron toggle */}
                {isOpen ? (
                  <Icons.ChevronUp size={16} />
                ) : (
                  <Icons.ChevronDown size={16} />
                )}
              </button>

              {/* Child menu */}
              {isOpen && (
                <div className="ml-4 flex flex-col gap-1">
                  {section.items.length > 0 ? (
                    section.items.map((item, idx) => {
                      if (!item.visible || !item.visible.includes(role)) {
                        return null;
                      }

                      const IconComponent = getIconComponent(item.icon);
                      const isActive = pathname === item.href;

                      return item.action ? (
                        <button
                          key={idx}
                          onClick={() => handleAction(item.action!)}
                          className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-white"
                          }`}
                        >
                          <IconComponent size={18} />
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        <Link
                          key={idx}
                          href={item.href || "/"}
                          className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-white"
                          }`}
                        >
                          <IconComponent size={18} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 text-xs ml-2">
                      No menu items
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-gray-500 text-xs">No menu available</div>
      )}
    </div>
  );
};

export default Menu;
