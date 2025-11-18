'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// LEGITIMATE SVG COLORS - EXTRACTED FROM REAL FILES
const LEGITIMATE_COLORS = {
  logo: {
    greyColor: '#eaeaea',
    blueColor: '#a7c9ea', 
    textDark: '#241f1f',
    textGrey: '#666666'
  },
  banda: {
    primaryBlue: '#296ca1',
    accentBlue: '#096ec1',
    lightBlue: '#92c5df',
    darkBlue: '#4ba2cc'
  }
};

const ProfessionalReportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Professional Report Header */}
      <section className="relative py-16 bg-white">
        
        {/* Single Banda Baja - Natural Flow Across Top */}
        <div className="absolute top-0 left-0 w-full h-24 overflow-hidden">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.12 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image
              src="/bandabaja-legitimate.svg"
              alt=""
              width={1400}
              height={96}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="container mx-auto px-12 pt-8">
          
          {/* Large Prominent Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Image
              src="/logo-legitimate.svg"
              alt="Dafel Technologies"
              width={420}
              height={260}
              className="mx-auto"
              priority
            />
          </motion.div>

          {/* Report Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 
              className="text-4xl md:text-5xl font-light mb-4 tracking-wide"
              style={{ color: LEGITIMATE_COLORS.logo.textDark }}
            >
              AI SOLUTIONS EXECUTIVE SUMMARY
            </h1>
            <div 
              className="w-32 h-px mx-auto mb-6"
              style={{ backgroundColor: LEGITIMATE_COLORS.banda.primaryBlue }}
            />
            <p 
              className="text-lg font-light tracking-wide"
              style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
            >
              ENTERPRISE TRANSFORMATION REPORT 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Executive Summary Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-12 max-w-5xl">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 
              className="text-2xl font-medium mb-6 tracking-wide"
              style={{ color: LEGITIMATE_COLORS.logo.textDark }}
            >
              EXECUTIVE SUMMARY
            </h2>
            <div 
              className="w-16 h-px mb-8"
              style={{ backgroundColor: LEGITIMATE_COLORS.banda.primaryBlue }}
            />
            
            <div className="prose prose-lg max-w-none">
              <p 
                className="text-lg leading-relaxed mb-6 font-light"
                style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
              >
                Dafel Technologies has successfully delivered enterprise-grade AI solutions to Fortune 500 
                companies, driving measurable business transformation through advanced machine learning, 
                data analytics, and intelligent automation platforms.
              </p>
              
              <p 
                className="text-lg leading-relaxed mb-6 font-light"
                style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
              >
                Our comprehensive approach combines strategic consulting, custom development, and 
                enterprise integration to ensure seamless adoption of AI technologies within existing 
                corporate infrastructure.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Performance Indicators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-12 max-w-5xl">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 
              className="text-2xl font-medium mb-6 tracking-wide"
              style={{ color: LEGITIMATE_COLORS.logo.textDark }}
            >
              KEY PERFORMANCE INDICATORS
            </h2>
            <div 
              className="w-16 h-px mb-8"
              style={{ backgroundColor: LEGITIMATE_COLORS.banda.primaryBlue }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { metric: "95%", label: "Client Satisfaction Rate", description: "Enterprise implementations" },
              { metric: "40%", label: "Average ROI Increase", description: "Within 12 months" },
              { metric: "500+", label: "AI Models Deployed", description: "Production environments" },
              { metric: "24/7", label: "Enterprise Support", description: "Guaranteed uptime" }
            ].map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 border border-gray-100 rounded-sm"
              >
                <div 
                  className="text-3xl font-light mb-2"
                  style={{ color: LEGITIMATE_COLORS.banda.primaryBlue }}
                >
                  {kpi.metric}
                </div>
                <h4 
                  className="font-medium mb-2 text-sm tracking-wide"
                  style={{ color: LEGITIMATE_COLORS.logo.textDark }}
                >
                  {kpi.label}
                </h4>
                <p 
                  className="text-sm font-light"
                  style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
                >
                  {kpi.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Portfolio */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-12 max-w-5xl">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 
              className="text-2xl font-medium mb-6 tracking-wide"
              style={{ color: LEGITIMATE_COLORS.logo.textDark }}
            >
              SERVICE PORTFOLIO
            </h2>
            <div 
              className="w-16 h-px mb-8"
              style={{ backgroundColor: LEGITIMATE_COLORS.banda.primaryBlue }}
            />
          </motion.div>

          <div className="space-y-8">
            {[
              {
                title: "AI Strategy & Implementation Consulting",
                description: "Comprehensive strategic planning and roadmap development for enterprise AI adoption, including technology assessment, risk analysis, and phased implementation strategies."
              },
              {
                title: "Custom Machine Learning Development",
                description: "Bespoke ML models and algorithms designed specifically for enterprise requirements, with full integration support and ongoing optimization services."
              },
              {
                title: "Enterprise Data Analytics Platform",
                description: "Advanced business intelligence solutions providing real-time analytics, predictive modeling, and automated reporting capabilities for data-driven decision making."
              },
              {
                title: "System Integration & Automation",
                description: "Seamless integration of AI solutions with existing enterprise systems, including legacy system compatibility and automated workflow implementation."
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 border border-gray-100 rounded-sm"
              >
                <h3 
                  className="text-lg font-medium mb-4 tracking-wide"
                  style={{ color: LEGITIMATE_COLORS.logo.textDark }}
                >
                  {service.title}
                </h3>
                <p 
                  className="text-base leading-relaxed font-light"
                  style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
                >
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Banda Flow */}
      <section className="relative py-16 bg-white">
        
        {/* Single Banda Baja - Natural Flow Across Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 0.08 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full h-full"
          >
            <Image
              src="/bandabaja-legitimate.svg"
              alt=""
              width={1400}
              height={96}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="container mx-auto px-12 max-w-5xl relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 
              className="text-2xl font-medium mb-6 tracking-wide"
              style={{ color: LEGITIMATE_COLORS.logo.textDark }}
            >
              ENTERPRISE CONTACT
            </h2>
            <div 
              className="w-16 h-px mx-auto mb-8"
              style={{ backgroundColor: LEGITIMATE_COLORS.banda.primaryBlue }}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto">
              <div className="text-center">
                <h3 
                  className="font-medium mb-3 tracking-wide"
                  style={{ color: LEGITIMATE_COLORS.logo.textDark }}
                >
                  ENTERPRISE SALES
                </h3>
                <p 
                  className="font-light mb-1"
                  style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
                >
                  enterprise@dafel.com.mx
                </p>
                <p 
                  className="font-light"
                  style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
                >
                  +52 (55) 1234-5678
                </p>
              </div>
              
              <div className="text-center">
                <h3 
                  className="font-medium mb-3 tracking-wide"
                  style={{ color: LEGITIMATE_COLORS.logo.textDark }}
                >
                  TECHNICAL SUPPORT
                </h3>
                <p 
                  className="font-light mb-1"
                  style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
                >
                  support@dafel.com.mx
                </p>
                <p 
                  className="font-light"
                  style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
                >
                  24/7 Enterprise Support
                </p>
              </div>
            </div>

            <div className="mt-12">
              <p 
                className="text-sm font-light tracking-wide"
                style={{ color: LEGITIMATE_COLORS.logo.textGrey }}
              >
                DAFEL TECHNOLOGIES © 2024 • ENTERPRISE AI SOLUTIONS
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalReportPage;