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

      {/* FILTER BUTTON */}
    <button
  onClick={() => setShow(!show)}
  className="flex items-center gap-2 bg-white border px-3 py-2 rounded shadow hover:bg-gray-100"
>
  <FiFilter className="text-blue-500" />
  <span>Filter</span>
</button>

      {/*  FILTER PANEL */}
      {show && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg p-4 rounded w-[300px] z-50">

          {/*TABS*/}
          <div className="flex mb-3 border-b">
            <button
              onClick={() => setActiveTab("amount")}
              className={`flex-1 p-2 ${
                activeTab === "amount"
                  ? "border-b-2 border-blue-500 font-bold"
                  : ""
              }`}
            >
              Amount
            </button>

            <button
              onClick={() => setActiveTab("date")}
              className={`flex-1 p-2 ${
                activeTab === "date"
                  ? "border-b-2 border-blue-500 font-bold"
                  : ""
              }`}
            >
              Date
            </button>
          </div>

          {/*  AMOUNT FILTER */}
          {activeTab === "amount" && (
            <div className="flex flex-col gap-2">
              <input
                type="number"
                placeholder="Min Amount"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters({ ...filters, minAmount: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Max Amount"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters({ ...filters, maxAmount: e.target.value })
                }
                className="border p-2 rounded"
              />
            </div>
          )}

          {/* DATE FILTER */}
          {activeTab === "date" && (
            <div className="flex flex-col gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="border p-2 rounded"
              />
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-between mt-4">
            <button
              onClick={applyFilter}
              className="bg-green-500 text-white px-3 py-2 rounded"
            >
              Apply
            </button>

            <button
              onClick={resetFilter}
              className="bg-gray-400 text-white px-3 py-2 rounded"
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