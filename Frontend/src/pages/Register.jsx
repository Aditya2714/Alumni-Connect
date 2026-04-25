import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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

  const roleOptions = [{ value: "alumni", label: "Alumni" }];

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

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center mb-12">
        <h2 className="my-3 text-center text-gray-900">
          Create your account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">

            <input
              name="firstName"
              type="text"
              required
              onChange={handleChange}
              placeholder="First Name"
              className="input"
            />

            <input
              name="lastName"
              type="text"
              required
              onChange={handleChange}
              placeholder="Last Name"
              className="input"
            />

            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              placeholder="Email"
              className="input"
            />

            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              placeholder="Password"
              className="input"
            />

            <input
              name="startYear"
              type="text"
              required
              onChange={handleChange}
              placeholder="Start Year"
              className="input"
            />

            <input
              name="endYear"
              type="text"
              required
              onChange={handleChange}
              placeholder="End Year"
              className="input"
            />

            <Select
              options={degreeOptions}
              value={selectedDegree}
              onChange={handleDegreeChange}
              placeholder="Select Degree"
            />

            <input
              name="branch"
              type="text"
              required
              onChange={handleChange}
              placeholder="Branch"
              className="input"
            />

            <input
              name="rollNumber"
              type="text"
              required
              onChange={handleChange}
              placeholder="Roll Number"
              className="input"
            />

            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={handleRoleChange}
              placeholder="Select Role"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded"
          >
            {loading ? <Loader text="Please Wait" /> : "Register"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;