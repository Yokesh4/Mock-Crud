/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/api";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      showNotification("Failed to fetch users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await updateUser(editingId, form);
        showNotification("User updated successfully!", "success");
      } else {
        await createUser(form);
        showNotification("User added successfully!", "success");
      }
      setForm({ name: "", email: "" });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      showNotification("Operation failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsLoading(true);
      try {
        await deleteUser(id);
        showNotification("User deleted successfully!", "success");
        fetchUsers();
      } catch (error) {
        showNotification("Failed to delete user.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setForm({ name: "", email: "" });
    setEditingId(null);
  };

  return (
    <div className="user-management-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-content">
          <h1 className="main-title">
            <span className="title-icon">👥</span>
            User Management System
          </h1>
          <p className="subtitle">Manage your users efficiently</p>
        </div>
        <div className="stats-badge">
          <span className="stats-number">{users.length}</span>
          <span className="stats-label">Total Users</span>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <span className="notification-icon">
            {notification.type === "success" ? "✓" : "⚠"}
          </span>
          <span className="notification-message">{notification.message}</span>
        </div>
      )}

      {/* Form Section */}
      <div className="form-section">
        <div className="form-header">
          <h2 className="section-title">
            {editingId ? (
              <>
                <span className="icon">✏️</span> Edit User
              </>
            ) : (
              <>
                <span className="icon">➕</span> Add New User
              </>
            )}
          </h2>
          {editingId && (
            <span className="editing-badge">Editing Mode</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <span className="label-icon">👤</span>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="label-icon">✉️</span>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              <span className="btn-icon">{editingId ? "💾" : "➕"}</span>
              {isLoading ? "Processing..." : editingId ? "Update User" : "Add User"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <span className="btn-icon">✕</span>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Users List Section */}
      <div className="users-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="icon">📋</span>
            Users Directory
          </h2>
          {users.length > 0 && (
            <span className="count-badge">{users.length} user{users.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {isLoading && users.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Users Yet</h3>
            <p>Start by adding your first user above</p>
          </div>
        ) : (
          <ul className="user-list">
            {users.map((user, index) => (
              <li 
                key={user.id} 
                className={`user-card ${editingId === user.id ? 'active-card' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="user-details">
                  <div className="user-header">
                    <h3 className="user-name">
                      {user.name}
                      {editingId === user.id && (
                        <span className="active-indicator">Currently Editing</span>
                      )}
                    </h3>
                  </div>
                  <p className="user-email">
                    <span className="email-icon">✉</span>
                    {user.email}
                  </p>
                  <div className="user-meta">
                    <span className="meta-item">
                      <span className="meta-icon">🆔</span>
                      ID: {user.id}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(user)}
                    className="action-btn edit-btn"
                    disabled={isLoading}
                    title="Edit user"
                  >
                    <span className="btn-icon">✏️</span>
                    <span className="btn-text">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="action-btn delete-btn"
                    disabled={isLoading}
                    title="Delete user"
                  >
                    <span className="btn-icon">🗑️</span>
                    <span className="btn-text">Delete</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="footer-section">
        <p>Manage your team efficiently with real-time updates</p>
      </div>
    </div>
  );
};

export default UserManagement;