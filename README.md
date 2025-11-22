# Blue Frame Digital Website

A professional website for Blue Frame Digital with Resend email integration.

## Features

- Modern, responsive design
- Contact form with email notifications
- Automatic email confirmations
- Node.js backend with Express
- Resend email service integration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Resend

1. Sign up for a Resend account at https://resend.com
2. Get your API key from the Resend dashboard
3. Add and verify your domain (blueframe.digital) in Resend
4. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

5. Edit `.env` and add your Resend API key and configuration:

```
RESEND_API_KEY=re_your_actual_api_key
RESEND_DOMAIN=blueframe.digital
CONTACT_EMAIL=isaac@blueframe.digital
PORT=3000
NODE_ENV=production
```

### 3. Domain Configuration in Resend

To send emails from `contact@blueframe.digital`, you need to:

1. Go to Resend Dashboard → Domains
2. Add your domain: `blueframe.digital`
3. Add the DNS records Resend provides to your domain's DNS settings
4. Wait for verification (usually takes a few minutes)

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on port 3000 (or the port specified in `.env`).

## Digital Ocean Deployment

### 1. Server Setup

SSH into your Digital Ocean droplet and install Node.js:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 3. Deploy Your Code

```bash
# Clone or upload your code to the server
cd /var/www
git clone <your-repo> blue-frame-digital
cd blue-frame-digital

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add your environment variables
```

### 4. Start with PM2

```bash
pm2 start server.js --name blue-frame-digital
pm2 save
pm2 startup
```

### 5. Setup Nginx Reverse Proxy

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/blueframe.digital
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name blueframe.digital www.blueframe.digital;

    location / {
        proxy_pass http://localhost:3000;
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

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/blueframe.digital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d blueframe.digital -d www.blueframe.digital
```

### 7. Monitor Your Application

```bash
# View logs
pm2 logs blue-frame-digital

# View status
pm2 status

# Restart application
pm2 restart blue-frame-digital
```

## API Endpoints

- `POST /api/contact` - Submit contact form
- `GET /api/health` - Health check endpoint

## Contact Form

The contact form sends:
1. An email to the configured contact email with the form submission
2. A confirmation email to the user who submitted the form

Both emails are sent using Resend with your verified domain.

