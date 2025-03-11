import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BankerDashboard() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/banker/customers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Customers API Response:", response.data);
        setCustomers(response.data);
      } catch (error) {
        console.error(
          "Error fetching customers:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = async (customer) => {
    setSelectedCustomer(customer);
    setLoading(true);

    try {
      console.log(customer.id);

      const response = await axios.get(
        `http://localhost:5000/banker/customer/${customer.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(`Transactions for ${customer.username}:`, response.data);
      setTransactions(response.data);
    } catch (error) {
      console.error(
        "Error fetching transactions:",
        error.response?.data?.message || error.message
      );
      setTransactions([]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">
            Banking Dashboard
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/banker/login");
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 bg-indigo-50">
              <h2 className="text-xl font-semibold text-indigo-900">
                Customers
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => handleCustomerClick(customer)}
                    className={`w-full p-4 text-left transition hover:bg-indigo-50 ${
                      selectedCustomer?.id === customer.id ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="p-4 text-center text-gray-500">
                  No customers found.
                </p>
              )}
            </div>
          </div>
 
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
            {selectedCustomer ? (
              <>
                <div className="p-6 bg-indigo-50 border-b border-indigo-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-indigo-900">
                      {selectedCustomer.username}'s Transactions
                    </h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {loading ? (
                    <p className="p-4 text-center text-gray-500">
                      Loading transactions...
                    </p>
                  ) : transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <div key={tx.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                tx.type === "deposit"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {tx.type.charAt(0).toUpperCase() +
                                  tx.type.slice(1)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(tx.createdAt).toLocaleDateString()}
                              </p>
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
                    ))
                  ) : (
                    <p className="p-4 text-center text-gray-500">
                      No transactions found.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <p className="text-gray-500 text-center">
                  Select a customer to view their transaction history
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BankerDashboard;
