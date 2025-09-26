#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db
from routes.order_routes import order_bp
from routes.menu_routes import menu_bp
from routes.category_routes import category_bp
from routes.admin_routes import admin_bp
from routes.auth_routes import auth_bp
app.register_blueprint(order_bp)
app.register_blueprint(menu_bp)
app.register_blueprint(category_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(auth_bp)

@app.route('/')
def index():
    return '<h1>Quick Bite API</h1>'

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    allowed_origins = [
        os.environ.get('FRONTEND_URL', 'http://localhost:3000'),
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:3002',
        'http://localhost:3003'
    ]
    
    if origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    
    return response

@app.route('/init-db')
def init_db():
    try:
        db.create_all()
        return 'Database initialized successfully!'
    except Exception as e:
        return f'Error: {str(e)}'

@app.route('/create-test-data')
def create_test_data():
    try:
        from models import Category, MenuItem
        
        # Create categories if they don't exist
        categories_data = [
            {'name': 'Appetizers', 'description': 'Start your meal right'},
            {'name': 'Main Course', 'description': 'Hearty main dishes'},
            {'name': 'Desserts', 'description': 'Sweet endings'},
            {'name': 'Beverages', 'description': 'Refreshing drinks'}
        ]
        
        for cat_data in categories_data:
            existing = Category.query.filter_by(name=cat_data['name']).first()
            if not existing:
                category = Category(name=cat_data['name'], description=cat_data['description'])
                db.session.add(category)
        
        db.session.commit()
        
        # Get category IDs
        appetizers = Category.query.filter_by(name='Appetizers').first()
        main_course = Category.query.filter_by(name='Main Course').first()
        
        # Create sample menu items
        menu_items = [
            {'name': 'Caesar Salad', 'description': 'Fresh romaine lettuce with caesar dressing', 'price': 12.99, 'category_id': appetizers.id},
            {'name': 'Grilled Chicken', 'description': 'Juicy grilled chicken breast', 'price': 18.99, 'category_id': main_course.id}
        ]
        
        for item_data in menu_items:
            existing = MenuItem.query.filter_by(name=item_data['name']).first()
            if not existing:
                item = MenuItem(**item_data)
                db.session.add(item)
        
        db.session.commit()
        
        return 'Test data created successfully!'
    except Exception as e:
        return f'Error creating test data: {str(e)}'

@app.route('/cleanup-users')
def cleanup_users():
    try:
        from models import User
        
        # Get all admin users
        admin_users = User.query.filter_by(username='admin').all()
        
        # Delete all admin users
        for user in admin_users:
            db.session.delete(user)
        
        db.session.commit()
        
        # Create single proper admin user
        admin = User(
            username='admin',
            email='admin@mvulecatering.com',
            is_admin=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        
        return f'Cleaned up {len(admin_users)} duplicate admin users. Created single admin: admin/admin123'
    except Exception as e:
        return f'Error cleaning up users: {str(e)}'

@app.route('/reset-admin')
def reset_admin():
    try:
        from models import User
        
        # Delete existing admin
        admin = User.query.filter_by(username='admin').first()
        if admin:
            db.session.delete(admin)
            db.session.commit()
        
        # Create fresh admin user
        admin = User(
            username='admin',
            email='admin@mvulecatering.com',
            is_admin=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        
        return 'Admin user reset successfully! Username: admin, Password: admin123'
    except Exception as e:
        return f'Error resetting admin: {str(e)}'

@app.route('/create-admin')
def create_admin():
    try:
        from models import User
        
        # Check if admin exists
        admin = User.query.filter_by(username='admin').first()
        if admin:
            return 'Admin user already exists!'
        
        # Create admin user
        admin = User(
            username='admin',
            email='admin@mvulecatering.com',
            is_admin=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        
        return 'Admin user created successfully! Username: admin, Password: admin123'
    except Exception as e:
        return f'Error creating admin: {str(e)}'

@app.route('/seed-db')
def seed_db():
    try:
        from models import User, Category, MenuItem
        
        # Create admin first
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@mvulecatering.com',
                is_admin=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
        
        # Create categories
        categories = [
            Category(name="Wings", description="Mouth tantalizing chicken wings"),
            Category(name="Burgers", description="Succulent beef burgers"),
            Category(name="Fries", description="Crispy combo fries")
        ]
        
        for category in categories:
            if not Category.query.filter_by(name=category.name).first():
                db.session.add(category)
        
        db.session.commit()
        
        # Create menu items
        menu_items = [
            MenuItem(name="Chicken Wings", description="6pc wings with fries", price=6.50, category_id=1, available=True),
            MenuItem(name="Beef Burger", description="Grilled beef burger with slaw", price=6.00, category_id=2, available=True),
            MenuItem(name="Combo Fries", description="Fries with minced beef topping", price=6.50, category_id=3, available=True)
        ]
        
        for item in menu_items:
            if not MenuItem.query.filter_by(name=item.name).first():
                db.session.add(item)
        
        db.session.commit()
        return 'Database seeded successfully with admin user!'
    except Exception as e:
        return f'Seed Error: {str(e)}'

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5555))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)

