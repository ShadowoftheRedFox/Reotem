import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

def get_db():
    mydb = mysql.connector.connect(
        host=os.environ.get('DATABASE_HOST'),
        user=os.environ.get('DATABASE_USER'),
        password=os.environ.get('DATABASE_PASS'),
        database=os.environ.get('DATABASE_NAME'),
        charset= 'utf8mb4',
        collation= 'utf8mb4_unicode_ci',
        autocommit=True,
    )
    return mydb