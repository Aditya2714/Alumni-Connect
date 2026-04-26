import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { login } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
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

      <div className="flex flex-col items-center mb-28 py-2">
        <h2 className="mt-5 text-center text-gray-900">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">

            {/* EMAIL */}
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={user.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-t-md"
            />

            {/* PASSWORD */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-b-md"
            />

            {/* ROLE SELECT */}
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={handleRoleChange}
              placeholder="Select your role"
              className="mt-2"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-md"
          >
            {loading ? <Loader text="Please Wait..." /> : "Sign In"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;