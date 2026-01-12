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
    image = request.files.get("image")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT image_url FROM products WHERE id=%s", (product_id,))
    product = cursor.fetchone()

    if not product:
        return jsonify({"error": "Product not found"}), 404

    image_url = product["image_url"]

    if image:
        filename = secure_filename(image.filename)
        image_url = f"{int(time.time())}_{filename}"
        image.save(os.path.join("uploads/products", image_url))

    cursor.execute("""
        UPDATE products
        SET name=%s, brand=%s, gender=%s, size=%s, image_url=%s
        WHERE id=%s
    """, (name, brand, gender, size, image_url, product_id))

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
        SELECT id, name, phone, email, rating, feedback, is_read, created_at
        FROM store_feedback
        ORDER BY created_at DESC
    """)
    feedbacks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(feedbacks), 200

# =========================
# STORE FEEDBACK READ
# =========================
@admin_bp.route("/admin/feedback/store/read/<int:id>", methods=["PUT"])
@jwt_required()
@admin_required
def mark_store_read(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE store_feedback SET is_read=1 WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Marked as read"}, 200

# =========================
# STORE FEEDBACK DELETE
# =========================
@admin_bp.route("/admin/feedback/store/<int:id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_store_feedback(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM store_feedback WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Deleted"}, 200


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
        SELECT id, product_name, name, phone, email, feedback, is_read, created_at
        FROM product_feedback
        ORDER BY created_at DESC
    """)
    feedbacks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(feedbacks), 200

# =========================
# PRODUCT FEEDBACK READ
# =========================
@admin_bp.route("/admin/feedback/product/read/<int:id>", methods=["PUT"])
@jwt_required()
@admin_required
def mark_product_read(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE product_feedback SET is_read=1 WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Marked as read"}, 200

# =========================
# PRODUCT FEEDBACK DELETE
# =========================
@admin_bp.route("/admin/feedback/product/<int:id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_product_feedback(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM product_feedback WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Deleted"}, 200

# =========================
#  USER QUERIES
# =========================
@admin_bp.route("/admin/queries", methods=["GET"])
@jwt_required()
@admin_required
def get_user_queries():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM queries ORDER BY created_at DESC")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data), 200

# =========================
#  USER QUERIES READ
# =========================
@admin_bp.route("/admin/queries/read/<int:id>", methods=["PUT"])
@jwt_required()
@admin_required
def mark_query_read(id):
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return {"error": "Unauthorized"}, 403

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("UPDATE queries SET is_read = TRUE WHERE id=%s", (id,))
    conn.commit()

    cur.close()
    conn.close()

    return {"message": "Marked as read"}

# =========================
#  USER QUERIES DELETE
# =========================
@admin_bp.route("/admin/queries/<int:id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_query(id):
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return {"error": "Unauthorized"}, 403

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM queries WHERE id=%s", (id,))
    conn.commit()

    cur.close()
    conn.close()

    return {"message": "Query deleted"}


