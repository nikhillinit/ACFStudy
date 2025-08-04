# Deployment Guide

This guide covers deploying the ACF Mastery Platform to various environments.

## Replit Deployment (Recommended)

### Prerequisites
- Replit account
- Access to environment secrets
- Database access (Replit Database or external PostgreSQL)

### Steps

1. **Import to Replit**
   - Upload project files or import from GitHub
   - Ensure all files except `.git` and `attached_assets/` are included

2. **Configure Environment Variables**
   Add these to Replit Secrets:
   ```
   DATABASE_URL=your-database-url
   SESSION_SECRET=your-session-secret
   OPENAI_API_KEY=your-openai-key
   CLAUDE_API_KEY=your-claude-key
   PERPLEXITY_API_KEY=your-perplexity-key
   NODE_ENV=production
   ```

3. **Set up Database**
   ```bash
   npm run db:push
   ```

4. **Deploy**
   - Use Replit Deployments
   - Configure custom domain if needed
   - Monitor deployment logs

### Replit-Specific Considerations

- Uses Replit Database by default
- Authentication integrates with Replit Auth
- Automatic HTTPS and domain management
- Built-in monitoring and logging

## Manual Server Deployment

### Prerequisites
- Node.js 18+
- PostgreSQL database
- SSL certificates (for HTTPS)
- Process manager (PM2 recommended)

### Environment Setup

1. **Install Dependencies**
   ```bash
   npm ci --only=production
   ```

2. **Environment Variables**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=postgresql://user:pass@host:port/db
   export SESSION_SECRET=your-session-secret
   export PORT=5000
   # Add other required variables
   ```

3. **Build Application**
   ```bash
   npm run build
   ```

4. **Database Setup**
   ```bash
   npm run db:migrate
   ```

5. **Start Application**
   ```bash
   npm start
   ```

### Production Considerations

#### Security
- Use HTTPS only (configure SSL certificates)
- Set secure session cookies
- Configure CORS properly
- Use strong secrets (32+ characters)
- Enable security headers

#### Performance
- Use a reverse proxy (nginx recommended)
- Enable compression
- Configure caching headers
- Monitor memory usage

#### Monitoring
- Set up application monitoring
- Configure log aggregation
- Monitor database performance
- Set up alerts for errors

### Sample nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "acf-platform" -- start

# Save PM2 configuration
pm2 save

# Setup auto-restart on boot
pm2 startup
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/acf
      - SESSION_SECRET=your-session-secret
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=acf
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

## Cloud Platform Deployment

### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set SESSION_SECRET=your-secret
heroku config:set OPENAI_API_KEY=your-key

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:migrate
```

### Vercel
```bash
# Install Vercel CLI
vercel

# Configure environment variables in Vercel dashboard
# Deploy
vercel --prod
```

### Railway
```bash
# Install Railway CLI
railway login
railway init

# Set environment variables
railway variables:set DATABASE_URL=your-url

# Deploy
railway up
```

## Database Migration

### Development to Production

1. **Generate Migration**
   ```bash
   npm run db:generate
   ```

2. **Review Migration Files**
   - Check generated SQL
   - Ensure no data loss
   - Test on staging first

3. **Apply to Production**
   ```bash
   npm run db:migrate
   ```

### Backup Strategy

```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

## Monitoring and Maintenance

### Health Checks
The application includes a health endpoint at `/api/health`

### Log Management
- Configure log level with `LOG_LEVEL` environment variable
- Use structured logging for production
- Set up log rotation

### Performance Monitoring
- Monitor response times
- Track error rates
- Monitor database performance
- Set up alerts

### Updates
1. Test updates in staging environment
2. Create database backup
3. Deploy during low-traffic periods
4. Monitor for issues post-deployment

## Troubleshooting

### Common Issues

**Database Connection**
- Verify DATABASE_URL format
- Check database accessibility
- Ensure migrations are applied

**Authentication**
- Verify all auth environment variables
- Check ISSUER_URL configuration
- Test auth flow thoroughly

**Performance**
- Monitor memory usage
- Check database query performance
- Verify caching is working

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=debug
npm start
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Strong session secrets (32+ characters)
- [ ] Database credentials secured
- [ ] API keys in environment variables only
- [ ] CORS configured properly
- [ ] Security headers enabled
- [ ] Input validation in place
- [ ] Error messages don't leak sensitive info

## Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Verify environment configuration
4. Contact the development team