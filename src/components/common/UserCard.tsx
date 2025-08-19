"use client";
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Package,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend: number;
  trendType: "up" | "down";
  icon?: "package" | "alert" | "money" | "stock";
  color?: string;
}

const icons = {
  package: <Package className="w-6 h-6" />,
  alert: <AlertTriangle className="w-6 h-6" />,
  money: <span className="text-lg font-bold">Rp</span>,
  stock: <Package className="w-6 h-6" />,
};

const UserCard = ({
  title,
  value,
  unit,
  trend,
  trendType,
  icon = "package",
  color = "bg-blue-500",
}: StatCardProps) => {
  return (
    <div className="rounded-2xl bg-white p-6 flex-1 min-w-[250px] shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl ${color} text-white`}
      >
        {icons[icon]}
      </div>
      <h2 className="text-sm font-medium text-gray-600 mt-4">{title}</h2>
      <h1 className="text-2xl font-bold text-gray-900 mt-1">
        {value}{" "}
        <span className="text-base font-medium text-gray-500">{unit}</span>
      </h1>
      <div
        className={`flex items-center gap-1 text-sm font-medium mt-2 ${
          trendType === "up" ? "text-green-600" : "text-red-600"
        }`}
      >
        {trendType === "up" ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        <span>{trend}% dari minggu lalu</span>
      </div>
    </div>
  );
};

export default UserCard;
