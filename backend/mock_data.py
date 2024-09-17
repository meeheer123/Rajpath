from app import app, db, District, Constituency

districts_data = [
    {
        "name": "Nagpur",
        "constituencies": ["Nagpur South", "Nagpur North", "Nagpur East", "Nagpur West", "Nagpur Central"]
    },
    {
        "name": "Mumbai",
        "constituencies": ["Mumbai North", "Mumbai South", "Mumbai East", "Mumbai West", "Mumbai Central"]
    },
    {
        "name": "Delhi",
        "constituencies": ["New Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"]
    },
    {
        "name": "Bangalore",
        "constituencies": ["Bangalore North", "Bangalore South", "Bangalore Central", "Bangalore Rural"]
    },
    {
        "name": "Chennai",
        "constituencies": ["Chennai North", "Chennai South", "Chennai Central", "Chennai East", "Chennai West"]
    },
    {
        "name": "Kolkata",
        "constituencies": ["Kolkata North", "Kolkata South", "Kolkata Port", "Jadavpur"]
    },
    {
        "name": "Pune",
        "constituencies": ["Pune", "Baramati", "Shirur", "Maval"]
    },
    {
        "name": "Hyderabad",
        "constituencies": ["Hyderabad", "Secunderabad", "Malkajgiri", "Chevella"]
    },
    {
        "name": "Ahmedabad",
        "constituencies": ["Ahmedabad East", "Ahmedabad West", "Gandhinagar", "Kheda"]
    },
    {
        "name": "Jaipur",
        "constituencies": ["Jaipur", "Jaipur Rural", "Sikar", "Alwar"]
    }
]

def truncate_tables():
    with app.app_context():
        try:
            # Disable foreign key checks
            db.session.execute('SET FOREIGN_KEY_CHECKS = 0;')
            
            # Truncate tables
            db.session.execute('TRUNCATE TABLE constituency;')
            db.session.execute('TRUNCATE TABLE district;')
            
            # Re-enable foreign key checks
            db.session.execute('SET FOREIGN_KEY_CHECKS = 1;')
            
            db.session.commit()
            print("Tables truncated successfully.")
        except Exception as e:
            db.session.rollback()
            print(f"Error truncating tables: {str(e)}")

def add_mock_data():
    with app.app_context():
        for district_info in districts_data:
            district = District(name=district_info["name"])
            db.session.add(district)
            
            for constituency_name in district_info["constituencies"]:
                constituency = Constituency(name=constituency_name, district=district)  # district relationship can be used
                db.session.add(constituency)
            
        db.session.commit()
        print("Mock data added successfully.")


if __name__ == "__main__":
    add_mock_data()