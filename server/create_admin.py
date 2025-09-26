#!/usr/bin/env python3

from app import app
from models import db, User

def create_admin():
    """Create admin user if it doesn't exist"""
    with app.app_context():
        # Check if admin exists
        admin = User.query.filter_by(username='admin').first()
        
        if not admin:
            print("Creating admin user...")
            admin = User(
                username='admin',
                email='admin@mvulecatering.com',
                is_admin=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists")
            # Update password to ensure it works
            admin.set_password('admin123')
            admin.is_admin = True
            db.session.commit()
            print("Admin password updated!")

if __name__ == '__main__':
    create_admin()