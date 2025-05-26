import mysql.connector
from config import Config

def get_db_connection():
    try:
        conn = mysql.connector.connect(**Config.MYSQL_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print("Database Connection Error:", err)
        return None

