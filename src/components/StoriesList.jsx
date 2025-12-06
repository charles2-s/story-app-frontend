import { useState, useEffect } from 'react';
import { storiesAPI } from '../api';

const StoriesList = ({ refreshTrigger, currentUser }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStory, setEditingStory] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState({});

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await storiesAPI.getStories();
      setStories(response);

      // Fetch like status for each story
      const likeStatuses = {};
      for (const story of response) {
        try {
          const likeStatus = await storiesAPI.checkLikeStatus(story.id);
          likeStatuses[story.id] = likeStatus.liked;
        } catch {
          likeStatuses[story.id] = false;
        }
      }
      setLikes(likeStatuses);
    } catch (err) {
      setError('Failed to load stories');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (storyId) => {
    try {
      const response = await storiesAPI.getComments(storyId);
      setComments(prev => ({ ...prev, [storyId]: response }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [refreshTrigger]);

  const handleEdit = (story) => {
    setEditingStory(story.id);
    setEditForm({ title: story.title, content: story.content });
  };

  const handleUpdate = async (storyId) => {
    try {
      await storiesAPI.updateStory(storyId, editForm);
      setEditingStory(null);
      fetchStories(); // Refresh the list
    } catch (err) {
      console.error('Error updating story:', err);
    }
  };

  const handleDelete = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await storiesAPI.deleteStory(storyId);
        fetchStories(); // Refresh the list
      } catch (err) {
        console.error('Error deleting story:', err);
      }
    }
  };

  const handleLike = async (storyId) => {
    try {
      if (likes[storyId]) {
        await storiesAPI.unlikeStory(storyId);
        setLikes(prev => ({ ...prev, [storyId]: false }));
      } else {
        await storiesAPI.likeStory(storyId);
        setLikes(prev => ({ ...prev, [storyId]: true }));
      }
      fetchStories(); // Refresh to update like counts
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleComment = async (storyId) => {
    if (!newComment.trim()) return;

    try {
      await storiesAPI.createComment(storyId, { content: newComment });
      setNewComment('');
      fetchComments(storyId);
      fetchStories(); // Refresh to update comment counts
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId, storyId) => {
    try {
      await storiesAPI.deleteComment(commentId);
      fetchComments(storyId);
      fetchStories(); // Refresh to update comment counts
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading stories...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (stories.length === 0) {
    return <div className="no-stories">No stories yet. Be the first to create one!</div>;
  }

  return (
    <div className="stories-list">
      <h3>All Stories</h3>
      {stories.map((story) => (
        <div key={story.id} className="story-card">
          {editingStory === story.id ? (
            <div className="edit-form">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Story title"
              />
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                placeholder="Story content"
                rows="4"
              />
              <div className="edit-buttons">
                <button onClick={() => handleUpdate(story.id)}>Save</button>
                <button onClick={() => setEditingStory(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h4>{story.title}</h4>
              <p className="story-content">{story.content}</p>
              <div className="story-meta">
                <small>By: {story.owner?.username || 'Anonymous'}</small>
                <small>Created: {new Date(story.created_at).toLocaleDateString()}</small>
                <small>Likes: {story.likes_count || 0}</small>
              </div>

              <div className="story-actions">
                <button
                  className={`like-btn ${likes[story.id] ? 'liked' : ''}`}
                  onClick={() => handleLike(story.id)}
                >
                  {likes[story.id] ? '❤️ Unlike' : '🤍 Like'}
                </button>

                <button
                  className="comment-btn"
                  onClick={() => fetchComments(story.id)}
                >
                  💬 Comments ({story.comments_count || 0})
                </button>

                {currentUser && story.owner_id === currentUser.id && (
                  <>
                    <button className="edit-btn" onClick={() => handleEdit(story)}>
                      ✏️ Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(story.id)}>
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>

              {/* Comments Section */}
              {comments[story.id] && (
                <div className="comments-section">
                  <h5>Comments</h5>
                  {comments[story.id].map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-content">
                        <strong>{comment.author?.username || 'Anonymous'}:</strong> {comment.content}
                      </div>
                      <div className="comment-meta">
                        <small>{new Date(comment.created_at).toLocaleDateString()}</small>
                        {currentUser && comment.author_id === currentUser.id && (
                          <button
                            className="delete-comment-btn"
                            onClick={() => handleDeleteComment(comment.id, story.id)}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Comment Form */}
                  <div className="add-comment">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows="2"
                    />
                    <button onClick={() => handleComment(story.id)}>Post Comment</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default StoriesList;