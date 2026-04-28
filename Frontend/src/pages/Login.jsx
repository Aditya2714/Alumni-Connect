import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { login } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../Components/Loader";

function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roleOptions = [
    { value: "alumni", label: "Alumni" },
    { value: "faculty", label: "Faculty" },
    { value: "admin", label: "Admin" },
    { value: "college", label: "College" },
  ];

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);

const url = "/auth/login";

    const userData = {
      email: user.email,
      password: user.password,
      role: selectedRole.value,
    };

    try {
      const response = await axios.post(url, userData);

      console.log("Login Success:", response.data);

      const payload = {
        ...(selectedRole.value === "alumni"
          ? response.data.alumni
          : response.data.admin),
        role: selectedRole.value,
      };

      dispatch(login(payload));

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.log("Login Error:", err);

      if (err.response) {
        toast.error(err.response.data.message || "Login failed");
      } else {
        toast.error("Backend not reachable. Check server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <main className="bg-slate-50 px-4 py-12">
        <section className="mx-auto max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5 p-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                New here?{" "}
                <Link to="/register" className="text-blue-700 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Email
              </span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={user.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Password
              </span>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Role
              </span>
              <Select
                options={roleOptions}
                value={selectedRole}
                onChange={handleRoleChange}
                placeholder="Select your role"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="min-h-[46px] w-full rounded-lg bg-blue-700 px-5 font-extrabold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loader text="Please Wait..." /> : "Sign In"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Login;
