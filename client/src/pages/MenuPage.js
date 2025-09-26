import React from 'react';
import { useAuth } from '../context/AuthContext';
import MenuList from '../components/Menu/MenuList';
import { orderService } from '../services/orderService';

function MenuPage() {
  const { user, isAuthenticated } = useAuth();

  const handleAddToCart = async (menuItemId) => {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      await orderService.addToCart({
        user_id: user.id,
        menu_item_id: menuItemId,
        quantity: 1
      });
      
      // Trigger cart count refresh in navbar
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="menu-page">
      <MenuList 
        onAddToCart={handleAddToCart}
        userId={user?.id}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

export default MenuPage;