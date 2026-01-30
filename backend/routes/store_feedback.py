from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import get_db_connection

store_feedback_bp = Blueprint("store_feedback_bp", __name__)

@store_feedback_bp.route("/feedback", methods=["POST"])
@jwt_required()
def submit_store_feedback():
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
        feedback = data.get("feedback")
        rating = data.get("rating")   # ✅ NEW

        # ✅ VALIDATION
        if not name or not phone or not rating:
            return jsonify({
                "success": False,
                "message": "Name, phone and rating are required"
            }), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO store_feedback (rating, feedback, name, phone, email, status)
            VALUES (%s, %s, %s, %s, %s, 'unread')
        """, (rating, feedback, name, phone, email))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Feedback submitted successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to submit feedback",
            "error": str(e)
        }), 500

