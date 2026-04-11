import React, { useState } from "react";

function InterestCalculator() {

  const token = localStorage.getItem("token");

  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [rate, setRate] = useState(7);

  const [interest, setInterest] = useState(0);
  const [maturity, setMaturity] = useState(0);

  const calculate = () => {

    if (!amount || !months || !rate) {
      alert("Fill all fields");
      return;
    }

    fetch(`http://localhost:8080/scheduler/calculate?amount=${amount}&months=${months}&rate=${rate}`, {
      headers: {
        Authorization: `Bearer ${token}`   // 🔥 FIX
      }
    })
      .then(res => res.json())
      .then(data => {

        const total = amount * months;

        setMaturity(data);
        setInterest(data - total);
      })
      .catch(() => alert("Error calculating"));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">

        <h2 className="text-xl font-bold mb-4 text-center">
          Interest Calculator
        </h2>

        <input
          type="number"
          placeholder="Monthly Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="number"
          placeholder="Months"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="number"
          placeholder="Interest %"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <button
          onClick={calculate}
          className="bg-green-500 text-white p-2 w-full rounded"
        >
          Calculate
        </button>

        {maturity > 0 && (
          <div className="mt-4 text-center">

            <p className="text-green-600 font-bold">
              Total Deposit: ₹ {(amount * months).toLocaleString()}
            </p>

            <p className="text-blue-600 font-bold">
              Interest: ₹ {interest.toFixed(2)}
            </p>

            <p className="text-purple-600 font-bold text-lg">
              Maturity: ₹ {maturity.toFixed(2)}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default InterestCalculator;