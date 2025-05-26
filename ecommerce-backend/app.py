from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.products import products_bp
from routes.cart import cart_bp

app = Flask(__name__)
app.config.from_object(Config)

jwt = JWTManager(app)
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(products_bp)
app.register_blueprint(cart_bp)

if __name__ == "__main__":
    app.run(debug=True)
