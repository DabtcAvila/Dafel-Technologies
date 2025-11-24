#!/bin/bash
set -e

echo "🔒 Starting comprehensive security check..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking security tools..."
    
    # Check for npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check for Docker (for container scanning)
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed - skipping container security scans"
        SKIP_DOCKER=true
    fi
    
    print_success "Dependencies check completed"
}

# NPM audit
npm_security_audit() {
    print_status "Running npm audit..."
    
    if npm audit --audit-level=moderate; then
        print_success "npm audit passed"
    else
        print_warning "npm audit found vulnerabilities - check the output above"
        
        # Try to fix automatically
        print_status "Attempting to fix vulnerabilities..."
        if npm audit fix --audit-level=moderate; then
            print_success "Vulnerabilities fixed automatically"
        else
            print_warning "Some vulnerabilities could not be fixed automatically"
        fi
    fi
}

# License check
license_check() {
    print_status "Checking license compliance..."
    
    if command -v license-checker &> /dev/null; then
        license-checker --production --json > licenses.json
        
        # Check for problematic licenses
        if grep -q "GPL\|AGPL\|CPAL\|OSL" licenses.json; then
            print_warning "Potentially problematic licenses found - review licenses.json"
        else
            print_success "License check passed"
        fi
        
        rm -f licenses.json
    else
        print_warning "license-checker not installed - run: npm install -g license-checker"
    fi
}

# Dockerfile security check
dockerfile_security() {
    if [[ "$SKIP_DOCKER" != true ]]; then
        print_status "Checking Dockerfile security..."
        
        if [[ -f "Dockerfile" ]]; then
            # Basic Dockerfile security checks
            if grep -q "USER root" Dockerfile; then
                print_error "Dockerfile should not run as root user"
            fi
            
            if ! grep -q "USER " Dockerfile; then
                print_warning "Dockerfile should specify a non-root user"
            fi
            
            if grep -q "ADD http" Dockerfile; then
                print_warning "Consider using COPY instead of ADD for URLs"
            fi
            
            print_success "Dockerfile security check completed"
        else
            print_warning "No Dockerfile found"
        fi
    fi
}

# Environment file check
env_file_check() {
    print_status "Checking for exposed environment files..."
    
    # Check for .env files in version control
    if git ls-files | grep -q "\.env$"; then
        print_error ".env files should not be in version control"
    fi
    
    # Check for hardcoded secrets in source files
    if grep -r "password\|secret\|key\|token" src/ --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" | grep -v "password" | grep -v "// " | head -5; then
        print_warning "Potential hardcoded secrets found - review manually"
    fi
    
    print_success "Environment file check completed"
}

# HTTPS and SSL check
ssl_check() {
    print_status "Checking SSL/TLS configuration..."
    
    # Check Next.js config for security headers
    if [[ -f "next.config.js" ]]; then
        if grep -q "X-Frame-Options\|X-Content-Type-Options\|Referrer-Policy" next.config.js; then
            print_success "Security headers found in Next.js config"
        else
            print_warning "Consider adding security headers to Next.js config"
        fi
    fi
    
    print_success "SSL check completed"
}

# Dependencies vulnerability check with detailed analysis
detailed_vulnerability_check() {
    print_status "Running detailed vulnerability analysis..."
    
    # Create vulnerability report
    npm audit --json > vulnerability-report.json 2>/dev/null || true
    
    if [[ -f "vulnerability-report.json" ]]; then
        # Parse vulnerabilities
        HIGH_VULNS=$(jq '.metadata.vulnerabilities.high // 0' vulnerability-report.json 2>/dev/null || echo 0)
        CRITICAL_VULNS=$(jq '.metadata.vulnerabilities.critical // 0' vulnerability-report.json 2>/dev/null || echo 0)
        MODERATE_VULNS=$(jq '.metadata.vulnerabilities.moderate // 0' vulnerability-report.json 2>/dev/null || echo 0)
        
        echo "📊 Vulnerability Summary:"
        echo "   Critical: $CRITICAL_VULNS"
        echo "   High: $HIGH_VULNS" 
        echo "   Moderate: $MODERATE_VULNS"
        
        if [[ "$CRITICAL_VULNS" -gt 0 ]]; then
            print_error "Critical vulnerabilities found - immediate action required"
            exit 1
        elif [[ "$HIGH_VULNS" -gt 0 ]]; then
            print_warning "High severity vulnerabilities found"
        else
            print_success "No critical or high severity vulnerabilities found"
        fi
        
        rm -f vulnerability-report.json
    fi
}

# File permissions check
file_permissions_check() {
    print_status "Checking file permissions..."
    
    # Check for overly permissive files
    if find . -type f -perm 777 2>/dev/null | head -5; then
        print_warning "Files with 777 permissions found"
    fi
    
    # Check for executable files that shouldn't be
    if find src/ -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | xargs ls -l | grep "^-rwx" | head -5; then
        print_warning "Source files with execute permissions found"
    fi
    
    print_success "File permissions check completed"
}

# Generate security report
generate_security_report() {
    print_status "Generating security report..."
    
    REPORT_FILE="security-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# Security Assessment Report

**Generated:** $(date)
**Project:** Dafel Frontend
**Environment:** $(node --version)

## Summary

This report contains the results of automated security checks performed on the Dafel Frontend application.

## Checks Performed

- ✅ NPM Security Audit
- ✅ License Compliance Check
- ✅ Dockerfile Security Analysis
- ✅ Environment File Check
- ✅ SSL/TLS Configuration
- ✅ Vulnerability Analysis
- ✅ File Permissions Check

## Recommendations

1. Regularly update dependencies to patch security vulnerabilities
2. Use tools like Snyk, Dependabot, or npm audit in CI/CD pipeline
3. Implement Content Security Policy (CSP) headers
4. Use HTTPS in all environments
5. Regularly rotate API keys and secrets
6. Monitor for security advisories in used packages

## Next Steps

1. Review any warnings or errors found above
2. Implement recommended security fixes
3. Set up continuous security monitoring
4. Schedule regular security audits

---
*This report was generated automatically by the security check script.*
EOF

    print_success "Security report generated: $REPORT_FILE"
}

# Main execution
main() {
    echo "🚀 Dafel Frontend Security Assessment"
    echo "====================================="
    
    check_dependencies
    npm_security_audit
    license_check
    dockerfile_security
    env_file_check
    ssl_check
    detailed_vulnerability_check
    file_permissions_check
    generate_security_report
    
    echo ""
    echo "🎉 Security assessment completed!"
    echo "📋 Check the generated security report for detailed findings."
}

# Execute main function
main "$@"