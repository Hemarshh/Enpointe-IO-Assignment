import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function CustomerLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isRegistering ? "register" : "login";
      const response = await axios.post(
        `http://localhost:5000/auth/${endpoint}`,
        credentials
      );
      console.log(response);

      localStorage.setItem("token", response.data.token);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md w-full m-4 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-8">
          {isRegistering ? "Register Account" : "Welcome Back"}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegistering && (
            <div>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </div>
          )}
          <div>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email address"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium transition-colors duration-200"
          >
            {isRegistering ? "Register" : "Sign in"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {isRegistering
              ? "Already have an account? Sign in"
              : "Create an Account"}
          </button>
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/banker/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Login as Banker
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
