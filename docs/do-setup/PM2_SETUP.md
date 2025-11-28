# PM2 Setup Guide

## 1. Install PM2 globally

```bash
npm install -g pm2
```

## 2. Create logs directory (if it doesn't exist)

```bash
mkdir -p logs
```

## 3. Start your app with PM2

Using the ecosystem config file:
```bash
pm2 start ecosystem.config.js
```

Or start directly:
```bash
pm2 start server.js --name blueframe-digital --env production -- --port 3050
```

## 4. Save PM2 process list (so it restarts on server reboot)

```bash
pm2 save
```

## 5. Setup PM2 to start on system boot

```bash
pm2 startup
```

This will output a command that you need to run with sudo. Copy and run that command.

## 6. Useful PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs blueframe-digital

# View real-time logs
pm2 logs blueframe-digital --lines 50

# Restart app
pm2 restart blueframe-digital

# Stop app
pm2 stop blueframe-digital

# Delete app from PM2
pm2 delete blueframe-digital

# Monitor (CPU, memory, etc.)
pm2 monit

# View detailed info
pm2 show blueframe-digital
```

## 7. Environment Variables

If you need to set environment variables, you can:

**Option A:** Create a `.env` file in the project root (make sure dotenv is installed - it already is)

**Option B:** Add them to the ecosystem.config.js file in the `env` section

**Option C:** Set them when starting:
```bash
pm2 start ecosystem.config.js --update-env
```

## 8. Verify it's running

```bash
pm2 status
curl http://localhost:3050/api/health
```

