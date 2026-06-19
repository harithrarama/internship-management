import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }
    setUser(currentUser);

    setInternships(JSON.parse(localStorage.getItem("internships")) || []);
    setApplications(JSON.parse(localStorage.getItem("applications")) || []);
  }, [navigate]);

  const handleAddInternship = (e) => {
    e.preventDefault();
    const newInternship = {
      id: Date.now(),
      title,
      company,
      duration,
      stipend,
    };
    const updated = [...internships, newInternship];
    setInternships(updated);
    localStorage.setItem("internships", JSON.stringify(updated));

    setTitle(""); setCompany(""); setDuration(""); setStipend("");
  };

  const handleStatusChange = (appId, newStatus) => {
    const updated = applications.map((app) =>
      app.id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    localStorage.setItem("applications", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const getStatusClass = (status) => {
    if (status === "approved") return "status-approved";
    if (status === "rejected") return "status-rejected";
    return "status-pending";
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="header-row">
        <h1>Welcome, {user.name} (Admin)</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Add New Internship</h2>
      <form onSubmit={handleAddInternship}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
        <input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        <input placeholder="Stipend" value={stipend} onChange={(e) => setStipend(e.target.value)} required />
        <button type="submit">Add Internship</button>
      </form>

      <h2>All Applications</h2>
      {applications.length === 0 && <p>No applications yet.</p>}
      {applications.map((app) => {
        const internship = internships.find((i) => i.id === app.internshipId);
        return (
          <div key={app.id} className="card">
            <p>Student: {app.studentName} ({app.studentEmail})</p>
            <p>Internship: {internship ? internship.title : "Unknown"}</p>
            <p>Status: <span className={getStatusClass(app.status)}>{app.status}</span></p>
            <button onClick={() => handleStatusChange(app.id, "approved")}>Approve</button>{" "}
            <button onClick={() => handleStatusChange(app.id, "rejected")}>Reject</button>
          </div>
        );
      })}
    </div>
  );
}

export default AdminDashboard;