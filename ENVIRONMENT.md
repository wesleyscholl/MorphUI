# Environment Variables

## Backend

Copy `.env.example` to `.env` and configure:

```bash
cd packages/backend
cp .env.example .env
```

### Required Setup

#### Ollama Installation
MorphUI uses **Ollama** for local AI processing - no API keys needed!

**Install Ollama**:
- macOS/Linux: `brew install ollama` or visit https://ollama.ai
- Start service: `ollama serve`
- Pull model: `ollama pull gemma2:270m`

### Optional Variables

#### OLLAMA_URL
**Description**: Ollama API endpoint  
**Default**: `http://localhost:11434`  
**Example**: `http://192.168.1.100:11434`

#### OLLAMA_MODEL
**Description**: Ollama model to use for AI analysis  
**Default**: `gemma2:270m`  
**Options**: `gemma2:270m`, `gemma2:2b`, `gemma2:9b`, `llama3.2:3b`, `phi3:mini`  
**Example**: `gemma2:270m`

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
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:270m
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
PORT=3000
```

**Note**: For production deployment, you'll need to deploy Ollama separately or use a hosted Ollama instance.

## Security Notes

⚠️ **Never commit `.env` files to version control**

✅ Always use environment variables for configuration  
✅ Ollama runs locally by default (no external API calls)  
✅ For production, secure your Ollama endpoint if exposed  
✅ Consider using reverse proxy with authentication

## Troubleshooting

### "Ollama service not available"
- Check Ollama is running: `ollama list`
- Start Ollama: `ollama serve`
- Verify model is pulled: `ollama pull gemma2:270m`
- Check URL: `curl http://localhost:11434/api/tags`
- Restart the backend server after starting Ollama

### CORS errors
- Verify `FRONTEND_URL` matches your frontend URL
- Check that both servers are running
- Clear browser cache and cookies

### Rate limiting issues
- Adjust `RATE_LIMIT_MAX_REQUESTS` if needed
- Consider implementing user-based rate limiting
