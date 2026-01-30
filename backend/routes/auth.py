from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from utils.user_queries import get_user_by_phone, create_user
from werkzeug.security import check_password_hash, generate_password_hash
import bcrypt

from db import get_db_connection

auth_bp = Blueprint("auth_bp", __name__, url_prefix="/auth")

# =======================
# SIGN UP
# =======================
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid JSON"
        }), 400

    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")  # OPTIONAL
    password = data.get("password")

    # ✅ REQUIRED FIELDS
    if not name or not phone or not password:
        return jsonify({
            "success": False,
            "message": "Name, phone and password are required"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # ✅ CHECK DUPLICATES
    if email:
        cursor.execute(
            "SELECT id FROM users WHERE phone = %s OR email = %s",
            (phone, email)
        )
    else:
        cursor.execute(
            "SELECT id FROM users WHERE phone = %s",
            (phone,)
        )

    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({
            "success": False,
            "message": "User already exists"
        }), 409

    hashed_password = generate_password_hash(password)

    cursor.execute("""
        INSERT INTO users (name, phone, email, password, role)
        VALUES (%s, %s, %s, %s, 'user')
    """, (name, phone, email, hashed_password))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Account created successfully"
    }), 201



# =======================
# LOGIN (USER + ADMIN)
# =======================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"success": False, "message": "Invalid JSON"}), 400

    identifier = data.get("identifier")  # phone OR email
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"success": False, "message": "Credentials required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, name, phone, email, password, role
        FROM users
        WHERE phone=%s OR email=%s
    """, (identifier, identifier))

    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    # 🔐 JWT WITH ROLE
    access_token = create_access_token(
        identity=str(user["id"]),
        additional_claims={"role": user["role"]}
    )

    return jsonify({
        "success": True,
        "access_token": access_token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "phone": user["phone"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200