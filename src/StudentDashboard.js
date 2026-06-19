import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "student") {
      navigate("/");
      return;
    }
    setUser(currentUser);

    const savedInternships = JSON.parse(localStorage.getItem("internships")) || [];
    setInternships(savedInternships);

    const savedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(savedApplications);
  }, [navigate]);

  const handleApply = (internshipId) => {
    const newApplication = {
      id: Date.now(),
      studentEmail: user.email,
      studentName: user.name,
      internshipId: internshipId,
      status: "pending",
    };

    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem("applications", JSON.stringify(updatedApplications));
    alert("Applied successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const hasApplied = (internshipId) => {
    return applications.some(
      (app) => app.internshipId === internshipId && app.studentEmail === user?.email
    );
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
        <h1>Welcome, {user.name}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Available Internships</h2>
      {internships.length === 0 && <p>No internships available yet.</p>}

      {internships.map((internship) => (
        <div key={internship.id} className="card">
          <h3>{internship.title}</h3>
          <p>Company: {internship.company}</p>
          <p>Duration: {internship.duration}</p>
          <p>Stipend: {internship.stipend}</p>

          {hasApplied(internship.id) ? (
            <button disabled>Already Applied</button>
          ) : (
            <button onClick={() => handleApply(internship.id)}>Apply</button>
          )}
        </div>
      ))}

      <h2>My Applications</h2>
      {applications
        .filter((app) => app.studentEmail === user.email)
        .map((app) => {
          const internship = internships.find((i) => i.id === app.internshipId);
          return (
            <div key={app.id} className="card">
              <p>Internship: {internship ? internship.title : "Unknown"}</p>
              <p>Status: <span className={getStatusClass(app.status)}>{app.status}</span></p>
            </div>
          );
        })}
    </div>
  );
}

export default StudentDashboard;