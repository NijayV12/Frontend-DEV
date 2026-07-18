import React, { useState, useEffect, useRef } from "react";

function EmployeeList({ employees, onEdit, onDelete, onView, onAddClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [deptOpen, setDeptOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const deptRef = useRef(null);
  const statusRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (deptRef.current && !deptRef.current.contains(e.target)) setDeptOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Get list of unique departments for filter dropdown
  const departments = ["All", ...new Set(employees.map((emp) => emp.department))];
  const statuses = ["All", "Active", "On Leave", "Suspended"];

  const filteredEmployees = employees.filter((emp) => {
    const nameVal = String(emp.name || "").toLowerCase();
    const roleVal = String(emp.role || emp.Role || "").toLowerCase();
    const emailVal = String(emp.email || "").toLowerCase();
    const idVal = String(emp.id || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      nameVal.includes(query) ||
      roleVal.includes(query) ||
      emailVal.includes(query) ||
      idVal.includes(query);
    
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
  const getAvatarBg = () => {
    return "var(--bg-tertiary)";
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "EE";
    return name
      .split(" ")
      .map((n) => n[0] || "")
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
        <div className="stats-card accent-cyan">
          <div className="stats-icon bg-indigo icon-bg-cyan">
            <svg className="stats-icon-svg cyan" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stats-info">
            <span className="stats-label">Total Workforce</span>
            <span className="stats-val">{totalCount}</span>
          </div>
        </div>
        <div className="stats-card accent-emerald">
          <div className="stats-icon bg-emerald icon-bg-emerald">
            <svg className="stats-icon-svg emerald" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stats-info">
            <span className="stats-label">Active Employees</span>
            <span className="stats-val">{activeCount} <span className="stats-percent">({totalCount ? Math.round((activeCount / totalCount) * 100) : 0}%)</span></span>
          </div>
        </div>
        <div className="stats-card accent-purple">
          <div className="stats-icon bg-cyan icon-bg-purple">
            <svg className="stats-icon-svg purple" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
          </div>
          <div className="stats-info">
            <span className="stats-label">Departments</span>
            <span className="stats-val">{deptCount}</span>
          </div>
        </div>
        <div className="stats-card accent-amber">
          <div className="stats-icon bg-purple icon-bg-amber">
            <svg className="stats-icon-svg amber" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stats-info">
            <span className="stats-label">Average Pay</span>
            <span className="stats-val">{formatCurrency(averageSalary)}</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="filter-toolbar">
        <div className="search-wrapper">
          <svg className="search-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
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
          {/* Department custom dropdown */}
          <div className="custom-dropdown-wrap" ref={deptRef} style={{ position: "relative" }}>
            <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Department</span>
            <button
              className="custom-dropdown-trigger"
              onClick={() => setDeptOpen(!deptOpen)}
              type="button"
            >
              <span>{selectedDept}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: deptOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {deptOpen && (
              <div className="custom-dropdown-menu">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    className={`custom-dropdown-item ${selectedDept === dept ? "selected" : ""}`}
                    onClick={() => { setSelectedDept(dept); setDeptOpen(false); }}
                  >
                    {selectedDept === dept && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status custom dropdown */}
          <div className="custom-dropdown-wrap" ref={statusRef} style={{ position: "relative" }}>
            <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Status</span>
            <button
              className="custom-dropdown-trigger"
              onClick={() => setStatusOpen(!statusOpen)}
              type="button"
            >
              <span>{selectedStatus}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: statusOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {statusOpen && (
              <div className="custom-dropdown-menu">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`custom-dropdown-item ${selectedStatus === status ? "selected" : ""}`}
                    onClick={() => { setSelectedStatus(status); setStatusOpen(false); }}
                  >
                    {selectedStatus === status && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    <span style={{
                      display: "inline-block",
                      width: "6px", height: "6px",
                      borderRadius: "50%",
                      background: status === "Active" ? "#10b981" : status === "On Leave" ? "#f59e0b" : status === "Suspended" ? "#ef4444" : "var(--text-muted)",
                      flexShrink: 0
                    }}/>
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="table-container">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", marginBottom: "12px" }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => onDelete(emp.id)}
                        title="Delete Employee"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
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
