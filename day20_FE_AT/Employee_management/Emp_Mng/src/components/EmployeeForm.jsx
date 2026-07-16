import React, { useState, useEffect } from "react";

function EmployeeForm({ employee, onSave, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "Engineering",
    salary: "",
    joiningDate: new Date().toISOString().split("T")[0],
    status: "Active"
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState({});

  // Initialize form if editing an existing employee
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        role: employee.role || "",
        department: employee.department || "Engineering",
        salary: employee.salary || "",
        joiningDate: employee.joiningDate || new Date().toISOString().split("T")[0],
        status: employee.status || "Active"
      });
      setErrors({});
      setIsDirty({});
    }
  }, [employee]);

  // Validation functions
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required.";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters.";
        } else if (!/^[A-Za-z\s.'-]+$/.test(value)) {
          error = "Name contains invalid characters.";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "role":
        if (!value.trim()) {
          error = "Designation/Role is required.";
        }
        break;
      case "salary":
        if (value === "" || value === null) {
          error = "Salary is required.";
        } else {
          const numVal = Number(value);
          if (isNaN(numVal) || numVal <= 0) {
            error = "Salary must be a positive number.";
          }
        }
        break;
      case "joiningDate":
        if (!value) {
          error = "Joining Date is required.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setIsDirty((prev) => ({
      ...prev,
      [name]: true
    }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setIsDirty((prev) => ({
      ...prev,
      [name]: true
    }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const dirtyAll = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
      dirtyAll[key] = true;
    });

    setErrors(newErrors);
    setIsDirty(dirtyAll);

    // If there are no errors, proceed with saving
    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        salary: Number(formData.salary) // Ensure salary is a number
      });
    }
  };

  const defaultDepartments = [
    "Engineering",
    "DevOps & Cloud",
    "QA & Testing",
    "Product & Design",
    "Human Resources",
    "Finance & Payroll",
    "Sales & Marketing"
  ];
  const departmentsList = [...defaultDepartments];
  if (formData.department && !departmentsList.includes(formData.department)) {
    departmentsList.push(formData.department);
  }

  const defaultRoles = [
    "Frontend Engineer",
    "Backend Engineer",
    "Fullstack Developer",
    "DevOps Architect",
    "Data Scientist",
    "QA Engineer",
    "Product Manager",
    "UI/UX Designer"
  ];
  const rolesList = [...defaultRoles];
  if (formData.role && !rolesList.includes(formData.role)) {
    rolesList.push(formData.role);
  }

  const statusesList = ["Active", "On Leave", "Suspended"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card animate-zoom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {employee ? "✏️ Edit Employee Details" : "👤 Add New Employee"}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${isDirty.name && errors.name ? "input-error" : ""}`}
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {isDirty.name && errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="text-red">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${isDirty.email && errors.email ? "input-error" : ""}`}
              placeholder="e.g. john.doe@company.com"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {isDirty.email && errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Designation / Role */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Designation / Role <span className="text-red">*</span>
            </label>
            <select
              id="role"
              name="role"
              className={`form-input select-input ${isDirty.role && errors.role ? "input-error" : ""}`}
              value={formData.role}
              onChange={handleInputChange}
              onBlur={handleBlur}
            >
              <option value="" disabled>Select Designation</option>
              {rolesList.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {isDirty.role && errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          {/* Half width groups */}
          <div className="form-row">
            {/* Department */}
            <div className="form-group col-6">
              <label htmlFor="department" className="form-label">
                Department <span className="text-red">*</span>
              </label>
              <select
                id="department"
                name="department"
                className="form-input select-input"
                value={formData.department}
                onChange={handleInputChange}
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="form-group col-6">
              <label htmlFor="status" className="form-label">
                Status <span className="text-red">*</span>
              </label>
              <select
                id="status"
                name="status"
                className="form-input select-input"
                value={formData.status}
                onChange={handleInputChange}
              >
                {statusesList.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Salary */}
            <div className="form-group col-6">
              <label htmlFor="salary" className="form-label">
                Monthly Salary (₹) <span className="text-red">*</span>
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                className={`form-input ${isDirty.salary && errors.salary ? "input-error" : ""}`}
                placeholder="e.g. 150000"
                value={formData.salary}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {isDirty.salary && errors.salary && <span className="error-text">{errors.salary}</span>}
            </div>

            {/* Joining Date */}
            <div className="form-group col-6">
              <label htmlFor="joiningDate" className="form-label">
                Joining Date <span className="text-red">*</span>
              </label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                className={`form-input ${isDirty.joiningDate && errors.joiningDate ? "input-error" : ""}`}
                value={formData.joiningDate}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {isDirty.joiningDate && errors.joiningDate && (
                <span className="error-text">{errors.joiningDate}</span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner">⌛</span> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
