const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // For handling CORS if required
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5500;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Middleware
app.use(cors()); // Allow cross-origin if needed for front-end
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Models
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

const SymptomLog = mongoose.model('SymptomLog', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: String, required: true },
  symptom: { type: String, required: true },
  severity: { type: Number, required: true, min: 1, max: 10 }
}));

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ status: 'success', message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'User registration failed.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ status: 'success', token });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Login failed.' });
  }
});

// Middleware for Protected Routes
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Authorization token missing.' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Session expired. Please log in again.' });
    req.userId = decoded.userId;
    next();
  });
};

// Protected route to log symptoms
app.post('/log_symptom', authenticate, async (req, res) => {
  const { symptom, severity } = req.body;

  // Validate input
  if (!symptom || !severity || severity < 1 || severity > 10) {
    return res.status(400).json({ status: 'error', message: 'Valid symptom and severity (1-10) required.' });
  }

  try {
    const date = new Date().toISOString().split('T')[0];
    await SymptomLog.create({ userId: req.userId, date, symptom, severity: parseInt(severity, 10) });

    // Determine health recommendation based on severity
    let recommendation;
    if (severity <= 3) {
      recommendation = 'Symptoms mild. Stay hydrated and rest.';
    } else if (severity <= 6) {
      recommendation = 'Moderate symptoms. Consider consulting a healthcare professional.';
    } else if (severity <= 8) {
      recommendation = 'Severe symptoms. Seek advice from a healthcare provider.';
    } else {
      recommendation = 'Critical symptoms. Seek emergency medical attention immediately!';
    }

    res.json({ status: 'success', recommendation });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to log symptom.' });
  }
});

// Fetch user-specific symptom history
app.get('/get_symptom_history', authenticate, async (req, res) => {
  try {
    const symptomData = await SymptomLog.find({ userId: req.userId }).sort({ date: 1 });
    const dates = symptomData.map(entry => entry.date);
    const severities = symptomData.map(entry => entry.severity);

    res.json({ dates, severities });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch symptom history.' });
  }
});

// Home Route (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
