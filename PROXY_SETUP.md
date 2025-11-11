# Proxy Configuration Documentation

## Overview
This project uses proxy configuration to hide backend URLs from the browser and ensure compatibility in production.

## Development Environment
In development, Vite proxy is used to forward API requests to the backend server.

### Configuration
- **File**: `vite.config.js`
- **Proxy Target**: `http://localhost:3000`
- **API Route**: `/api/*`

### How it works
1. Frontend makes request to `/api/endpoint`
2. Vite server intercepts the request
3. Request is forwarded to `http://localhost:3000/api/endpoint`
4. Backend URL is never exposed to the browser

## Production Environment
You have two options for production proxy: Cloudflare Workers or Cloudflare Pages.

### Option 1: Cloudflare Workers
- **File**: `wrangler.toml`
- **Backend URL**: `https://presensi.sigmath.net/api`
- **Proxy Function**: `functions/api-proxy.js`

### Option 2: Cloudflare Pages (Recommended for simplicity)
- **Files**: `_redirects`, `_headers`, `functions/api/[...path].js`
- **Backend URL**: `https://presensi.sigmath.net/api`
- **No additional configuration needed**

### How it works (both options)
1. Frontend makes request to `/api/endpoint`
2. Cloudflare intercepts the request
3. Request is forwarded to `https://presensi.sigmath.net/api/endpoint`
4. Backend URL is never exposed to the browser

## Environment Variables

### Development (.env)
```
VITE_API_BASE_URL=/api
VITE_BACKEND_URL=https://presensi.sigmath.net
```

### Local Development (.env.local) - Recommended for security
```
VITE_BACKEND_URL=https://your-actual-backend-url.com
```
This file is NOT committed to git, keeping your backend URL secure.

### Production (.env.production)
```
VITE_API_BASE_URL=/api
```

## Security Best Practices

### Hiding Backend URLs
1. **Use .env.local for sensitive URLs**: This file is ignored by git
2. **Never commit backend URLs to repository**: Use environment variables
3. **Use different URLs for different environments**: Development, staging, production
4. **Configure backend URL in deployment platform**: Use Cloudflare environment variables

### File Priority (Vite loads in this order):
1. `.env.local` - Highest priority (for local secrets)
2. `.env.[mode]` - Environment specific (development, production)
3. `.env` - Default values

## Deployment Instructions

### Option 1: Cloudflare Workers Deployment
1. Update `wrangler.toml` with your actual domain:
   ```toml
   routes = [
     { pattern = "your-domain.com/api/*", zone_name = "your-domain.com" }
   ]
   ```

2. Update the function routes:
   ```toml
   [[env.production.functions]]
   name = "api-proxy"
   route = { pattern = "your-domain.com/api/*", zone_name = "your-domain.com" }
   ```

3. Deploy with:
   ```bash
   npm run build
   wrangler deploy --env production
   ```

### Option 2: Cloudflare Pages Deployment (Recommended)
1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable (optional): `API_BASE_URL=https://presensi.sigmath.net/api`
5. Deploy - Pages will automatically detect and use the functions

**Benefits of Pages:**
- Simpler setup
- Automatic deployments
- Built-in CI/CD
- No custom domain configuration needed for proxy
- Functions automatically route based on file structure

## Testing

### Development
1. Start backend server on port 3000
2. Start frontend with `npm run dev`
3. API requests will be automatically proxied

### Production
1. Deploy to Cloudflare Workers
2. Check browser network tab - all requests should go to `/api/*`
3. Backend URL should not be visible in the browser

## Security Benefits
- Backend URL is hidden from client-side code
- CORS issues are eliminated
- API endpoints can be changed without updating frontend code
- Additional security headers can be added at the proxy level

## Troubleshooting

### Common Issues
1. **404 errors**: Check if backend server is running
2. **CORS errors**: Verify proxy configuration is correct
3. **Connection refused**: Ensure backend URL is accessible

### Debug Logs
Development proxy includes debug logging. Check the console for:
- Proxy errors
- Request forwarding logs
- Response logs