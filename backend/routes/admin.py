from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from utils.jwt_required import admin_required
from db import get_db_connection
import os, time

from db import get_db_connection

admin_bp = Blueprint("admin", __name__)

UPLOAD_FOLDER = "uploads/products"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# =========================
# ADD PRODUCT
# =========================
@admin_bp.route("/admin/products", methods=["POST"])
@jwt_required()
@admin_required
def add_product():
    name = request.form.get("name")
    brand = request.form.get("brand")
    gender = request.form.get("gender")
    size = request.form.get("size")
    image = request.files.get("image")

    if not name or not brand or not image:
        return jsonify({"error": "Missing required fields"}), 400

    if not allowed_file(image.filename):
        return jsonify({"error": "Invalid image type"}), 400

    filename = secure_filename(image.filename)
    unique_name = f"{int(time.time())}_{filename}"
    image_path = unique_name
    image.save(os.path.join("uploads", "products", image_path))


    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO products (name, brand, gender, size, image_path)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (name, brand, gender, size, image_path)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Product added"}), 201


# =========================
# GET ALL PRODUCTS
# =========================
@admin_bp.route("/admin/products", methods=["GET"])
@jwt_required()
@admin_required
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products ORDER BY id DESC")
    products = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(products), 200



# =========================
# DELETE PRODUCT
# =========================
@admin_bp.route("/admin/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_product(product_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT image_url FROM products WHERE id=%s", (product_id,))
    product = cur.fetchone()

    if not product:
        return jsonify({"error": "Not found"}), 404

    cur.execute("DELETE FROM products WHERE id=%s", (product_id,))
    conn.commit()

    image_path = os.path.join(UPLOAD_FOLDER, product["image_url"])
    if os.path.exists(image_path):
        os.remove(image_path)

    cur.close()
    conn.close()

    return jsonify({"message": "Product deleted"}), 200



# =========================
# UPDATE PRODUCT
# =========================
@admin_bp.route("/admin/products/<int:product_id>", methods=["PUT"])
@jwt_required()
@admin_required
def update_product(product_id):
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Admin only"}), 403
    
    data = request.json

    name = data.get("name")
    brand = data.get("brand")
    gender = data.get("gender")
    size = data.get("size")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE products
        SET name=%s, brand=%s, gender=%s, size=%s
        WHERE id=%s
    """, (name, brand, gender, size, product_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Product updated"}), 200

# =========================
# STORE FEEDBACK
# =========================
@admin_bp.route("/admin/feedback/store", methods=["GET"])
@jwt_required()
@admin_required
def get_store_feedback():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, rating, feedback, created_at
        FROM store_feedback
        ORDER BY created_at DESC
    """)
    feedbacks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(feedbacks), 200

# =========================
# PRODUCT FEEDBACK
# =========================
@admin_bp.route("/admin/feedback/products", methods=["GET"])
@jwt_required()
@admin_required
def get_product_feedback():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, product_name, feedback, created_at
        FROM product_feedback
        ORDER BY created_at DESC
    """)
    feedbacks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(feedbacks), 200

# =========================
#  USER QUERIES
# =========================
@admin_bp.route("/admin/queries", methods=["GET"])
@jwt_required()
@admin_required
def get_user_queries():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, name, phone, email, message, created_at
        FROM queries
        ORDER BY created_at DESC
    """)
    queries = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(queries), 200

