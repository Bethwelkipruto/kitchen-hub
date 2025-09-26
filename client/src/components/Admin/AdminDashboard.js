import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5555';

function AdminDashboard({ userId, isAdmin }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category_id: '', image_url: '' });

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
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users?user_id=${userId}`);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const loadMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/`);
      const data = await response.json();
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading menu items:', error);
      setMenuItems([]);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
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

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem 
        ? `${API_BASE_URL}/api/admin/menu-items/${editingItem.id}`
        : `${API_BASE_URL}/api/admin/menu-items`;
      const method = editingItem ? 'PATCH' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...menuForm, user_id: userId, price: parseFloat(menuForm.price) })
      });
      
      setShowMenuForm(false);
      setEditingItem(null);
      setMenuForm({ name: '', description: '', price: '', category_id: '', image_url: '' });
      loadMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const editMenuItem = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category_id: item.category_id.toString(),
      image_url: item.image_url || ''
    });
    setShowMenuForm(true);
  };

  const addNewMenuItem = () => {
    setEditingItem(null);
    setMenuForm({ name: '', description: '', price: '', category_id: '', image_url: '' });
    setShowMenuForm(true);
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
    backgroundColor: activeTab === tab ? '#4caf50' : 'white',
    color: activeTab === tab ? 'white' : '#2e7d32',
    border: activeTab === tab ? '2px solid #4caf50' : '2px solid #e8f5e9',
    cursor: 'pointer',
    borderRadius: '8px 8px 0 0',
    marginRight: '0.5rem',
    fontWeight: 'bold'
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2e7d32', marginBottom: '2rem', textAlign: 'center' }}>🏪 Kitchen Hub Admin Panel</h1>
      
      <div style={{ marginBottom: '2rem', borderBottom: '2px solid #4caf50' }}>
        <button style={tabStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
        <button style={tabStyle('orders')} onClick={() => setActiveTab('orders')}>📋 Orders</button>
        <button style={tabStyle('menu')} onClick={() => setActiveTab('menu')}>🍽️ Menu</button>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>👥 Users</button>
        <button style={tabStyle('categories')} onClick={() => setActiveTab('categories')}>📂 Categories</button>
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <h2 style={{ color: '#2e7d32', borderBottom: '2px solid #4caf50', paddingBottom: '0.5rem' }}>📈 Business Overview</h2>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '10px', border: '2px solid #4caf50', boxShadow: '0 4px 8px rgba(76, 175, 80, 0.1)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>👥 Total Users</h3>
                <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#4caf50' }}>{stats.total_users}</p>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '10px', border: '2px solid #66bb6a', boxShadow: '0 4px 8px rgba(102, 187, 106, 0.1)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>📋 Total Orders</h3>
                <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#66bb6a' }}>{stats.total_orders}</p>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '10px', border: '2px solid #81c784', boxShadow: '0 4px 8px rgba(129, 199, 132, 0.1)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>🍽️ Menu Items</h3>
                <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#81c784' }}>{stats.total_menu_items}</p>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: '#e8f5e9', borderRadius: '10px', border: '2px solid #4caf50', boxShadow: '0 4px 8px rgba(76, 175, 80, 0.1)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>⏳ Pending Orders</h3>
                <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#4caf50' }}>{stats.pending_orders}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 style={{ color: '#2e7d32', borderBottom: '2px solid #4caf50', paddingBottom: '0.5rem' }}>📋 Order Management & Approval</h2>
          
          {/* Quick Actions for Pending Orders */}
          {orders.filter(o => o.status === 'pending').length > 0 && (
            <div style={{ backgroundColor: '#fff3e0', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem', border: '2px solid #ff9800' }}>
              <h3 style={{ color: '#e65100', margin: '0 0 1rem 0' }}>⚠️ Orders Awaiting Your Approval ({orders.filter(o => o.status === 'pending').length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {orders.filter(o => o.status === 'pending').map(order => (
                  <div key={order.id} style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '10px', 
                    border: '2px solid #ff9800',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, color: '#2e7d32' }}>Order #{order.id}</h4>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        backgroundColor: '#fff3e0', 
                        color: '#e65100', 
                        borderRadius: '15px', 
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        ⏳ PENDING
                      </span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>👤 Customer: <strong>{order.username}</strong></p>
                    <p style={{ margin: '0 0 1.5rem 0', color: '#4caf50', fontWeight: 'bold', fontSize: '1.2rem' }}>💰 ${order.total_amount?.toFixed(2)}</p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      >
                        ✅ APPROVE & START COOKING
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      >
                        ❌ REJECT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e8f5e9' }}>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Order #</th>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Customer</th>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Total</th>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Status</th>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Date</th>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>#{order.id}</td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{order.username}</td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6', fontWeight: 'bold' }}>${order.total_amount?.toFixed(2)}</td>
                    <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                      <span style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        backgroundColor: order.status === 'pending' ? '#fff3cd' : order.status === 'completed' ? '#d4edda' : '#f8d7da'
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
                        style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ced4da' }}
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

      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ color: '#2e7d32', borderBottom: '2px solid #4caf50', paddingBottom: '0.5rem' }}>🍽️ Menu Management</h2>
            <button 
              onClick={addNewMenuItem}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ➕ Add New Item
            </button>
          </div>

          {showMenuForm && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '10px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
              border: '2px solid #4caf50'
            }}>
              <h3 style={{ color: '#2e7d32', marginBottom: '1rem' }}>
                {editingItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
              </h3>
              <form onSubmit={handleMenuSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                    style={{ padding: '0.75rem', border: '2px solid #e8f5e9', borderRadius: '5px' }}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                    style={{ padding: '0.75rem', border: '2px solid #e8f5e9', borderRadius: '5px' }}
                    required
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #e8f5e9', borderRadius: '5px', marginBottom: '1rem', minHeight: '80px' }}
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <select
                    value={menuForm.category_id}
                    onChange={(e) => setMenuForm({...menuForm, category_id: e.target.value})}
                    style={{ padding: '0.75rem', border: '2px solid #e8f5e9', borderRadius: '5px' }}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    placeholder="Image URL (optional)"
                    value={menuForm.image_url}
                    onChange={(e) => setMenuForm({...menuForm, image_url: e.target.value})}
                    style={{ padding: '0.75rem', border: '2px solid #e8f5e9', borderRadius: '5px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="submit"
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {editingItem ? '💾 Update Item' : '➕ Create Item'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowMenuForm(false)}
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {menuItems.map(item => (
              <div key={item.id} style={{ 
                backgroundColor: 'white', 
                padding: '1rem', 
                borderRadius: '10px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: item.available ? '2px solid #4caf50' : '2px solid #f44336'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>{item.name}</h4>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>{item.description}</p>
                <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', fontSize: '1.2rem', color: '#4caf50' }}>${item.price}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    backgroundColor: item.available ? '#e8f5e9' : '#ffebee',
                    color: item.available ? '#2e7d32' : '#c62828'
                  }}>
                    {item.available ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => editMenuItem(item)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => toggleMenuItemAvailability(item.id, item.available)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: item.available ? '#f44336' : '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {item.available ? '🚫 Disable' : '✅ Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 style={{ color: '#2e7d32', borderBottom: '2px solid #4caf50', paddingBottom: '0.5rem' }}>👥 User Management</h2>
          <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e8f5e9' }}>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>ID</th>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Username</th>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Email</th>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Role</th>
                  <th style={{ padding: '1rem', border: '1px solid #4caf50', fontWeight: 'bold', color: '#2e7d32' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
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

      {activeTab === 'categories' && (
        <div>
          <h2 style={{ color: '#2e7d32', borderBottom: '2px solid #4caf50', paddingBottom: '0.5rem' }}>📂 Category Management</h2>
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