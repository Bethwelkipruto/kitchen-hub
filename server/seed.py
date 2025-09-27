#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from werkzeug.security import generate_password_hash

# Local imports
from app import app
from models import db, User, Order, OrderItem, Category, MenuItem

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # Clear existing data
        OrderItem.query.delete()
        Order.query.delete()
        MenuItem.query.delete()
        Category.query.delete()
        User.query.delete()
        
        # Create categories
        categories = [
            Category(name="Wings", description="Mouth tantalizing chicken wings with various flavors"),
            Category(name="Wraps", description="Delicious wraps with fresh ingredients"),
            Category(name="Burgers", description="Succulent beef burgers grilled to perfection"),
            Category(name="Fries", description="Crispy combo fries with amazing toppings"),
            Category(name="Small Bites", description="Perfect appetizers and snacks"),
            Category(name="Ribs", description="Off the bone beef ribs served with fries")
        ]
        
        for category in categories:
            db.session.add(category)
        
        db.session.commit()
        
        # Create sample users
        users = [
            User(username='john_doe', email='john@example.com', is_admin=False),
            User(username='jane_smith', email='jane@example.com', is_admin=False),
            User(username='chef_mike', email='mike@mvulecatering.com', is_admin=False),
            User(username='admin', email='admin@mvulecatering.com', is_admin=True),
            User(username='customer1', email='customer@example.com', is_admin=False)
        ]
        
        # Set passwords (now properly hashed)
        users[0].set_password('password123')
        users[1].set_password('password123')
        users[2].set_password('password123')
        users[3].set_password('admin123')
        users[4].set_password('password123')
        
        for user in users:
            db.session.add(user)
        
        db.session.commit()
        
        # Create menu items
        menu_items = [
            # Wings
            MenuItem(name="Mouth Tantalizing Chicken Wings", description="Served with fries | 6pc", price=6.50, category_id=1, image_url="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop"),
            MenuItem(name="Duo Wings", description="2 Flavours | 12pc", price=12.50, category_id=1, image_url="https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop"),
            MenuItem(name="Trio Wings", description="3 Flavours | 18pc", price=18.50, category_id=1, image_url="https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop"),
            MenuItem(name="BBQ Coated Wings", description="Classic BBQ flavor wings", price=7.00, category_id=1, image_url="https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop"),
            MenuItem(name="Bread Crumb Wings", description="Crispy bread crumb coated wings", price=7.00, category_id=1, image_url="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop"),
            MenuItem(name="Soy Honey Chilly Wings", description="Sweet and spicy Asian-style wings", price=7.50, category_id=1, image_url="https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop"),
            MenuItem(name="Hot and Spicy Wings", description="Fiery hot wings for spice lovers", price=7.50, category_id=1, image_url="https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400&h=300&fit=crop"),
            MenuItem(name="Lemon and Pepper Wings", description="Zesty lemon pepper seasoned wings", price=7.50, category_id=1, image_url="https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=400&h=300&fit=crop"),
            
            # Wraps
            MenuItem(name="Ronikkies Chicken Wrap", description="Homemade tortilla, shredded chicken, bbq sauce or hot sauce, coleslaw, pickled cucumbers", price=4.50, category_id=2, image_url="https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=400&h=300&fit=crop"),
            MenuItem(name="Big Mac Wrap", description="Homemade tortilla, ground beef, special sauce, lettuce, caramelized onions, pickled cucumber | Option of chilli | Add Fries @ 100", price=4.50, category_id=2, image_url="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop"),
            
            # Burgers
            MenuItem(name="Mvule Smash Burger", description="Succulent beef burgers grilled to perfection with slaw and a choice of our amazing sauces", price=6.00, category_id=3, image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"),
            
            # Fries
            MenuItem(name="Mvule Combo Fries", description="Enjoy a tasty combo of crinkle fries topped with minced beef or chicken, creamy sauce, and BBQ sauce. Spice it up if you like!", price=6.50, category_id=4, image_url="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop"),
            
            # Small Bites
            MenuItem(name="Beef Samosas", description="Crispy pastry filled with spiced beef", price=0.50, category_id=5, image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop"),
            MenuItem(name="Chicken Samosas", description="Crispy pastry filled with seasoned chicken", price=0.60, category_id=5, image_url="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop"),
            MenuItem(name="Spicy Beef Sausages", description="Flavorful spicy beef sausages", price=0.50, category_id=5, image_url="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop"),
            MenuItem(name="Beef Sausages", description="Classic beef sausages", price=0.50, category_id=5, image_url="https://images.unsplash.com/photo-1566843972142-a306d2597d3d?w=400&h=300&fit=crop"),
            MenuItem(name="Chips", description="Crispy golden chips", price=1.50, category_id=5, image_url="https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop"),
            MenuItem(name="Masala Chips", description="Spiced chips with masala seasoning", price=2.00, category_id=5, image_url="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop"),
            
            # Ribs
            MenuItem(name="Mvule Beef Ribs", description="Off the bone beef ribs served with fries. Sauces: Caramelized Onions and Coriander, Glazed With BBQ Sauce, Spicy with Our Secret Hot Sauce", price=8.50, category_id=6, image_url="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop")
        ]
        
        for item in menu_items:
            db.session.add(item)
        
        db.session.commit()
        
        # Create sample orders
        for user in users:
            for _ in range(randint(1, 3)):
                order = Order(
                    user_id=user.id,
                    total_amount=randint(5, 50),
                    status=rc(["pending", "completed", "cancelled"])
                )
                db.session.add(order)
        
        db.session.commit()
        
        print("Database seeded successfully!")