"use client";
import React, { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";

const InventoryCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Hari ini");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const periods = ["Hari ini", "Minggu ini", "Bulan ini"];

  return (
    <div className=" flex-1 min-w-[200px] mx-auto rounded-2xl bg-gradient-to-r p-6 ">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard Inventory</h1>
              <p className="">Kelola stok dan inventaris dengan mudah</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Custom Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-white/20 backdrop-blur-md  border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center gap-2 min-w-[120px] justify-between hover:bg-white/30 transition-colors duration-200"
                >
                  {selectedPeriod}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full  rounded-lg shadow-lg border border-gray-500 z-10">
                    {periods.map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-150 ${
                          selectedPeriod === period
                            ? "bg-purple-50 text-purple-600"
                            : "text-gray-700"
                        } ${period === periods[0] ? "rounded-t-lg" : ""} ${
                          period === periods[periods.length - 1]
                            ? "rounded-b-lg"
                            : ""
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Product Button */}
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-purple-50 transition-colors duration-200 shadow-md">
                <Plus className="w-4 h-4" />
                Tambah Produk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
