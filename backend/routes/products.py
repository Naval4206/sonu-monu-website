from flask import Blueprint, jsonify
from db import get_db_connection

products_bp = Blueprint("products", __name__)

@products_bp.route("/products", methods=["GET"])
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, name, brand, gender, size, image_path
        FROM products
        ORDER BY id DESC
    """)

    products = cursor.fetchall()

    for p in products:
        p["image_url"] = f"/uploads/{p['image_path']}"

    cursor.close()
    conn.close()

    return jsonify(products)
