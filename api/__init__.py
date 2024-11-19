from flask import Flask
from firebase_admin import credentials, initialize_app
from dotenv import load_dotenv
import os
import json

def configure():
    load_dotenv()

configure()

cred = credentials.Certificate(json.loads(os.getenv('firebase_api_key')))

default_app = initialize_app(cred)

def create_app():
    app= Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('flask_secret_key')

    from .intersectionsAPI import intersectionsAPI

    app.register_blueprint(intersectionsAPI, url_prefix='/api')

    return app