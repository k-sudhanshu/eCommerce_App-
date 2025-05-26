from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, unset_jwt_cookies
from db import get_db_connection
import re

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request, no JSON data"}), 400

        email = data.get("email")
        username = data.get("username")
        phone = data.get("phone")
        password = data.get("password")

        if not all([email, username, phone, password]):
            return jsonify({"error": "Missing required fields"}), 400

        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex, email):
            return jsonify({"error": "Invalid email format"}), 400

        hashed_password = generate_password_hash(password)

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "User already exists"}), 400

        cursor.execute("INSERT INTO users (email, username, phone, password) VALUES (%s, %s, %s, %s)",
                       (email, username, phone, hashed_password))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, password FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user["id"])
    print(access_token)
    return jsonify({"message": "Login successful", "access_token": access_token}), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"message": "Successfully logged out"})
    unset_jwt_cookies(response)
    return response, 200
