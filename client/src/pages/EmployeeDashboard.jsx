import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const [userName, setUserName] = useState("User");
  const [taskStats, setTaskStats] = useState({
    new: 0,
    completed: 0,
    active: 0,
    failed: 0,
  });
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Common fetchTasks method
  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/api/tasks/my-tasks", {
        headers: { Authorization: token },
      })
      .then((res) => {
        const fetchedTasks = res.data;
        setTasks(fetchedTasks);

        const stats = {
          new: fetchedTasks.filter((t) => t.status === "New").length,
          completed: fetchedTasks.filter((t) => t.status === "Completed").length,
          active: fetchedTasks.filter((t) => t.status === "Active").length,
          failed: fetchedTasks.filter((t) => t.status === "Failed").length,
        };
        setTaskStats(stats);
      })
      .catch((err) => {
        console.error("Error fetching tasks", err);
      });
  };

  useEffect(() => {
    // ✅ Fetch user name
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: token },
      })
      .then((res) => {
        setUserName(res.data.name);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });

    fetchTasks(); // ✅ Fetch tasks on load
  }, []);

  const updateStatus = (taskId, status) => {
    axios
      .put(
        `http://localhost:5000/api/tasks/update-status/${taskId}`,
        { status },
        { headers: { Authorization: token } }
      )
      .then(() => {
        fetchTasks(); // ✅ Refresh task + stats after update
      })
      .catch((err) => {
        console.error("Error updating status:", err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container-fluid min-vh-100 py-4 px-5" style={{ backgroundColor: "#111" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 text-white">
        <h3>Hello <strong>{userName}</strong> 👋</h3>
        <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-5">
        {["new", "completed", "active", "failed"].map((key) => {
          const colorMap = {
            new: "primary",
            completed: "success",
            active: "warning",
            failed: "danger",
          };
          return (
            <div className="col-md-3" key={key}>
              <div className={`card text-white text-center bg-${colorMap[key]} rounded-4 py-4`}>
                <h2>{taskStats[key]}</h2>
                <p>{key.charAt(0).toUpperCase() + key.slice(1)} Task</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Cards */}
      <div className="row g-4">
        {tasks.map((task) => (
          <div key={task._id} className="col-md-4">
            <div className="card text-white rounded-4 p-3" style={{ backgroundColor: "#222" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-danger">{task.tag}</span>
                <small className="text-muted">{task.dueDate}</small>
              </div>
              <h5 className="mb-1">{task.title}</h5>
              <p className="mb-3 text-light">{task.description}</p>
              <div className="d-flex gap-2">
                {task.status !== "Completed" && (
                  <button className="btn btn-success btn-sm" onClick={() => updateStatus(task._id, "Completed")}>
                    Mark as Completed
                  </button>
                )}
                {task.status !== "Failed" && (
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(task._id, "Failed")}>
                    Mark as Failed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
