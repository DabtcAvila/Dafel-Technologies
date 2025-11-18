#!/bin/bash
# CloudFlare Setup for Dafel Technologies (dafel.com.mx)
# Automatic DNS configuration and performance optimization

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
║                 ☁️  CLOUDFLARE SETUP ☁️                  ║
║               dafel.com.mx DNS & Security               ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check if server IP is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./cloudflare-setup.sh <server-ip>${NC}"
    echo "Example: ./cloudflare-setup.sh 129.153.45.123"
    exit 1
fi

SERVER_IP=$1

echo -e "${BLUE}Server IP: ${SERVER_IP}${NC}"
echo ""

# Step 1: CloudFlare Account Setup
echo -e "${BLUE}Step 1: CloudFlare Configuration${NC}"
echo ""
echo "🌐 Manual steps (CloudFlare doesn't allow full API automation for new domains):"
echo ""
echo "1. Go to https://dash.cloudflare.com/"
echo "2. Click 'Add Site' and enter: dafel.com.mx"
echo "3. Choose FREE plan"
echo "4. Configure these DNS records:"
echo ""
echo "   TYPE    NAME               CONTENT          PROXY"
echo "   ────    ────               ───────          ─────"
echo -e "   ${GREEN}A       dafel.com.mx       $SERVER_IP       ☁️ Proxied${NC}"
echo -e "   ${GREEN}A       www                $SERVER_IP       ☁️ Proxied${NC}" 
echo -e "   ${GREEN}A       api                $SERVER_IP       ☁️ Proxied${NC}"
echo -e "   ${GREEN}CNAME   *                  dafel.com.mx     ☁️ Proxied${NC}"
echo ""
echo "5. Update nameservers at your domain registrar:"
echo "   - Remove old nameservers"
echo "   - Add CloudFlare nameservers (provided by CloudFlare)"
echo ""
echo -e "${YELLOW}⚠️  Nameserver propagation takes 2-48 hours${NC}"

# Step 2: CloudFlare Configuration Recommendations
echo ""
echo -e "${BLUE}Step 2: Recommended CloudFlare Settings${NC}"
echo ""
echo "🔒 Security:"
echo "   • SSL/TLS: Full (strict)"
echo "   • Always Use HTTPS: ON"
echo "   • HTTP Strict Transport Security (HSTS): ON"
echo "   • Security Level: Medium"
echo "   • Bot Fight Mode: ON"
echo ""
echo "⚡ Performance:"
echo "   • Caching Level: Standard"
echo "   • Browser Cache TTL: 4 hours"
echo "   • Always Online: ON"
echo "   • Brotli: ON"
echo "   • HTTP/2: ON"
echo "   • HTTP/3 (with QUIC): ON"
echo "   • 0-RTT Connection Resumption: ON"
echo ""
echo "🚀 Speed:"
echo "   • Auto Minify: HTML, CSS, JS"
echo "   • Rocket Loader: ON"
echo "   • Mirage: ON (if available)"
echo "   • Polish: Lossy"
echo ""

# Step 3: Page Rules for optimization
echo -e "${BLUE}Step 3: Page Rules (FREE plan allows 3 rules)${NC}"
echo ""
echo "Rule 1: Cache Everything"
echo "   URL: dafel.com.mx/static/*"
echo "   Settings: Cache Level = Cache Everything, Edge Cache TTL = 1 month"
echo ""
echo "Rule 2: Security for Admin"
echo "   URL: dafel.com.mx/studio/admin*"
echo "   Settings: Security Level = High, Challenge Passage = 30 minutes"
echo ""
echo "Rule 3: API Rate Limiting"
echo "   URL: dafel.com.mx/api/*"
echo "   Settings: Security Level = Medium"

# Step 4: Firewall Rules (if Pro plan)
echo ""
echo -e "${BLUE}Step 4: Firewall Rules (Pro Plan - Optional)${NC}"
echo ""
echo "🛡️  Block malicious countries (if needed)"
echo "🛡️  Rate limit login attempts"
echo "🛡️  Block known bad bots"
echo "🛡️  Challenge suspicious traffic"

# Step 5: Analytics Setup
echo ""
echo -e "${BLUE}Step 5: Analytics & Monitoring${NC}"
echo ""
echo "📊 Enable CloudFlare Web Analytics:"
echo "   • Go to Analytics & Logs"
echo "   • Enable Web Analytics"
echo "   • Add JavaScript snippet to your site"

# Step 6: SSL Configuration  
echo ""
echo -e "${BLUE}Step 6: SSL/TLS Configuration${NC}"
echo ""
echo "🔒 CloudFlare provides free SSL certificates automatically!"
echo "   • Universal SSL: Enabled by default"
echo "   • Edge certificates: Automatic"
echo "   • Origin certificates: Available for server"

# Step 7: Testing
echo ""
echo -e "${BLUE}Step 7: Testing After Setup${NC}"
echo ""
echo "Once nameservers are updated and propagated:"
echo ""
echo "🧪 Test commands:"
echo "   dig dafel.com.mx"
echo "   curl -I https://dafel.com.mx"
echo "   curl -I https://www.dafel.com.mx"
echo "   curl -I https://api.dafel.com.mx"
echo ""
echo "🌐 Browser tests:"
echo "   • https://dafel.com.mx (should load your app)"
echo "   • https://www.dafel.com.mx (should redirect)"
echo "   • SSL Labs Test: https://www.ssllabs.com/ssltest/"

# Step 8: Integration with application
echo ""
echo -e "${BLUE}Step 8: Application Integration${NC}"
echo ""
echo "Update your application's CORS settings to allow CloudFlare:"
echo ""
cat << 'EOF'
// In your Next.js application
const allowedOrigins = [
  'https://dafel.com.mx',
  'https://www.dafel.com.mx',
  'https://api.dafel.com.mx'
];

// CloudFlare IPs should be trusted
const trustedProxies = [
  '103.21.244.0/22',
  '103.22.200.0/22', 
  '103.31.4.0/22',
  '104.16.0.0/13',
  '108.162.192.0/18',
  '131.0.72.0/22'
];
EOF

# Step 9: Monitoring & Maintenance
echo ""
echo -e "${BLUE}Step 9: Monitoring & Maintenance${NC}"
echo ""
echo "📈 Regular monitoring:"
echo "   • Check CloudFlare Analytics weekly"
echo "   • Monitor cache hit ratio (aim for >80%)"
echo "   • Review security events"
echo "   • Update firewall rules as needed"

# Final summary
echo ""
echo -e "${GREEN}"
cat << EOF
╔══════════════════════════════════════════════════════════╗
║                 ✅ CLOUDFLARE READY! ✅                  ║
╚══════════════════════════════════════════════════════════╝

🚀 Your CloudFlare setup for dafel.com.mx:

📋 Checklist:
   ☐ Add site to CloudFlare
   ☐ Configure DNS records (A, CNAME)
   ☐ Update nameservers at registrar
   ☐ Wait for propagation (2-48h)
   ☐ Configure security settings
   ☐ Set up page rules
   ☐ Test all domains

🌟 Benefits you'll get:
   • FREE SSL certificates
   • Global CDN (200+ locations)
   • DDoS protection
   • Bot management
   • Performance optimization
   • 99.99% uptime

🔗 After setup, your site will be:
   • Faster (Global CDN)
   • Safer (DDoS + Bot protection)
   • More reliable (Always Online)
   • Better SEO (Performance boost)

💰 All this for FREE! (with option to upgrade)

EOF
echo -e "${NC}"

echo -e "${PURPLE}🎉 CloudFlare + Oracle Cloud = Unbeatable combo! 🚀${NC}"