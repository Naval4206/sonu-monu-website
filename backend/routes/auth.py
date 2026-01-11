from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from utils.user_queries import get_user_by_phone, create_user
from werkzeug.security import check_password_hash, generate_password_hash
import bcrypt

from db import get_db_connection

auth_bp = Blueprint("auth", __name__)

# ---------------- REGISTER ----------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    phone = data.get("phone")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if not phone or not password:
        return jsonify({"error": "Phone and password required"}), 400

    hashed_password = generate_password_hash(password)

    create_user(phone, email, hashed_password, role)

    return jsonify({"message": "User registered"}), 201



# ---------------- LOGIN ----------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "Phone and password required"}), 400

    user = get_user_by_phone(phone)  # your DB function

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(
    identity=str(user["id"]),
    additional_claims={
        "role": user["role"]
    }
)

    return jsonify({
        "access_token": access_token,
        "role": user["role"]
    }), 200

