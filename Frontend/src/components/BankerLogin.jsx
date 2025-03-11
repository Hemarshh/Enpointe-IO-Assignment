import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function BankerLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    role: "banker",
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !credentials.email ||
      !credentials.password ||
      (isRegistering && !credentials.username)
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const endpoint = isRegistering ? "register" : "login";
      const response = await axios.post(
        `http://localhost:5000/auth/${endpoint}`,
        credentials
      );
      console.log(response);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      navigate("/banker/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md w-full m-4 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-2">
          {isRegistering ? "Register as Banker" : "Banker Portal"}
        </h1>
        <p className="text-center text-gray-500 mb-8">
          {isRegistering
            ? "Create your banker account"
            : "Access the banking system management"}
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-50 rounded-lg text-red-800">{error}</div>
          )}

          <div className="space-y-4">
            {isRegistering && (
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            )}
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500"
              placeholder="Email address"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            {isRegistering ? "Register" : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 py-3 text-indigo-600 bg-gray-100 rounded-lg"
        >
          {isRegistering ? "Back to Login" : "Create an Account"}
        </button>

        <div className="mt-6 text-center">
          <Link
            to="/customer/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {isRegistering
              ? "Already have an account? Login as Customer"
              : "Login as Customer"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BankerLogin;
