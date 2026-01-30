from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from db import get_db_connection

queries_bp = Blueprint("queries_bp", __name__)

@queries_bp.route("/queries", methods=["POST"])
@jwt_required()
def submit_query():
    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "success": False,
                "message": "Invalid JSON body"
            }), 400

        name = data.get("name")
        phone = data.get("phone")
        email = data.get("email")
        query_text = data.get("query")

        # ✅ Validation
        if not name or not phone or not query_text:
            return jsonify({
                "success": False,
                "message": "Name, phone and query are required"
            }), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO queries (name, phone, email, message, status)
            VALUES (%s, %s, %s, %s, 'unread')
        """, (name, phone, email, query_text))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Query submitted successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to submit query",
            "error": str(e)
        }), 500
