from flask import Blueprint, jsonify, request
from db import get_db_connection

products_bp = Blueprint("products", __name__)

@products_bp.route("/products", methods=["GET"])
def get_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500
    finally:
        cursor.close()
        conn.close()

@products_bp.route("/products/filter", methods=["GET"])
def filter_products():
    try:
        name = request.args.get("name", "")
        min_price = request.args.get("min_price", type=float, default=0)
        max_price = request.args.get("max_price", type=float, default=1000000)

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM products WHERE price BETWEEN %s AND %s AND name LIKE %s"
        cursor.execute(query, (min_price, max_price, f"%{name}%"))
        products = cursor.fetchall()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500
    finally:
        cursor.close()
        conn.close()