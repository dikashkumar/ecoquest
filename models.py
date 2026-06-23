from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    
    # Gamification Stats
    xp = db.Column(db.Integer, default=0)
    eco_coins = db.Column(db.Integer, default=100) # Start with 100 coins to buy seeds/buildings
    level = db.Column(db.Integer, default=1)
    streak = db.Column(db.Integer, default=0)
    last_active = db.Column(db.String(20), nullable=True) # Store date YYYY-MM-DD
    
    # Progress Metrics
    lessons_completed = db.Column(db.Text, default='[]') # JSON array of module IDs (e.g. ["climate_change", "waste_management"])
    quizzes_completed = db.Column(db.Integer, default=0)
    games_played = db.Column(db.Integer, default=0)
    challenges_completed = db.Column(db.Integer, default=0)
    
    # Sandbox Game States
    garden_state = db.Column(db.Text, default='[]') # JSON string listing plants in garden
    city_state = db.Column(db.Text, default='{}') # JSON string representing the grid and metrics of city simulator
    
    # Relationships
    badges = db.relationship('Badge', backref='user', lazy=True, cascade="all, delete-orphan")
    challenges = db.relationship('UserChallenge', backref='user', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'xp': self.xp,
            'eco_coins': self.eco_coins,
            'level': self.level,
            'streak': self.streak,
            'lessons_completed': self.lessons_completed,
            'quizzes_completed': self.quizzes_completed,
            'games_played': self.games_played,
            'challenges_completed': self.challenges_completed,
            'city_state': self.city_state,
            'garden_state': self.garden_state
        }

class DailyChallenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(256), nullable=False)
    xp_reward = db.Column(db.Integer, default=15)
    coin_reward = db.Column(db.Integer, default=10)
    challenge_type = db.Column(db.String(50), nullable=False) # 'water', 'energy', 'plastic', 'waste', 'planting'

class UserChallenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey('daily_challenge.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    date = db.Column(db.String(20), nullable=False) # 'YYYY-MM-DD'
    
    # Relationship to join DailyChallenge details
    challenge = db.relationship('DailyChallenge')

class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(80), nullable=False) # 'Eco Beginner', 'Waste Warrior', etc.
    description = db.Column(db.String(256), nullable=False)
    badge_icon = db.Column(db.String(50), nullable=False) # SVG or icon selector string
    date_earned = db.Column(db.String(20), nullable=False) # 'YYYY-MM-DD'
