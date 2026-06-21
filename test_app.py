import unittest
import os
import json
from app import app, db
from models import User, DailyChallenge

class EcoQuestTestCase(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # In-memory database
        self.client = app.test_client()
        
        # Initialize tables
        with app.app_context():
            db.create_all()
            
            # Seed tests
            ch1 = DailyChallenge(title="Test Challenge", description="Test Description", xp_reward=10, coin_reward=5, challenge_type="test")
            db.session.add(ch1)
            
            # Seed test user
            from werkzeug.security import generate_password_hash
            user = User(
                username="testuser",
                email="testuser@test.com",
                password_hash=generate_password_hash("testpwd", method="pbkdf2:sha256"),
                xp=0,
                eco_coins=100,
                level=1,
                streak=0
            )
            db.session.add(user)
            db.session.commit()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    # --- 1. Test Routing ---
    def test_landing_page_redirect(self):
        # Landing page redirects to dashboard if not logged in (wait, root index page is rendered!)
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Gamified Learning For Our', response.data)

    def test_unauthorized_redirects(self):
        # Unauthorized pages redirect to login
        routes = ['/dashboard', '/learning', '/quiz', '/garden', '/city', '/calculator', '/chatbot']
        for r in routes:
            response = self.client.get(r)
            self.assertEqual(response.status_code, 302) # Redirect to login
            self.assertIn('/login', response.headers['Location'])

    # --- 2. Test Authentication ---
    def test_login_logout_flow(self):
        # Test valid login
        response = self.client.post('/login', data=dict(
            username="testuser",
            password="testpwd"
        ), follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Eco Dashboard', response.data)
        
        # Test logout
        response = self.client.get('/logout', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Logged out successfully', response.data)

    def test_invalid_login(self):
        response = self.client.post('/login', data=dict(
            username="testuser",
            password="wrongpassword"
        ), follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Invalid username or password', response.data)

    # --- 3. Test API endpoints ---
    def test_api_chatbot(self):
        # Log in first
        self.client.post('/login', data=dict(username="testuser", password="testpwd"))
        
        # Send chatbot request
        response = self.client.post('/api/chatbot', 
                                   data=json.dumps(dict(message="Tell me about climate change")),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('reply', data)
        self.assertTrue(len(data['reply']) > 0)

    def test_api_update_stats(self):
        # Log in
        self.client.post('/login', data=dict(username="testuser", password="testpwd"))
        
        # Update stats
        response = self.client.post('/api/update_stats',
                                   data=json.dumps(dict(xp_gain=50, coins_gain=20, quiz_complete=True)),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['xp_gained'], 50)
        self.assertEqual(data['coins_gained'], 20)
        self.assertEqual(data['total_xp'], 50)
        self.assertEqual(data['total_coins'], 120)

    def test_api_save_garden(self):
        self.client.post('/login', data=dict(username="testuser", password="testpwd"))
        
        garden_mock = [{"id": "p1", "type": "pine", "x": 100, "y": 150, "stage": 1, "water": 40}]
        response = self.client.post('/api/save_garden',
                                   data=json.dumps(dict(garden_state=garden_mock)),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)
        
        # Verify changes in DB
        with app.app_context():
            u = User.query.filter_by(username="testuser").first()
            state = json.loads(u.garden_state)
            self.assertEqual(len(state), 1)
            self.assertEqual(state[0]['type'], 'pine')

if __name__ == '__main__':
    unittest.main()
