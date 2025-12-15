import axios from 'axios';
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    date: "",
    assignedTo: "",
    category: "",
    description: "",
  });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Error loading summary", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchSummary();
  }, []);

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tasks/create", taskForm);
      alert("✅ Task Created!");
      setTaskForm({
        title: "",
        date: "",
        assignedTo: "",
        category: "",
        description: "",
      });
      fetchSummary();   // Refresh summary
      fetchEmployees(); // Optional: if employee list changes
    } catch (err) {
      console.error("Task creation failed", err);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-4 px-5" style={{ backgroundColor: "#111", color: "#fff" }}>
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* --- Task Creation Form --- */}
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="row g-3">
          <div className="col-md-6">
            <input type="text" name="title" className="form-control" placeholder="Task Title" value={taskForm.title} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input type="date" name="date" className="form-control" value={taskForm.date} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <select name="assignedTo" className="form-control" value={taskForm.assignedTo} onChange={handleChange} required>
              <option value="">Select Employee</option>
              {employees.map((emp, index) => (
                <option key={index} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <input type="text" name="category" className="form-control" placeholder="Category" value={taskForm.category} onChange={handleChange} />
          </div>
          <div className="col-12">
            <textarea name="description" className="form-control" placeholder="Description" value={taskForm.description} onChange={handleChange}></textarea>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-success">Create Task</button>
          </div>
        </div>
      </form>

      {/* --- Employee Task Summary --- */}
      <h4 className="mt-5">Employee Task Summary</h4>
      <table className="table table-bordered table-dark mb-5">
        <thead>
          <tr>
            <th>Name</th>
            <th>New</th>
            <th>Active</th>
            <th>Completed</th>
            <th>Failed</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((emp, index) => (
            <tr key={index}>
              <td>{emp.name}</td>
              <td>{emp.new || 0}</td>
              <td>{emp.active || 0}</td>
              <td>{emp.completed || 0}</td>
              <td>{emp.failed || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Employee List with Assign Button --- */}
      <h4>Employee List</h4>
      <table className="table table-dark table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
     
            <th>Assign Task</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={index}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
           
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => setTaskForm({ ...taskForm, assignedTo: emp.name })}
                >
                  Select for Task
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
