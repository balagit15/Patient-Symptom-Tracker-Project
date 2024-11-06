const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost:27017/medical_terms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Symptom schema and model
const symptomSchema = new mongoose.Schema({
  symptom: String,
  severity: Number,
  date: { type: Date, default: Date.now }
});
const Symptom = mongoose.model('Symptom', symptomSchema);

// Route to get the index page (without login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the index.html file
});

// Log Symptom (no authentication required now)
app.post('/log_symptom', async (req, res) => {
  const { symptom, severity } = req.body;

  try {
    // Save the symptom
    const newSymptom = new Symptom({ symptom, severity });
    await newSymptom.save();

    // Generate health recommendation (simplified)
    let recommendation = '';
    if (severity >= 8) {
      recommendation = 'Please consult a doctor immediately.';
    } else if (severity >= 5) {
      recommendation = 'Consider visiting a healthcare professional if the symptom persists.';
    } else {
      recommendation = 'Monitor the symptom and seek medical advice if needed.';
    }

    res.json({ status: 'success', recommendation });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to log symptom', error });
  }
});

// Get Symptom History (no authentication required)
app.get('/get_symptom_history', async (req, res) => {
  try {
    const symptoms = await Symptom.find().sort({ date: -1 }).limit(10);
    const dates = symptoms.map(symptom => symptom.date.toISOString().split('T')[0]);
    const severities = symptoms.map(symptom => symptom.severity);
  
    res.json({ dates, severities });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve symptom history' });
  }
});

// Get Stats (no authentication required)
app.get('/get_stats', async (req, res) => {
  try {
    const symptoms = await Symptom.find();

    const avgSeverity = symptoms.reduce((total, symptom) => total + symptom.severity, 0) / symptoms.length || 0;
    const symptomCount = symptoms.length;

    res.json({ avgSeverity, symptomCount });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve statistics' });
  }
});

// Get Health Tips (static example)
app.get('/get_health_tips', (req, res) => {
  const tips = [
    'Drink plenty of water to stay hydrated.',
    'Get at least 7-8 hours of sleep every night.',
    'Exercise regularly to maintain overall health.',
    'If you feel unwell, consult a doctor as soon as possible.',
    'Avoid smoking and excessive alcohol consumption.'
  ];
  res.json({ tips });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
