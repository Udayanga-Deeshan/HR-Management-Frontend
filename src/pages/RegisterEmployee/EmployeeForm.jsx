import React, { useState } from "react";
import axios from "axios";
import "./EmployeeForm.css";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

const EmployeeForm = () => {
  const departments = ["HR", "IT", "FINANCE", "OPERATIONS"];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const [errors, setErrors] = useState({});
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.department) newErrors.department = "Department is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccessOpen(false);
    setErrorOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post("http://localhost:8080/api/employee/add", formData);
        setSuccessOpen(true);
        setErrorOpen(false);
        setFormData({ name: "", email: "", department: "" });
        setTimeout(() => setSuccessOpen(false), 3000);
      } catch (error) {
        console.error("Error adding employee:", error);
        setSuccessOpen(false);
        setErrorOpen(true);
      }
    }
  };

  return (
    <div className="employee-form-container">
      <form className="employee-form" onSubmit={handleSubmit}>
        <h2>Add Employee</h2>

        <Collapse in={successOpen}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Employee added successfully!
          </Alert>
        </Collapse>

        <Collapse in={errorOpen}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to add employee. Please try again.
          </Alert>
        </Collapse>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={errors.department ? "error" : ""}
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <span className="error-message">{errors.department}</span>
          )}
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">
            Submit
          </button>
          
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
