'use client';

import React from 'react';
import DafelBandBajaAnimation from '@/components/ui/DafelBandBajaAnimation';

export default function BandaDemoPage() {
  const handleAnimationComplete = () => {
    console.log('¡Animación de banda baja completada!');
  };

  return (
    <div className="min-h-screen">
      <DafelBandBajaAnimation 
        autoPlay={true}
        onAnimationComplete={handleAnimationComplete}
        className="demo-animation"
      />
      
      {/* Información de la demo */}
      <div className="absolute top-8 left-8 bg-black/20 backdrop-blur-sm text-white p-6 rounded-lg max-w-md z-20">
        <h1 className="text-2xl font-bold mb-4">Dafel Banda Baja Animation</h1>
        <div className="space-y-2 text-sm">
          <p><strong>37 elementos path</strong> animados individualmente</p>
          <p><strong>Velocidades variables:</strong> Bandas principales (1.0x), medios (1.3x), pequeños (1.8-2.5x)</p>
          <p><strong>Spring physics:</strong> Configuraciones realistas por tamaño</p>
          <p><strong>Efectos:</strong> Sombras, glows, hover effects</p>
          <p><strong>Alineación:</strong> Borde derecho de la página</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs opacity-80">
            Los elementos entran desde la derecha con delays escalonados creando un efecto cascada espectacular.
          </p>
        </div>
      </div>
    </div>
  );
}