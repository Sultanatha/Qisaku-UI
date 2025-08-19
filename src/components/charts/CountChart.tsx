"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  {
    name: "Sisa",
    count: 20,
    fill: "#daeef0",
  },
  {
    name: "Sapu",
    count: 30,
    fill: "#FAE27C",
  },
  {
    name: "Pemanggang",
    count: 20,
    fill: "#C3EBFA",
  },
  {
    name: "Kasur",
    count: 30,
    fill: "#85b57f",
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const CountChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-md font-semibold">Stok Berdasarkan Kategori</h1>
        {/* <Image src="/moreDark.png" alt="" width={20} height={20} /> */}
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%] ">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={2}
              dataKey={(data) => data.count}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
          80%
        </div>
        {/* <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        /> */}
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">30</h1>
          <h2 className="text-xs text-gray-300">Sapu (30%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">20</h1>
          <h2 className="text-xs text-gray-300">Pemanggang (20%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaGreen rounded-full" />
          <h1 className="font-bold">30</h1>
          <h2 className="text-xs text-gray-300">Kasur (30%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaCool rounded-full" />
          <h1 className="font-bold">20</h1>
          <h2 className="text-xs text-gray-300">Sisa (20%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
