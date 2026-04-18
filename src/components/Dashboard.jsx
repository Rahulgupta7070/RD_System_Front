import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  CartesianGrid, Legend
} from "recharts";

import { FaUsers, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { BsCheckCircle } from "react-icons/bs";
import { IoMdTime } from "react-icons/io";

const Dashboard = () => {

  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {

    const token = localStorage.getItem("token");

    Promise.all([
      fetch("http://localhost:8080/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),

      fetch("http://localhost:8080/dashboard/monthly-collection", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
    ])
      .then(([summaryData, chartData]) => {

        const safeData = (chartData || []).map((item) => ({
          month: item.month || "",
          amount: Number(item.amount) || 0,
        }));

        setSummary(summaryData || {});
        setChartData(safeData);
        setLoading(false);
      })
      .catch(() => setLoading(false));

  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold dark:text-white">
        Loading Dashboard...
      </div>
    );
  }

  const pieData = [
    { name: "Active", value: summary.activeAccounts || 0 },
    { name: "Completed", value: summary.completedAccounts || 0 }
  ];

  const COLORS = ["#22c55e", "#6366f1"];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black transition-all">

<h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
  Dashboard 
</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">

        <Card title="Total Users" value={summary.totalUsers} icon={<FaUsers />} color="bg-blue-500" />
        <Card title="Total Deposit" value={`₹ ${summary.totalDeposit || 0}`} icon={<FaMoneyBillWave />} color="bg-green-500" />
        <Card title="Interest Earned" value={`₹ ${summary.totalInterest || 0}`} icon={<FaChartLine />} color="bg-purple-500" />
        <Card title="Fine Collected" value={`₹ ${summary.totalFine || 0}`} icon={<MdAttachMoney />} color="bg-red-500" />
        <Card title="Active Accounts" value={summary.activeAccounts || 0} icon={<IoMdTime />} color="bg-yellow-500" />
        <Card title="Completed Accounts" value={summary.completedAccounts || 0} icon={<BsCheckCircle />} color="bg-indigo-500" />

      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["bar", "line", "area", "pie"].map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`px-4 py-1 rounded-full text-sm font-semibold transition 
              ${chartType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
              }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl transition-all">

        <h2 className="font-semibold mb-4 text-gray-700 dark:text-white">
           Analytics Overview
        </h2>

        {chartData.length > 0 && (
          <div style={{ width: "100%", height: 320 }}>

            <ResponsiveContainer width="100%" height="100%" key={chartType}>

              {chartType === "bar" && (
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#4F46E5" radius={[6,6,0,0]} />
                </BarChart>
              )}

              {chartType === "line" && (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={3} />
                </LineChart>
              )}

              {chartType === "area" && (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="#c7d2fe" />
                </AreaChart>
              )}

              {chartType === "pie" && (
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={110} label>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}

            </ResponsiveContainer>

          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;


// PREMIUM CARD
const Card = ({ title, value, icon, color }) => {
  return (
    <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300">
      
      <div>
        <p className="text-gray-500 dark:text-gray-300">{title}</p>
        <h2 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
          {value}
        </h2>
      </div>

      <div className={`text-white p-4 rounded-full ${color} text-2xl shadow-lg`}>
        {icon}
      </div>

    </div>
  );
};