import axios from "axios";

// Default seed data for our application
const DEFAULT_EMPLOYEES = [
  {
    id: "EMP-101",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@company.com",
    role: "Tech Lead",
    department: "Engineering",
    salary: 240000,
    joiningDate: "2022-04-12",
    status: "Active"
  },
  {
    id: "EMP-102",
    name: "Alex Chen",
    email: "alex.chen@company.com",
    role: "Senior Frontend Developer",
    department: "Engineering",
    salary: 180000,
    joiningDate: "2023-01-15",
    status: "Active"
  },
  {
    id: "EMP-103",
    name: "Michael Kross",
    email: "michael.k@company.com",
    role: "Lead UI/UX Designer",
    department: "Design",
    salary: 160000,
    joiningDate: "2021-11-01",
    status: "Active"
  },
  {
    id: "EMP-104",
    name: "Jessica Taylor",
    email: "jessica.t@company.com",
    role: "HR Director",
    department: "HR",
    salary: 125000,
    joiningDate: "2020-08-20",
    status: "Active"
  },
  {
    id: "EMP-105",
    name: "David Kim",
    email: "david.kim@company.com",
    role: "QA Engineer",
    department: "QA",
    salary: 95000,
    joiningDate: "2023-06-10",
    status: "On Leave"
  },
  {
    id: "EMP-106",
    name: "Emily Watson",
    email: "emily.w@company.com",
    role: "Senior Product Marketer",
    department: "Marketing",
    salary: 110000,
    joiningDate: "2022-09-05",
    status: "Active"
  }
];

// Initialize localStorage if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem("employees")) {
    localStorage.setItem("employees", JSON.stringify(DEFAULT_EMPLOYEES));
  }
};

initializeLocalStorage();

// Intercept axios requests to simulate a backend REST API
axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes("/api/employees")) {
    config.adapter = (cfg) => {
      return new Promise((resolve, reject) => {
        const url = cfg.url;
        const method = cfg.method.toLowerCase();
        let employees = JSON.parse(localStorage.getItem("employees")) || [];

        // Simple URL parsing
        // Base API: /api/employees
        // Single employee API: /api/employees/:id
        const isSingleEmployeeRegex = /\/api\/employees\/([A-Za-z0-9-]+)$/;
        const match = url.match(isSingleEmployeeRegex);

        let responseData = null;
        let statusCode = 200;

        if (method === "get") {
          if (match) {
            // GET /api/employees/:id
            const empId = match[1];
            const emp = employees.find((e) => e.id === empId);
            if (emp) {
              responseData = emp;
              statusCode = 200;
            } else {
              responseData = { message: "Employee not found" };
              statusCode = 404;
            }
          } else {
            // GET /api/employees
            responseData = employees;
            statusCode = 200;
          }
        } else if (method === "post") {
          // POST /api/employees
          const newEmp = JSON.parse(cfg.data);
          // Generate a custom ID
          const nextNum = employees.reduce((max, emp) => {
            const num = parseInt(emp.id.split("-")[1], 10);
            return num > max ? num : max;
          }, 100) + 1;
          
          newEmp.id = `EMP-${nextNum}`;
          employees.push(newEmp);
          localStorage.setItem("employees", JSON.stringify(employees));
          responseData = newEmp;
          statusCode = 201;
        } else if (method === "put") {
          if (match) {
            // PUT /api/employees/:id
            const empId = match[1];
            const updatedData = JSON.parse(cfg.data);
            const index = employees.findIndex((e) => e.id === empId);

            if (index !== -1) {
              employees[index] = { ...employees[index], ...updatedData, id: empId };
              localStorage.setItem("employees", JSON.stringify(employees));
              responseData = employees[index];
              statusCode = 200;
            } else {
              responseData = { message: "Employee not found" };
              statusCode = 404;
            }
          } else {
            responseData = { message: "Bad Request" };
            statusCode = 400;
          }
        } else if (method === "delete") {
          if (match) {
            // DELETE /api/employees/:id
            const empId = match[1];
            const initialLength = employees.length;
            employees = employees.filter((e) => e.id !== empId);

            if (employees.length < initialLength) {
              localStorage.setItem("employees", JSON.stringify(employees));
              responseData = { success: true, message: "Employee deleted successfully" };
              statusCode = 200;
            } else {
              responseData = { message: "Employee not found" };
              statusCode = 404;
            }
          } else {
            responseData = { message: "Bad Request" };
            statusCode = 400;
          }
        }

        // Simulate server response latency
        setTimeout(() => {
          if (statusCode >= 200 && statusCode < 300) {
            resolve({
              data: responseData,
              status: statusCode,
              statusText: statusCode === 201 ? "Created" : "OK",
              headers: {},
              config: cfg
            });
          } else {
            reject({
              response: {
                data: responseData,
                status: statusCode,
                statusText: "Error",
                headers: {},
                config: cfg
              }
            });
          }
        }, 300);
      });
    };
  }
  return config;
});

// Employee service API calls
const employeeService = {
  getEmployees: async () => {
    const response = await axios.get("/api/employees");
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await axios.get(`/api/employees/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await axios.post("/api/employees", employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await axios.put(`/api/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await axios.delete(`/api/employees/${id}`);
    return response.data;
  }
};

export default employeeService;
