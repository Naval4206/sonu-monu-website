from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps
from flask import jsonify

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            identity = get_jwt_identity()

            if identity.get("role") != "admin":
                return jsonify({"error": "Admin access required"}), 403

            return fn(*args, **kwargs)
        except Exception:
            return jsonify({"error": "Invalid or missing token"}), 401

    return wrapper

