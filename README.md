# Racktastic Manager 

A comprehensive rack and storage management interface for data centers.

## Features
- Manage multiple data centers and racks
- Track devices and their network connections
- Monitor system status
- Manage network adapters

## Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

## Local Development Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd racktastic-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Production Deployment

### Option 1: Traditional Web Server (Apache/Nginx)

1. Build the project:
```bash
npm run build
# or
yarn build
```

2. Copy the contents of the `dist` folder to your web server's public directory.

3. Configure your web server:

For Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

For Apache (.htaccess):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Option 2: Docker Deployment

1. Create a Dockerfile:
```dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Build and run the Docker container:
```bash
docker build -t racktastic-manager .
docker run -p 80:80 racktastic-manager
```

### Option 3: Cloud Platform Deployment

The application can be deployed to various cloud platforms:

1. Vercel:
```bash
npm install -g vercel
vercel login
vercel
```

2. Netlify:
- Connect your repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`

## Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_url_here
```

## Security Considerations

1. Enable HTTPS in production
2. Set appropriate CORS headers
3. Implement authentication if needed
4. Regular security updates

## Maintenance

- Regular backups of configuration
- Monitor system logs
- Keep dependencies updated
- Regular security patches

## Support

For issues and feature requests, please create an issue in the repository.