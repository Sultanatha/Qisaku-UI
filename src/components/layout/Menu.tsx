"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { role } from "@/lib/utils/data/data";
import { logout } from "@/lib/utils/services/auth";
import * as Icons from "lucide-react";
import { api } from "@/lib/utils/services/api";

// Interface untuk API response
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
  title: string;
  items: MenuItem[];
}

// Fungsi untuk mendapatkan icon component berdasarkan nama string
const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.HelpCircle;
};

// Transform API data ke format yang dibutuhkan komponen
const transformApiData = (apiData: ApiMenuItem[]): MenuSection[] => {
  const parentMenus = apiData.filter((item) => item.menus_parent_id === null);
  const childMenus = apiData.filter((item) => item.menus_parent_id !== null);

  if (parentMenus.length > 0) {
    return parentMenus.map((parent) => ({
      title: parent.menus_name.toUpperCase(),
      items: childMenus
        .filter((child) => child.menus_parent_id === parent.menus_id)
        .filter((child) => child.menus_stat) // Hanya yang aktif
        .map((child) => ({
          icon: child.menus_icon,
          label: child.menus_name,
          href: child.menus_path,
          action:
            child.menus_name.toLowerCase() === "logout" ? "logout" : undefined,
          visible: ["admin", "teacher", "student", "parent"], // Default visibility
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
      title: "MENU",
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

  // Fetch menu data dari API
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

  if (loading) {
    return (
      <div className="mt-4 text-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && menuItems.length === 0) {
    return (
      <div className="mt-4 text-sm">
        <div className="text-red-500 text-xs mb-2">
          Failed to load menu: {error}
        </div>
        <div className="text-gray-500 text-xs">Using fallback menu...</div>
      </div>
    );
  }

  return (
    <div className="mt-4 text-sm">
      {menuItems && menuItems.length > 0 ? (
        menuItems.map((section, sectionIndex) => (
          <div
            className="flex flex-col gap-2"
            key={section.title || `section-${sectionIndex}`}
          >
            <span className="hidden lg:block text-gray-400 font-light my-4">
              {section.title}
            </span>
            {section.items && section.items.length > 0 ? (
              section.items.map((item, itemIndex) => {
                // Check visibility
                if (!item.visible || !item.visible.includes(role)) {
                  return null;
                }

                const IconComponent = getIconComponent(item.icon);
                const key = `${item.label}-${itemIndex}`;

                return item.action ? (
                  <button
                    key={key}
                    onClick={() => handleAction(item.action!)}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight w-full text-left"
                  >
                    <IconComponent size={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href || "/"}
                    key={key}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                  >
                    <IconComponent size={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              })
            ) : (
              <div className="text-gray-400 text-xs">No menu items</div>
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-400 text-xs">No menu available</div>
      )}
    </div>
  );
};

export default Menu;
