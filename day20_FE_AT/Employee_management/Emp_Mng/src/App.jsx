import React, { useState, useEffect } from "react";
import employeeService from "./services/employeeService";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import PayAnalyticsPage from "./components/PayAnalyticsPage";
import PermissionsPage from "./components/PermissionsPage";
import DepartmentHubPage from "./components/DepartmentHubPage";
import PerformancePage from "./components/PerformancePage";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import LeaveApprovalPage from "./components/LeaveApprovalPage";
import AnnouncementsPage from "./components/AnnouncementsPage";
import "./App.css";

const normalizeDepartment = (rawDept) => {
  const dept = String(rawDept || "Engineering").trim();
  const deptLower = dept.toLowerCase();
  
  if (deptLower.includes("qa") || deptLower.includes("test") || deptLower.includes("quality")) {
    return "QA & Testing";
  }
  if (deptLower.includes("devops") || deptLower.includes("cloud") || deptLower.includes("infra") || deptLower.includes("sys") || deptLower.includes("home") || deptLower.includes("automotive")) {
    return "DevOps & Cloud";
  }
  if (deptLower.includes("sale") || deptLower.includes("market") || deptLower.includes("business") || deptLower.includes("beauty") || deptLower.includes("sports")) {
    return "Sales & Marketing";
  }
  if (deptLower.includes("hr") || deptLower.includes("human") || deptLower.includes("people") || deptLower.includes("recruit") || deptLower.includes("baby") || deptLower.includes("clothing")) {
    return "Human Resources";
  }
  if (deptLower.includes("fin") || deptLower.includes("pay") || deptLower.includes("account") || deptLower.includes("grocery")) {
    return "Finance & Payroll";
  }
  if (deptLower.includes("product") || deptLower.includes("design") || deptLower.includes("ux") || deptLower.includes("garden") || deptLower.includes("toys") || deptLower.includes("music")) {
    return "Product & Design";
  }
  
  // Default to Engineering
  return "Engineering";
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Navigation tab state
  const [activeTab, setActiveTab] = useState("directory");

  // Modals / Overlays
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [drawerTab, setDrawerTab] = useState("profile");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Performance Evaluation state
  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem("employeeFeedback");
    if (saved) return JSON.parse(saved);
    return {};
  });
  const [performanceEvalEmployee, setPerformanceEvalEmployee] = useState(null);

  // --- MNC Admin States ---
  const [adminAssets, setAdminAssets] = useState([
    { id: "ast_101", employeeName: "Nijay", type: "Laptop", model: "MacBook Pro M3 Max", serial: "SN-98234-X", status: "Active", assignedDate: "2026-01-10" },
    { id: "ast_102", employeeName: "Nijay", type: "Monitor", model: "Dell UltraSharp 32\" 4K", serial: "SN-29384-D", status: "Active", assignedDate: "2026-01-12" },
    { id: "ast_103", employeeName: "Nijay V", type: "Laptop", model: "ThinkPad X1 Carbon Gen 11", serial: "SN-55612-L", status: "Active", assignedDate: "2026-02-15" },
    { id: "ast_104", employeeName: "Ravi", type: "Keyboard", model: "Logitech MX Keys", serial: "SN-66120-K", status: "Active", assignedDate: "2026-03-20" },
    { id: "ast_105", employeeName: "Anita", type: "Monitor", model: "LG UltraWide 34\"", serial: "SN-77893-M", status: "Under Maintenance", assignedDate: "2026-04-05" }
  ]);
  const [adminAssetRequests, setAdminAssetRequests] = useState([
    { id: "req_201", employeeName: "Nijay", type: "Keyboard", reason: "Current keyboard has sticky keys", status: "Approved", date: "2026-05-14" },
    { id: "req_202", employeeName: "Ravi", type: "Monitor", reason: "Need dual display layout for coding", status: "Pending", date: "2026-07-16" },
    { id: "req_203", employeeName: "Anita", type: "Laptop", reason: "Current laptop is 4 years old and running slow", status: "Pending", date: "2026-07-17" }
  ]);
  // Assets UI state
  const [assetTypeFilter, setAssetTypeFilter] = useState("All");
  const [assetSearch, setAssetSearch] = useState("");
  const [showAssetRequestForm, setShowAssetRequestForm] = useState(false);
  const [newAssetReqEmployee, setNewAssetReqEmployee] = useState("");
  const [newAssetReqType, setNewAssetReqType] = useState("Laptop");
  const [newAssetReqReason, setNewAssetReqReason] = useState("");

  const [adminTickets, setAdminTickets] = useState([
    { id: "tkt_501", employeeName: "Nijay", title: "VPN Access Request", category: "IT Security", priority: "High", status: "Resolved", date: "2026-07-02", desc: "Need access to internal staging servers via secure VPN tunnel." },
    { id: "tkt_502", employeeName: "Nijay", title: "MFA Enrolment Query", category: "IT Support", priority: "Medium", status: "Open", date: "2026-07-16", desc: "Cannot scan the QR code on mobile device for MFA setup." },
    { id: "tkt_503", employeeName: "Ravi", title: "Payslip Correction", category: "Finance", priority: "Low", status: "Open", date: "2026-07-15", desc: "My HRA component was miscalculated on last month's payslip." },
    { id: "tkt_504", employeeName: "Anita", title: "Software License Request", category: "IT Support", priority: "Medium", status: "Open", date: "2026-07-17", desc: "Need Figma Pro license for upcoming UX design project." },
    { id: "tkt_505", employeeName: "Ravi", title: "Email Migration Issue", category: "IT Support", priority: "High", status: "Resolved", date: "2026-07-10", desc: "Emails not syncing after migration to new Outlook tenant." }
  ]);
  // Helpdesk UI state
  const [helpdeskStatusFilter, setHelpdeskStatusFilter] = useState("All");
  const [helpdeskPriorityFilter, setHelpdeskPriorityFilter] = useState("All");
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketCategory, setNewTicketCategory] = useState("IT Support");
  const [newTicketPriority, setNewTicketPriority] = useState("Medium");
  const [newTicketDesc, setNewTicketDesc] = useState("");
  const [newTicketEmployee, setNewTicketEmployee] = useState("");

  const [adminLearning, setAdminLearning] = useState([
    { id: "crs_1", name: "Cybersecurity & Phishing Prevention", completedCount: 15, totalCount: 20 },
    { id: "crs_2", name: "Data Privacy & GDPR Guidelines", completedCount: 12, totalCount: 20 },
    { id: "crs_3", name: "Code of Business Conduct & Ethics", completedCount: 8, totalCount: 20 }
  ]);

  // Edit Evaluation local states inside Admin drawer
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  const [editRating, setEditRating] = useState(3.0);
  const [editOkr, setEditOkr] = useState(50);
  const [editFeedbackText, setEditFeedbackText] = useState("");

  // Profile Settings local states
  const [profilePhone, setProfilePhone] = useState("+1 (555) 019-2834");
  const [profileLanguage, setProfileLanguage] = useState("English");
  const [profile2FA, setProfile2FA] = useState(true);
  const [profileCurrentPassword, setProfileCurrentPassword] = useState("");
  const [profileNewPassword, setProfileNewPassword] = useState("");
  const [profileConfirmPassword, setProfileConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  // Fetch employees on component mount
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees();
      const normalizedData = data.map(emp => ({
        ...emp,
        department: normalizeDepartment(emp.department || emp.Department)
      }));
      setEmployees(normalizedData);
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

  // Seed feedback list once employees are loaded if not already saved in localStorage
  useEffect(() => {
    if (employees.length > 0 && Object.keys(feedbackList).length === 0) {
      const seeded = {};
      employees.forEach(emp => {
        const scoreSeed = ((Number(emp.id) * 7) % 15) / 10 + 3.5;
        seeded[emp.id] = {
          rating: Math.min(5, Math.max(1, Math.round(scoreSeed * 10) / 10)),
          okrProgress: Math.min(100, Math.max(20, (Number(emp.id) * 13) % 60 + 40)),
          feedback: "Consistent performer with strong team contribution.",
          lastReviewDate: "2026-06-15"
        };
      });
      setFeedbackList(seeded);
      localStorage.setItem("employeeFeedback", JSON.stringify(seeded));
    }
  }, [employees, feedbackList]);

  // Force dark theme on mount and clear stale cache on fresh start
  useEffect(() => {
    document.documentElement.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
    // Clear stale feedback and permissions cache to force fresh re-seed from server
    localStorage.removeItem("employeePermissions");
  }, []);

  // Save employee handler (creates or updates)
  const handleSaveEmployee = async (formData) => {
    try {
      setIsSubmitting(true);
      const normalizedFormData = {
        ...formData,
        department: normalizeDepartment(formData.department)
      };
      if (selectedEmployee) {
        // Edit Mode
        const updated = await employeeService.updateEmployee(selectedEmployee.id, normalizedFormData);
        const normalizedUpdated = {
          ...updated,
          department: normalizeDepartment(updated.department)
        };
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === selectedEmployee.id ? normalizedUpdated : emp))
        );
      } else {
        // Add Mode
        const created = await employeeService.createEmployee(normalizedFormData);
        const normalizedCreated = {
          ...created,
          department: normalizeDepartment(created.department)
        };
        setEmployees((prev) => [...prev, normalizedCreated]);
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

  const handleViewClick = (employee) => {
    setDetailEmployee(employee);
    setDrawerTab("profile");
    setIsEditingFeedback(false);
    
    const f = feedbackList[employee.id] || { rating: 3.0, okrProgress: 50, feedback: "No evaluation recorded yet." };
    setEditRating(f.rating);
    setEditOkr(f.okrProgress);
    setEditFeedbackText(f.feedback);
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

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "UN";
    return name
      .split(" ")
      .map((n) => n[0] || "")
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (!currentUser) {
    return (
      <Login
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem("currentUser", JSON.stringify(user));
        }}
      />
    );
  }

  if (currentUser.role === "Employee") {
    return (
      <EmployeeDashboard
        employee={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
        }}
      />
    );
  }

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
              <span className="brand-name">CorpTech</span>
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
            <a
              href="#"
              className={`nav-item ${activeTab === "departments" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("departments");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Department Hub
            </a>
            <a
              href="#"
              className={`nav-item ${activeTab === "performance" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("performance");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Performance
            </a>
            <a
              href="#"
              className={`nav-item ${activeTab === "leaves" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("leaves");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Leave Requests
            </a>
            <a
              href="#"
              className={`nav-item ${activeTab === "announcements" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("announcements");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Announcements
            </a>
            <div className="nav-section-label">MNC Operations</div>
            <a
              href="#"
              className={`nav-item ${activeTab === "assets" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("assets");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
              IT Assets Admin
            </a>
            <a
              href="#"
              className={`nav-item ${activeTab === "helpdesk" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("helpdesk");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Helpdesk Tickets
            </a>
            <a
              href="#"
              className={`nav-item ${activeTab === "learning" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("learning");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
              </svg>
              Learning & Compliance
            </a>
            <a
              href="#"
              id="profile-nav-btn"
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("profile");
              }}
            >
              <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile Settings
            </a>
          </nav>

          <div className="sidebar-footer">
            <div className="sys-status" style={{ marginBottom: "8px" }}>
              <div className="sys-dot"></div>
              <span>API Server Online</span>
            </div>
            <button
              className="btn btn-secondary w-full"
              onClick={() => {
                setCurrentUser(null);
                localStorage.removeItem("currentUser");
              }}
              style={{ border: "1px solid var(--accent-red)", color: "#f87171", padding: "6px" }}
            >
              🚪 Log Out
            </button>
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
                ) : activeTab === "departments" ? (
                  <DepartmentHubPage employees={employees} />
                ) : activeTab === "performance" ? (
                  <PerformancePage 
                    employees={employees} 
                    feedbackList={feedbackList}
                    onEvaluate={(emp) => setPerformanceEvalEmployee(emp)}
                  />
                ) : activeTab === "leaves" ? (
                  <LeaveApprovalPage />
                ) : activeTab === "announcements" ? (
                  <AnnouncementsPage />
                ) : activeTab === "assets" ? (
                  <div className="dashboard-content animate-fade-in">
                    {/* Page header */}
                    <div className="page-section-header">
                      <div>
                        <h1 className="page-section-title">💻 IT Asset Management</h1>
                        <p className="page-section-subtitle">Track hardware inventory, process requests, and manage asset lifecycle</p>
                      </div>
                      <button className="add-btn" id="new-asset-request-btn" onClick={() => setShowAssetRequestForm(!showAssetRequestForm)}>
                        <span>+</span> New Request
                      </button>
                    </div>

                    {/* KPI Bar */}
                    <div className="kpi-bar cols-4">
                      <div className="kpi-chip cyan">
                        <span className="kpi-label">Total Assets</span>
                        <span className="kpi-value" id="kpi-total-assets">{adminAssets.length}</span>
                      </div>
                      <div className="kpi-chip emerald">
                        <span className="kpi-label">Active</span>
                        <span className="kpi-value emerald" id="kpi-active-assets">{adminAssets.filter(a => a.status === "Active").length}</span>
                      </div>
                      <div className="kpi-chip amber">
                        <span className="kpi-label">Under Maintenance</span>
                        <span className="kpi-value amber">{adminAssets.filter(a => a.status === "Under Maintenance").length}</span>
                      </div>
                      <div className="kpi-chip red">
                        <span className="kpi-label">Pending Requests</span>
                        <span className="kpi-value red">{adminAssetRequests.filter(r => r.status === "Pending").length}</span>
                      </div>
                    </div>

                    {/* New Request inline form */}
                    {showAssetRequestForm && (
                      <div className="inline-form-panel" id="asset-request-form">
                        <h4>📋 Submit New Asset Request</h4>
                        <div className="inline-form-grid">
                          <input
                            className="inline-form-input"
                            id="asset-req-employee"
                            placeholder="Employee Name"
                            value={newAssetReqEmployee}
                            onChange={e => setNewAssetReqEmployee(e.target.value)}
                          />
                          <select
                            className="inline-form-input"
                            id="asset-req-type"
                            value={newAssetReqType}
                            onChange={e => setNewAssetReqType(e.target.value)}
                          >
                            {["Laptop","Monitor","Keyboard","Mouse","Headset","Chair","Webcam"].map(t => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          className="inline-form-textarea"
                          id="asset-req-reason"
                          placeholder="Reason for request..."
                          rows={3}
                          value={newAssetReqReason}
                          onChange={e => setNewAssetReqReason(e.target.value)}
                        />
                        <div className="inline-form-actions">
                          <button className="btn-sm-ghost" onClick={() => { setShowAssetRequestForm(false); setNewAssetReqEmployee(""); setNewAssetReqReason(""); }}>Cancel</button>
                          <button className="btn-sm-primary" id="asset-request-submit" onClick={() => {
                            if (!newAssetReqEmployee.trim() || !newAssetReqReason.trim()) return;
                            const newReq = {
                              id: "req_" + Date.now(),
                              employeeName: newAssetReqEmployee,
                              type: newAssetReqType,
                              reason: newAssetReqReason,
                              status: "Pending",
                              date: new Date().toISOString().split("T")[0]
                            };
                            setAdminAssetRequests([...adminAssetRequests, newReq]);
                            setShowAssetRequestForm(false);
                            setNewAssetReqEmployee("");
                            setNewAssetReqReason("");
                          }}>Submit Request</button>
                        </div>
                      </div>
                    )}

                    {/* Main layout: inventory table + request panel */}
                    <div className="two-col-layout">
                      {/* Left: Asset Inventory */}
                      <div className="glass-panel">
                        <div className="panel-header">
                          <span className="panel-title">
                            🗄️ Hardware Inventory
                            <span className="panel-count-badge">{adminAssets.length} assets</span>
                          </span>
                        </div>

                        {/* Search + filter pills */}
                        <div className="panel-search-wrapper">
                          <svg className="panel-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          </svg>
                          <input
                            className="panel-search-input"
                            id="assets-search-input"
                            placeholder="Search by employee or serial..."
                            value={assetSearch}
                            onChange={e => setAssetSearch(e.target.value)}
                          />
                        </div>
                        <div className="filter-pills" style={{ marginBottom: "16px" }}>
                          {["All","Laptop","Monitor","Keyboard","Mouse"].map(type => (
                            <button
                              key={type}
                              id={`assets-filter-${type.toLowerCase()}`}
                              className={`filter-pill ${assetTypeFilter === type ? "active" : ""}`}
                              onClick={() => setAssetTypeFilter(type)}
                            >{type}</button>
                          ))}
                        </div>

                        <div className="table-container" id="asset-rows">
                          <table className="employee-table">
                            <thead>
                              <tr>
                                <th>Asset</th>
                                <th>Assigned To</th>
                                <th>Serial</th>
                                <th>Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminAssets
                                .filter(a => assetTypeFilter === "All" || a.type === assetTypeFilter)
                                .filter(a => {
                                  const q = assetSearch.toLowerCase();
                                  return !q || a.employeeName.toLowerCase().includes(q) || a.serial.toLowerCase().includes(q) || a.model.toLowerCase().includes(q);
                                })
                                .map(asset => {
                                  const typeIcon = asset.type === "Laptop" ? "💻" : asset.type === "Monitor" ? "🖥️" : asset.type === "Keyboard" ? "⌨️" : asset.type === "Mouse" ? "🖱️" : "📦";
                                  return (
                                    <tr key={asset.id} className="table-row">
                                      <td>
                                        <div className="asset-row-cell">
                                          <div className="asset-type-icon">{typeIcon}</div>
                                          <div>
                                            <div style={{ fontWeight: "700", fontSize: "13px", color: "var(--text-primary)" }}>{asset.model}</div>
                                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{asset.type}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td style={{ fontWeight: "600" }}>{asset.employeeName}</td>
                                      <td><code style={{ fontSize: "11px", background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: "4px" }}>{asset.serial}</code></td>
                                      <td style={{ fontSize: "12px", color: "var(--text-muted)" }}>{asset.assignedDate}</td>
                                      <td>
                                        <span className={`status-badge-static ${asset.status === "Active" ? "bg-active" : "bg-pending"}`} style={{ fontSize: "10px" }}>{asset.status}</span>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Right: Requests Panel */}
                      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div className="panel-header">
                          <span className="panel-title">
                            📥 Asset Requests
                            <span className="panel-count-badge" id="pending-request-count">{adminAssetRequests.filter(r => r.status === "Pending").length} pending</span>
                          </span>
                        </div>
                        {adminAssetRequests.map(req => (
                          <div key={req.id} className="request-card" id={`request-card-${req.id}`}>
                            <div className="request-card-header">
                              <div>
                                <div className="request-employee">{req.employeeName}</div>
                                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{req.date}</div>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                                <span className="request-type-badge">{req.type}</span>
                                <span className={`status-badge-static ${req.status === "Approved" ? "bg-active" : req.status === "Pending" ? "bg-pending" : "bg-leave"}`} style={{ fontSize: "9px" }}>{req.status}</span>
                              </div>
                            </div>
                            <p className="request-reason">"{req.reason}"</p>
                            {req.status === "Pending" && (
                              <div className="request-actions">
                                <button className="btn-approve" id={`approve-btn-${req.id}`} onClick={() => {
                                  setAdminAssetRequests(adminAssetRequests.map(r => r.id === req.id ? { ...r, status: "Approved" } : r));
                                  const newAsset = {
                                    id: "ast_" + Date.now(),
                                    employeeName: req.employeeName,
                                    type: req.type,
                                    model: req.type === "Keyboard" ? "Logitech MX Keys" : req.type === "Monitor" ? "Dell UltraSharp 32\" 4K" : req.type === "Laptop" ? "MacBook Pro M3" : req.type + " Standard",
                                    serial: "SN-" + Math.floor(10000 + Math.random() * 90000) + "-U",
                                    status: "Active",
                                    assignedDate: new Date().toISOString().split("T")[0]
                                  };
                                  setAdminAssets([...adminAssets, newAsset]);
                                }}>✓ Approve & Deploy</button>
                                <button className="btn-reject" id={`reject-btn-${req.id}`} onClick={() => {
                                  setAdminAssetRequests(adminAssetRequests.map(r => r.id === req.id ? { ...r, status: "Rejected" } : r));
                                }}>✕ Reject</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : activeTab === "helpdesk" ? (
                  <div className="dashboard-content animate-fade-in">
                    {/* Page header */}
                    <div className="page-section-header">
                      <div>
                        <h1 className="page-section-title">🎫 Helpdesk Tickets</h1>
                        <p className="page-section-subtitle">Manage support requests, track resolution, and maintain SLAs</p>
                      </div>
                      <button className="add-btn" id="helpdesk-new-ticket-btn" onClick={() => setShowNewTicketForm(!showNewTicketForm)}>
                        <span>+</span> New Ticket
                      </button>
                    </div>

                    {/* KPI Bar */}
                    <div className="kpi-bar cols-4">
                      <div className="kpi-chip cyan">
                        <span className="kpi-label">Total Tickets</span>
                        <span className="kpi-value">{adminTickets.length}</span>
                      </div>
                      <div className="kpi-chip amber">
                        <span className="kpi-label">Open</span>
                        <span className="kpi-value amber" id="kpi-open-tickets">{adminTickets.filter(t => t.status === "Open").length}</span>
                      </div>
                      <div className="kpi-chip emerald">
                        <span className="kpi-label">Resolved</span>
                        <span className="kpi-value emerald" id="kpi-resolved-tickets">{adminTickets.filter(t => t.status === "Resolved").length}</span>
                      </div>
                      <div className="kpi-chip red">
                        <span className="kpi-label">High Priority</span>
                        <span className="kpi-value red">{adminTickets.filter(t => t.priority === "High" && t.status === "Open").length}</span>
                      </div>
                    </div>

                    {/* New Ticket Form */}
                    {showNewTicketForm && (
                      <div className="inline-form-panel" id="helpdesk-new-ticket-form">
                        <h4>🆕 Submit New Support Ticket</h4>
                        <div className="inline-form-grid">
                          <input
                            className="inline-form-input"
                            id="helpdesk-ticket-employee"
                            placeholder="Employee Name"
                            value={newTicketEmployee}
                            onChange={e => setNewTicketEmployee(e.target.value)}
                          />
                          <input
                            className="inline-form-input"
                            id="helpdesk-ticket-title-input"
                            placeholder="Ticket Title"
                            value={newTicketTitle}
                            onChange={e => setNewTicketTitle(e.target.value)}
                          />
                          <select
                            className="inline-form-input"
                            id="helpdesk-ticket-category"
                            value={newTicketCategory}
                            onChange={e => setNewTicketCategory(e.target.value)}
                          >
                            {["IT Support","IT Security","Finance","HR","Facilities"].map(c => <option key={c}>{c}</option>)}
                          </select>
                          <select
                            className="inline-form-input"
                            id="helpdesk-ticket-priority"
                            value={newTicketPriority}
                            onChange={e => setNewTicketPriority(e.target.value)}
                          >
                            {["High","Medium","Low"].map(p => <option key={p}>{p}</option>)}
                          </select>
                        </div>
                        <textarea
                          className="inline-form-textarea"
                          id="helpdesk-ticket-desc"
                          placeholder="Describe the issue..."
                          rows={3}
                          value={newTicketDesc}
                          onChange={e => setNewTicketDesc(e.target.value)}
                        />
                        <div className="inline-form-actions">
                          <button className="btn-sm-ghost" onClick={() => { setShowNewTicketForm(false); setNewTicketTitle(""); setNewTicketDesc(""); setNewTicketEmployee(""); }}>Cancel</button>
                          <button className="btn-sm-primary" id="helpdesk-ticket-submit" onClick={() => {
                            if (!newTicketTitle.trim() || !newTicketEmployee.trim() || !newTicketDesc.trim()) return;
                            const ticket = {
                              id: "tkt_" + Date.now(),
                              employeeName: newTicketEmployee,
                              title: newTicketTitle,
                              category: newTicketCategory,
                              priority: newTicketPriority,
                              status: "Open",
                              date: new Date().toISOString().split("T")[0],
                              desc: newTicketDesc
                            };
                            setAdminTickets([ticket, ...adminTickets]);
                            setShowNewTicketForm(false);
                            setNewTicketTitle("");
                            setNewTicketDesc("");
                            setNewTicketEmployee("");
                          }}>Submit Ticket</button>
                        </div>
                      </div>
                    )}

                    {/* Filter controls */}
                    <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                      <div className="filter-pills">
                        {["All","Open","Resolved"].map(s => (
                          <button
                            key={s}
                            id={`helpdesk-filter-${s.toLowerCase()}`}
                            className={`filter-pill ${helpdeskStatusFilter === s ? "active" : ""}`}
                            onClick={() => setHelpdeskStatusFilter(s)}
                          >{s}</button>
                        ))}
                      </div>
                      <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.08)" }} />
                      <div className="filter-pills">
                        {["All","High","Medium","Low"].map(p => (
                          <button
                            key={p}
                            className={`filter-pill ${helpdeskPriorityFilter === p ? "active" : ""}`}
                            onClick={() => setHelpdeskPriorityFilter(p)}
                          >{p}</button>
                        ))}
                      </div>
                    </div>

                    {/* Ticket cards list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} id="helpdesk-ticket-rows">
                      {adminTickets
                        .filter(t => helpdeskStatusFilter === "All" || t.status === helpdeskStatusFilter)
                        .filter(t => helpdeskPriorityFilter === "All" || t.priority === helpdeskPriorityFilter)
                        .map(t => (
                          <div key={t.id} className={`ticket-card priority-${t.priority}`} id={`ticket-card-${t.id}`}>
                            <div className="ticket-header">
                              <div className="ticket-title-wrap">
                                <div className="ticket-title">{t.title}</div>
                                <div className="ticket-meta">
                                  <span className="ticket-category-chip">{t.category}</span>
                                  <span className={`ticket-priority-chip ${t.priority}`}>{t.priority}</span>
                                  <span>· {t.date}</span>
                                </div>
                              </div>
                              <span className={`status-badge-static ${t.status === "Resolved" ? "bg-active" : "bg-pending"}`} style={{ fontSize: "10px", whiteSpace: "nowrap" }}>{t.status}</span>
                            </div>
                            <p className="ticket-desc">{t.desc}</p>
                            <div className="ticket-footer">
                              <div className="ticket-assignee">
                                <div className="ticket-assignee-dot">{t.employeeName.slice(0,2).toUpperCase()}</div>
                                {t.employeeName}
                              </div>
                              {t.status === "Open" ? (
                                <button
                                  className="ticket-resolve-btn"
                                  id={`resolve-btn-${t.id}`}
                                  onClick={() => setAdminTickets(adminTickets.map(x => x.id === t.id ? { ...x, status: "Resolved" } : x))}
                                >✓ Resolve</button>
                              ) : (
                                <button
                                  className="ticket-reopen-btn"
                                  id={`reopen-btn-${t.id}`}
                                  onClick={() => setAdminTickets(adminTickets.map(x => x.id === t.id ? { ...x, status: "Open" } : x))}
                                >↩ Re-open</button>
                              )}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ) : activeTab === "learning" ? (
                  <div className="dashboard-content animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }}>
                    <div className="glass-panel">
                      <h3 className="stat-label" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}>
                        🎓 Corporate Compliance Rate
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {adminLearning.map((course) => {
                          const percent = Math.round((course.completedCount / course.totalCount) * 100);
                          return (
                            <div key={course.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "var(--radius-md)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                <div>
                                  <strong style={{ color: "var(--text-primary)", fontSize: "14px" }}>{course.name}</strong>
                                  <span style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                                    Completed: {course.completedCount} of {course.totalCount} employees
                                  </span>
                                </div>
                                <span style={{ fontSize: "14px", fontWeight: "700", color: percent >= 75 ? "#10b981" : "#f59e0b" }}>{percent}% Compliant</span>
                              </div>
                              <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-tertiary)", borderRadius: "3px", overflow: "hidden" }}>
                                <div style={{ width: `${percent}%`, backgroundColor: percent >= 75 ? "#10b981" : "#f59e0b", height: "100%", borderRadius: "3px" }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                      <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", border: "4px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                        <span style={{ fontSize: "40px" }}>🛡️</span>
                      </div>
                      <h4 style={{ fontSize: "18px", color: "var(--text-primary)", marginBottom: "4px" }}>Audit Clearance Status</h4>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 16px 0", maxWidth: "220px" }}>
                        Corporate compliance status is green. All employees have successfully enrolled in active security courses.
                      </p>
                      <span className="status-badge-static bg-active" style={{ fontSize: "12px", padding: "6px 14px" }}>Passed Compliance Audit</span>
                    </div>
                  </div>
                ) : activeTab === "profile" ? (
                  <div className="dashboard-content animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
                    <div className="glass-panel" style={{ padding: "24px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                        👤 Profile Details
                      </h3>
                      {profileMessage && (
                        <div id="profile-msg" style={{ background: profileMessage.includes("Error") ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)", border: `1px solid ${profileMessage.includes("Error") ? "#ef4444" : "#10b981"}`, color: profileMessage.includes("Error") ? "#fca5a5" : "#34d399", padding: "12px", borderRadius: "var(--radius-md)", marginBottom: "16px", fontSize: "14px" }}>
                          {profileMessage}
                        </div>
                      )}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div>
                          <label className="form-label" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Name</label>
                          <input type="text" className="form-input" value={currentUser?.name || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Email Address</label>
                          <input type="text" className="form-input" value={currentUser?.email || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div>
                          <label className="form-label" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Designation Role</label>
                          <input type="text" className="form-input" value={currentUser?.role === "admin" ? "System Administrator" : "Staff Member"} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Phone Number</label>
                          <input type="text" className="form-input" id="profile-phone-input" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div>
                          <label className="form-label" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Language Preference</label>
                          <select className="form-input" id="profile-lang-select" value={profileLanguage} onChange={e => setProfileLanguage(e.target.value)} style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <label className="form-label" style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>Two-Factor Auth (2FA)</label>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input type="checkbox" id="profile-2fa-toggle" checked={profile2FA} onChange={e => setProfile2FA(e.target.checked)} style={{ cursor: "pointer", width: "16px", height: "16px" }} />
                            <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>{profile2FA ? "Enabled" : "Disabled"}</span>
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-primary" id="save-profile-btn" style={{ marginTop: "16px" }} onClick={() => {
                        if (!profilePhone.trim()) {
                          setProfileMessage("Error: Phone number is required.");
                          return;
                        }
                        setProfileMessage("Profile details updated successfully!");
                        setTimeout(() => setProfileMessage(""), 4000);
                      }}>
                        Save Profile Details
                      </button>
                    </div>

                    <div className="glass-panel" style={{ padding: "24px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                        🔒 Security Settings
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div>
                          <label className="form-label" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Current Password</label>
                          <input type="password" id="profile-curr-pass" className="form-input" value={profileCurrentPassword} onChange={e => setProfileCurrentPassword(e.target.value)} />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>New Password</label>
                          <input type="password" id="profile-new-pass" className="form-input" value={profileNewPassword} onChange={e => setProfileNewPassword(e.target.value)} />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Confirm New Password</label>
                          <input type="password" id="profile-conf-pass" className="form-input" value={profileConfirmPassword} onChange={e => setProfileConfirmPassword(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" id="change-pass-btn" style={{ marginTop: "10px", width: "100%" }} onClick={() => {
                          if (!profileCurrentPassword || !profileNewPassword || !profileConfirmPassword) {
                            setProfileMessage("Error: All password fields are required.");
                            return;
                          }
                          if (profileNewPassword !== profileConfirmPassword) {
                            setProfileMessage("Error: New passwords do not match.");
                            return;
                          }
                          if (profileNewPassword.length < 6) {
                            setProfileMessage("Error: New password must be at least 6 characters.");
                            return;
                          }
                          setProfileMessage("Password changed successfully!");
                          setProfileCurrentPassword("");
                          setProfileNewPassword("");
                          setProfileConfirmPassword("");
                          setTimeout(() => setProfileMessage(""), 4000);
                        }}>
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
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
            <div className="drawer-card animate-slide-left" onClick={(e) => e.stopPropagation()} style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div className="drawer-banner">
                <button className="drawer-close-btn" onClick={() => setDetailEmployee(null)}>
                  ✕
                </button>
              </div>
              
              <div className="drawer-profile-summary">
                <div className="drawer-avatar" style={{ backgroundColor: getAvatarBg(detailEmployee.name) }}>
                  {getInitials(detailEmployee.name || "UN")}
                </div>
                <h2 className="drawer-name">{detailEmployee.name || detailEmployee.Name}</h2>
                <span className="drawer-role-tag">{detailEmployee.role || detailEmployee.Role}</span>
                <span className="drawer-dept-badge">{detailEmployee.department || detailEmployee.Department}</span>
              </div>

              {/* Drawer Tabs */}
              <div className="drawer-tabs" style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-color)", padding: "0 32px 12px 32px", marginTop: "16px" }}>
                {["Profile", "Leaves", "Performance"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`drawer-tab-btn ${drawerTab === tab.toLowerCase() ? "active" : ""}`}
                    onClick={() => setDrawerTab(tab.toLowerCase())}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: drawerTab === tab.toLowerCase() ? "2px solid #06b6d4" : "2px solid transparent",
                      color: drawerTab === tab.toLowerCase() ? "#06b6d4" : "var(--text-secondary)",
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "13px"
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="drawer-content" style={{ padding: "24px 32px", overflowY: "auto", flexGrow: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                {drawerTab === "profile" && (
                  <>
                    <div className="drawer-section">
                      <h3 className="drawer-section-title">Core Information</h3>
                      <div className="drawer-info-grid">
                        <div className="info-item">
                          <span className="info-label">Employee ID</span>
                          <span className="info-val">#{detailEmployee.id}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Email Address</span>
                          <span className="info-val">{detailEmployee.email || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Joining Date</span>
                          <span className="info-val">
                            {detailEmployee.joiningDate
                              ? new Date(detailEmployee.joiningDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Company Tenure</span>
                          <span className="info-val">{calculateTenure(detailEmployee.joiningDate)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Status</span>
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
                            <div className="info-item">
                              <span className="info-label">Monthly Gross</span>
                              <span className="info-val value-highlight">{formatCurrency(detailEmployee.salary)}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Annual CTC</span>
                              <span className="info-val">{formatCurrency(fin.annual)}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Est. Annual Tax</span>
                              <span className="info-val" style={{ color: "#ef4444" }}>
                                {formatCurrency(fin.tax)}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Est. Take-Home</span>
                              <span className="info-val" style={{ color: "#10b981" }}>
                                {formatCurrency(fin.netAnnual)}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </>
                )}

                {drawerTab === "leaves" && (
                  <div className="drawer-section">
                    <h3 className="drawer-section-title" style={{ marginBottom: "12px" }}>Time Off Requests ({detailEmployee.leaves?.length || 0})</h3>
                    {(!detailEmployee.leaves || detailEmployee.leaves.length === 0) ? (
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>No leave records on file.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {detailEmployee.leaves.map((req, index) => (
                          <div key={req.id || index} style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "var(--radius-md)", fontSize: "13px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                              <strong style={{ color: "var(--text-primary)" }}>{req.leaveType}</strong>
                              <span className={`status-badge-static ${req.status === "Approved" ? "bg-active" : req.status === "Pending" ? "bg-pending" : "bg-leave"}`} style={{ fontSize: "10px" }}>
                                {req.status}
                              </span>
                            </div>
                            <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "4px" }}>
                              🗓️ {req.startDate} to {req.endDate} ({req.totalDays} Day{req.totalDays > 1 ? "s" : ""})
                            </div>
                            <div style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "12px" }}>
                              "{req.reason}"
                            </div>
                            {req.remarks && (
                              <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--accent-cyan)", borderTop: "1px dashed var(--border-color)", paddingTop: "4px" }}>
                                Note: {req.remarks}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {drawerTab === "performance" && (
                  <div className="drawer-section">
                    <h3 className="drawer-section-title" style={{ marginBottom: "12px" }}>Performance Review</h3>
                    {(() => {
                      const feedback = feedbackList[detailEmployee.id] || {
                        rating: 3.0,
                        okrProgress: 50,
                        feedback: "No evaluation recorded yet.",
                        lastReviewDate: "N/A"
                      };

                      const handleSaveFeedback = () => {
                        const updated = {
                          rating: parseFloat(editRating),
                          okrProgress: parseInt(editOkr),
                          feedback: editFeedbackText,
                          lastReviewDate: new Date().toISOString().split("T")[0]
                        };
                        const newList = { ...feedbackList, [detailEmployee.id]: updated };
                        setFeedbackList(newList);
                        localStorage.setItem("employeeFeedback", JSON.stringify(newList));
                        setIsEditingFeedback(false);
                      };

                      if (isEditingFeedback) {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div className="form-group">
                              <label className="form-label" htmlFor="edit-rating-input">Rating (1.0 - 5.0)</label>
                              <input
                                id="edit-rating-input"
                                type="number"
                                className="form-input"
                                min="1"
                                max="5"
                                step="0.1"
                                value={editRating}
                                onChange={(e) => setEditRating(e.target.value)}
                                style={{ background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "var(--radius-md)" }}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label" htmlFor="edit-okr-input">OKR Progress ({editOkr}%)</label>
                              <input
                                id="edit-okr-input"
                                type="range"
                                min="0"
                                max="100"
                                value={editOkr}
                                onChange={(e) => setEditOkr(e.target.value)}
                                style={{ width: "100%", accentColor: "var(--accent-cyan)" }}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label" htmlFor="edit-feedback-textarea">Feedback Comments</label>
                              <textarea
                                id="edit-feedback-textarea"
                                className="form-input"
                                style={{ minHeight: "80px", resize: "vertical", background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "var(--radius-md)", fontFamily: "inherit" }}
                                value={editFeedbackText}
                                onChange={(e) => setEditFeedbackText(e.target.value)}
                              />
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                              <button className="btn btn-primary save-eval-btn" onClick={handleSaveFeedback}>
                                Save Review
                              </button>
                              <button className="btn btn-secondary" onClick={() => setIsEditingFeedback(false)}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "var(--radius-md)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Performance Rating:</span>
                              <strong style={{ fontSize: "16px", color: "#f59e0b" }} className="eval-rating-display">⭐ {feedback.rating} / 5.0</strong>
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                                <span>OKR Progress:</span>
                                <strong className="eval-okr-display">{feedback.okrProgress}%</strong>
                              </div>
                              <div style={{ width: "100%", height: "6px", background: "var(--bg-tertiary)", borderRadius: "3px", overflow: "hidden" }}>
                                <div style={{ width: `${feedback.okrProgress}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #06b6d4)", borderRadius: "3px" }}></div>
                              </div>
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "right" }}>
                              Last Review Date: {feedback.lastReviewDate}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>MANAGER FEEDBACK</span>
                            <blockquote style={{ background: "rgba(6, 182, 212, 0.05)", borderLeft: "3px solid var(--accent-cyan)", padding: "12px", borderRadius: "0 var(--radius-md) var(--radius-md) 0", fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic", margin: 0 }} className="eval-comments-display">
                              "{feedback.feedback}"
                            </blockquote>
                          </div>
                          <button
                            className="btn btn-secondary w-full edit-eval-btn"
                            onClick={() => {
                              setEditRating(feedback.rating);
                              setEditOkr(feedback.okrProgress);
                              setEditFeedbackText(feedback.feedback);
                              setIsEditingFeedback(true);
                            }}
                            style={{ marginTop: "8px" }}
                          >
                            ✏️ Edit Review
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
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

        {/* 4. Performance Evaluation Modal */}
        {performanceEvalEmployee && (
          <div className="modal-overlay" onClick={() => setPerformanceEvalEmployee(null)}>
            <div className="confirm-card animate-zoom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
              <h2 className="confirm-title" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px" }}>
                ✍️ Performance Evaluation
              </h2>
              <p className="confirm-desc" style={{ marginBottom: "16px" }}>
                Update performance ratings and OKR progress log for <strong>{performanceEvalEmployee.name || performanceEvalEmployee.Name}</strong>.
              </p>
              
              {(() => {
                const perf = feedbackList[performanceEvalEmployee.id] || { rating: 5, okrProgress: 80, feedback: "Consistent performer.", lastReviewDate: "N/A" };
                return (
                  <PerformanceModalInner
                    perf={perf}
                    onSave={(updatedPerf) => {
                      const updatedList = {
                        ...feedbackList,
                        [performanceEvalEmployee.id]: {
                          ...updatedPerf,
                          lastReviewDate: new Date().toISOString().split("T")[0]
                        }
                      };
                      setFeedbackList(updatedList);
                      localStorage.setItem("employeeFeedback", JSON.stringify(updatedList));
                      setPerformanceEvalEmployee(null);
                    }}
                    onCancel={() => setPerformanceEvalEmployee(null)}
                  />
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PerformanceModalInner({ perf, onSave, onCancel }) {
  const [rating, setRating] = useState(perf.rating || 5);
  const [okr, setOkr] = useState(perf.okrProgress || 80);
  const [feedback, setFeedback] = useState(perf.feedback || "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
      <div>
        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
          Performance Rating (1.0 to 5.0)
        </label>
        <input 
          type="number" 
          step="0.1" 
          min="1" 
          max="5"
          className="form-input" 
          value={rating} 
          onChange={(e) => setRating(e.target.value)} 
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
          OKR Completion Progress (%)
        </label>
        <input 
          type="range" 
          min="0" 
          max="100"
          style={{ width: "100%", margin: "8px 0", accentColor: "#06b6d4" }} 
          value={okr} 
          onChange={(e) => setOkr(e.target.value)} 
        />
        <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Current Progress: {okr}%</span>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
          Feedback Log
        </label>
        <textarea 
          className="form-input" 
          style={{ width: "100%", minHeight: "80px", padding: "10px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", resize: "vertical", fontFamily: "inherit" }}
          value={feedback} 
          onChange={(e) => setFeedback(e.target.value)} 
        />
      </div>

      <div className="confirm-buttons" style={{ marginTop: "24px" }}>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={() => onSave({ rating: Number(rating), okrProgress: Number(okr), feedback })}>
          Save Evaluation
        </button>
      </div>
    </div>
  );
}

export default App;
