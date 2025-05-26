from flask import Blueprint, request, jsonify
from db import get_db_connection

# Creating a Blueprint for cart-related routes
cart_bp = Blueprint("cart", __name__)

# Route to add a product to the cart
@cart_bp.route("/cart/add", methods=["POST"])
def add_to_cart():
    data = request.get_json()
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not user_id or not product_id:
        return jsonify({"error": "User ID and Product ID are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id FROM products WHERE id = %s", (product_id,))
        if not cursor.fetchone():
            return jsonify({"error": "Product not found"}), 404

        cursor.execute("SELECT quantity FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
        existing_item = cursor.fetchone()

        if existing_item:
            new_quantity = existing_item[0] + quantity
            cursor.execute("UPDATE cart SET quantity = %s WHERE user_id = %s AND product_id = %s",
                           (new_quantity, user_id, product_id))
        else:
            cursor.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)",
                           (user_id, product_id, quantity))

        conn.commit()
        return jsonify({"message": "Product added to cart"}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Route to get all items from the cart
@cart_bp.route("/cart", methods=["GET"])
def get_cart():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT product_id, quantity FROM cart WHERE user_id = %s", (user_id,))
        cart_items = cursor.fetchall()
        
        cart_dict = {item[0]: item[1] for item in cart_items}
        return jsonify(cart_dict), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Route to update cart quantity
@cart_bp.route("/cart/update", methods=["PUT"])
def update_cart_quantity():
    data = request.get_json()
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not user_id or not product_id or not quantity:
        return jsonify({"error": "User ID, Product ID, and quantity are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("UPDATE cart SET quantity = %s WHERE user_id = %s AND product_id = %s",
                       (quantity, user_id, product_id))
        conn.commit()
        return jsonify({"message": "Cart updated successfully"}), 200
    
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()

# Route to remove an item from the cart
@cart_bp.route("/cart/delete", methods=["DELETE"])
def delete_from_cart():
    data = request.get_json()
    user_id = data.get("user_id")
    product_id = data.get("product_id")

    if not user_id or not product_id:
        return jsonify({"error": "User ID and Product ID are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
        conn.commit()
        return jsonify({"message": "Product removed from cart"}), 200
    
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()
