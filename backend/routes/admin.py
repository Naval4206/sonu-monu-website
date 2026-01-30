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
    price = request.form.get("price")
    image = request.files.get("image")

    if not name or not brand or not image:
        return jsonify({"error": "Missing required fields"}), 400

    if not allowed_file(image.filename):
        return jsonify({"error": "Invalid image type"}), 400

    filename = secure_filename(image.filename)
    image_path = f"{int(time.time())}_{filename}"
    image.save(os.path.join(UPLOAD_FOLDER, image_path))

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO products (name, brand, gender, size, price, image_path)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (name, brand, gender, size, price, image_path))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"success": True, "message": "Product added"}), 201


# =========================
# GET ALL PRODUCTS
# =========================
@admin_bp.route("/admin/products", methods=["GET"])
@jwt_required()
@admin_required
def get_products():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT * FROM products ORDER BY id DESC")
    products = cur.fetchall()

    for p in products:
        p["image_url"] = f"/uploads/products/{p['image_path']}" if p.get("image_path") else None

    cur.close()
    conn.close()

    return jsonify({
        "success": True,
        "data": products
    }), 200


# =========================
# DELETE PRODUCT
# =========================
@admin_bp.route("/admin/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_product(product_id):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT image_path FROM products WHERE id=%s", (product_id,))
    product = cur.fetchone()

    if not product:
        return jsonify({"error": "Not found"}), 404

    cur.execute("DELETE FROM products WHERE id=%s", (product_id,))
    conn.commit()

    image_path = os.path.join(UPLOAD_FOLDER, product["image_path"])
    if product["image_path"] and os.path.exists(image_path):
        os.remove(image_path)

    cur.close()
    conn.close()

    return jsonify({"success": True, "message": "Product deleted"}), 200


# =========================
# UPDATE PRODUCT
# =========================
@admin_bp.route("/admin/products/<int:product_id>", methods=["PUT"])
@jwt_required()
@admin_required
def update_product(product_id):
    data = request.form
    image = request.files.get("image")

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT image_path FROM products WHERE id=%s", (product_id,))
    product = cur.fetchone()

    if not product:
        return jsonify({"error": "Product not found"}), 404

    image_path = product["image_path"]

    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image_path = f"{int(time.time())}_{filename}"
        image.save(os.path.join(UPLOAD_FOLDER, image_path))

    cur.execute("""
        UPDATE products
        SET name=%s, brand=%s, gender=%s, size=%s, price=%s, image_path=%s
        WHERE id=%s
    """, (
        data.get("name"),
        data.get("brand"),
        data.get("gender"),
        data.get("size"),
        data.get("price"),
        image_path,
        product_id
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"success": True, "message": "Product updated"}), 200

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
        SELECT id, name, phone, email, rating, feedback, status, created_at
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
    cursor.execute("UPDATE store_feedback SET status='read' WHERE id=%s", (id,))
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
        SELECT id, product_name, name, phone, email, feedback, status, created_at
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
    cursor.execute("UPDATE product_feedback SET status='read' WHERE id=%s", (id,))
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

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("UPDATE queries SET status='read' WHERE id=%s", (id,))
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
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM queries WHERE id=%s", (id,))
    conn.commit()

    cur.close()
    conn.close()

    return {"message": "Query deleted"}

# =========================
# ADMIN DASHBOARD STATS
# =========================
@admin_bp.route("/admin/stats", methods=["GET"])
@jwt_required()
@admin_required
def admin_stats():
    conn = get_db_connection()
    cur = conn.cursor()

    stats = {}
    
    # USERS
    cur.execute("SELECT COUNT(*) FROM users")
    stats["total_users"] = cur.fetchone()[0]

    # PRODUCTS
    cur.execute("SELECT COUNT(*) FROM products")
    stats["total_products"] = cur.fetchone()[0]

    # ---------------- STORE FEEDBACK ----------------
    cur.execute("SELECT COUNT(*) FROM store_feedback")
    stats["store_feedback_total"] = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM store_feedback WHERE status = 'unread'")
    stats["store_feedback_unread"] = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM store_feedback WHERE status = 'read'")
    stats["store_feedback_read"] = cur.fetchone()[0]

    # ---------------- PRODUCT FEEDBACK ----------------
    cur.execute("SELECT COUNT(*) FROM product_feedback")
    stats["product_feedback_total"] = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM product_feedback WHERE status = 'unread'")
    stats["product_feedback_unread"] = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM product_feedback WHERE status = 'read'")
    stats["product_feedback_read"] = cur.fetchone()[0]

    # ---------------- USER QUERIES ----------------
    cur.execute("SELECT COUNT(*) FROM queries")
    stats["queries_total"] = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM queries WHERE status = 'unread'")
    stats["queries_unread"] = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM queries WHERE status = 'read'")
    stats["queries_read"] = cur.fetchone()[0]

    cur.close()
    conn.close()

    return jsonify(stats), 200



# =========================
# GET ALL USERS
# =========================
@admin_bp.route("/admin/users", methods=["GET"])
@jwt_required()
@admin_required
def get_users():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT id, name, phone, email, role, created_at
        FROM users
        ORDER BY created_at DESC
    """)
    users = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify({
        "success": True,
        "data": users
    }), 200


# =========================
# UPDATE USER
# =========================
@admin_bp.route("/admin/users/<int:user_id>", methods=["PUT"])
@jwt_required()
@admin_required
def update_user(user_id):
    data = request.get_json()

    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")
    role = data.get("role")

    if role not in ["user", "admin"]:
        return jsonify({"error": "Invalid role"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE users
        SET name=%s, phone=%s, email=%s, role=%s
        WHERE id=%s
    """, (name, phone, email, role, user_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "User updated"
    }), 200


# =========================
# DELETE USER
# =========================
@admin_bp.route("/admin/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_user(user_id):
    claims = get_jwt()

    # ❌ Prevent admin deleting himself
    if str(user_id) == get_jwt_identity():
        return jsonify({"error": "Cannot delete your own account"}), 403

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM users WHERE id=%s", (user_id,))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "User deleted"
    }), 200
