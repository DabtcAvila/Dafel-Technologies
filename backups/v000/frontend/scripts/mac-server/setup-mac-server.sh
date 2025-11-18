#!/bin/bash
# Mac Server Setup for Dafel Technologies
# Converts your Mac into a professional 24/7 server

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════╗
║            🖥️  MAC SERVER SETUP 🖥️                      ║
║        Converting Mac to Professional Server            ║
║                                                          ║
║  🌐  dafel.com.mx → Your Mac                           ║
║  ⚡  24/7 Professional Hosting                          ║
║  💰  $0/month Cost                                      ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Get Mac info
MAC_MODEL=$(system_profiler SPHardwareDataType | grep "Model Name" | cut -d: -f2 | xargs)
MAC_MEMORY=$(system_profiler SPHardwareDataType | grep "Memory" | cut -d: -f2 | xargs)
MAC_PROCESSOR=$(system_profiler SPHardwareDataType | grep "Chip" | cut -d: -f2 | xargs)

echo -e "${BLUE}🖥️  Mac Specifications:${NC}"
echo "   Model: $MAC_MODEL"
echo "   Processor: $MAC_PROCESSOR" 
echo "   Memory: $MAC_MEMORY"
echo ""

# Step 1: System Optimization for 24/7 Operation
echo -e "${BLUE}Step 1: Optimizing Mac for 24/7 server operation...${NC}"

# Prevent sleep
sudo pmset -a displaysleep 0
sudo pmset -a sleep 0
sudo pmset -a disksleep 0
sudo pmset -a hibernatemode 0

# Disable automatic updates that could restart
sudo softwareupdate --schedule off

# Set energy saver preferences
sudo pmset -a womp 1  # Wake on magic packet
sudo pmset -a powernap 0  # Disable power nap
sudo pmset -a tcpkeepalive 1  # Keep network connections alive

echo -e "${GREEN}✅ Mac optimized for 24/7 operation${NC}"

# Step 2: Get network information
echo -e "${BLUE}Step 2: Getting network information...${NC}"

# Get local IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

# Get public IP
PUBLIC_IP=$(curl -s https://ipinfo.io/ip || curl -s https://api.ipify.org || curl -s https://checkip.amazonaws.com)

# Get network interface
INTERFACE=$(route get default | grep interface | awk '{print $2}')

echo -e "${GREEN}🌐 Network Information:${NC}"
echo "   Local IP: $LOCAL_IP"
echo "   Public IP: $PUBLIC_IP"
echo "   Interface: $INTERFACE"
echo ""

# Step 3: Configure firewall
echo -e "${BLUE}Step 3: Configuring macOS firewall...${NC}"

# Enable firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Allow specific ports
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /opt/homebrew/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /opt/homebrew/bin/node

echo -e "${GREEN}✅ Firewall configured${NC}"

# Step 4: Install required services
echo -e "${BLUE}Step 4: Installing required services...${NC}"

# Install nginx for reverse proxy
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    brew install nginx
fi

# Install certbot for SSL
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    brew install certbot
fi

# Install ddclient for dynamic DNS
if ! command -v ddclient &> /dev/null; then
    echo "Installing ddclient..."
    brew install ddclient
fi

echo -e "${GREEN}✅ Services installed${NC}"

# Step 5: Create nginx configuration
echo -e "${BLUE}Step 5: Configuring nginx reverse proxy...${NC}"

NGINX_CONFIG="/opt/homebrew/etc/nginx/nginx.conf"

# Backup original config
sudo cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup"

# Create new nginx config
sudo tee "$NGINX_CONFIG" > /dev/null << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name dafel.com.mx www.dafel.com.mx;
        return 301 https://$server_name$request_uri;
    }
    
    # HTTPS server
    server {
        listen 443 ssl;
        server_name dafel.com.mx www.dafel.com.mx;
        
        # SSL configuration (will be updated after getting certificates)
        ssl_certificate /opt/homebrew/etc/nginx/ssl/dafel.com.mx.crt;
        ssl_certificate_key /opt/homebrew/etc/nginx/ssl/dafel.com.mx.key;
        
        # Security headers
        add_header Strict-Transport-Security "max-age=31536000" always;
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # Proxy to Next.js application
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
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }
        
        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Login rate limiting
        location /api/auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# Create SSL directory
sudo mkdir -p /opt/homebrew/etc/nginx/ssl

echo -e "${GREEN}✅ Nginx configured${NC}"

# Step 6: Create startup services
echo -e "${BLUE}Step 6: Creating startup services...${NC}"

# Create LaunchDaemon for nginx
sudo tee /Library/LaunchDaemons/com.dafel.nginx.plist > /dev/null << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.dafel.nginx</string>
    <key>Program</key>
    <string>/opt/homebrew/bin/nginx</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/nginx</string>
        <string>-g</string>
        <string>daemon off;</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardErrorPath</key>
    <string>/tmp/nginx.error.log</string>
    <key>StandardOutPath</key>
    <string>/tmp/nginx.out.log</string>
</dict>
</plist>
EOF

# Create LaunchAgent for Dafel app
tee ~/Library/LaunchAgents/com.dafel.app.plist > /dev/null << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.dafel.app</string>
    <key>WorkingDirectory</key>
    <string>$(pwd)</string>
    <key>Program</key>
    <string>/opt/homebrew/bin/npm</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/npm</string>
        <string>run</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardErrorPath</key>
    <string>/tmp/dafel.error.log</string>
    <key>StandardOutPath</key>
    <string>/tmp/dafel.out.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>NODE_ENV</key>
        <string>production</string>
        <key>PORT</key>
        <string>3000</string>
    </dict>
</dict>
</plist>
EOF

echo -e "${GREEN}✅ Startup services created${NC}"

# Step 7: Create monitoring script
echo -e "${BLUE}Step 7: Setting up monitoring...${NC}"

tee ~/dafel-monitor.sh > /dev/null << 'EOF'
#!/bin/bash
# Dafel Technologies Server Monitor

check_service() {
    local service=$1
    local port=$2
    
    if lsof -i:$port >/dev/null 2>&1; then
        echo "✅ $service is running on port $port"
        return 0
    else
        echo "❌ $service is DOWN on port $port"
        return 1
    fi
}

echo "🖥️  Dafel Technologies Server Status - $(date)"
echo "================================================"

# Check system
echo "💻 System Info:"
echo "   Uptime: $(uptime | awk '{print $3,$4}' | sed 's/,//')"
echo "   Load: $(uptime | awk -F'load average:' '{print $2}')"
echo "   Memory: $(memory_pressure | grep "System-wide memory" | awk '{print $4}')"

# Check services
echo ""
echo "🚀 Services Status:"
check_service "Dafel App" 3000
check_service "Nginx" 80
check_service "PostgreSQL" 5432

# Check internet
echo ""
echo "🌐 Network Status:"
if ping -c 1 google.com >/dev/null 2>&1; then
    echo "✅ Internet connection OK"
else
    echo "❌ Internet connection FAILED"
fi

# Check public IP
CURRENT_IP=$(curl -s https://ipinfo.io/ip)
echo "   Public IP: $CURRENT_IP"

# Check disk space
echo ""
echo "💿 Disk Space:"
df -h / | grep -v Filesystem

echo ""
echo "📊 Recent logs:"
tail -5 /tmp/dafel.error.log 2>/dev/null || echo "No error logs"
EOF

chmod +x ~/dafel-monitor.sh

echo -e "${GREEN}✅ Monitoring setup complete${NC}"

# Step 8: Build production version
echo -e "${BLUE}Step 8: Building production version...${NC}"

# Build the app
npm run build

echo -e "${GREEN}✅ Production build complete${NC}"

# Step 9: Information summary
echo -e "${BLUE}Step 9: Setup summary...${NC}"

echo ""
echo -e "${GREEN}"
cat << EOF
╔══════════════════════════════════════════════════════════╗
║              🎉 MAC SERVER SETUP COMPLETE! 🎉           ║
╚══════════════════════════════════════════════════════════╝

🖥️  Your Mac is now a professional server!

📋 What's configured:
   ✅ 24/7 operation (no sleep)
   ✅ Nginx reverse proxy
   ✅ Firewall configured
   ✅ Auto-startup services
   ✅ Production build
   ✅ Monitoring script

🌐 Network Information:
   • Local IP: $LOCAL_IP
   • Public IP: $PUBLIC_IP
   • Domain: dafel.com.mx (pending DNS)

📋 Next Steps:
   1. Configure router port forwarding
   2. Setup dynamic DNS
   3. Get SSL certificates
   4. Configure domain DNS

🔧 Useful Commands:
   • Monitor: ~/dafel-monitor.sh
   • Start services: sudo launchctl load /Library/LaunchDaemons/com.dafel.nginx.plist
   • View logs: tail -f /tmp/dafel.error.log

🎯 Once DNS is configured, your site will be live at:
   https://dafel.com.mx

EOF
echo -e "${NC}"

echo -e "${PURPLE}🚀 Ready for the next step: Router configuration! 🚀${NC}"