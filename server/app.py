#!/usr/bin/env python3

# Remote library imports
from flask import request, abort
from flask_restful import Resource
from flask_cors import CORS
import os

# Local imports
from config import app, db
from routes.order_routes import order_bp
from routes.menu_routes import menu_bp
from routes.category_routes import category_bp
from routes.admin_routes import admin_bp
from routes.auth_routes import auth_bp

# Register blueprints
app.register_blueprint(order_bp)
app.register_blueprint(menu_bp)
app.register_blueprint(category_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(auth_bp)

# ------------------------
# CORS setup
# ------------------------
CORS(app, supports_credentials=True, origins=[
    os.environ.get("FRONTEND_URL"_
