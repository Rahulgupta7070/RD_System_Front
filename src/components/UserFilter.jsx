import React, { useState } from "react";
import { FiFilter } from "react-icons/fi";

const UserFilter = ({ onApply }) => {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("amount");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const applyFilter = () => {
    onApply(filters);
    setShow(false);
  };

  const resetFilter = () => {
    const reset = {
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    };
    setFilters(reset);
    onApply(reset);
  };

  return (
    <div className="relative">

      {/* 🔥 FILTER BUTTON */}
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 
        text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 
        px-4 py-2 rounded-xl shadow hover:scale-105 transition"
      >
        <FiFilter className="text-blue-500" />
        <span>Filter</span>
      </button>

      {/* 🔥 FILTER PANEL */}
      {show && (
        <div className="absolute right-0 mt-2 w-[320px] z-[9999]
          bg-white dark:bg-gray-800 
          text-gray-800 dark:text-white
          border border-gray-200 dark:border-gray-700 
          shadow-2xl rounded-xl p-4 backdrop-blur-lg">

          {/* TABS */}
          <div className="flex mb-4 border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("amount")}
              className={`flex-1 p-2 text-sm ${
                activeTab === "amount"
                  ? "border-b-2 border-blue-500 font-semibold text-blue-500"
                  : "text-gray-500"
              }`}
            >
              Amount
            </button>

            <button
              onClick={() => setActiveTab("date")}
              className={`flex-1 p-2 text-sm ${
                activeTab === "date"
                  ? "border-b-2 border-blue-500 font-semibold text-blue-500"
                  : "text-gray-500"
              }`}
            >
              Date
            </button>
          </div>

          {/* AMOUNT FILTER */}
          {activeTab === "amount" && (
            <div className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="Min Amount"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters({ ...filters, minAmount: e.target.value })
                }
                className="bg-gray-100 dark:bg-gray-700 
                border border-gray-300 dark:border-gray-600 
                px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Max Amount"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters({ ...filters, maxAmount: e.target.value })
                }
                className="bg-gray-100 dark:bg-gray-700 
                border border-gray-300 dark:border-gray-600 
                px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* DATE FILTER */}
          {activeTab === "date" && (
            <div className="flex flex-col gap-3">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="bg-gray-100 dark:bg-gray-700 
                border border-gray-300 dark:border-gray-600 
                px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="bg-gray-100 dark:bg-gray-700 
                border border-gray-300 dark:border-gray-600 
                px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-between mt-5 gap-2">

            <button
              onClick={applyFilter}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 
              text-white py-2 rounded-lg hover:scale-105 transition"
            >
              Apply
            </button>

            <button
              onClick={resetFilter}
              className="flex-1 bg-gray-300 dark:bg-gray-700 
              text-black dark:text-white py-2 rounded-lg hover:scale-105 transition"
            >
              Reset
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilter;