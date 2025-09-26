# Kitchen Hub Deployment Guide

## Render.com Deployment Instructions

### Backend Deployment

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the `server` directory as the root directory
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`

2. **Set Environment Variables**
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   SECRET_KEY=your-super-secret-key-here
   FRONTEND_URL=https://your-frontend-domain.onrender.com
   FLASK_ENV=production
   PORT=5000
   ```

3. **Database Setup**
   - Create a PostgreSQL database on Render
   - Copy the database URL to the `DATABASE_URL` environment variable
   - The app will automatically handle database migrations

### Frontend Deployment

1. **Create a new Static Site on Render**
   - Connect your GitHub repository
   - Select the `client` directory as the root directory
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

2. **Set Environment Variables**
   ```
   REACT_APP_API_BASE_URL=https://your-backend-service.onrender.com
   ```

### Post-Deployment Steps

1. **Initialize Database**
   - Visit `https://your-backend-url.onrender.com/seed-db` to create initial data
   - This will create the admin user and sample categories

2. **Test the Application**
   - Visit your frontend URL
   - Try logging in with admin credentials: `admin` / `admin123`
   - Test creating orders and managing menu items

### Environment Variables Summary

**Backend (.env)**
```
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
FRONTEND_URL=https://your-frontend.onrender.com
FLASK_ENV=production
PORT=5000
```

**Frontend (.env)**
```
REACT_APP_API_BASE_URL=https://your-backend.onrender.com
```

### Troubleshooting

1. **CORS Issues**: Ensure `FRONTEND_URL` is set correctly in backend environment
2. **Database Connection**: Check `DATABASE_URL` format and credentials
3. **API Calls Failing**: Verify `REACT_APP_API_BASE_URL` matches your backend URL
4. **Build Failures**: Check that all dependencies are listed in requirements.txt/package.json

### Local Development

For local development, the app will fall back to:
- Backend: `http://localhost:5555`
- Frontend: `http://localhost:3000`

No environment variables needed for local development.