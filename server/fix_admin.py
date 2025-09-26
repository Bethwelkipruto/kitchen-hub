#!/usr/bin/env python3

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from config import db
from models import User, Category, MenuItem

def fix_admin():
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        
        # Create admin user
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
            print("✅ Admin user created!")
        else:
            print("✅ Admin user already exists!")
        
        # Create test user
        test_user = User.query.filter_by(username='john_doe').first()
        if not test_user:
            test_user = User(
                username='john_doe',
                email='john@example.com',
                is_admin=False
            )
            test_user.set_password('password123')
            db.session.add(test_user)
            db.session.commit()
            print("✅ Test user created!")
        
        print("\n🔐 Admin Credentials:")
        print("Username: admin")
        print("Password: admin123")
        print("\n🔐 Test User Credentials:")
        print("Username: john_doe")
        print("Password: password123")

if __name__ == '__main__':
    fix_admin()