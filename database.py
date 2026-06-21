from models import db, DailyChallenge, User
from werkzeug.security import generate_password_hash
import json

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
        seed_challenges()
        seed_admin()

def seed_challenges():
    # Check if challenges are already seeded
    if DailyChallenge.query.first() is not None:
        return
        
    challenges = [
        DailyChallenge(
            title="Save Water",
            description="Turn off the tap while brushing your teeth to save up to 6 liters of water.",
            xp_reward=15,
            coin_reward=10,
            challenge_type="water"
        ),
        DailyChallenge(
            title="Switch Off Lights",
            description="Turn off all lights, monitors, and chargers when leaving a room for at least 1 hour.",
            xp_reward=15,
            coin_reward=10,
            challenge_type="energy"
        ),
        DailyChallenge(
            title="Use Reusable Bags",
            description="Decline plastic bags at the grocery store today and use a reusable fabric bag instead.",
            xp_reward=20,
            coin_reward=15,
            challenge_type="plastic"
        ),
        DailyChallenge(
            title="Sort Waste",
            description="Successfully segregate 10 waste items in the Waste Segregation Game.",
            xp_reward=25,
            coin_reward=20,
            challenge_type="waste"
        ),
        DailyChallenge(
            title="Grow the Garden",
            description="Plant a new seed or water a plant in your Virtual Eco Garden.",
            xp_reward=20,
            coin_reward=15,
            challenge_type="planting"
        ),
        DailyChallenge(
            title="Clean Transit",
            description="Walk, cycle, or use public transit instead of driving for your journeys today.",
            xp_reward=30,
            coin_reward=25,
            challenge_type="energy"
        ),
        DailyChallenge(
            title="Power Down",
            description="Unplug standby appliances (microwave, TV, gaming consoles) when not in use.",
            xp_reward=15,
            coin_reward=10,
            challenge_type="energy"
        )
    ]
    
    db.session.bulk_save_objects(challenges)
    db.session.commit()
    print("Pre-seeded daily challenges successfully.")

def seed_admin():
    # Check if admin already exists
    admin_user = User.query.filter_by(username="admin").first()
    if admin_user:
        return
        
    admin = User(
        username="admin",
        email="admin@ecoquest.com",
        password_hash=generate_password_hash("admin123", method="pbkdf2:sha256"),
        is_admin=True,
        xp=500,
        eco_coins=1000,
        level=5,
        streak=10,
        garden_state=json.dumps([
            {"id": "p1", "type": "oak", "x": 120, "y": 280, "stage": 3, "water": 100, "date": "2026-06-21"},
            {"id": "p2", "type": "rose", "x": 240, "y": 320, "stage": 2, "water": 80, "date": "2026-06-21"}
        ]),
        city_state=json.dumps({
            "grid": {
                "0_0": {"type": "solar_panel", "level": 1},
                "0_1": {"type": "solar_panel", "level": 1},
                "1_0": {"type": "park", "level": 1},
                "2_2": {"type": "recycling_center", "level": 1}
            },
            "pollution": 35,
            "air_quality": 82,
            "green_coverage": 45,
            "happiness": 78,
            "sustainability": 80
        })
    )
    
    db.session.add(admin)
    db.session.commit()
    print("Admin user seeded successfully.")
