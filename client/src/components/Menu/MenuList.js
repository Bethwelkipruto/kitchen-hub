import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/menuService';
import { getCategories } from '../../services/categoryService';
import { orderService } from '../../services/orderService';

function MenuList({ onAddToCart, userId, isAuthenticated }) {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: ''
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await getMenuItems();
      setMenuItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id)
      };
      
      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData);
        setEditingItem(null);
      } else {
        await createMenuItem(itemData);
      }
      
      setFormData({ name: '', description: '', price: '', category_id: '', image_url: '' });
      setShowForm(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category_id: item.category_id.toString(),
      image_url: item.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterItems(term, selectedCategory);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    filterItems(searchTerm, categoryId);
  };

  const filterItems = (search, category) => {
    let filtered = menuItems;
    
    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(item => item.category_id.toString() === category);
    }
    
    setFilteredItems(filtered);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category_id: '', image_url: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleAddToCart = async (menuItemId) => {
    if (onAddToCart) {
      onAddToCart(menuItemId);
    }
  };

  if (loading) return <div>Loading menu...</div>;

  return (
    <div className="page-container">
      <div className="hero">
        <h1>Our Menu</h1>
        <p>Discover our carefully crafted dishes made with the finest ingredients</p>
      </div>
      
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('')}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id.toString() ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(cat.id.toString())}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      
      {!isAuthenticated && (
        <div style={{ 
          backgroundColor: '#e8f5e9', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          textAlign: 'center',
          border: '2px solid #4caf50'
        }}>
          <p style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>
            🍽️ Browse our delicious menu! <a href="/register" style={{ color: '#4caf50', fontWeight: 'bold' }}>Register</a> or <a href="/login" style={{ color: '#4caf50', fontWeight: 'bold' }}>Login</a> to order.
          </p>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading menu items...</div>
      ) : (
        <div className="menu-items">
          {filteredItems.map(item => (
            <MenuItem 
              key={item.id} 
              item={item} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddToCart={handleAddToCart}
              userId={userId}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuList;