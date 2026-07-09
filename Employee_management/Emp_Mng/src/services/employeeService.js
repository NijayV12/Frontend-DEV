import axios from "axios";

// Active TARGET API URL
const API_URL = "https://6a4b3678f5eab0bb6b6256cf.mockapi.io/Employee";

const employeeService = {
  getEmployees: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await axios.post(API_URL, employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await axios.put(`${API_URL}/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default employeeService;
