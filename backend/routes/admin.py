from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import time

from db import get_db_connection
from utils.jwt_required import admin_required

admin_bp = Blueprint("admin", __name__)

UPLOAD_FOLDER = "uploads/products"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@admin_bp.route("/admin/add-product", methods=["POST"])
@admin_required
def add_product():
    name = request.form.get("name")
    brand = request.form.get("brand")
    gender = request.form.get("gender")
    size = request.form.get("size")
    age_group = request.form.get("age_group")
    image = request.files.get("image")

    if not name or not brand or not image:
        return jsonify({"error": "Missing required fields"}), 400

    if not allowed_file(image.filename):
        return jsonify({"error": "Invalid image format"}), 400

    filename = secure_filename(image.filename)
    unique_name = f"{int(time.time())}_{filename}"
    image_path = f"products/{unique_name}"

    image.save(os.path.join("uploads", image_path))

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO products 
        (name, brand, gender, size, age_group, image_path)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (name, brand, gender, size, age_group, image_path))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Product added successfully"}), 201

