import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const USER_ID = 1; // Demo user

function App() {
  const [view, setView] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    loadCategories();
    if (view === 'gallery') loadImages();
    if (view === 'favorites') loadFavorites();
    if (view === 'history') loadHistory();
  }, [view]);

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadImages = async () => {
    try {
      const res = await axios.get(`${API}/images`);
      setImages(res.data);
    } catch (err) {
      console.error('Error loading images:', err);
    }
  };

  const loadFavorites = async () => {
    try {
      const res = await axios.get(`${API}/user/${USER_ID}/favorites`);
      setFavorites(res.data);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API}/user/${USER_ID}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt!');
      return;
    }
    
    setLoading(true);
    setCurrentImage('');
    
    try {
      const res = await axios.post(`${API}/generate`, { 
        prompt: prompt.trim(), 
        userId: USER_ID 
      });
      
      if (res.data.success) {
        setCurrentImage(res.data.imageUrl);
        alert('✅ Image generated successfully!');
        setPrompt('');
      }
    } catch (err) {
      console.error('Generation error:', err);
      alert('❌ Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (imageId) => {
    try {
      await axios.post(`${API}/favorites`, { userId: USER_ID, imageId });
      alert('❤️ Added to favorites!');
    } catch (err) {
      if (err.response?.data?.error === 'Already in favorites') {
        alert('Already in favorites!');
      } else {
        alert('Failed to add to favorites');
      }
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await axios.delete(`${API}/images/${id}`);
      alert('🗑️ Deleted successfully!');
      loadImages();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && prompt.trim()) {
      generateImage();
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>✨ AI Image Generator</h1>
        <div className="nav-links">
          <button onClick={() => setView('generate')} className={view === 'generate' ? 'active' : ''}>
            Generate
          </button>
          <button onClick={() => setView('gallery')} className={view === 'gallery' ? 'active' : ''}>
            Gallery
          </button>
          <button onClick={() => setView('favorites')} className={view === 'favorites' ? 'active' : ''}>
            Favorites
          </button>
          <button onClick={() => setView('history')} className={view === 'history' ? 'active' : ''}>
            History
          </button>
        </div>
      </nav>

      <div className="container">
        {view === 'generate' && (
          <div className="generate-section">
            <h2>Create Your Image</h2>
            <p className="subtitle">Describe what you want to see</p>
            
            <div className="categories">
              <h3>Quick Suggestions:</h3>
              <div className="category-grid">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    className="category-btn" 
                    onClick={() => setPrompt(`${cat.name.toLowerCase()} scene`)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., A magical forest with glowing mushrooms at night"
              rows="4"
              disabled={loading}
            />
            
            <button onClick={generateImage} disabled={loading} className="generate-btn">
              {loading ? '⏳ Generating...' : '🎨 Generate Image'}
            </button>

            {currentImage && (
              <div className="current-image">
                <h3>Your Generated Image:</h3>
                <img src={currentImage} alt="Generated" />
                <p className="success-msg">✅ Image saved to gallery!</p>
              </div>
            )}
          </div>
        )}

        {view === 'gallery' && (
          <div className="gallery-section">
            <h2>Image Gallery ({images.length})</h2>
            {images.length === 0 ? (
              <p className="empty-msg">No images yet. Generate some!</p>
            ) : (
              <div className="image-grid">
                {images.map(img => (
                  <div key={img.id} className="image-card">
                    <img src={img.image_url} alt={img.prompt} />
                    <div className="image-info">
                      <p className="prompt">{img.prompt}</p>
                      <p className="username">by {img.username}</p>
                      <div className="actions">
                        <button onClick={() => addToFavorites(img.id)} className="fav-btn">
                          ❤️
                        </button>
                        <button onClick={() => deleteImage(img.id)} className="del-btn">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'favorites' && (
          <div className="gallery-section">
            <h2>My Favorites ({favorites.length})</h2>
            {favorites.length === 0 ? (
              <p className="empty-msg">No favorites yet. Add some from the gallery!</p>
            ) : (
              <div className="image-grid">
                {favorites.map(img => (
                  <div key={img.id} className="image-card">
                    <img src={img.image_url} alt={img.prompt} />
                    <div className="image-info">
                      <p className="prompt">{img.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'history' && (
          <div className="history-section">
            <h2>Generation History</h2>
            {history.length === 0 ? (
              <p className="empty-msg">No history yet. Start generating!</p>
            ) : (
              <div className="history-list">
                {history.map(h => (
                  <div key={h.id} className={`history-item ${h.status}`}>
                    <span className="status-icon">
                      {h.status === 'success' ? '✅' : '❌'}
                    </span>
                    <span className="prompt">{h.prompt}</span>
                    <span className="date">{new Date(h.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;