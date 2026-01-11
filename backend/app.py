from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from routes.products import products_bp
from routes.auth import auth_bp
from routes.admin import admin_bp


def create_app():
    app = Flask(__name__)

    # ================== CONFIG ==================
    app.config["JWT_SECRET_KEY"] = "sonu-monu-secret-key"  # move to env later
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 86400  # 1 day

    CORS(app)
    JWTManager(app)

    # ================== IMAGE SERVING ==================
    @app.route("/uploads/<path:filename>")
    def serve_uploaded_file(filename):
        return send_from_directory("uploads", filename)

    # ================== ROUTES ==================
    app.register_blueprint(products_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp)


    @app.route("/")
    def home():
        return jsonify({"status": "Backend running successfully"})

    return app


# ================== ENTRY POINT ==================
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
