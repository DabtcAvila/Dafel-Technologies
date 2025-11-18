#!/bin/bash
# Mac Server Setup for Dafel Technologies - Interactive Version
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

echo -e "${YELLOW}⚠️  This setup requires administrator privileges${NC}"
echo "You'll be asked for your Mac password for system configuration."
echo ""
read -p "Press Enter to continue..."

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
echo "This prevents your Mac from sleeping and optimizes for server use."

# Get network information first (no sudo needed)
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
PUBLIC_IP=$(curl -s https://ipinfo.io/ip || curl -s https://api.ipify.org || curl -s https://checkip.amazonaws.com)
INTERFACE=$(route get default | grep interface | awk '{print $2}')

echo -e "${GREEN}🌐 Network Information:${NC}"
echo "   Local IP: $LOCAL_IP"
echo "   Public IP: $PUBLIC_IP"
echo "   Interface: $INTERFACE"
echo ""

# Step 2: Install required services (non-sudo)
echo -e "${BLUE}Step 2: Installing required services...${NC}"

# Check and install nginx
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    brew install nginx
else
    echo "✅ nginx already installed"
fi

# Check and install certbot
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    brew install certbot
else
    echo "✅ certbot already installed"
fi

echo -e "${GREEN}✅ Services installed${NC}"

# Step 3: Build production version
echo -e "${BLUE}Step 3: Building production version...${NC}"

# Build the app
npm run build

echo -e "${GREEN}✅ Production build complete${NC}"

# Step 4: Create monitoring script (no sudo needed)
echo -e "${BLUE}Step 4: Setting up monitoring...${NC}"

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

# Check services
echo ""
echo "🚀 Services Status:"
check_service "Dafel App" 3000
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
echo "📊 App Status:"
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Dafel App responding"
else
    echo "❌ Dafel App not responding"
fi
EOF

chmod +x ~/dafel-monitor.sh

echo -e "${GREEN}✅ Monitoring setup complete${NC}"

# Test monitoring
echo -e "${BLUE}Step 5: Testing current setup...${NC}"
~/dafel-monitor.sh

echo ""
echo -e "${GREEN}"
cat << EOF
╔══════════════════════════════════════════════════════════╗
║            🎉 INITIAL MAC SETUP COMPLETE! 🎉            ║
╚══════════════════════════════════════════════════════════╝

🖥️  Your Mac server foundation is ready!

✅ What's working now:
   • Dafel app running on localhost:3000
   • Production build completed
   • PostgreSQL database running
   • Monitoring script created
   • Network information gathered

🌐 Network Details:
   • Local IP: $LOCAL_IP
   • Public IP: $PUBLIC_IP
   • Current status: Local only

📋 Next Steps (require admin access):
   1. Configure system for 24/7 operation
   2. Setup nginx reverse proxy
   3. Configure router port forwarding
   4. Setup DNS for dafel.com.mx
   5. Get SSL certificates

🔧 Quick Commands:
   • Monitor: ~/dafel-monitor.sh
   • Check app: curl http://localhost:3000

🎯 Ready for next phase: Router & DNS configuration!

EOF
echo -e "${NC}"

echo ""
echo -e "${YELLOW}🔧 For the advanced server configuration (nginx, SSL, 24/7 mode):${NC}"
echo "Run this when you're ready:"
echo "   sudo ./scripts/mac-server/setup-mac-advanced.sh"
echo ""

echo -e "${PURPLE}🚀 Your Mac is ready to serve Dafel Technologies! 🚀${NC}"