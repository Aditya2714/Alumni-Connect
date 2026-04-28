import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";

function Register() {
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    startYear: "",
    endYear: "",
    degree: "",
    branch: "",
    rollNumber: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  const navigate = useNavigate();

  const roleOptions = [
    { value: "alumni", label: "Alumni" },
    { value: "faculty", label: "Faculty" },
    { value: "admin", label: "Admin" },
    { value: "college", label: "College" },
  ];

  const degreeOptions = [
    { value: "bachelor", label: "Bachelor" },
    { value: "master", label: "Master" },
    { value: "phd", label: "PhD" },
  ];

  const handleDegreeChange = (selectedOption) => {
    setSelectedDegree(selectedOption);
    setFormData({ ...formData, degree: selectedOption.value });
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
    setFormData({ ...formData, role: selectedOption.value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Send only required fields to backend
      const payload = {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role || "alumni",
      };

      const response = await axios.post(
        "http://localhost:4000/register",
        payload
      );

      if (response.data.message === "User registered successfully") {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed. Please try again.");
    }

    setLoading(false);
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "48px",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#1d4ed8" : "#cbd5e1",
      boxShadow: state.isFocused ? "0 0 0 4px #dbeafe" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#1d4ed8" : "#94a3b8",
      },
    }),
  };

  return (
    <>
      <ToastContainer />
      <main className="bg-slate-50 px-4 py-12">
        <section className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-8">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
                Alumni registration
              </p>
              <h1 className="text-3xl font-extrabold tracking-normal">
                Create your account
              </h1>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
                Join the CMRIT alumni portal and unlock access to alumni search,
                events, job opportunities, and college updates.
              </p>
            </div>
          </div>

          <form className="space-y-8 p-6 sm:p-8" onSubmit={handleSubmit}>
            <section>
              <h2 className="mb-4 text-lg font-extrabold text-slate-900">
                Personal details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    First name
                  </span>
                  <input
                    name="firstName"
                    type="text"
                    required
                    onChange={handleChange}
                    placeholder="First Name"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Last name
                  </span>
                  <input
                    name="lastName"
                    type="text"
                    required
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={inputClass}
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-lg font-extrabold text-slate-900">
                Account details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Password
                  </span>
                  <input
                    name="password"
                    type="password"
                    required
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={inputClass}
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-lg font-extrabold text-slate-900">
                Academic details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Start year
                  </span>
                  <input
                    name="startYear"
                    type="text"
                    required
                    onChange={handleChange}
                    placeholder="2020"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    End year
                  </span>
                  <input
                    name="endYear"
                    type="text"
                    required
                    onChange={handleChange}
                    placeholder="2024"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Degree
                  </span>
                  <Select
                    options={degreeOptions}
                    value={selectedDegree}
                    onChange={handleDegreeChange}
                    placeholder="Select Degree"
                    styles={selectStyles}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Branch
                  </span>
                  <input
                    name="branch"
                    type="text"
                    required
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Roll number
                  </span>
                  <input
                    name="rollNumber"
                    type="text"
                    required
                    onChange={handleChange}
                    placeholder="USN / Roll Number"
                    className={inputClass}
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
                    placeholder="Select Role"
                    styles={selectStyles}
                  />
                </label>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Already registered?{" "}
                <Link to="/login" className="text-blue-700 hover:underline">
                  Sign in
                </Link>
              </p>
              <button
                type="submit"
                disabled={loading}
                className="min-h-[46px] rounded-lg bg-blue-700 px-6 font-extrabold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <Loader text="Please Wait" /> : "Create Account"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default Register;
