#!/bin/bash
# CloudFlare Tunnel Setup - Works from ANY network (even public WiFi)
# Makes your Mac accessible worldwide without router configuration

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════╗
║           🌐 CLOUDFLARE TUNNEL SETUP 🌐                 ║
║      Works from ANY network (even public WiFi!)         ║
║                                                          ║
║  🚇 Creates secure tunnel to your Mac                   ║
║  🌍 No router configuration needed                      ║
║  💰 Completely FREE                                     ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}🎯 What this does:${NC}"
echo "   • Creates secure tunnel from CloudFlare to your Mac"
echo "   • Works on ANY network (public WiFi, corporate, etc.)"
echo "   • No router configuration needed"  
echo "   • Professional SSL certificates included"
echo "   • dafel.com.mx → CloudFlare → Your Mac"
echo ""

# Install cloudflared
echo -e "${BLUE}Step 1: Installing CloudFlare tunnel client...${NC}"
if ! command -v cloudflared &> /dev/null; then
    brew install cloudflared
else
    echo "✅ cloudflared already installed"
fi

echo ""
echo -e "${BLUE}Step 2: Authentication setup...${NC}"
echo ""
echo "🔐 You need to authenticate with CloudFlare:"
echo "1. This will open your browser"
echo "2. Login to CloudFlare (or create free account)"
echo "3. Authorize the tunnel connection"
echo ""
read -p "Press Enter to start authentication..."

# Authenticate with CloudFlare
cloudflared tunnel login

echo ""
echo -e "${BLUE}Step 3: Creating tunnel for Dafel Technologies...${NC}"

# Create tunnel
TUNNEL_NAME="dafel-tech-$(date +%s)"
echo "Creating tunnel: $TUNNEL_NAME"
cloudflared tunnel create "$TUNNEL_NAME"

# Get tunnel info
TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')
echo "✅ Tunnel created with ID: $TUNNEL_ID"

echo ""
echo -e "${BLUE}Step 4: Configuring tunnel...${NC}"

# Create tunnel configuration
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: /Users/$(whoami)/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: dafel.com.mx
    service: http://localhost:3000
  - hostname: www.dafel.com.mx  
    service: http://localhost:3000
  - service: http_status:404
EOF

echo "✅ Tunnel configuration created"

echo ""
echo -e "${BLUE}Step 5: DNS Configuration...${NC}"
echo ""
echo "Setting up DNS records to point to your tunnel..."

# Set up DNS records
cloudflared tunnel route dns "$TUNNEL_ID" dafel.com.mx
cloudflared tunnel route dns "$TUNNEL_ID" www.dafel.com.mx

echo "✅ DNS records configured"

echo ""
echo -e "${BLUE}Step 6: Starting tunnel...${NC}"

# Start tunnel in background
cloudflared tunnel run "$TUNNEL_ID" &
TUNNEL_PID=$!

echo "✅ Tunnel started (PID: $TUNNEL_PID)"

# Create service file for auto-start
echo ""
echo -e "${BLUE}Step 7: Setting up auto-start service...${NC}"

# Create LaunchAgent for tunnel
tee ~/Library/LaunchAgents/com.dafel.cloudflare-tunnel.plist > /dev/null << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.dafel.cloudflare-tunnel</string>
    <key>Program</key>
    <string>/opt/homebrew/bin/cloudflared</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/cloudflared</string>
        <string>tunnel</string>
        <string>run</string>
        <string>$TUNNEL_ID</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardErrorPath</key>
    <string>/tmp/cloudflared.error.log</string>
    <key>StandardOutPath</key>
    <string>/tmp/cloudflared.out.log</string>
</dict>
</plist>
EOF

# Load the service
launchctl load ~/Library/LaunchAgents/com.dafel.cloudflare-tunnel.plist

echo "✅ Auto-start service configured"

# Test the connection
echo ""
echo -e "${BLUE}Step 8: Testing connection...${NC}"

sleep 10
echo "Testing tunnel connection..."

if curl -s --connect-timeout 10 https://dafel.com.mx >/dev/null 2>&1; then
    echo "✅ Tunnel is working! dafel.com.mx is live!"
else
    echo "⏳ Tunnel is starting up... (may take 1-2 minutes)"
fi

# Create tunnel management script
cat > ~/manage-dafel-tunnel.sh << EOF
#!/bin/bash
# Dafel Technologies Tunnel Management

case "\$1" in
    start)
        echo "🚀 Starting Dafel tunnel..."
        launchctl load ~/Library/LaunchAgents/com.dafel.cloudflare-tunnel.plist
        ;;
    stop)
        echo "⏹️  Stopping Dafel tunnel..."
        launchctl unload ~/Library/LaunchAgents/com.dafel.cloudflare-tunnel.plist
        ;;
    status)
        echo "📊 Dafel Tunnel Status:"
        if pgrep -f "cloudflared tunnel run" >/dev/null; then
            echo "✅ Tunnel is running"
        else
            echo "❌ Tunnel is stopped"
        fi
        echo ""
        echo "🌐 Testing connectivity:"
        if curl -s --connect-timeout 5 https://dafel.com.mx >/dev/null; then
            echo "✅ dafel.com.mx is accessible"
        else
            echo "❌ dafel.com.mx is not accessible"
        fi
        ;;
    logs)
        echo "📋 Recent tunnel logs:"
        tail -20 /tmp/cloudflared.out.log
        ;;
    *)
        echo "Usage: \$0 {start|stop|status|logs}"
        ;;
esac
EOF

chmod +x ~/manage-dafel-tunnel.sh

echo ""
echo -e "${GREEN}"
cat << EOF
╔══════════════════════════════════════════════════════════╗
║            🎉 CLOUDFLARE TUNNEL ACTIVE! 🎉              ║
╚══════════════════════════════════════════════════════════╝

🌍 Your Mac is now accessible WORLDWIDE!

🌐 Live URLs:
   • https://dafel.com.mx
   • https://www.dafel.com.mx

✅ What's working:
   • Secure HTTPS tunnel (SSL included)
   • Works from ANY network (public WiFi, etc.)
   • Auto-restart on Mac reboot
   • Professional domain setup

🔧 Management commands:
   • Start tunnel:  ~/manage-dafel-tunnel.sh start
   • Stop tunnel:   ~/manage-dafel-tunnel.sh stop  
   • Check status:  ~/manage-dafel-tunnel.sh status
   • View logs:     ~/manage-dafel-tunnel.sh logs

🎯 Test your site:
   Open https://dafel.com.mx in any browser!

💡 Benefits over router setup:
   • Works on ANY network
   • No router configuration needed  
   • Professional SSL certificates
   • CloudFlare CDN included (faster loading)
   • DDoS protection included

EOF
echo -e "${NC}"

echo -e "${PURPLE}🚀 Dafel Technologies is now LIVE on the internet! 🌍${NC}"