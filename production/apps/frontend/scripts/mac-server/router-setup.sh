#!/bin/bash
# Router Configuration Guide for Dafel Technologies Mac Server
# Port forwarding setup for professional hosting

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
║            🌐 ROUTER CONFIGURATION GUIDE 🌐             ║
║          Port Forwarding for Mac Server                 ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Get network information
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
PUBLIC_IP=$(curl -s https://ipinfo.io/ip)
ROUTER_IP=$(route -n get default | grep gateway | awk '{print $2}')

echo -e "${BLUE}🌐 Network Information:${NC}"
echo "   Your Mac IP: $LOCAL_IP"
echo "   Public IP: $PUBLIC_IP"  
echo "   Router IP: $ROUTER_IP"
echo ""

# Try to detect router brand
echo -e "${BLUE}Detecting router information...${NC}"
ROUTER_INFO=$(curl -s --connect-timeout 3 http://$ROUTER_IP | head -10 | grep -i "title" | sed 's/<[^>]*>//g' | xargs 2>/dev/null || echo "Unknown")

echo "   Router: $ROUTER_INFO"
echo ""

echo -e "${BLUE}📋 Port Forwarding Configuration Needed:${NC}"
echo ""
echo "You need to forward these ports from your router to your Mac:"
echo ""
echo "   PORT    SERVICE        MAC IP"
echo "   ────    ───────        ──────"
echo "   80   →  HTTP          $LOCAL_IP"
echo "   443  →  HTTPS         $LOCAL_IP"
echo "   22   →  SSH           $LOCAL_IP (optional)"
echo ""

echo -e "${YELLOW}🔧 Router Access Methods:${NC}"
echo ""
echo "Method 1 - Web Interface:"
echo "   1. Open browser and go to: http://$ROUTER_IP"
echo "   2. Login with admin credentials"
echo "   3. Look for 'Port Forwarding' or 'Virtual Servers'"
echo ""
echo "Method 2 - UPnP (Automatic):"
echo "   We'll try to configure automatically..."
echo ""

# Try UPnP configuration
if command -v upnpc &> /dev/null; then
    echo -e "${BLUE}Attempting UPnP configuration...${NC}"
    
    # Try to add port mappings
    upnpc -a $LOCAL_IP 80 80 TCP "Dafel HTTP" 2>/dev/null && echo "✅ HTTP port 80 configured via UPnP" || echo "❌ Failed to configure port 80"
    upnpc -a $LOCAL_IP 443 443 TCP "Dafel HTTPS" 2>/dev/null && echo "✅ HTTPS port 443 configured via UPnP" || echo "❌ Failed to configure port 443"
    
    echo ""
    echo "Current UPnP mappings:"
    upnpc -l 2>/dev/null || echo "No UPnP mappings found"
else
    echo -e "${YELLOW}UPnP client not found. Installing miniupnpc...${NC}"
    brew install miniupnpc
    
    echo "Attempting UPnP configuration..."
    upnpc -a $LOCAL_IP 80 80 TCP "Dafel HTTP" 2>/dev/null && echo "✅ HTTP port 80 configured" || echo "❌ Failed"
    upnpc -a $LOCAL_IP 443 443 TCP "Dafel HTTPS" 2>/dev/null && echo "✅ HTTPS port 443 configured" || echo "❌ Failed"
fi

echo ""
echo -e "${BLUE}🔧 Manual Router Configuration Steps:${NC}"
echo ""
echo "If UPnP didn't work, configure manually:"
echo ""
echo "1. Open browser → http://$ROUTER_IP"
echo "2. Login (common defaults: admin/admin, admin/password)"
echo "3. Find 'Port Forwarding' / 'Virtual Servers' / 'NAT'"
echo "4. Add these rules:"
echo ""
echo "   Rule 1: HTTP"
echo "   ─────────────"
echo "   Service Name: Dafel-HTTP"
echo "   Protocol: TCP"
echo "   External Port: 80"
echo "   Internal IP: $LOCAL_IP"  
echo "   Internal Port: 80"
echo "   Enable: Yes"
echo ""
echo "   Rule 2: HTTPS"
echo "   ──────────────"
echo "   Service Name: Dafel-HTTPS"
echo "   Protocol: TCP"
echo "   External Port: 443"
echo "   Internal IP: $LOCAL_IP"
echo "   Internal Port: 443"  
echo "   Enable: Yes"
echo ""

echo -e "${BLUE}🌐 Router Brand Specific Guides:${NC}"
echo ""

# Common router configuration guides
cat << 'EOF'
📱 Netgear:
   Advanced → Dynamic DNS/Port Forwarding → Port Forwarding

🔵 Linksys:
   Smart Wi-Fi → Security → Apps and Gaming → Single Port Forwarding

⚫ ASUS:
   Adaptive QoS → Traditional QoS → Port Forwarding

🟠 D-Link:  
   Advanced → Port Forwarding

🔴 TP-Link:
   Advanced → NAT Forwarding → Port Forwarding

📡 Ubiquiti:
   Settings → Routing & Firewall → Port Forwarding
EOF

echo ""
echo -e "${BLUE}✅ Testing Port Forwarding:${NC}"
echo ""
echo "After configuration, test with these commands:"
echo ""
echo "External test (from another network):"
echo "   telnet $PUBLIC_IP 80"
echo "   telnet $PUBLIC_IP 443"
echo ""
echo "Or use online tools:"
echo "   https://www.yougetsignal.com/tools/open-ports/"
echo "   Enter IP: $PUBLIC_IP"
echo "   Test ports: 80, 443"
echo ""

# Create a test script
cat > ~/test-port-forwarding.sh << EOF
#!/bin/bash
echo "🧪 Testing Port Forwarding for Dafel Technologies"
echo "================================================"
echo ""

echo "Testing HTTP port 80..."
if timeout 5 telnet $PUBLIC_IP 80 2>/dev/null | grep -q Connected; then
    echo "✅ Port 80 is accessible externally"
else
    echo "❌ Port 80 is NOT accessible externally"
fi

echo ""
echo "Testing HTTPS port 443..."
if timeout 5 telnet $PUBLIC_IP 443 2>/dev/null | grep -q Connected; then
    echo "✅ Port 443 is accessible externally"  
else
    echo "❌ Port 443 is NOT accessible externally"
fi

echo ""
echo "🌐 Your public IP: $PUBLIC_IP"
echo "💻 Your Mac IP: $LOCAL_IP"
echo ""
echo "📝 Manual test URLs:"
echo "   http://$PUBLIC_IP (should redirect to your app)"
echo "   https://$PUBLIC_IP (after SSL setup)"
EOF

chmod +x ~/test-port-forwarding.sh

echo ""
echo -e "${GREEN}"
cat << EOF
╔══════════════════════════════════════════════════════════╗
║           🌐 ROUTER CONFIGURATION GUIDE READY! 🌐       ║
╚══════════════════════════════════════════════════════════╝

📋 Summary:
   • Router IP: $ROUTER_IP  
   • Your Mac IP: $LOCAL_IP
   • Public IP: $PUBLIC_IP
   • Ports needed: 80, 443

🔧 Next Steps:
   1. Configure port forwarding (manual or UPnP)
   2. Test with: ~/test-port-forwarding.sh
   3. Configure DNS to point dafel.com.mx → $PUBLIC_IP

⚡ Quick Test:
   Once configured, test: curl http://$PUBLIC_IP

🎯 Goal: 
   dafel.com.mx → $PUBLIC_IP → Your Mac → Dafel App

EOF
echo -e "${NC}"

echo -e "${PURPLE}🚀 Ready to make your Mac accessible worldwide! 🌍${NC}"