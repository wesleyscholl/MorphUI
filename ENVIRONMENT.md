# Environment Variables

## Backend

Copy `.env.example` to `.env` and configure:

```bash
cd packages/backend
cp .env.example .env
```

### Required Variables

#### GEMINI_API_KEY
**Description**: Google Gemini AI API key for mood analysis and UI recommendations  
**Required**: Yes  
**Get it**: https://ai.google.dev/  
**Example**: `AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz`

### Optional Variables

#### PORT
**Description**: Backend server port  
**Default**: `3000`  
**Example**: `3000`

#### NODE_ENV
**Description**: Environment mode  
**Values**: `development`, `production`, `test`  
**Default**: `development`

#### FRONTEND_URL
**Description**: Frontend URL for CORS configuration  
**Default**: `http://localhost:5173`  
**Example**: `https://your-frontend.com`

#### RATE_LIMIT_WINDOW_MS
**Description**: Rate limit window in milliseconds  
**Default**: `900000` (15 minutes)  
**Example**: `600000`

#### RATE_LIMIT_MAX_REQUESTS
**Description**: Maximum requests per window  
**Default**: `100`  
**Example**: `150`

## Frontend

Frontend uses Vite's environment variable system. Create a `.env.local` file in `packages/frontend`:

### Optional Variables

#### VITE_API_URL
**Description**: Backend API base URL  
**Default**: `/api` (proxied by Vite)  
**Example**: `http://localhost:3000/api`

## Production Deployment

For production, set these environment variables in your hosting platform:

### Vercel / Netlify (Frontend)
```bash
VITE_API_URL=https://your-backend-api.com/api
```

### Railway / Render / Heroku (Backend)
```bash
GEMINI_API_KEY=your_actual_key_here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
PORT=3000
```

## Security Notes

⚠️ **Never commit `.env` files to version control**

✅ Always use environment variables for sensitive data  
✅ Rotate API keys regularly  
✅ Use different keys for development and production  
✅ Limit API key permissions when possible

## Troubleshooting

### "GEMINI_API_KEY not found"
- Check that `.env` exists in `packages/backend`
- Verify the key is correctly formatted
- Restart the backend server after changes

### CORS errors
- Verify `FRONTEND_URL` matches your frontend URL
- Check that both servers are running
- Clear browser cache and cookies

### Rate limiting issues
- Adjust `RATE_LIMIT_MAX_REQUESTS` if needed
- Consider implementing user-based rate limiting
