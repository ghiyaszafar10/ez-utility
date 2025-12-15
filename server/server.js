const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://ez-utility.vercel.app/', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ez-utility';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', urlSchema);

const generateShortCode = () => {
  return crypto.randomBytes(3).toString('hex');
};

app.get('/', (req, res) => {
  res.json({ message: 'EZ-Utility API is running!' });
});

app.post('/api/shorten', async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) {
      return res.status(400).json({ error: 'Please provide a URL' });
    }

    try {
      new URL(longUrl);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    let url = await Url.findOne({ longUrl });
    if (url) {
      return res.json({
        longUrl: url.longUrl,
        shortUrl: url.shortUrl,
        shortCode: url.shortCode
      });
    }

    let shortCode;
    let isUnique = false;
    while (!isUnique) {
      shortCode = generateShortCode();
      const existing = await Url.findOne({ shortCode });
      if (!existing) isUnique = true;
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const shortUrl = `${baseUrl}/${shortCode}`;

    url = new Url({ longUrl, shortCode, shortUrl });
    await url.save();

    res.json({
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      shortCode: url.shortCode
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    url.clicks++;
    await url.save();
    res.redirect(url.longUrl);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
