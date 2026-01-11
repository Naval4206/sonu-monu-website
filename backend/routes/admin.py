from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os, time

from db import get_db_connection

admin_bp = Blueprint("admin", __name__)

UPLOAD_FOLDER = "uploads/products"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@admin_bp.route("/admin/products", methods=["POST"])
@jwt_required()
def add_product():
    identity = get_jwt_identity()

    # ADMIN CHECK
    if identity.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403

    # FORM DATA
    name = request.form.get("name")
    brand = request.form.get("brand")
    gender = request.form.get("gender")
    size = request.form.get("size")
    image = request.files.get("image")

    if not name or not brand or not image:
        return jsonify({"error": "Missing required fields"}), 400

    if not allowed_file(image.filename):
        return jsonify({"error": "Invalid image type"}), 400

    # SAVE IMAGE
    filename = secure_filename(image.filename)
    unique_name = f"{int(time.time())}_{filename}"
    image_path = f"products/{unique_name}"

    image.save(os.path.join("uploads", image_path))

    # SAVE TO DATABASE
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO products (name, brand, gender, size, image_path)
        VALUES (%s, %s, %s, %s, %s)
    """, (name, brand, gender, size, image_path))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Product added successfully"}), 201
