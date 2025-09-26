import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/Admin/AdminDashboard';

function AdminPage() {
  const { user, isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div>
      <AdminDashboard userId={user?.id} isAdmin={isAdmin} />
    </div>
  );
}

export default AdminPage;