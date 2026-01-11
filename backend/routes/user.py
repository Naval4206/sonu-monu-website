from flask import Blueprint, request, jsonify
from db import get_db_connection

user_bp = Blueprint("user", __name__)

@user_bp.route("/feedback/store", methods=["POST"])
def submit_store_feedback():
    data = request.json
    rating = data.get("rating")
    feedback = data.get("feedback")

    if not rating or not feedback:
        return jsonify({"error": "Rating and feedback required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO store_feedback (rating, feedback)
        VALUES (%s, %s)
    """, (rating, feedback))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Store feedback submitted"}), 201


@user_bp.route("/feedback/product", methods=["POST"])
def submit_product_feedback():
    data = request.json
    product_name = data.get("product_name")
    feedback = data.get("feedback")

    if not product_name or not feedback:
        return jsonify({"error": "Product name and feedback required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO product_feedback (product_name, feedback)
        VALUES (%s, %s)
    """, (product_name, feedback))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Product feedback submitted"}), 201

@user_bp.route("/contact", methods=["POST"])
def submit_query():
    data = request.json
    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")
    message = data.get("message")

    if not phone or not message:
        return jsonify({"error": "Phone and message required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO queries (name, phone, email, message)
        VALUES (%s, %s, %s, %s)
    """, (name, phone, email, message))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Query submitted"}), 201

