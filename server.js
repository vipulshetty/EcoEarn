
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RecyclingEntry = require('./models/RecyclingEntry');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/eco_earn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.post('/api/recycling-entry', async (req, res) => {
  try {
    const { userId, weight, imageCount, classifications } = req.body;

    // Calculate environmental impact
    const co2Saved = weight * 2 + imageCount * 0.1;
    const treesSaved = co2Saved / 22;
    const waterSaved = weight * 17;

    const entry = new RecyclingEntry({
      userId,
      weight,
      imageCount,
      classifications,
      co2Saved,
      treesSaved,
      waterSaved
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/recycling-entries/:userId', async (req, res) => {
  try {
    const entries = await RecyclingEntry.find({ userId: req.params.userId });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const result = await RecyclingEntry.aggregate([
      { $match: { userId: req.params.userId } },
      { $group: {
        _id: null,
        totalWeight: { $sum: '$weight' },
        totalCO2Saved: { $sum: '$co2Saved' },
        totalTreesSaved: { $sum: '$treesSaved' },
        totalWaterSaved: { $sum: '$waterSaved' },
        totalEntries: { $sum: 1 }
      }}
    ]);

    res.json(result[0] || { totalWeight: 0, totalCO2Saved: 0, totalTreesSaved: 0, totalWaterSaved: 0, totalEntries: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));