import React, { useState, useEffect } from "react";
import employeeService from "./services/employeeService";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals / Overlays
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // App Theme Mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // Default dark
  });

  // Fetch employees on component mount
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees();
      setEmployees(data);
      setError("");
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employee records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Theme effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Save employee handler (creates or updates)
  const handleSaveEmployee = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedEmployee) {
        // Edit Mode
        const updated = await employeeService.updateEmployee(selectedEmployee.id, formData);
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === selectedEmployee.id ? updated : emp))
        );
      } else {
        // Add Mode
        const created = await employeeService.createEmployee(formData);
        setEmployees((prev) => [...prev, created]);
      }
      setIsFormOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error("Error saving employee:", err);
      alert("Failed to save employee records.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete employee handler
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await employeeService.deleteEmployee(deleteConfirmId);
      setEmployees((prev) => prev.filter((emp) => emp.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      
      // Close detail view if that employee was deleted
      if (detailEmployee && detailEmployee.id === deleteConfirmId) {
        setDetailEmployee(null);
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee records.");
    }
  };

  // Open Edit Form
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  // Open Add Form
  const handleAddNewClick = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  // Open View Details Card
  const handleViewClick = (employee) => {
    setDetailEmployee(employee);
  };

  // Calculate tenure string (months or years)
  const calculateTenure = (joiningDate) => {
    const join = new Date(joiningDate);
    const now = new Date();
    const diffTime = Math.abs(now - join);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    }
    const months = Math.floor(diffDays / 30.4);
    if (months < 12) {
      return `${months} month${months > 1 ? "s" : ""}`;
    }
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return `${years} yr${years > 1 ? "s" : ""} ${remMonths > 0 ? `${remMonths} mo${remMonths > 1 ? "s" : ""}` : ""}`;
  };

  // Calculate annual salary and estimated tax (simple slab)
  const calculateFinancials = (monthlySalary) => {
    const annual = monthlySalary * 12;
    // Simple mock tax calculation (15% avg tax above 7L, etc.)
    let tax = 0;
    if (annual > 1500000) {
      tax = annual * 0.25;
    } else if (annual > 1000000) {
      tax = annual * 0.15;
    } else if (annual > 700000) {
      tax = annual * 0.10;
    } else {
      tax = annual * 0.05;
    }
    return {
      annual: annual,
      tax: Math.round(tax),
      netAnnual: annual - Math.round(tax)
    };
  };

  const getAvatarBg = (name) => {
    const colors = ["#4f46e5", "#0891b2", "#0d9488", "#059669", "#ca8a04", "#db2777", "#9333ea"];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">🌌</div>
          <div className="brand-meta">
            <span className="brand-name">ApexCorp</span>
            <span className="brand-slogan">Portal v2.0</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Core Modules</div>
          <a href="#" className="nav-item active">
            <span className="nav-icon">👤</span> Employee Directory
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); alert("Financial Analytics module is coming soon!"); }}>
            <span className="nav-icon">📊</span> Pay Analytics
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); alert("Access Control module is coming soon!"); }}>
            <span className="nav-icon">🔐</span> Permissions
          </a>

          <div className="nav-section-label font-secondary">System Settings</div>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); alert("Portal Settings are under construction."); }}>
            <span className="nav-icon">⚙️</span> Configuration
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="sys-status">
            <div className="sys-dot"></div>
            <span>API Server Online</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="workspace">
        {/* Header */}
        <header className="workspace-header">
          <div className="header-info">
            <span className="welcome-text">Workspace</span>
            <span className="current-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </div>

          <div className="header-actions">
            {/* Theme Toggle Button */}
            <button
              className="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            <div className="header-divider"></div>

            {/* Profile badge */}
            <div className="admin-profile">
              <div className="admin-avatar">AD</div>
              <div className="admin-meta">
                <span className="admin-name">Admin Portal</span>
                <span className="admin-role">System Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Panel */}
        <div className="workspace-body">
          {loading ? (
            <div className="app-loader">
              <div className="pulse-spinner"></div>
              <p>Connecting to Employee Database...</p>
            </div>
          ) : error ? (
            <div className="error-panel">
              <div className="error-icon">⚠️</div>
              <h2>Connection Failed</h2>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchEmployees}>
                Retry Connection
              </button>
            </div>
          ) : (
            <EmployeeList
              employees={employees}
              onEdit={handleEditClick}
              onDelete={(id) => setDeleteConfirmId(id)}
              onView={handleViewClick}
              onAddClick={handleAddNewClick}
            />
          )}
        </div>
      </main>

      {/* 1. Add / Edit Form Modal */}
      {isFormOpen && (
        <EmployeeForm
          employee={selectedEmployee}
          onSave={handleSaveEmployee}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedEmployee(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {/* 2. Employee Details Drawer Modal */}
      {detailEmployee && (
        <div className="modal-overlay" onClick={() => setDetailEmployee(null)}>
          <div className="drawer-card animate-slide-left" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-banner">
              <button className="drawer-close-btn" onClick={() => setDetailEmployee(null)}>
                ✕
              </button>
            </div>
            
            <div className="drawer-profile-summary">
              <div
                className="drawer-avatar"
                style={{ backgroundColor: getAvatarBg(detailEmployee.name) }}
              >
                {detailEmployee.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <h2 className="drawer-name">{detailEmployee.name}</h2>
              <span className="drawer-id-badge">{detailEmployee.id}</span>
              <p className="drawer-role-tag">{detailEmployee.role}</p>
              <span className="drawer-dept-badge">{detailEmployee.department}</span>
            </div>

            <div className="drawer-content">
              <h3 className="drawer-section-title">Employment Profile</h3>
              <div className="drawer-info-grid">
                <div className="info-item">
                  <span className="info-label">Email Address</span>
                  <span className="info-val">{detailEmployee.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Current Status</span>
                  <span className={`info-val status-text-${detailEmployee.status.toLowerCase().replace(" ", "-")}`}>
                    {detailEmployee.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Joining Date</span>
                  <span className="info-val">
                    {new Date(detailEmployee.joiningDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Company Tenure</span>
                  <span className="info-val">{calculateTenure(detailEmployee.joiningDate)}</span>
                </div>
              </div>

              <h3 className="drawer-section-title">Financial Compensation</h3>
              {(() => {
                const financials = calculateFinancials(detailEmployee.salary);
                return (
                  <div className="drawer-info-grid">
                    <div className="info-item">
                      <span className="info-label">Monthly Gross</span>
                      <span className="info-val-strong">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0
                        }).format(detailEmployee.salary)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Annual CTC</span>
                      <span className="info-val">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0
                        }).format(financials.annual)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Estimated Tax Ded.</span>
                      <span className="info-val text-red">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0
                        }).format(financials.tax)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Estimated Net Take-Home</span>
                      <span className="info-val text-emerald">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0
                        }).format(financials.netAnnual)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="drawer-footer">
              <button
                className="btn btn-secondary w-full"
                onClick={() => {
                  setDetailEmployee(null);
                  handleEditClick(detailEmployee);
                }}
              >
                ✏️ Edit Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Dialog Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="confirm-card animate-zoom" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2 className="confirm-title">Delete Employee Record</h2>
            <p className="confirm-desc">
              Are you sure you want to delete this employee? This action is permanent and cannot be undone.
            </p>
            <div className="confirm-buttons">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
