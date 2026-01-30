from flask import Blueprint, jsonify
from db import get_db_connection

products_bp = Blueprint("products_bp", __name__)

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
                price,
                image_path
            FROM products
            ORDER BY id DESC
        """)

        products = cursor.fetchall()

        # Build image_url safely
        for product in products:
            if product.get("image_path"):
                product["image_url"] = f"/uploads/products/{product['image_path']}"
            else:
                product["image_url"] = None

        cursor.close()
        conn.close()

        # ✅ ALWAYS JSON
        return jsonify({
            "success": True,
            "data": products
        }), 200

    except Exception as e:
        # 🔒 NEVER return HTML on error
        return jsonify({
            "success": False,
            "message": "Failed to fetch products",
            "error": str(e)
        }), 500
