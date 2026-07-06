import React, { useState } from "react";

function EmployeeList({ employees, onEdit, onDelete, onView, onAddClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Get list of unique departments for filter dropdown
  const departments = ["All", ...new Set(employees.map((emp) => emp.department))];
  const statuses = ["All", "Active", "On Leave", "Suspended"];

  // Filter logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === "All" || emp.department === selectedDept;
    const matchesStatus = selectedStatus === "All" || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Calculate statistics
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === "Active").length;
  const averageSalary = employees.length
    ? Math.round(employees.reduce((acc, curr) => acc + Number(curr.salary), 0) / employees.length)
    : 0;
  const deptCount = new Set(employees.map((e) => e.department)).size;

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Get color for status badge
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "On Leave":
        return "status-leave";
      case "Suspended":
        return "status-suspended";
      default:
        return "";
    }
  };

  // Get consistent avatar background color based on name initials
  const getAvatarBg = (name) => {
    const colors = [
      "#4f46e5", // Indigo
      "#0891b2", // Cyan
      "#0d9488", // Teal
      "#059669", // Emerald
      "#ca8a04", // Yellow
      "#db2777", // Pink
      "#9333ea"  // Purple
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="dashboard-content">
      {/* Top Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Employee Directory</h1>
          <p className="dashboard-subtitle">Manage company workforce, roles, and compensation.</p>
        </div>
        <button className="btn btn-primary" onClick={onAddClick}>
          <span className="btn-icon">+</span> Add Employee
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-icon bg-indigo">👥</div>
          <div className="stats-info">
            <span className="stats-label">Total Workforce</span>
            <span className="stats-val">{totalCount}</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon bg-emerald">🟢</div>
          <div className="stats-info">
            <span className="stats-label">Active Employees</span>
            <span className="stats-val">{activeCount} <span className="stats-percent">({totalCount ? Math.round((activeCount / totalCount) * 100) : 0}%)</span></span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon bg-cyan">📊</div>
          <div className="stats-info">
            <span className="stats-label">Departments</span>
            <span className="stats-val">{deptCount}</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon bg-purple">💰</div>
          <div className="stats-info">
            <span className="stats-label">Average Pay</span>
            <span className="stats-val">{formatCurrency(averageSalary)}</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="filter-toolbar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by ID, name, role, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <label>Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="select-input"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select-input"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="table-container">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No employees found</h3>
            <p>Try refining your search terms or adjusting the filters.</p>
          </div>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee Info</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Joining Date</th>
                <th>Salary</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="table-row">
                  <td>
                    <div className="emp-info-cell">
                      <div
                        className="emp-avatar"
                        style={{ backgroundColor: getAvatarBg(emp.name) }}
                      >
                        {getInitials(emp.name)}
                      </div>
                      <div className="emp-meta">
                        <span className="emp-name" onClick={() => onView(emp)}>
                          {emp.name}
                        </span>
                        <span className="emp-id-email">
                          {emp.id} • {emp.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="emp-role">{emp.role}</span>
                  </td>
                  <td>
                    <span className="dept-badge">{emp.department}</span>
                  </td>
                  <td>
                    <span className="emp-date">
                      {new Date(emp.joiningDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </td>
                  <td>
                    <span className="emp-salary">{formatCurrency(emp.salary)}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => onEdit(emp)}
                        title="Edit Employee"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => onDelete(emp.id)}
                        title="Delete Employee"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="table-footer">
        Showing {filteredEmployees.length} of {totalCount} total employees
      </div>
    </div>
  );
}

export default EmployeeList;
