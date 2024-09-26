from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import text

app = Flask(__name__)
CORS(app)

# SQLite database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///districts.db'
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
    polling_booths = db.relationship('PollingBooth', backref='constituency', lazy=True)

class PollingBooth(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    constituency_id = db.Column(db.Integer, db.ForeignKey('constituency.id'), nullable=False)
    people = db.relationship('Person', backref='polling_booth', lazy=True)

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    voter_id = db.Column(db.String(255), nullable=False)
    polling_booth_id = db.Column(db.Integer, db.ForeignKey('polling_booth.id'), nullable=False)

# Route to populate data
def populate_data():
    # Check if the Nagpur district already exists
    nagpur_district = db.session.query(District).filter_by(name='Nagpur').first()
    
    if nagpur_district is None:
        # Insert Nagpur district
        db.session.execute(text("INSERT INTO district (name) VALUES ('Nagpur')"))
        db.session.commit()  # Commit after insert

        # Get the ID of the newly inserted Nagpur district
        nagpur_district = db.session.query(District).filter_by(name='Nagpur').first()

    # Check for constituencies
    constituencies = [
        'Nagpur South',
        'Nagpur West',
        'Nagpur North',
        'Nagpur Central',
        'Nagpur East',
        'Nagpur Rural',
        'Katol',
        'Hingna',
        'Umred'
    ]

    for name in constituencies:
        existing_constituency = db.session.query(Constituency).filter_by(name=name, district_id=nagpur_district.id).first()
        if existing_constituency is None:
            db.session.execute(
                text("INSERT INTO constituency (name, district_id) VALUES (:name, :district_id)"),
                {'name': name, 'district_id': nagpur_district.id}
            )
    
    db.session.commit()  # Commit the changes after inserting constituencies

    # Get Nagpur Central constituency to add polling booths
    nagpur_central = db.session.query(Constituency).filter_by(name='Nagpur Central').first()

    # Polling booths data
    polling_booths = [
        {'address': 'Booth 1, Central Street', 'latitude': 21.146, 'longitude': 79.088, 'constituency_id': nagpur_central.id},
        {'address': 'Booth 2, Main Road', 'latitude': 21.145, 'longitude': 79.091, 'constituency_id': nagpur_central.id}
    ]

    for booth in polling_booths:
        # Check if polling booth already exists
        existing_booth = db.session.query(PollingBooth).filter_by(address=booth['address'], constituency_id=booth['constituency_id']).first()
        if existing_booth is None:
            db.session.execute(
                text("INSERT INTO polling_booth (address, latitude, longitude, constituency_id) VALUES (:address, :latitude, :longitude, :constituency_id)"),
                booth
            )
    
    db.session.commit()  # Commit the polling booths

    # Get polling booths to add people
    booth1 = db.session.query(PollingBooth).filter_by(address='Booth 1, Central Street').first()
    booth2 = db.session.query(PollingBooth).filter_by(address='Booth 2, Main Road').first()

    # People data
    people = [
        {'name': 'John Doe', 'age': 45, 'gender': 'Male', 'address': '123 Main Street', 'voter_id': 'VTR001', 'polling_booth_id': booth1.id},
        {'name': 'Jane Doe', 'age': 42, 'gender': 'Female', 'address': '456 Central Avenue', 'voter_id': 'VTR002', 'polling_booth_id': booth1.id},
        {'name': 'Alex Smith', 'age': 36, 'gender': 'Male', 'address': '789 West Road', 'voter_id': 'VTR003', 'polling_booth_id': booth2.id}
    ]

    for person in people:
        # Check if person already exists
        existing_person = db.session.query(Person).filter_by(voter_id=person['voter_id']).first()
        if existing_person is None:
            db.session.execute(
                text("INSERT INTO person (name, age, gender, address, voter_id, polling_booth_id) VALUES (:name, :age, :gender, :address, :voter_id, :polling_booth_id)"),
                person
            )

    db.session.commit()  # Commit the people

    return jsonify({'message': 'Data populated successfully'})


# Routes to fetch data
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

@app.route('/api/find_people', methods=['GET'])
def find_people():
    name = request.args.get('name')
    constituency_name = request.args.get('constituency')
    district_name = request.args.get('district')

    # Find the district
    district = District.query.filter_by(name=district_name).first()
    if not district:
        return jsonify({'error': 'District not found'}), 404

    # Find the constituency
    constituency = Constituency.query.filter_by(name=constituency_name, district_id=district.id).first()
    if not constituency:
        return jsonify({'error': 'Constituency not found in this district'}), 404

    # Find all people with the same name in the same constituency
    people = Person.query.filter_by(name=name).join(PollingBooth).filter(
        PollingBooth.constituency_id == constituency.id
    ).all()

    if not people:
        return jsonify({'error': 'No people found with this name in the constituency'}), 404

    # Return details for selection if multiple people found
    return jsonify([{
        'id': person.id,
        'name': person.name,
        'age': person.age,
        'gender': person.gender,
        'voter_id': person.voter_id,
        'address': person.address
    } for person in people])

# Route to get polling booth by person ID
@app.route('/api/get_polling_booth_by_person_id', methods=['GET'])
def get_polling_booth_by_person_id():
    person_id = request.args.get('person_id')

    person = Person.query.filter_by(id=person_id).first()
    if not person:
        return jsonify({'error': 'Person not found'}), 404

    polling_booth = PollingBooth.query.filter_by(id=person.polling_booth_id).first()
    if polling_booth:
        return jsonify({
            'person_name': person.name,
            'polling_booth_address': polling_booth.address,
            'latitude': polling_booth.latitude,
            'longitude': polling_booth.longitude
        })
    else:
        return jsonify({'error': 'Polling booth not found'}), 404

if __name__ == '__main__':
    # Create the SQLite database tables before running the app
    with app.app_context():
        db.create_all()  # Ensures the tables are created
        populate_data()  # Populates the data inside app context
    app.run(port=3001, debug=True)
