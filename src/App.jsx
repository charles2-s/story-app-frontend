import { useState, useMemo } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import StoryForm from './components/StoryForm';
import StoriesList from './components/StoriesList';
import './App.css';

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!token);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Decode current user from token
  const currentUser = useMemo(() => {
    return token ? decodeToken(token) : null;
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleRegister = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleStoryCreated = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger stories refresh
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        {currentView === 'login' ? (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        ) : (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-spacer"></div>
        <h1>My Stories</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <main className="app-main">
        <div className="content-wrapper">
          <StoryForm onStoryCreated={handleStoryCreated} />
          <StoriesList refreshTrigger={refreshTrigger} currentUser={currentUser} />
        </div>
      </main>
    </div>
  );
}

export default App;