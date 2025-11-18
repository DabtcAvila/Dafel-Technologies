'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MovementDesignerPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  // Estado de la herramienta
  const [epicenter, setEpicenter] = useState({ x: 400, y: 300 });
  const [viewportArea, setViewportArea] = useState({ x: 200, y: 150, width: 800, height: 400 });
  const [rectPosition, setRectPosition] = useState({ x: 300, y: 200 });
  const [animationRadius, setAnimationRadius] = useState(150);
  const [animationAngle, setAnimationAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Rectángulo de muestra (tomado de la banda baja)
  const sampleRect = {
    path: 'm53.48 22.493s50.058 125.32 208.66 67.839c0.4001 39.429-0.0607 0.021 0.47146 39.403-182.76 63.714-244.93-91.761-244.93-91.761z',
    gradient: 'url(#linearGradient39)',
    width: 60,
    height: 20
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular posición en círculo
  const getCircularPosition = (angle: number, radius: number) => {
    return {
      x: epicenter.x + Math.cos(angle * Math.PI / 180) * radius,
      y: epicenter.y + Math.sin(angle * Math.PI / 180) * radius
    };
  };

  // Iniciar animación tipo compás
  const startCompassAnimation = () => {
    setIsAnimating(true);
    const startAngle = animationAngle;
    const endAngle = animationAngle + 180; // Media vuelta

    // Simular animación
    let currentAngle = startAngle;
    const interval = setInterval(() => {
      currentAngle += 2;
      setAnimationAngle(currentAngle);
      
      if (currentAngle >= endAngle) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 50);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Cargando herramienta...</div>
      </div>
    );
  }

  const currentRectPos = getCircularPosition(animationAngle, animationRadius);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎯 Diseñador de Movimiento - Banda Baja
          </h1>
          <p className="text-gray-600">
            Herramienta interactiva para diseñar el movimiento circunferencial exacto
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Panel de controles */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">🎮 Controles</h2>
            
            {/* Epicentro */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-700">📍 Epicentro del Compás</h3>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">
                  X: {epicenter.x}
                  <input
                    type="range"
                    min="0"
                    max="800"
                    value={epicenter.x}
                    onChange={(e) => setEpicenter(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full mt-1"
                  />
                </label>
                <label className="block text-sm text-gray-600">
                  Y: {epicenter.y}
                  <input
                    type="range"
                    min="0"
                    max="600"
                    value={epicenter.y}
                    onChange={(e) => setEpicenter(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full mt-1"
                  />
                </label>
              </div>
            </div>

            {/* Radio de animación */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-700">📏 Radio del Compás</h3>
              <label className="block text-sm text-gray-600">
                Radio: {animationRadius}px
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={animationRadius}
                  onChange={(e) => setAnimationRadius(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
              </label>
            </div>

            {/* Ángulo inicial */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-700">🔄 Ángulo Inicial</h3>
              <label className="block text-sm text-gray-600">
                Ángulo: {animationAngle}°
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={animationAngle}
                  onChange={(e) => setAnimationAngle(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
              </label>
            </div>

            {/* Área visible */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-700">📺 Área Visible</h3>
              <div className="space-y-2 text-sm">
                <label className="block text-gray-600">
                  X: {viewportArea.x}
                  <input
                    type="range"
                    min="0"
                    max="400"
                    value={viewportArea.x}
                    onChange={(e) => setViewportArea(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full mt-1"
                  />
                </label>
                <label className="block text-gray-600">
                  Y: {viewportArea.y}
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={viewportArea.y}
                    onChange={(e) => setViewportArea(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full mt-1"
                  />
                </label>
                <label className="block text-gray-600">
                  Ancho: {viewportArea.width}
                  <input
                    type="range"
                    min="200"
                    max="1000"
                    value={viewportArea.width}
                    onChange={(e) => setViewportArea(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    className="w-full mt-1"
                  />
                </label>
                <label className="block text-gray-600">
                  Alto: {viewportArea.height}
                  <input
                    type="range"
                    min="200"
                    max="600"
                    value={viewportArea.height}
                    onChange={(e) => setViewportArea(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="w-full mt-1"
                  />
                </label>
              </div>
            </div>

            {/* Botón de animación */}
            <button
              onClick={startCompassAnimation}
              disabled={isAnimating}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isAnimating 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAnimating ? '🔄 Animando...' : '▶️ Probar Movimiento Compás'}
            </button>
          </div>

          {/* Área de diseño */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-800">🎨 Área de Diseño</h2>
              <p className="text-sm text-gray-600 mt-1">
                Posición actual: X:{Math.round(currentRectPos.x)}, Y:{Math.round(currentRectPos.y)}
              </p>
            </div>
            
            <div className="relative bg-gray-200" style={{ height: '600px' }}>
              
              {/* SVG de diseño */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 600"
                className="absolute inset-0"
              >
                {/* Definiciones de gradientes */}
                <defs>
                  <linearGradient id="linearGradient39" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientUnits="userSpaceOnUse">
                    <stop offset="0" style={{ stopColor: '#92c5df' }} />
                    <stop offset="1" style={{ stopColor: '#92c5e1', stopOpacity: 0.19784 }} />
                  </linearGradient>
                </defs>

                {/* Área visible de pantalla */}
                <rect
                  x={viewportArea.x}
                  y={viewportArea.y}
                  width={viewportArea.width}
                  height={viewportArea.height}
                  fill="rgba(34, 197, 94, 0.1)"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text x={viewportArea.x + 10} y={viewportArea.y + 20} fill="#22c55e" fontSize="12" fontWeight="bold">
                  📺 Área Visible
                </text>

                {/* Círculo del compás */}
                <circle
                  cx={epicenter.x}
                  cy={epicenter.y}
                  r={animationRadius}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.5"
                />

                {/* Epicentro */}
                <circle
                  cx={epicenter.x}
                  cy={epicenter.y}
                  r="6"
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth="2"
                />
                <text x={epicenter.x + 10} y={epicenter.y - 10} fill="#ef4444" fontSize="12" fontWeight="bold">
                  📍 Epicentro
                </text>

                {/* Línea del compás */}
                <line
                  x1={epicenter.x}
                  y1={epicenter.y}
                  x2={currentRectPos.x}
                  y2={currentRectPos.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  opacity="0.7"
                />

                {/* Rectángulo de la banda baja */}
                <motion.g
                  animate={{
                    x: currentRectPos.x - 30,
                    y: currentRectPos.y - 10,
                    rotate: animationAngle
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  style={{ transformOrigin: '30px 10px' }}
                >
                  <rect
                    width={sampleRect.width}
                    height={sampleRect.height}
                    fill={sampleRect.gradient}
                    stroke="#1f2937"
                    strokeWidth="1"
                    rx="2"
                  />
                </motion.g>

                {/* Información de coordenadas */}
                <text x="10" y="30" fill="#374151" fontSize="14" fontWeight="bold">
                  🎯 Herramienta de Diseño de Movimiento Circunferencial
                </text>
                <text x="10" y="50" fill="#6b7280" fontSize="12">
                  Radio: {animationRadius}px | Ángulo: {animationAngle}° | Centro: ({epicenter.x}, {epicenter.y})
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Información de ayuda */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Instrucciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">🎮 Controles disponibles:</h4>
              <ul className="space-y-1">
                <li>• <strong>Epicentro:</strong> Punto central del movimiento tipo compás</li>
                <li>• <strong>Radio:</strong> Distancia del movimiento circular</li>
                <li>• <strong>Ángulo:</strong> Posición actual en el círculo</li>
                <li>• <strong>Área Visible:</strong> Zona que se ve en pantalla</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎯 Objetivo:</h4>
              <ul className="space-y-1">
                <li>• Ajusta el epicentro para definir el centro de rotación</li>
                <li>• Modifica el radio para el arco de movimiento</li>
                <li>• Prueba diferentes ángulos para el recorrido</li>
                <li>• Define el área visible para simular la pantalla real</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementDesignerPage;