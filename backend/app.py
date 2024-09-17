from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Neon database configuration
neon_database_url = os.environ.get('NEON_DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = neon_database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class District(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    constituencies = db.relationship('Constituency', backref='district', lazy=True)

class Constituency(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    district_id = db.Column(db.Integer, db.ForeignKey('district.id'), nullable=False)
    
# Routes
@app.route('/api/districts')
def get_districts():
    districts = District.query.all()
    return jsonify([{'id': d.id, 'name': d.name} for d in districts])

@app.route('/api/constituencies')
def get_constituencies():
    district_id = request.args.get('district')
    if district_id:
        constituencies = Constituency.query.filter_by(district_id=district_id).all()
        return jsonify([{'id': c.id, 'name': c.name} for c in constituencies])
    else:
        return jsonify({'error': 'Invalid district ID'}), 400

if __name__ == '__main__':
    app.run(port=3001)