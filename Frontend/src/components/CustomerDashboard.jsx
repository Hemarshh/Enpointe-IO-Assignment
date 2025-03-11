import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionModal from "./TransactionModal";

const API_URL = "http://localhost:5000/customer";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      setTransactions(data.transactions);
      setBalance(data.balance);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const API_URL = "http://localhost:5000/customer";

  const handleTransaction = async (amount) => {
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const endpoint = transactionType === "deposit" ? "deposit" : "withdraw";

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setShowModal(false);
      setError("");
      fetchTransactions();
    } catch (error) {
      console.error("Transaction Error:", error);
      setError("Transaction failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">My Account</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/customer/login");
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-3xl font-bold text-indigo-600">
                ${balance.toFixed(2)}
              </p>
            </div>
            {error && <p className="text-red-600 font-medium">{error}</p>}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setTransactionType("deposit");
                setShowModal(true);
                setError("");
              }}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
            >
              Deposit
            </button>
            <button
              onClick={() => {
                setTransactionType("withdraw");
                setShowModal(true);
                setError("");
              }}
              className="flex-1 bg-indigo-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors duration-200"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-indigo-50 border-b border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-900">
              Transaction History
            </h2>
          </div>
          {transactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          tx.type === "deposit" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </p>
                        <p className="text-sm text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                    <p
                      className={`font-medium ${
                        tx.type === "deposit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}$
                      {Number(tx.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <TransactionModal
          type={transactionType}
          balance={balance}
          onClose={() => setShowModal(false)}
          onSubmit={handleTransaction}
        />
      )}
    </div>
  );
}

export default CustomerDashboard;
