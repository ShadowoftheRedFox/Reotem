from flask import Blueprint

from ..database import get_db
from .. import api

blueprint = Blueprint('emails', __name__)

@blueprint.route('', methods=['GET'])
def get_emails():
    mydb = get_db()
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT email,name FROM emails", ())
    emails = mycursor.fetchall()
    return api.success(emails)