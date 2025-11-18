'use client';

import React from 'react';
import { PathsBackground } from '@/components/ui';

export default function PathsTestPage() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* PathsBackground Component - Testing animations */}
      <PathsBackground />
      
      {/* Simple overlay text to test visibility */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">
            Animated Paths Test - Check for smooth path animations
          </h1>
          <p className="text-lg text-gray-700">
            You should see black animated curved paths drawing and reversing in the background
          </p>
        </div>
      </div>
    </main>
  );
}