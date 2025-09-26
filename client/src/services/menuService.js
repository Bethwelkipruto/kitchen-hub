const BACKEND_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5555';
const API_BASE_URL = `${BACKEND_URL}/api/menu`;

export const getMenuItems = async () => {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch menu items');
  }
  return response.json();
};

export const createMenuItem = async (menuItemData) => {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(menuItemData),
  });
  if (!response.ok) {
    throw new Error('Failed to create menu item');
  }
  return response.json();
};

export const updateMenuItem = async (id, menuItemData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(menuItemData),
  });
  if (!response.ok) {
    throw new Error('Failed to update menu item');
  }
  return response.json();
};

export const deleteMenuItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete menu item');
  }
  return response.ok;
};