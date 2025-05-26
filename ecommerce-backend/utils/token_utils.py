from flask_jwt_extended import create_access_token
import datetime

def generate_token(identity):
    return create_access_token(identity=identity, expires_delta=datetime.timedelta(days=1))
