import express from 'express';
import cors from 'cors';
import axios from 'axios';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// 1. Generate Image
app.post('/api/generate', async (req, res) => {
  const { prompt, userId = 1 } = req.body;
  
  try {
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;
    
    // Test if image URL is accessible
    await axios.get(imageUrl, { timeout: 15000 });
    
    // Save to database
    const [result] = await db.query(
      'INSERT INTO images (user_id, prompt, image_url) VALUES (?, ?, ?)',
      [userId, prompt, imageUrl]
    );
    
    // Save to history
    await db.query(
      'INSERT INTO generation_history (user_id, prompt, status) VALUES (?, ?, ?)',
      [userId, prompt, 'success']
    );
    
    console.log(`✅ Image generated: ${prompt}`);
    res.json({ success: true, imageUrl, imageId: result.insertId });
    
  } catch (error) {
    console.error('❌ Generation error:', error.message);
    
    // Save failed attempt to history
    try {
      await db.query(
        'INSERT INTO generation_history (user_id, prompt, status) VALUES (?, ?, ?)',
        [userId, prompt, 'failed']
      );
    } catch (dbError) {
      console.error('Database error:', dbError.message);
    }
    
    res.status(500).json({ error: 'Generation failed', details: error.message });
  }
});

// 2. Get All Images
app.get('/api/images', async (req, res) => {
  try {
    const [images] = await db.query(
      'SELECT i.*, u.username FROM images i JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC LIMIT 50'
    );
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// 3. Get User Images
app.get('/api/user/:userId/images', async (req, res) => {
  try {
    const [images] = await db.query(
      'SELECT * FROM images WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(images);
  } catch (error) {
    console.error('Error fetching user images:', error.message);
    res.status(500).json({ error: 'Failed to fetch user images' });
  }
});

// 4. Add to Favorites
app.post('/api/favorites', async (req, res) => {
  const { userId, imageId } = req.body;
  try {
    await db.query(
      'INSERT INTO favorites (user_id, image_id) VALUES (?, ?)',
      [userId, imageId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Already in favorites' });
    } else {
      res.status(500).json({ error: 'Failed to add favorite' });
    }
  }
});

// 5. Get Favorites
app.get('/api/user/:userId/favorites', async (req, res) => {
  try {
    const [favorites] = await db.query(
      'SELECT i.*, f.created_at as favorited_at FROM favorites f JOIN images i ON f.image_id = i.id WHERE f.user_id = ? ORDER BY f.created_at DESC',
      [req.params.userId]
    );
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// 6. Get Categories
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// 7. Delete Image
app.delete('/api/images/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM images WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error.message);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// 8. Get Generation History
app.get('/api/user/:userId/history', async (req, res) => {
  try {
    const [history] = await db.query(
      'SELECT * FROM generation_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.params.userId]
    );
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});