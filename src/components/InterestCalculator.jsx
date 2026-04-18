import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaCalculator } from "react-icons/fa";

function InterestCalculator() {

  const token = localStorage.getItem("token");

  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [rate, setRate] = useState(7);

  const [interest, setInterest] = useState(0);
  const [maturity, setMaturity] = useState(0);

  const calculate = () => {

    if (!amount || !months || !rate) {
      toast.warning("Fill all fields ");
      return;
    }

    fetch(`http://localhost:8080/scheduler/calculate?amount=${amount}&months=${months}&rate=${rate}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {

        const total = amount * months;

        setMaturity(data);
        setInterest(data - total);
      })
      .catch(() => toast.error("Error calculating ❌"));
  };

  return (
    <div className="flex justify-center items-center min-h-screen 
    bg-gradient-to-br from-gray-100 to-gray-200 
    dark:from-gray-900 dark:to-black">

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg 
      p-8 rounded-2xl shadow-2xl w-[420px] 
      border border-gray-200 dark:border-gray-700">

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-5 text-center 
        text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <FaCalculator /> Interest Calculator
        </h2>

        {/* INPUTS */}
        <input
          type="number"
          placeholder="Monthly Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input mb-3"
        />

        <input
          type="number"
          placeholder="Months"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          className="input mb-3"
        />

        <input
          type="number"
          placeholder="Interest %"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="input mb-4"
        />

        {/* BUTTON */}
        <button
          onClick={calculate}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 
          text-white py-2 rounded-xl shadow-lg hover:scale-105 transition"
        >
          Calculate
        </button>

        {/* RESULT */}
        {maturity > 0 && (
          <div className="mt-6 space-y-2 text-center">

            <p className="text-green-600 dark:text-green-400 font-bold">
              Total Deposit: ₹ {(amount * months).toLocaleString()}
            </p>

            <p className="text-blue-600 dark:text-blue-400 font-bold">
              Interest: ₹ {interest.toFixed(2)}
            </p>

            <p className="text-purple-600 dark:text-purple-400 font-bold text-lg">
              Maturity: ₹ {maturity.toFixed(2)}
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default InterestCalculator;