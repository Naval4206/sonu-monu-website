from flask import Blueprint, jsonify
from db import get_db_connection

products_bp = Blueprint("products", __name__)

@products_bp.route("/products", methods=["GET"])
def get_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                id,
                name,
                brand,
                gender,
                size,
                age_group,
                image_path,
                created_at
            FROM products
            ORDER BY created_at DESC
        """)

        products = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(products), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch products",
            "details": str(e)
        }), 500
