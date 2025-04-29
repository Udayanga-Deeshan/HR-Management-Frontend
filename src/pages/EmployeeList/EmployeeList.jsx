import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    department: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/employee/all");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!editForm.name.trim()) newErrors.name = "Name is required.";
    if (!editForm.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!editForm.department) newErrors.department = "Department is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      await axios.put("http://localhost:8080/api/employee/update", {
        id: selectedEmployee.id,
        ...editForm,
      });
      setEditDialogOpen(false);
      setSnackbarOpen(true);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  

  const filteredEmployees = employees.filter((emp) =>
    [emp.name, emp.email, emp.department].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="employee-list-container">
      <div className="header">
        <h2>Employee Directory</h2>
        <button className="add-btn" onClick={() => navigate("/add-employee")}>
          Add
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, email or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(emp)}>Edit</button>
                    <button className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-records">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="dense"
            value={editForm.name}
            onChange={handleEditChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="dense"
            value={editForm.email}
            onChange={handleEditChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormControl fullWidth margin="dense" error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={editForm.department}
              onChange={handleEditChange}
              label="Department"
            >
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="FINANCE">FINANCE</MenuItem>
              <MenuItem value="OPERATIONS">OPERATIONS</MenuItem>
            </Select>
            {errors.department && (
              <span style={{ color: "#d32f2f", fontSize: "0.75rem" }}>{errors.department}</span>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Employee updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmployeeList;
