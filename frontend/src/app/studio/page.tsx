'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  CubeIcon,
  CircleStackIcon,
  CpuChipIcon,
  BeakerIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function StudioPage() {
  const { messages } = useLanguage();
  const [activeIcon, setActiveIcon] = useState(0);

  const sidebarIcons = [
    { Icon: CubeIcon, id: 0 },
    { Icon: CircleStackIcon, id: 1 },
    { Icon: CpuChipIcon, id: 2 },
    { Icon: BeakerIcon, id: 3 },
    { Icon: ChartBarIcon, id: 4 },
    { Icon: Cog6ToothIcon, id: 5 }
  ];

  const workflowNodes = [
    { id: 'data', label: messages.studio.data, x: 100, y: 250 },
    { id: 'process', label: messages.studio.process, x: 300, y: 250 },
    { id: 'ai', label: messages.studio.ai, x: 500, y: 250 },
    { id: 'output', label: messages.studio.output, x: 700, y: 250 }
  ];

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-[60px] bg-gray-900 flex flex-col items-center py-6 space-y-6">
        {sidebarIcons.map(({ Icon, id }) => (
          <button
            key={id}
            onClick={() => setActiveIcon(id)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              activeIcon === id 
                ? 'text-white bg-gray-800' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon className="h-6 w-6" />
          </button>
        ))}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-mono font-light tracking-wider text-gray-900">
            {messages.studio.title}
          </h1>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8 relative">
          <div className="h-full bg-white rounded-lg border border-gray-200 relative overflow-hidden">
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill="#9ca3af"
                  />
                </marker>
              </defs>
              {/* Connection lines */}
              <line
                x1="180"
                y1="250"
                x2="220"
                y2="250"
                stroke="#9ca3af"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
              <line
                x1="380"
                y1="250"
                x2="420"
                y2="250"
                stroke="#9ca3af"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
              <line
                x1="580"
                y1="250"
                x2="620"
                y2="250"
                stroke="#9ca3af"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            </svg>

            {/* Workflow Nodes */}
            {workflowNodes.map((node, index) => (
              <motion.div
                key={node.id}
                className="absolute"
                style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                <div className="bg-white border-2 border-gray-900 rounded-lg px-6 py-4 cursor-move hover:shadow-lg transition-shadow">
                  <span className="text-sm font-mono font-medium text-gray-900">
                    {node.label}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Instruction text */}
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <p className="text-sm font-sans text-gray-500">
                {messages.studio.dragPrompt}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}