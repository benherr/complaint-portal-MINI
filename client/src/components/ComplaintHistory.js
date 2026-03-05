import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import "./ComplaintHistory.css";

function ComplaintHistory({ initialStatusFilter = "all" }) {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();
  const { error: showError } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchComplaints(token);
    }
  }, [navigate]);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm, statusFilter, departmentFilter, categoryFilter]);

  const fetchComplaints = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComplaints(response.data || []);
      setLoading(false);
    } catch (error) {
      setError("Error fetching complaints. Please try again later.");
      showError("Failed to load complaints");
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (complaint) =>
          complaint.title?.toLowerCase().includes(term) ||
          complaint.description?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => {
        const status = complaint.status || "Pending";
        return status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.department?.toLowerCase() === departmentFilter.toLowerCase()
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredComplaints(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const s = (status || "Pending").toLowerCase();
    if (s === "resolved") return "status-resolved";
    if (s === "in progress") return "status-progress";
    return "status-pending";
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDepartmentFilter("all");
    setCategoryFilter("all");
  };

  return (
    <div className="complaint-history-container">
      <div className="history-header">
        <h2 className="history-title">Complaint History</h2>
        <p className="history-subtitle">View and manage all your submitted complaints</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Departments</option>
            <option value="ec">EC</option>
            <option value="mca">MCA</option>
            <option value="it">IT</option>
            <option value="cs">CS</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="carpentry">Carpentry</option>
            <option value="cleaning">Cleaning</option>
            <option value="other">Other</option>
          </select>

          {(searchTerm || statusFilter !== "all" || departmentFilter !== "all" || categoryFilter !== "all") && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>

        <div className="results-count">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading complaints...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-text">{error}</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No complaints found</h3>
          <p>
            {complaints.length === 0
              ? "You haven't submitted any complaints yet."
              : "No complaints match your current filters."}
          </p>
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map((complaint) => (
            <Link
              to={`/complaint/${complaint._id}`}
              key={complaint._id}
              className="complaint-card"
            >
              <div className="complaint-card-header">
                <h3 className="complaint-title">{complaint.title}</h3>
                <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                  {complaint.status || "Pending"}
                </span>
              </div>
              <p className="complaint-description">
                {complaint.description?.substring(0, 100)}
                {complaint.description?.length > 100 ? "..." : ""}
              </p>
              <div className="complaint-meta">
                <span className="meta-item">
                  <span className="meta-icon">🏢</span>
                  {complaint.department?.toUpperCase() || "N/A"}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">📁</span>
                  {complaint.category || "N/A"}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  {formatDate(complaint.createdAt)}
                </span>
              </div>
              {complaint.media && (
                <div className="complaint-media-indicator">
                  <span className="media-icon">📎</span>
                  Attachment
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComplaintHistory;
