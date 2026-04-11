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
      <div className="flex justify-center items-center h-screen text-xl font-bold">
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
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-6">

        <Card title="Total Users" value={summary.totalUsers} icon={<FaUsers />} color="bg-blue-500" />
        <Card title="Total Deposit" value={`₹ ${summary.totalDeposit || 0}`} icon={<FaMoneyBillWave />} color="bg-green-500" />
        <Card title="Interest Earned" value={`₹ ${summary.totalInterest || 0}`} icon={<FaChartLine />} color="bg-purple-500" />
        <Card title="Fine Collected" value={`₹ ${summary.totalFine || 0}`} icon={<MdAttachMoney />} color="bg-red-500" />
        <Card title="Active Accounts" value={summary.activeAccounts || 0} icon={<IoMdTime />} color="bg-yellow-500" />
        <Card title="Completed Accounts" value={summary.completedAccounts || 0} icon={<BsCheckCircle />} color="bg-indigo-500" />

      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button onClick={() => setChartType("bar")} className="btn">Bar</button>
        <button onClick={() => setChartType("line")} className="btn">Line</button>
        <button onClick={() => setChartType("area")} className="btn">Area</button>
        <button onClick={() => setChartType("pie")} className="btn">Pie</button>
      </div>

      {/* ✅ FINAL FIXED CHART */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-3">Analytics Chart</h2>

        {chartData.length > 0 && (
          <div style={{ width: "100%", height: 300 }}>

            <ResponsiveContainer width="100%" height="100%" key={chartType}>

              {chartType === "bar" && (
                <BarChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis width={80} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#4F46E5" />
                </BarChart>
              )}

              {chartType === "line" && (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis width={80} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#22c55e" />
                </LineChart>
              )}

              {chartType === "area" && (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis width={80} />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="#c7d2fe" />
                </AreaChart>
              )}

              {chartType === "pie" && (
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={100} label>
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


// CARD COMPONENT
const Card = ({ title, value, icon, color }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-xl font-bold mt-1">{value}</h2>
      </div>
      <div className={`text-white p-3 rounded-full ${color} text-xl`}>
        {icon}
      </div>
    </div>
  );
};