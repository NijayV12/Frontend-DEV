import React, { useState, useEffect } from "react";
import employeeService from "./services/employeeService";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import PayAnalyticsPage from "./components/PayAnalyticsPage";
import PermissionsPage from "./components/PermissionsPage";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Navigation tab state
  const [activeTab, setActiveTab] = useState("directory");

  // Modals / Overlays
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Force dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  }, []);

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
    if (!joiningDate) return "N/A";
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
    const salary = Number(monthlySalary) || 0;
    const annual = salary * 12;
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

  const getAvatarBg = () => {
    return "var(--bg-tertiary)";
  };

  return (
    <div className="app-container">
      {/* Ambient Blobs */}
      <div className="ambient-blob-container">
        <div className="ambient-blob blob-purple"></div>
        <div className="ambient-blob blob-emerald"></div>
        <div className="ambient-blob blob-cyan"></div>
      </div>

      <div className="portal-shell">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <svg className="brand-logo-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <div className="brand-meta">
              <span className="brand-name">ApexCorp</span>
              <span className="brand-slogan">Portal v2.0</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Core Modules</div>
            <a
              href="#"
              className={`nav-item ${activeTab === "directory" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("directory");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Employee Directory
            </a>
            <a
              href="#"
              className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("analytics");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Pay Analytics
            </a>
            <a
              href="#"
              className={`nav-item ${activeTab === "permissions" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("permissions");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
              </svg>
              Permissions
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
              <div className="admin-profile">
                <div className="admin-avatar">NV</div>
                <div className="admin-meta">
                  <span className="admin-name">Nijay V</span>
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
              <div key={activeTab} className="animate-fade-in">
                {activeTab === "directory" ? (
                  <EmployeeList
                    employees={employees}
                    onEdit={handleEditClick}
                    onDelete={(id) => setDeleteConfirmId(id)}
                    onView={handleViewClick}
                    onAddClick={handleAddNewClick}
                  />
                ) : activeTab === "analytics" ? (
                  <PayAnalyticsPage employees={employees} />
                ) : activeTab === "permissions" ? (
                  <PermissionsPage employees={employees} />
                ) : null}
              </div>
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
                <div className="drawer-avatar-lg" style={{ backgroundColor: getAvatarBg(detailEmployee.name) }}>
                  {getInitials(detailEmployee.name || "UN")}
                </div>
                <h2 className="drawer-emp-name">{detailEmployee.name || detailEmployee.Name}</h2>
                <span className="drawer-emp-role">{detailEmployee.role || detailEmployee.Role}</span>
                <span className="drawer-dept-badge">{detailEmployee.department || detailEmployee.Department}</span>
              </div>

              <div className="drawer-divider"></div>

              <div className="drawer-section">
                <h3 className="drawer-section-title">Core Information</h3>
                <div className="drawer-info-grid">
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">Employee ID</span>
                    <span className="drawer-info-val">#{detailEmployee.id}</span>
                  </div>
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">Email Address</span>
                    <span className="drawer-info-val">{detailEmployee.email || "N/A"}</span>
                  </div>
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">Joining Date</span>
                    <span className="drawer-info-val">
                      {detailEmployee.joiningDate
                        ? new Date(detailEmployee.joiningDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">Company Tenure</span>
                    <span className="drawer-info-val">{calculateTenure(detailEmployee.joiningDate)}</span>
                  </div>
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">Status</span>
                    <span className={`status-badge-static ${detailEmployee.status === "Active" ? "bg-active" : "bg-leave"}`}>
                      {detailEmployee.status || "Active"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="drawer-divider"></div>

              <div className="drawer-section">
                <h3 className="drawer-section-title">Compensation & Financials</h3>
                {(() => {
                  const fin = calculateFinancials(detailEmployee.salary);
                  return (
                    <div className="drawer-info-grid">
                      <div className="drawer-info-item">
                        <span className="drawer-info-label">Monthly Gross</span>
                        <span className="drawer-info-val value-highlight">{formatCurrency(detailEmployee.salary)}</span>
                      </div>
                      <div className="drawer-info-item">
                        <span className="drawer-info-label">Annual CTC</span>
                        <span className="drawer-info-val">{formatCurrency(fin.annual)}</span>
                      </div>
                      <div className="drawer-info-item">
                        <span className="drawer-info-label">Est. Annual Tax</span>
                        <span className="drawer-info-val" style={{ color: "#ef4444" }}>
                          {formatCurrency(fin.tax)}
                        </span>
                      </div>
                      <div className="drawer-info-item">
                        <span className="drawer-info-label">Est. Take-Home</span>
                        <span className="drawer-info-val" style={{ color: "#10b981" }}>
                          {formatCurrency(fin.netAnnual)}
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
                Are you sure you want to delete this employee? This action is permanent and will affect the remote mockapi.io endpoint.
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
    </div>
  );
}

export default App;
