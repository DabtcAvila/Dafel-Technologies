#!/bin/bash
# DNS Configuration for dafel.com.mx → Mac Server
# Points domain to your Mac's public IP

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
║              🌐 DNS CONFIGURATION GUIDE 🌐              ║
║        dafel.com.mx → Your Mac Server                   ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Get current public IP
PUBLIC_IP=$(curl -s https://ipinfo.io/ip)

echo -e "${BLUE}📍 Current Network Status:${NC}"
echo "   Public IP: $PUBLIC_IP"
echo "   Domain: dafel.com.mx"
echo "   Target: Point domain → Your Mac"
echo ""

echo -e "${BLUE}🏆 DNS Configuration Options:${NC}"
echo ""
echo "Option 1: CloudFlare (RECOMMENDED - Free + CDN)"
echo "Option 2: Your domain registrar's DNS"
echo "Option 3: Dynamic DNS (for changing IPs)"
echo ""

read -p "Which option would you prefer? (1/2/3): " DNS_OPTION

case $DNS_OPTION in
    1)
        echo ""
        echo -e "${BLUE}🟠 CloudFlare DNS Setup (RECOMMENDED):${NC}"
        echo ""
        echo "Benefits:"
        echo "  ✅ FREE CDN (faster loading worldwide)"
        echo "  ✅ DDoS protection"
        echo "  ✅ SSL certificates (automatic)"
        echo "  ✅ Analytics and monitoring"
        echo "  ✅ Professional DNS management"
        echo ""
        echo "Steps:"
        echo "1. Go to https://cloudflare.com"
        echo "2. Create free account"
        echo "3. Add site: dafel.com.mx"
        echo "4. CloudFlare will scan existing DNS records"
        echo "5. Add/modify these DNS records:"
        echo ""
        echo "   TYPE    NAME               CONTENT          PROXY"
        echo "   ────    ────               ───────          ─────"  
        echo "   A       dafel.com.mx       $PUBLIC_IP       🟠 Proxied"
        echo "   A       www                $PUBLIC_IP       🟠 Proxied"
        echo "   CNAME   *                  dafel.com.mx     🟠 Proxied"
        echo ""
        echo "6. Update nameservers at your registrar to CloudFlare's"
        echo "7. Wait 2-24 hours for propagation"
        echo ""
        echo "💰 Cost: FREE"
        echo "⚡ Speed: Fast (global CDN)"
        echo "🔒 Security: High (DDoS protection)"
        ;;
    2)
        echo ""
        echo -e "${BLUE}🏢 Registrar DNS Setup:${NC}"
        echo ""
        echo "Go to your domain registrar's control panel and add:"
        echo ""
        echo "   TYPE    NAME               CONTENT"
        echo "   ────    ────               ───────"
        echo "   A       @                  $PUBLIC_IP"
        echo "   A       www                $PUBLIC_IP"
        echo "   CNAME   *                  dafel.com.mx"
        echo ""
        echo "💰 Cost: Usually free with domain"
        echo "⚡ Speed: Basic (no CDN)"
        echo "🔒 Security: Basic"
        ;;
    3)
        echo ""
        echo -e "${BLUE}⚡ Dynamic DNS Setup:${NC}"
        echo ""
        echo "For changing IPs (if your ISP changes your IP frequently)"
        echo ""
        echo "Recommended services:"
        echo "  • No-IP.com (free subdomains)"
        echo "  • Duck DNS (free)"  
        echo "  • DynDNS (paid)"
        echo ""
        echo "We'll setup automatic IP updates..."
        
        # Install ddclient if not present
        if ! command -v ddclient &> /dev/null; then
            echo "Installing ddclient..."
            brew install ddclient
        fi
        
        echo "Dynamic DNS client installed!"
        ;;
esac

echo ""
echo -e "${BLUE}🧪 DNS Testing Commands:${NC}"
echo ""
echo "After DNS configuration, test with:"
echo ""
echo "1. Check DNS propagation:"
echo "   dig dafel.com.mx"
echo "   nslookup dafel.com.mx"
echo ""
echo "2. Test from different locations:"
echo "   https://www.whatsmydns.net/#A/dafel.com.mx"
echo ""
echo "3. Test HTTP access (after port forwarding):"
echo "   curl -I http://dafel.com.mx"
echo "   curl -I http://www.dafel.com.mx"
echo ""

# Create DNS test script
cat > ~/test-dns.sh << EOF
#!/bin/bash
echo "🧪 DNS Testing for dafel.com.mx"
echo "==============================="
echo ""

echo "1. DNS Resolution Test:"
if dig +short dafel.com.mx | grep -q "$PUBLIC_IP"; then
    echo "✅ dafel.com.mx resolves to $PUBLIC_IP"
else
    echo "❌ dafel.com.mx does NOT resolve to $PUBLIC_IP"
    echo "   Current resolution: \$(dig +short dafel.com.mx)"
fi

echo ""
echo "2. WWW Subdomain Test:"
if dig +short www.dafel.com.mx >/dev/null 2>&1; then
    echo "✅ www.dafel.com.mx is configured"
else
    echo "❌ www.dafel.com.mx is NOT configured"
fi

echo ""
echo "3. HTTP Connectivity Test:"
if curl -s --connect-timeout 5 http://dafel.com.mx >/dev/null 2>&1; then
    echo "✅ HTTP connection successful"
else
    echo "❌ HTTP connection failed (check port forwarding)"
fi

echo ""
echo "📊 Current Status:"
echo "   Your IP: $PUBLIC_IP"
echo "   Domain IP: \$(dig +short dafel.com.mx || echo 'Not resolved')"
echo "   Time: \$(date)"
EOF

chmod +x ~/test-dns.sh

echo ""
echo -e "${GREEN}"
cat << EOF
╔══════════════════════════════════════════════════════════╗
║              🌐 DNS CONFIGURATION READY! 🌐             ║
╚══════════════════════════════════════════════════════════╝

🎯 Goal: dafel.com.mx → $PUBLIC_IP → Your Mac

📋 Next Steps:
   1. Configure DNS (CloudFlare recommended)
   2. Wait for DNS propagation (2-24 hours)
   3. Test with: ~/test-dns.sh
   4. Configure SSL certificates

⚡ Quick Commands:
   • Test DNS: ~/test-dns.sh
   • Check IP: curl https://ipinfo.io/ip
   • Test site: curl -I http://dafel.com.mx

🚀 Once DNS + Port Forwarding are done:
   dafel.com.mx will load your Mac's Dafel app!

EOF
echo -e "${NC}"

echo -e "${PURPLE}🌍 Your Mac is about to serve the world! 🌍${NC}"