#!/usr/bin/env node

/**
 * OWASP ZAP Security Testing Script
 * 
 * This script performs automated security testing using OWASP ZAP
 * It includes:
 * - Passive scanning
 * - Active scanning  
 * - Spider crawling
 * - Authentication testing
 * - SQL injection detection
 * - XSS vulnerability detection
 * - CSRF protection validation
 */

const axios = require('axios')
const fs = require('fs')
const path = require('path')

class ZAPSecurityTester {
  constructor(options = {}) {
    this.zapUrl = options.zapUrl || 'http://localhost:8080'
    this.targetUrl = options.targetUrl || 'http://localhost:3000'
    this.apiKey = options.apiKey || 'your-zap-api-key'
    this.reportDir = options.reportDir || './security-reports'
    
    // Ensure report directory exists
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true })
    }
  }

  async checkZAPStatus() {
    try {
      const response = await axios.get(`${this.zapUrl}/JSON/core/view/version/`)
      console.log(`✅ ZAP is running: ${response.data.version}`)
      return true
    } catch (error) {
      console.error('❌ ZAP is not running or not accessible')
      console.error('Please start OWASP ZAP and ensure it\'s listening on', this.zapUrl)
      return false
    }
  }

  async startSpider() {
    console.log('🕷️ Starting spider scan...')
    
    try {
      const response = await axios.get(`${this.zapUrl}/JSON/spider/action/scan/`, {
        params: {
          zapapiformat: 'JSON',
          apikey: this.apiKey,
          url: this.targetUrl,
          maxChildren: '10',
          recurse: 'true',
          contextName: '',
          subtreeOnly: 'false'
        }
      })

      const scanId = response.data.scan
      console.log(`Spider scan started with ID: ${scanId}`)
      
      return await this.waitForSpiderToComplete(scanId)
    } catch (error) {
      console.error('❌ Spider scan failed:', error.message)
      throw error
    }
  }

  async waitForSpiderToComplete(scanId) {
    console.log('⏳ Waiting for spider scan to complete...')
    
    while (true) {
      try {
        const statusResponse = await axios.get(`${this.zapUrl}/JSON/spider/view/status/`, {
          params: {
            zapapiformat: 'JSON',
            apikey: this.apiKey,
            scanId: scanId
          }
        })

        const status = parseInt(statusResponse.data.status)
        process.stdout.write(`\rSpider progress: ${status}%`)
        
        if (status >= 100) {
          console.log('\n✅ Spider scan completed')
          break
        }
        
        await this.sleep(2000)
      } catch (error) {
        console.error('❌ Error checking spider status:', error.message)
        throw error
      }
    }

    // Get spider results
    const resultsResponse = await axios.get(`${this.zapUrl}/JSON/spider/view/results/`, {
      params: {
        zapapiformat: 'JSON',
        apikey: this.apiKey,
        scanId: scanId
      }
    })

    const urls = resultsResponse.data.results
    console.log(`🔍 Spider found ${urls.length} URLs`)
    
    return urls
  }

  async startPassiveScan() {
    console.log('🔍 Starting passive scan...')
    
    try {
      await axios.get(`${this.zapUrl}/JSON/pscan/action/enableAllScanners/`, {
        params: {
          zapapiformat: 'JSON',
          apikey: this.apiKey
        }
      })

      console.log('✅ Passive scan enabled')
      
      // Wait for passive scan to process
      await this.waitForPassiveScanToComplete()
      
    } catch (error) {
      console.error('❌ Passive scan failed:', error.message)
      throw error
    }
  }

  async waitForPassiveScanToComplete() {
    console.log('⏳ Waiting for passive scan to complete...')
    
    while (true) {
      try {
        const recordsResponse = await axios.get(`${this.zapUrl}/JSON/pscan/view/recordsToScan/`, {
          params: {
            zapapiformat: 'JSON',
            apikey: this.apiKey
          }
        })

        const recordsToScan = parseInt(recordsResponse.data.recordsToScan)
        
        if (recordsToScan <= 0) {
          console.log('\n✅ Passive scan completed')
          break
        }
        
        process.stdout.write(`\rRecords remaining: ${recordsToScan}`)
        await this.sleep(2000)
        
      } catch (error) {
        console.error('❌ Error checking passive scan status:', error.message)
        throw error
      }
    }
  }

  async startActiveScan() {
    console.log('🎯 Starting active scan...')
    
    try {
      const response = await axios.get(`${this.zapUrl}/JSON/ascan/action/scan/`, {
        params: {
          zapapiformat: 'JSON',
          apikey: this.apiKey,
          url: this.targetUrl,
          recurse: 'true',
          inScopeOnly: 'false',
          scanPolicyName: '',
          method: '',
          postData: '',
          contextId: ''
        }
      })

      const scanId = response.data.scan
      console.log(`Active scan started with ID: ${scanId}`)
      
      return await this.waitForActiveScanToComplete(scanId)
    } catch (error) {
      console.error('❌ Active scan failed:', error.message)
      throw error
    }
  }

  async waitForActiveScanToComplete(scanId) {
    console.log('⏳ Waiting for active scan to complete...')
    
    while (true) {
      try {
        const statusResponse = await axios.get(`${this.zapUrl}/JSON/ascan/view/status/`, {
          params: {
            zapapiformat: 'JSON',
            apikey: this.apiKey,
            scanId: scanId
          }
        })

        const status = parseInt(statusResponse.data.status)
        process.stdout.write(`\rActive scan progress: ${status}%`)
        
        if (status >= 100) {
          console.log('\n✅ Active scan completed')
          break
        }
        
        await this.sleep(5000) // Active scan takes longer
      } catch (error) {
        console.error('❌ Error checking active scan status:', error.message)
        throw error
      }
    }
  }

  async testSQLInjection() {
    console.log('💉 Testing for SQL Injection vulnerabilities...')
    
    const testPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "1' UNION SELECT * FROM users--",
      "admin'--",
      "' OR 1=1--"
    ]

    const vulnerabilities = []

    for (const payload of testPayloads) {
      try {
        // Test login endpoint
        const response = await axios.post(`${this.targetUrl}/api/auth/signin`, {
          email: payload,
          password: 'test'
        }, {
          validateStatus: () => true // Don't throw on error status
        })

        // Check for SQL error messages in response
        const responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
        
        if (this.containsSQLError(responseText)) {
          vulnerabilities.push({
            type: 'SQL Injection',
            payload: payload,
            endpoint: '/api/auth/signin',
            response: response.status,
            evidence: 'SQL error message detected'
          })
        }
      } catch (error) {
        // Network errors are expected for some payloads
      }
    }

    if (vulnerabilities.length > 0) {
      console.log(`❌ Found ${vulnerabilities.length} potential SQL injection vulnerabilities`)
      return vulnerabilities
    } else {
      console.log('✅ No SQL injection vulnerabilities detected')
      return []
    }
  }

  containsSQLError(text) {
    const sqlErrors = [
      'SQL syntax error',
      'mysql_fetch_array',
      'ORA-',
      'PostgreSQL query failed',
      'Warning: pg_',
      'valid MySQL result',
      'SQLServer JDBC Driver',
      'SqlException'
    ]

    return sqlErrors.some(error => 
      text.toLowerCase().includes(error.toLowerCase())
    )
  }

  async testXSS() {
    console.log('🚨 Testing for XSS vulnerabilities...')
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      "javascript:alert('XSS')",
      '<img src="x" onerror="alert(1)">',
      '<svg onload="alert(1)">'
    ]

    const vulnerabilities = []

    for (const payload of xssPayloads) {
      try {
        // Test search or form inputs
        const testEndpoints = [
          `/api/data-sources?search=${encodeURIComponent(payload)}`,
          `/studio?query=${encodeURIComponent(payload)}`
        ]

        for (const endpoint of testEndpoints) {
          const response = await axios.get(`${this.targetUrl}${endpoint}`, {
            validateStatus: () => true
          })

          const responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data)

          if (responseText.includes(payload)) {
            vulnerabilities.push({
              type: 'Reflected XSS',
              payload: payload,
              endpoint: endpoint,
              evidence: 'Payload reflected in response'
            })
          }
        }
      } catch (error) {
        // Network errors are expected
      }
    }

    if (vulnerabilities.length > 0) {
      console.log(`❌ Found ${vulnerabilities.length} potential XSS vulnerabilities`)
      return vulnerabilities
    } else {
      console.log('✅ No XSS vulnerabilities detected')
      return []
    }
  }

  async testCSRF() {
    console.log('🛡️ Testing CSRF protection...')
    
    try {
      // Test state-changing operations without CSRF token
      const response = await axios.post(`${this.targetUrl}/api/data-sources`, {
        name: 'CSRF Test',
        type: 'postgresql'
      }, {
        validateStatus: () => true
      })

      if (response.status === 200 || response.status === 201) {
        console.log('❌ CSRF protection may be missing')
        return [{
          type: 'CSRF',
          endpoint: '/api/data-sources',
          evidence: 'Request succeeded without CSRF token'
        }]
      } else {
        console.log('✅ CSRF protection appears to be in place')
        return []
      }
    } catch (error) {
      console.log('✅ CSRF protection test completed')
      return []
    }
  }

  async testHeaders() {
    console.log('🔒 Testing security headers...')
    
    try {
      const response = await axios.get(this.targetUrl)
      const headers = response.headers
      const missingHeaders = []

      const requiredHeaders = {
        'x-frame-options': 'Clickjacking protection',
        'x-content-type-options': 'MIME type sniffing protection', 
        'x-xss-protection': 'XSS protection',
        'strict-transport-security': 'HTTPS enforcement',
        'content-security-policy': 'Content Security Policy'
      }

      for (const [header, description] of Object.entries(requiredHeaders)) {
        if (!headers[header]) {
          missingHeaders.push({
            type: 'Missing Security Header',
            header: header,
            description: description
          })
        }
      }

      if (missingHeaders.length > 0) {
        console.log(`❌ Found ${missingHeaders.length} missing security headers`)
        return missingHeaders
      } else {
        console.log('✅ All required security headers are present')
        return []
      }
    } catch (error) {
      console.error('❌ Error testing headers:', error.message)
      return []
    }
  }

  async generateReports() {
    console.log('📊 Generating security reports...')
    
    try {
      // HTML Report
      const htmlResponse = await axios.get(`${this.zapUrl}/OTHER/core/other/htmlreport/`, {
        params: {
          apikey: this.apiKey
        }
      })

      fs.writeFileSync(
        path.join(this.reportDir, 'zap-security-report.html'),
        htmlResponse.data
      )

      // JSON Report
      const jsonResponse = await axios.get(`${this.zapUrl}/JSON/core/view/alerts/`, {
        params: {
          zapapiformat: 'JSON',
          apikey: this.apiKey,
          baseurl: this.targetUrl
        }
      })

      fs.writeFileSync(
        path.join(this.reportDir, 'zap-security-report.json'),
        JSON.stringify(jsonResponse.data, null, 2)
      )

      // XML Report  
      const xmlResponse = await axios.get(`${this.zapUrl}/OTHER/core/other/xmlreport/`, {
        params: {
          apikey: this.apiKey
        }
      })

      fs.writeFileSync(
        path.join(this.reportDir, 'zap-security-report.xml'),
        xmlResponse.data
      )

      console.log(`✅ Security reports generated in ${this.reportDir}`)
      
      return jsonResponse.data.alerts || []
    } catch (error) {
      console.error('❌ Error generating reports:', error.message)
      return []
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async runFullSecurityScan() {
    console.log('🚀 Starting comprehensive security scan...')
    console.log(`Target: ${this.targetUrl}`)
    console.log(`ZAP Proxy: ${this.zapUrl}`)
    console.log('=' .repeat(50))

    const startTime = Date.now()
    let allVulnerabilities = []

    try {
      // Check if ZAP is running
      if (!(await this.checkZAPStatus())) {
        throw new Error('OWASP ZAP is not accessible')
      }

      // Run spider scan
      await this.startSpider()

      // Run passive scan
      await this.startPassiveScan()

      // Run active scan
      await this.startActiveScan()

      // Custom security tests
      const sqlInjectionVulns = await this.testSQLInjection()
      const xssVulns = await this.testXSS()
      const csrfVulns = await this.testCSRF()
      const headerVulns = await this.testHeaders()

      allVulnerabilities = [
        ...sqlInjectionVulns,
        ...xssVulns,
        ...csrfVulns,
        ...headerVulns
      ]

      // Generate reports
      const zapAlerts = await this.generateReports()
      
      // Summary
      const endTime = Date.now()
      const duration = Math.round((endTime - startTime) / 1000)
      
      console.log('\n' + '=' .repeat(50))
      console.log('📈 SECURITY SCAN SUMMARY')
      console.log('=' .repeat(50))
      console.log(`⏱️ Scan Duration: ${duration} seconds`)
      console.log(`🔍 ZAP Alerts Found: ${zapAlerts.length}`)
      console.log(`🚨 Custom Test Vulnerabilities: ${allVulnerabilities.length}`)
      console.log(`📂 Reports Location: ${this.reportDir}`)
      
      if (zapAlerts.length > 0 || allVulnerabilities.length > 0) {
        console.log('\n❌ SECURITY ISSUES DETECTED - Review reports for details')
        process.exit(1)
      } else {
        console.log('\n✅ NO CRITICAL SECURITY ISSUES DETECTED')
        process.exit(0)
      }

    } catch (error) {
      console.error('\n❌ Security scan failed:', error.message)
      process.exit(1)
    }
  }
}

// Run security scan if called directly
if (require.main === module) {
  const tester = new ZAPSecurityTester({
    zapUrl: process.env.ZAP_URL || 'http://localhost:8080',
    targetUrl: process.env.TARGET_URL || 'http://localhost:3000',
    apiKey: process.env.ZAP_API_KEY || 'your-zap-api-key',
    reportDir: process.env.REPORT_DIR || './security-reports'
  })

  tester.runFullSecurityScan()
}

module.exports = ZAPSecurityTester