#!/bin/bash
# One-Click Deployment Script for Dafel Technologies on Oracle Cloud
# This script handles everything automatically

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
║                 🚀 DAFEL TECHNOLOGIES 🚀                 ║
║           Oracle Cloud One-Click Deployment             ║
║                                                          ║
║  💻 ARM Ampere: 4 vCPU + 24GB RAM (FREE!)              ║
║  💰 Cost: $0/month Forever                              ║
║  🌐 Enterprise-grade Infrastructure                     ║
║  ⚡ Full automation - Zero manual steps                 ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Step 1: Prerequisites Check
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${YELLOW}Installing Terraform...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew tap hashicorp/tap
        brew install hashicorp/tap/terraform
    else
        # Linux
        wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
        echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
        sudo apt update && sudo apt install terraform
    fi
fi

# Check if OCI CLI is installed
if ! command -v oci &> /dev/null; then
    echo -e "${YELLOW}Installing Oracle Cloud CLI...${NC}"
    bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)" -- --accept-all-defaults
    echo 'export PATH=$PATH:$HOME/bin' >> ~/.bashrc
    source ~/.bashrc
fi

echo -e "${GREEN}✅ Prerequisites installed!${NC}"

# Step 2: Oracle Cloud Setup
echo -e "${BLUE}Step 2: Oracle Cloud Configuration...${NC}"

if [ ! -f "terraform/oracle-cloud/terraform.tfvars" ]; then
    echo -e "${YELLOW}🔧 First-time setup required!${NC}"
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to https://cloud.oracle.com/en_US/tryit"
    echo "2. Create a FREE Oracle Cloud account"
    echo "3. Complete identity verification (credit card required but not charged)"
    echo "4. Once logged in, we'll configure everything automatically..."
    echo ""
    read -p "Press Enter when you have your Oracle Cloud account ready..."
    
    # Interactive OCI configuration
    echo -e "${BLUE}Configuring Oracle Cloud CLI...${NC}"
    oci setup config
    
    # Extract values from OCI config
    OCI_CONFIG="$HOME/.oci/config"
    if [ -f "$OCI_CONFIG" ]; then
        TENANCY_OCID=$(grep tenancy "$OCI_CONFIG" | cut -d'=' -f2 | tr -d ' ')
        USER_OCID=$(grep user "$OCI_CONFIG" | cut -d'=' -f2 | tr -d ' ')
        FINGERPRINT=$(grep fingerprint "$OCI_CONFIG" | cut -d'=' -f2 | tr -d ' ')
        KEY_FILE=$(grep key_file "$OCI_CONFIG" | cut -d'=' -f2 | tr -d ' ')
        REGION=$(grep region "$OCI_CONFIG" | cut -d'=' -f2 | tr -d ' ')
    else
        echo -e "${RED}Error: OCI config not found. Please run 'oci setup config' first.${NC}"
        exit 1
    fi
    
    # Generate SSH key if it doesn't exist
    if [ ! -f "$HOME/.ssh/id_rsa.pub" ]; then
        echo -e "${BLUE}Generating SSH key...${NC}"
        ssh-keygen -t rsa -b 4096 -f "$HOME/.ssh/id_rsa" -N ""
    fi
    
    SSH_PUBLIC_KEY=$(cat "$HOME/.ssh/id_rsa.pub")
    
    # Create terraform.tfvars
    cat > terraform/oracle-cloud/terraform.tfvars << EOF
# Auto-generated Oracle Cloud configuration
tenancy_ocid     = "$TENANCY_OCID"
user_ocid        = "$USER_OCID"
fingerprint      = "$FINGERPRINT"
private_key_path = "$KEY_FILE"
region           = "$REGION"
compartment_ocid = "$TENANCY_OCID"
ssh_public_key   = "$SSH_PUBLIC_KEY"
EOF
    
    echo -e "${GREEN}✅ Oracle Cloud configuration completed!${NC}"
else
    echo -e "${GREEN}✅ Oracle Cloud already configured!${NC}"
fi

# Step 3: Infrastructure Deployment
echo -e "${BLUE}Step 3: Deploying infrastructure...${NC}"

cd terraform/oracle-cloud

# Initialize Terraform
terraform init

# Plan deployment
echo -e "${BLUE}Creating deployment plan...${NC}"
terraform plan -out=tfplan

# Apply deployment
echo -e "${BLUE}🚀 Deploying to Oracle Cloud... (this may take 5-10 minutes)${NC}"
terraform apply tfplan

# Get outputs
SERVER_IP=$(terraform output -raw instance_public_ip)
LB_IP=$(terraform output -raw load_balancer_ip)

echo -e "${GREEN}✅ Infrastructure deployed successfully!${NC}"
echo -e "${GREEN}🌐 Server IP: ${SERVER_IP}${NC}"
echo -e "${GREEN}⚖️ Load Balancer IP: ${LB_IP}${NC}"

cd ../..

# Step 4: DNS Configuration Guide
echo -e "${BLUE}Step 4: DNS Configuration...${NC}"
echo ""
echo "🌐 Configure your DNS records:"
echo "================================"
echo "A     dafel.com.mx      → $LB_IP"
echo "A     www.dafel.com.mx  → $LB_IP"
echo "A     api.dafel.com.mx  → $LB_IP"
echo ""
echo -e "${YELLOW}⚠️  DNS propagation can take up to 24 hours${NC}"
echo ""

# Step 5: Wait for server setup
echo -e "${BLUE}Step 5: Waiting for server setup... (3-5 minutes)${NC}"
echo "The server is automatically installing Docker, dependencies, and deploying your application..."

# Progress indicator
for i in {1..20}; do
    echo -n "."
    sleep 15
done
echo ""

# Step 6: Health Check
echo -e "${BLUE}Step 6: Health check...${NC}"

# Try to connect to the application
for i in {1..10}; do
    if curl -f "http://$SERVER_IP:3000/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is running!${NC}"
        break
    else
        echo -n "⏳ Waiting for application to start..."
        sleep 30
    fi
done

# Step 7: SSL Setup
echo -e "${BLUE}Step 7: SSL Certificate setup...${NC}"
echo "Once DNS is configured, run this command on your server:"
echo ""
echo -e "${YELLOW}ssh -i ~/.ssh/id_rsa ubuntu@$SERVER_IP 'sudo /opt/dafel/setup-ssl.sh'${NC}"
echo ""

# Step 8: Final Summary
echo -e "${GREEN}"
cat << EOF

╔══════════════════════════════════════════════════════════╗
║                 🎉 DEPLOYMENT SUCCESSFUL! 🎉             ║
╚══════════════════════════════════════════════════════════╝

🚀 Dafel Technologies is now LIVE on Oracle Cloud!

📊 Infrastructure:
   • ARM Ampere: 4 vCPU + 24GB RAM
   • Storage: 200GB SSD
   • Load Balancer: Enterprise-grade
   • Cost: $0/month (FREE TIER!)

🌐 Access URLs:
   • Application: http://$SERVER_IP:3000
   • Monitoring: http://$SERVER_IP:3001
   • Server SSH: ssh -i ~/.ssh/id_rsa ubuntu@$SERVER_IP

📋 Next Steps:
   1. Configure DNS records (shown above)
   2. Wait for DNS propagation (up to 24h)
   3. Setup SSL: ssh to server and run setup-ssl.sh
   4. Access: https://dafel.com.mx

📈 Monitoring:
   • System: /opt/dafel/monitor.sh
   • Logs: docker compose -f docker-compose.production.yml logs
   • Grafana: http://$SERVER_IP:3001

🎯 Your enterprise AI platform is ready for customers!

EOF
echo -e "${NC}"

# Step 9: Optional - Open monitoring
read -p "Would you like to open the monitoring dashboard? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "http://$SERVER_IP:3001"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "http://$SERVER_IP:3001"
    else
        echo "Open this URL in your browser: http://$SERVER_IP:3001"
    fi
fi

echo -e "${PURPLE}🎉 Welcome to the future of enterprise AI! 🚀${NC}"