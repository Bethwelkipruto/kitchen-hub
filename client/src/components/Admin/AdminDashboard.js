import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5555';

function AdminDashboard({ userId, isAdmin }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      loadDashboard();
      loadOrders();
      loadUsers();
      loadMenuItems();
      loadCategories();
    }
  }, [isAdmin]);

  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard?user_id=${userId}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users?user_id=${userId}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/`);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, status: newStatus })
      });
      loadOrders();
      loadDashboard();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const toggleMenuItemAvailability = async (itemId, available) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/menu-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, available: !available })
      });
      loadMenuItems();
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  if (!isAdmin) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Access denied. Admin privileges required.</div>;
  }

  const tabStyle = (tab) => ({
    padding: '1rem 2rem',
    backgroundColor: activeTab === tab ? '#007bff' : '#f8f9fa',
    color: activeTab === tab ? 'white' : '#333',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px 5px 0 0',
    marginRight: '0.5rem'
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>🏪 Kitchen Hub Admin Panel</h1>
      
      {/* Navigation Tabs */}
      <div style={{ marginBottom: '2rem', borderBottom: '2px solid #dee2e6' }}>
        <button style={tabStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
        <button style={tabStyle('orders')} onClick={() => setActiveTab('orders')}>📋 Orders</button>
        <button style={tabStyle('menu')} onClick={() => setActiveTab('menu')}>🍽️ Menu</button>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>👥 Users</button>
        <button style={tabStyle('categories')} onClick={() => setActiveTab('categories')}>📂 Categories</button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          <h2>📈 Business Overview</h2>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', backgroundColor: '#e3f2fd', borderRadius: '10px', border: '1px solid #bbdefb' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>👥 Total Users</h3>
                <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#1976d2' }}>{stats.total_users}</p>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: '#f3e5f5', borderRadius: '10px', border: '1px solid #ce93d8' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#7b1fa2' }}>📋 Total Orders</h3>
                <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#7b1fa2' }}>{stats.total_orders}</p>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: '#e8f5e8', borderRadius: '10px', border: '1px solid #a5d6a7' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#388e3c' }}>🍽️ Menu Items</h3>
                <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#388e3c' }}>{stats.total_menu_items}</p>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: '#fff3e0', borderRadius: '10px', border: '1px solid #ffcc02' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>⏳ Pending Orders</h3>
                <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#f57c00' }}>{stats.pending_orders}</p>
              </div>
            </div>
          )}
          
          <h3>📊 Recent Activity</h3>
          <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '5px' }}>
            <p>• {orders.filter(o => o.status === 'pending').length} orders awaiting approval</p>
            <p>• {orders.filter(o => o.status === 'preparing').length} orders in preparation</p>
            <p>• {menuItems.filter(m => !m.available).length} menu items currently unavailable</p>
          </div>
        </div>
      )}

      {/* Orders Management Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2>📋 Order Management</h2>
          <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Order #</th>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Customer</th>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Total</th>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Date</th>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>#{order.id}</td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{order.username}</td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>${order.total_amount?.toFixed(2)}</td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                      <span style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        backgroundColor: 
                          order.status === 'pending' ? '#fff3cd' : 
                          order.status === 'preparing' ? '#cce5ff' :
                          order.status === 'ready' ? '#d4edda' :
                          order.status === 'completed' ? '#d1ecf1' : '#f8d7da',
                        color:
                          order.status === 'pending' ? '#856404' : 
                          order.status === 'preparing' ? '#004085' :
                          order.status === 'ready' ? '#155724' :
                          order.status === 'completed' ? '#0c5460' : '#721c24'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{ 
                          padding: '0.5rem', 
                          borderRadius: '5px', 
                          border: '1px solid #ced4da',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="preparing">👨‍🍳 Preparing</option>
                        <option value="ready">✅ Ready</option>
                        <option value="completed">🎉 Completed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Menu Management Tab */}
      {activeTab === 'menu' && (
        <div>
          <h2>🍽️ Menu Management</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {menuItems.map(item => (
              <div key={item.id} style={{ 
                backgroundColor: 'white', 
                padding: '1rem', 
                borderRadius: '10px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: item.available ? '2px solid #28a745' : '2px solid #dc3545'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{item.name}</h4>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>{item.description}</p>
                <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', fontSize: '1.2rem', color: '#007bff' }}>${item.price}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    backgroundColor: item.available ? '#d4edda' : '#f8d7da',
                    color: item.available ? '#155724' : '#721c24'
                  }}>
                    {item.available ? '✅ Available' : '❌ Unavailable'}
                  </span>
                  <button 
                    onClick={() => toggleMenuItemAvailability(item.id, item.available)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: item.available ? '#dc3545' : '#28a745',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {item.available ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div>
          <h2>👥 User Management</h2>
          <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>ID</th>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Username</th>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Email</th>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Role</th>
                  <th style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{user.id}</td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>{user.username}</td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{user.email}</td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        backgroundColor: user.is_admin ? '#ffeaa7' : '#74b9ff',
                        color: user.is_admin ? '#2d3436' : 'white'
                      }}>
                        {user.is_admin ? '👑 Admin' : '👤 Customer'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Management Tab */}
      {activeTab === 'categories' && (
        <div>
          <h2>📂 Category Management</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {categories.map(category => (
              <div key={category.id} style={{ 
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '10px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{category.name}</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{category.description}</p>
                <p style={{ margin: '1rem 0 0 0', fontSize: '0.8rem', color: '#007bff' }}>
                  {menuItems.filter(item => item.category_id === category.id).length} items
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;