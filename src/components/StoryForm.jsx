import { useState } from 'react';
import { storiesAPI } from '../api';

const StoryForm = ({ onStoryCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await storiesAPI.createStory(formData);
      onStoryCreated(response);
      setFormData({ title: '', content: '' }); // Clear form
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-form-container">
      <h3>Create New Story</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter story title"
          />
        </div>

        <div className="form-group">
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Write your story here..."
            rows="6"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Story...' : 'Create Story'}
        </button>
      </form>
    </div>
  );
};

export default StoryForm;