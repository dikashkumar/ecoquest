# EcoQuest – Learn, Play & Protect the Planet

EcoQuest is a complete, full-stack educational and gamified learning web application designed to foster environmental awareness. It fuses the bite-sized learning mechanics of **Duolingo** and the competitive timers of **Kahoot** with grid-builder simulators, canvas canvas graphics, custom sound synthesis, and real-time carbon calculators.

---

## 🚀 Technology Stack
- **Frontend**: HTML5, CSS3 (Glassmorphism, custom dark/light theme properties), JavaScript (Vanilla ES6)
- **Backend**: Flask (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **Data Visualisation**: Chart.js
- **Audio Effects**: Web Audio API (real-time synthesised waveforms)

---

## 🌟 Key Features
1. **Interactive Learning Zone**: 8 detailed syllabus modules (Climate Change, Deforestation, etc.) with progressive slides, tip cards, and end-of-lesson quizzes.
2. **Quiz Arena**: Timed multiple-choice testing with Easy, Medium, and Hard difficulties and XP multipliers.
3. **Waste Segregation Game**: Fast-paced drag-and-drop game classifying organic, recyclable, and hazardous garbage under a ticking clock.
4. **Eco Adventure Story Mode**: 5 visual-novel style quests where user choices impact community metrics (river purity, forest density, etc.).
5. **Virtual Eco Garden**: Buy seeds using Eco Coins and watch your trees and flowers grow across 4 biological stages on a Canvas board.
6. **Green City Simulator**: Grid-builder zoning solar panels, wind turbines, eco parks, and houses. Recalculates pollution indexes and citizen happiness live!
7. **Carbon Footprint Calculator**: Input energy, travel, and food habits to receive your carbon footprint tonnage and carbon reduction recommendations.
8. **Poster Creation Corner**: Canvas-based designer supporting brushes, text stamps, templates, and PNG exports.
9. **Eco AI Chatbot**: Heuristic conversational bot answering environmental queries instantly.
10. **Achievements Cabinet**: Tracks unlocked badges and generates high-resolution course mastery certificates printable/downloadable from canvas.
11. **Admin Control Room**: System analytics dashboard listing users, updating gamified metrics, and creating new daily tasks.

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ecoquest.git
   cd ecoquest
   ```

2. **Install requirements**:
   ```bash
   pip install flask flask-sqlalchemy flask-login
   ```

3. **Launch the application**:
   ```bash
   python app.py
   ```
   *Note: On startup, the database is automatically created (`ecoquest.db`) and seeded with default daily challenges, badges, and a default admin account.*

4. **Access the application**:
   - URL: `http://127.0.0.1:5000`
   - Default Admin Credentials:
     - **Username**: `admin`
     - **Password**: `admin123`

---

## 🧪 Running Tests
We have structured unit tests checking authentication, API updates, database sessions, and chatbot keywords. Run tests via:
```bash
python -m unittest test_app.py
```
