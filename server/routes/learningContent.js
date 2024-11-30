const express = require('express');
const router = express.Router();
const LearningContent = require('../models/LearningContent');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');

// Helper function to validate URL
const isValidUrl = (str) => {
  const pattern = new RegExp('^(https?://)?([\\w-]+\\.)+[\\w-]+(/[^\\s]*)?$', 'i');
  return pattern.test(str);
};

// GET all learning content
router.get('/', verifyToken, async (req, res) => {
  try {
    const content = await LearningContent.find();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// POST new learning content
router.post('/add', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  // Validate that title and content are provided, and content is a valid URL
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  if (!isValidUrl(content)) {
    return res.status(400).json({ error: 'Content must be a valid URL' });
  }

  try {
    const newContent = new LearningContent({
      title,
      type: 'link', // Default type is 'link' since content is a URL
      content,
    });

    await newContent.save();
    res.status(201).json(newContent);  // Respond with the added content
  } catch (error) {
    res.status(500).json({ error: 'Failed to add content' });
  }
});

module.exports = router;
