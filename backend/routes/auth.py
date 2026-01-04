from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt

from db import get_db_connection

auth_bp = Blueprint("auth", __name__)

# ---------------- REGISTER ----------------
@auth_bp.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    phone = data.get("phone")
    email = data.get("email")      # optional
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "Phone and password required"}), 400

    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if phone already exists
    cursor.execute(
        "SELECT id FROM users WHERE phone=%s",
        (phone,)
    )
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"error": "Phone number already registered"}), 400

    # Insert new user
    cursor.execute(
        "INSERT INTO users (phone, email, password) VALUES (%s, %s, %s)",
        (phone, email, hashed_pw)
    )
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "User registered successfully"}), 201



# ---------------- LOGIN ----------------
@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    phone = data.get("phone")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE phone=%s", (phone,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
        identity={
            "id": user["id"],
            "role": user.get("role", "user")
        }
    )

    return jsonify({
        "token": token,
        "role": user.get("role", "user")
    }), 200
