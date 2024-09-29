from flask import Flask, jsonify, request, redirect
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
        nagpur_district = District(name='Nagpur')
        db.session.add(nagpur_district)
        db.session.commit()

    # Insert constituencies
    constituencies = [
        {'name': 'Nagpur South', 'district_id': nagpur_district.id},
        {'name': 'Nagpur West', 'district_id': nagpur_district.id},
        {'name': 'Nagpur North', 'district_id': nagpur_district.id},
        {'name': 'Nagpur Central', 'district_id': nagpur_district.id},
        {'name': 'Nagpur East', 'district_id': nagpur_district.id}
    ]
    
    for const in constituencies:
        existing_const = db.session.query(Constituency).filter_by(name=const['name'], district_id=nagpur_district.id).first()
        if not existing_const:
            new_const = Constituency(name=const['name'], district_id=const['district_id'])
            db.session.add(new_const)
    
    db.session.commit()

    # Insert polling booths for Nagpur Central constituency
    nagpur_central = db.session.query(Constituency).filter_by(name='Nagpur Central').first()

    polling_booths = [
        {'address': 'Booth 1, Central Avenue', 'latitude': 21.146, 'longitude': 79.088, 'constituency_id': nagpur_central.id},
        {'address': 'Booth 2, Main Bazar Road', 'latitude': 21.145, 'longitude': 79.091, 'constituency_id': nagpur_central.id}
    ]

    for booth in polling_booths:
        existing_booth = db.session.query(PollingBooth).filter_by(address=booth['address'], constituency_id=booth['constituency_id']).first()
        if not existing_booth:
            new_booth = PollingBooth(
                address=booth['address'],
                latitude=booth['latitude'],
                longitude=booth['longitude'],
                constituency_id=booth['constituency_id']
            )
            db.session.add(new_booth)
    
    db.session.commit()

    # Get the inserted polling booths
    booth1 = db.session.query(PollingBooth).filter_by(address='Booth 1, Central Avenue').first()
    booth2 = db.session.query(PollingBooth).filter_by(address='Booth 2, Main Bazar Road').first()

    # Insert people with some conflicting data
    people = [
        # Non-conflicting people
        {'name': 'Ravi Sharma', 'age': 50, 'gender': 'Male', 'address': '123 Civil Lines', 'voter_id': 'IND001', 'polling_booth_id': booth1.id},
        {'name': 'Meena Sharma', 'age': 45, 'gender': 'Female', 'address': '123 Civil Lines', 'voter_id': 'IND002', 'polling_booth_id': booth1.id},
        
        # Conflicting people with same names but different voter IDs, ages, and addresses
        {'name': 'Amit Verma', 'age': 35, 'gender': 'Male', 'address': '456 Ram Nagar', 'voter_id': 'IND003', 'polling_booth_id': booth2.id},
        {'name': 'Amit Verma', 'age': 42, 'gender': 'Male', 'address': '999 West Avenue', 'voter_id': 'IND004', 'polling_booth_id': booth1.id},
        
        {'name': 'Priya Rao', 'age': 30, 'gender': 'Female', 'address': '789 Shanti Colony', 'voter_id': 'IND005', 'polling_booth_id': booth2.id},
        {'name': 'Priya Rao', 'age': 34, 'gender': 'Female', 'address': '321 East Park', 'voter_id': 'IND006', 'polling_booth_id': booth1.id},

        # More conflicts for good measure
        {'name': 'Rajesh Gupta', 'age': 40, 'gender': 'Male', 'address': '111 Central Plaza', 'voter_id': 'IND007', 'polling_booth_id': booth2.id},
        {'name': 'Rajesh Gupta', 'age': 50, 'gender': 'Male', 'address': '222 Market Street', 'voter_id': 'IND008', 'polling_booth_id': booth1.id}
    ]

    for person in people:
        existing_person = db.session.query(Person).filter_by(voter_id=person['voter_id']).first()
        if not existing_person:
            new_person = Person(
                name=person['name'],
                age=person['age'],
                gender=person['gender'],
                address=person['address'],
                voter_id=person['voter_id'],
                polling_booth_id=person['polling_booth_id']
            )
            db.session.add(new_person)

    db.session.commit()

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
    voter_id = request.args.get('voterId')
    district = request.args.get('district')
    constituency = request.args.get('constituency')

    query = db.session.query(Person).join(PollingBooth).join(Constituency).join(District)

    # Filter by district and constituency
    if district:
        query = query.filter(District.name == district)
    if constituency:
        query = query.filter(Constituency.name == constituency)

    # Filter by voter ID or name
    if voter_id:
        query = query.filter(Person.voter_id == voter_id)
    elif name:
        query = query.filter(Person.name.ilike(f'%{name}%'))

    # Fetch results
    matching_people = query.all()

    if not matching_people:
        return jsonify({'error': 'No Such Record Was Found'}), 404

    # Format the results to return the person details
    result = [
        {
            'name': person.name,
            'age': person.age,
            'gender': person.gender,
            'address': person.address,
            'voter_id': person.voter_id,
            'polling_booth': person.polling_booth.address
        }
        for person in matching_people
    ]

    return jsonify(result)

# Route to get polling booth by person ID
@app.route('/api/get_polling_booth_by_person_id', methods=['GET'])
def get_polling_booth_by_person_id():
    person_id = request.args.get('person_id')

    person = Person.query.filter_by(voter_id=person_id).first()

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
