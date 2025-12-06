# Story App Frontend

A modern React-based frontend for the Story App, providing a user-friendly interface for story sharing and management.

## Features

- **User Authentication**: Secure login and registration system
- **Story Creation**: Easy-to-use form for creating new stories
- **Story Viewing**: Display all user stories in an organized list
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Stories refresh automatically after creation

## Tech Stack

- **React 19**: Latest React with modern hooks and features
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API communication
- **React Icons**: Beautiful icons for enhanced UI
- **CSS**: Custom styling for polished appearance

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/charles2-s/story-app-frontend.git
   cd story-app-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Usage

1. **Register**: Create a new account with username and password
2. **Login**: Sign in with your credentials
3. **Create Stories**: Use the story form to share your stories
4. **View Stories**: Browse through all stories in the main feed
5. **Logout**: Securely sign out when done

## API Integration

This frontend connects to the Story App backend API. Make sure the backend server is running and accessible.

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file contains the deployment configuration.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── StoryForm.jsx
│   │   └── StoriesList.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── api.js
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on GitHub.