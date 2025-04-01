const express = require('express');
const Gallery = require('../models/Gallery');
const router = express.Router();

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.json(galleries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a new gallery item
router.post('/', async (req, res) => {
  const { title, description, imageUrl } = req.body;
  const newGallery = new Gallery({ title, description, imageUrl });
  try {
    await newGallery.save();
    res.status(201).json(newGallery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
