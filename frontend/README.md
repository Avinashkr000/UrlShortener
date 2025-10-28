# URL Shortener Frontend

Modern React frontend for the URL Shortener service built with Tailwind CSS and modern UI components.

## Features

- 🎆 Modern, responsive design with Tailwind CSS
- ⚡ Fast and intuitive user interface
- 📊 Real-time analytics dashboard
- 🖼 QR code generation for shortened URLs
- 📋 One-click copy to clipboard
- 📅 Expiry date management
- 📱 Mobile-first responsive design
- 🎨 Beautiful animations and transitions

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications
- **React QR Code** - QR code generation

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Backend service running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Update the API URL if needed:

```env
REACT_APP_API_URL=http://localhost:8080
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js
│   └── Footer.js
├── pages/              # Page components
│   ├── Home.js           # URL shortening form
│   ├── Dashboard.js      # URL management
│   └── Analytics.js      # Analytics dashboard
├── services/           # API services
│   └── api.js            # Axios configuration
├── App.js              # Main app component
├── App.css             # Global styles
└── index.js            # App entry point
```

## Features Overview

### Home Page
- Clean, modern URL shortening form
- Real-time URL validation
- Optional expiry date setting
- QR code generation
- One-click copy functionality

### Dashboard
- View all shortened URLs
- Manage URL expiry dates
- Delete URLs
- Quick copy and external link access

### Analytics
- Service health monitoring
- URL statistics and metrics
- System information display
- Real-time data refresh

## API Integration

The frontend integrates with the Spring Boot backend through these endpoints:

- `POST /api/shorten` - Create short URL
- `GET /api/all` - Get all URLs
- `DELETE /api/{shortCode}` - Delete URL
- `GET /actuator/health` - Health check

## Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/UrlShortener"
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Author

**Avinash Kumar**
- GitHub: [@Avinashkr000](https://github.com/Avinashkr000)
- Email: ak749299.ak@gmail.com
