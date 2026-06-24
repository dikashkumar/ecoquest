from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, DailyChallenge, UserChallenge, Badge
from database import init_db
from chatbot import get_bot_response
import json
import os
from datetime import datetime, date

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'ecoquest-secret-key-12345')

# Dynamically set DB URI and copy seeded DB for Vercel read-only filesystem environment
if os.environ.get('VERCEL'):
    db_path = '/tmp/ecoquest.db'
    if not os.path.exists(db_path) and os.path.exists('ecoquest.db'):
        import shutil
        try:
            shutil.copy('ecoquest.db', db_path)
        except Exception as e:
            print(f"Error copying seeded database to /tmp: {e}")
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecoquest.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB and seed
init_db(app)

# Setup Login Manager
login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- Global Template Context Manager ---
@app.context_processor
def inject_now():
    return {'now': datetime.utcnow()}

# Helper to check/update streaks
def update_user_streak(user):
    today = date.today().isoformat()
    if user.last_active == today:
        return # Already active today
        
    if user.last_active:
        last_date = datetime.strptime(user.last_active, "%Y-%m-%d").date()
        delta = date.today() - last_date
        if delta.days == 1:
            user.streak += 1
        elif delta.days > 1:
            user.streak = 1
    else:
        user.streak = 1
        
    user.last_active = today
    db.session.commit()

# --- ROUTES ---

# Landing Page
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

# Authentication
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        user_exists = User.query.filter((User.username == username) | (User.email == email)).first()
        if user_exists:
            flash('Username or Email already registered!', 'danger')
            return redirect(url_for('signup'))
            
        hashed_password = generate_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            password_hash=hashed_password,
            xp=0,
            eco_coins=100,
            level=1,
            streak=0,
            garden_state=json.dumps([]),
            city_state=json.dumps({
                "grid": {},
                "pollution": 60,
                "air_quality": 65,
                "green_coverage": 15,
                "happiness": 55,
                "sustainability": 45
            })
        )
        
        # Award initial "Eco Beginner" badge
        today = date.today().isoformat()
        beginner_badge = Badge(
            name="Eco Beginner",
            description="Created an EcoQuest account and committed to protecting the planet.",
            badge_icon="eco-beginner",
            date_earned=today
        )
        new_user.badges.append(beginner_badge)
        
        db.session.add(new_user)
        db.session.commit()
        
        login_user(new_user)
        flash('Account created successfully! Welcome to EcoQuest!', 'success')
        return redirect(url_for('dashboard'))
        
    return render_template('login.html', signup_mode=True)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password_hash, password):
            flash('Invalid username or password!', 'danger')
            return redirect(url_for('login'))
            
        login_user(user)
        update_user_streak(user)
        flash(f'Welcome back, {user.username}!', 'success')
        return redirect(url_for('dashboard'))
        
    return render_template('login.html', signup_mode=False)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('index'))

@app.route('/forgot', methods=['GET', 'POST'])
def forgot():
    if request.method == 'POST':
        email = request.form.get('email')
        new_password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user:
            user.password_hash = generate_password_hash(new_password)
            db.session.commit()
            flash('Password reset successfully! Please log in.', 'success')
            return redirect(url_for('login'))
        else:
            flash('No user found with that email address.', 'danger')
            
    return render_template('login.html', forgot_mode=True)

# Dashboard
@app.route('/dashboard')
@login_required
def dashboard():
    # Fetch user daily challenges for today
    today = date.today().isoformat()
    
    # Check if we need to assign challenges to this user for today
    assigned = UserChallenge.query.filter_by(user_id=current_user.id, date=today).all()
    if not assigned:
        # Fetch standard challenges and assign them
        challenges = DailyChallenge.query.limit(3).all()
        for ch in challenges:
            user_ch = UserChallenge(user_id=current_user.id, challenge_id=ch.id, completed=False, date=today)
            db.session.add(user_ch)
        db.session.commit()
        assigned = UserChallenge.query.filter_by(user_id=current_user.id, date=today).all()
        
    # Stats parsing
    lessons_list = json.loads(current_user.lessons_completed or '[]')
    
    return render_template('dashboard.html', 
                           challenges=assigned, 
                           lessons_count=len(lessons_list))

# Modules & Learning Zone
@app.route('/learning')
@login_required
def learning():
    completed_lessons = json.loads(current_user.lessons_completed or '[]')
    return render_template('learning.html', completed=completed_lessons)

# Quiz Zone
@app.route('/quiz')
@login_required
def quiz():
    return render_template('quiz.html')

# Waste Segregation Game
@app.route('/game/waste')
@login_required
def game_waste():
    return render_template('game_waste.html')

# Story Mode
@app.route('/story')
@login_required
def story():
    return render_template('story.html')

# Virtual Eco Garden
@app.route('/garden')
@login_required
def garden():
    return render_template('garden.html')

# Green City Simulator
@app.route('/city')
@login_required
def city():
    return render_template('city.html')

# Carbon Footprint Calculator
@app.route('/calculator')
@login_required
def calculator():
    return render_template('calculator.html')

# Treasure Hunt
@app.route('/treasure')
@login_required
def treasure():
    return render_template('treasure.html')

# Poster Creation Corner
@app.route('/poster')
@login_required
def poster():
    return render_template('poster.html')

# AI Chatbot
@app.route('/chatbot')
@login_required
def chatbot():
    return render_template('chatbot.html')

# Achievements & Certificates
@app.route('/achievements')
@login_required
def achievements():
    lessons = json.loads(current_user.lessons_completed or '[]')
    return render_template('achievements.html', lessons=lessons)

# Admin Panel
@app.route('/admin')
@login_required
def admin():
    if not current_user.is_admin:
        flash('Unauthorized Access! Admin rights required.', 'danger')
        return redirect(url_for('dashboard'))
        
    # Gather Platform Analytics
    total_users = User.query.count()
    admins_count = User.query.filter_by(is_admin=True).count()
    all_users = User.query.order_by(User.xp.desc()).all()
    challenges_count = DailyChallenge.query.count()
    
    # Calculate global averages
    total_xp = sum(u.xp for u in all_users)
    avg_xp = round(total_xp / total_users, 1) if total_users > 0 else 0
    total_coins = sum(u.eco_coins for u in all_users)
    
    # Challenge list for editing
    challenges_list = DailyChallenge.query.all()
    
    return render_template('admin.html',
                           total_users=total_users,
                           admins_count=admins_count,
                           avg_xp=avg_xp,
                           total_coins=total_coins,
                           users=all_users,
                           challenges=challenges_list)

# --- POST & API ROUTING ---

# API to retrieve dynamic stats
@app.route('/api/get_stats', methods=['GET'])
@login_required
def api_get_stats():
    return jsonify(current_user.to_dict())

# Chatbot response endpoint
@app.route('/api/chatbot', methods=['POST'])
@login_required
def api_chatbot():
    data = request.get_json() or {}
    message = data.get('message', '')
    response = get_bot_response(message)
    return jsonify({'reply': response})

# API to complete a lesson and reward
@app.route('/api/complete_lesson', methods=['POST'])
@login_required
def api_complete_lesson():
    data = request.get_json() or {}
    module_id = data.get('module_id')
    
    if not module_id:
        return jsonify({'error': 'Module ID missing'}), 400
        
    completed = json.loads(current_user.lessons_completed or '[]')
    
    # Reward only if it's first completion
    rewarded = False
    xp_gained = 0
    coins_gained = 0
    
    if module_id not in completed:
        completed.append(module_id)
        current_user.lessons_completed = json.dumps(completed)
        
        # Reward
        xp_gained = 50
        coins_gained = 30
        current_user.xp += xp_gained
        current_user.eco_coins += coins_gained
        
        # Check badge rewards based on completions
        check_badges(current_user, len(completed), "lessons")
        
        rewarded = True
        
    # Check level up
    old_level = current_user.level
    new_level = (current_user.xp // 250) + 1
    level_up = False
    if new_level > old_level:
        current_user.level = new_level
        level_up = True
        
    db.session.commit()
    
    return jsonify({
        'success': True,
        'rewarded': rewarded,
        'xp_gained': xp_gained,
        'coins_gained': coins_gained,
        'total_xp': current_user.xp,
        'total_coins': current_user.eco_coins,
        'level_up': level_up,
        'new_level': current_user.level
    })

# API to save stats after games/quizzes
@app.route('/api/update_stats', methods=['POST'])
@login_required
def api_update_stats():
    data = request.get_json() or {}
    xp_gain = int(data.get('xp_gain', 0))
    coins_gain = int(data.get('coins_gain', 0))
    quiz_complete = data.get('quiz_complete', False)
    game_complete = data.get('game_complete', False)
    
    current_user.xp += xp_gain
    current_user.eco_coins += coins_gain
    
    if quiz_complete:
        current_user.quizzes_completed += 1
        check_badges(current_user, current_user.quizzes_completed, "quizzes")
    if game_complete:
        current_user.games_played += 1
        check_badges(current_user, current_user.games_played, "games")
        
    # Level calculations
    old_level = current_user.level
    new_level = (current_user.xp // 250) + 1
    level_up = False
    if new_level > old_level:
        current_user.level = new_level
        level_up = True
        
    db.session.commit()
    
    return jsonify({
        'success': True,
        'xp_gained': xp_gain,
        'coins_gained': coins_gain,
        'total_xp': current_user.xp,
        'total_coins': current_user.eco_coins,
        'level_up': level_up,
        'new_level': current_user.level
    })

# API to complete a daily challenge
@app.route('/api/complete_challenge', methods=['POST'])
@login_required
def api_complete_challenge():
    data = request.get_json() or {}
    challenge_id = data.get('challenge_id')
    
    today = date.today().isoformat()
    uc = UserChallenge.query.filter_by(user_id=current_user.id, challenge_id=challenge_id, date=today).first()
    
    if not uc:
        return jsonify({'error': 'Challenge assignment not found'}), 400
        
    if uc.completed:
        return jsonify({'message': 'Challenge already completed today'}), 200
        
    uc.completed = True
    current_user.challenges_completed += 1
    
    # Reward
    xp_gain = uc.challenge.xp_reward
    coins_gain = uc.challenge.coin_reward
    current_user.xp += xp_gain
    current_user.eco_coins += coins_gain
    
    # Check levels and badges
    check_badges(current_user, current_user.challenges_completed, "challenges")
    
    old_level = current_user.level
    new_level = (current_user.xp // 250) + 1
    level_up = False
    if new_level > old_level:
        current_user.level = new_level
        level_up = True
        
    db.session.commit()
    
    return jsonify({
        'success': True,
        'xp_gained': xp_gain,
        'coins_gained': coins_gain,
        'level_up': level_up,
        'new_level': current_user.level
    })

# API to save/load garden layout
@app.route('/api/save_garden', methods=['POST'])
@login_required
def api_save_garden():
    data = request.get_json() or {}
    garden_state = data.get('garden_state')
    
    if garden_state is not None:
        current_user.garden_state = json.dumps(garden_state)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Invalid state'}), 400

# API to save/load city builder state
@app.route('/api/save_city', methods=['POST'])
@login_required
def api_save_city():
    data = request.get_json() or {}
    city_state = data.get('city_state')
    
    if city_state is not None:
        current_user.city_state = json.dumps(city_state)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Invalid state'}), 400

# API for Leaderboards
@app.route('/api/leaderboard', methods=['GET'])
@login_required
def api_leaderboard():
    users = User.query.order_by(User.xp.desc()).limit(10).all()
    leaderboard_data = []
    
    for index, u in enumerate(users):
        leaderboard_data.append({
            'rank': index + 1,
            'username': u.username,
            'xp': u.xp,
            'level': u.level,
            'id': u.id
        })
        
    # Get current user rank
    all_users_ordered = User.query.order_by(User.xp.desc()).all()
    user_rank = -1
    for index, u in enumerate(all_users_ordered):
        if u.id == current_user.id:
            user_rank = index + 1
            break
            
    return jsonify({
        'leaderboard': leaderboard_data,
        'user_rank': user_rank
    })

# Admin routes: Modify User statistics directly
@app.route('/admin/update_user', methods=['POST'])
@login_required
def admin_update_user():
    if not current_user.is_admin:
        return jsonify({'error': 'Unauthorized'}), 403
        
    user_id = request.form.get('user_id')
    xp = request.form.get('xp')
    coins = request.form.get('eco_coins')
    level = request.form.get('level')
    is_admin = request.form.get('is_admin') == 'on'
    
    user = User.query.get(user_id)
    if user:
        if xp: user.xp = int(xp)
        if coins: user.eco_coins = int(coins)
        if level: user.level = int(level)
        user.is_admin = is_admin
        db.session.commit()
        flash(f'User {user.username} statistics updated successfully.', 'success')
    else:
        flash('User not found.', 'danger')
        
    return redirect(url_for('admin'))

@app.route('/admin/delete_user/<int:user_id>', methods=['POST'])
@login_required
def admin_delete_user(user_id):
    if not current_user.is_admin:
        return redirect(url_for('dashboard'))
        
    user = User.query.get(user_id)
    if user:
        if user.username == "admin":
            flash("Cannot delete standard system administrator!", "danger")
        else:
            db.session.delete(user)
            db.session.commit()
            flash(f"User {user.username} removed successfully.", "success")
    return redirect(url_for('admin'))

@app.route('/admin/add_challenge', methods=['POST'])
@login_required
def admin_add_challenge():
    if not current_user.is_admin:
        return redirect(url_for('dashboard'))
        
    title = request.form.get('title')
    description = request.form.get('description')
    xp_reward = request.form.get('xp_reward', 15)
    coin_reward = request.form.get('coin_reward', 10)
    ctype = request.form.get('challenge_type')
    
    new_challenge = DailyChallenge(
        title=title,
        description=description,
        xp_reward=int(xp_reward),
        coin_reward=int(coin_reward),
        challenge_type=ctype
    )
    
    db.session.add(new_challenge)
    db.session.commit()
    flash(f"Challenge '{title}' added successfully.", "success")
    return redirect(url_for('admin'))

# Helper Badge Triggering Engine
def check_badges(user, current_count, check_type):
    today = date.today().isoformat()
    earned_names = [b.name for b in user.badges]
    
    badges_to_award = []
    
    if check_type == "lessons":
        if current_count >= 1 and "Green Champion" not in earned_names:
            badges_to_award.append(Badge(name="Green Champion", description="Completed your first educational learning module.", badge_icon="green-champion", date_earned=today))
        if current_count >= 4 and "Sustainability Hero" not in earned_names:
            badges_to_award.append(Badge(name="Sustainability Hero", description="Completed 4 educational learning modules.", badge_icon="sustainability-hero", date_earned=today))
        if current_count >= 8 and "Earth Protector" not in earned_names:
            badges_to_award.append(Badge(name="Earth Protector", description="Completed all 8 learning modules! Master of eco-sciences.", badge_icon="earth-protector", date_earned=today))
            
    elif check_type == "quizzes":
        if current_count >= 1 and "Climate Guardian" not in earned_names:
            badges_to_award.append(Badge(name="Climate Guardian", description="Scored perfectly or finished a Quiz Arena test.", badge_icon="climate-guardian", date_earned=today))
            
    elif check_type == "games":
        if current_count >= 1 and "Waste Warrior" not in earned_names:
            badges_to_award.append(Badge(name="Waste Warrior", description="Played the Waste Segregation Game and sorted waste properly.", badge_icon="waste-warrior", date_earned=today))
            
    elif check_type == "challenges":
        if current_count >= 1 and "Eco Activist" not in earned_names:
            badges_to_award.append(Badge(name="Eco Activist", description="Completed your first real-world daily challenge.", badge_icon="eco-activist", date_earned=today))
        if current_count >= 5 and "Biodiversity Defender" not in earned_names:
            badges_to_award.append(Badge(name="Biodiversity Defender", description="Completed 5 daily tasks advocating for green behaviors.", badge_icon="biodiversity-defender", date_earned=today))
            
    for b in badges_to_award:
        user.badges.append(b)

if __name__ == '__main__':
    app.run(debug=True)
