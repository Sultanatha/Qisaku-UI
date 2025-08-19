"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", barangmasuk: 4000, barangkeluar: 2400 },
  { name: "Tue", barangmasuk: 3000, barangkeluar: 1398 },
  { name: "Wed", barangmasuk: 2000, barangkeluar: 9800 },
  { name: "Thu", barangmasuk: 2780, barangkeluar: 3908 },
  { name: "Fri", barangmasuk: 1890, barangkeluar: 4800 },
];

const AttadanceChart = () => {
  return (
    <div className="bg-white rounded-lg w-full h-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Pergerakan Stok</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#F97316" stopOpacity={0.5} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#9ca3af" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#9ca3af" }} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              borderColor: "lightgray",
              backgroundColor: "white",
            }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />

          {/* Barang Masuk (Hijau) */}
          <Bar
            dataKey="barangmasuk"
            name="Barang Masuk"
            fill="url(#greenGradient)"
            legendType="circle"
            radius={[10, 10, 0, 0]}
            activeBar={{ fill: "#16a34a" }} // Hover effect
          />

          {/* Barang Keluar (Oranye) */}
          <Bar
            dataKey="barangkeluar"
            name="Barang Keluar"
            fill="url(#orangeGradient)"
            legendType="circle"
            radius={[10, 10, 0, 0]}
            activeBar={{ fill: "#ea580c" }} // Hover effect
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttadanceChart;
