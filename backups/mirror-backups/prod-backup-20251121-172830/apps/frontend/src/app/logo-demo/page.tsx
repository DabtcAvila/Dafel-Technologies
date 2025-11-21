'use client';

import { DafelLogo3D } from '@/components/DafelLogo3D';

export default function LogoDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl mx-auto text-center space-y-12">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Dafel Logo 3D - Versión Moderna
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Logo vectorizado con efectos 3D y animaciones tecnológicas
          </p>
        </div>

        {/* Logo tamaño extra grande como principal */}
        <div className="flex justify-center mb-16">
          <DafelLogo3D size="xl" className="transform hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Diferentes tamaños para demostración */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
              Tamaño Grande
            </h3>
            <DafelLogo3D size="lg" className="mx-auto" />
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
              Tamaño Mediano
            </h3>
            <DafelLogo3D size="md" className="mx-auto" />
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
              Tamaño Pequeño
            </h3>
            <DafelLogo3D size="sm" className="mx-auto" />
          </div>
        </div>

        {/* Sobre fondo oscuro */}
        <div className="bg-slate-900 p-12 rounded-2xl">
          <h3 className="text-xl font-semibold mb-8 text-white">
            Versión sobre fondo oscuro
          </h3>
          <DafelLogo3D size="lg" className="mx-auto" />
        </div>

        {/* Características técnicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-semibold text-slate-800 dark:text-white">SVG Vectorizado</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Escalable sin pérdida</p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl mb-2">✨</div>
            <h4 className="font-semibold text-slate-800 dark:text-white">Efectos 3D</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gradientes y sombras</p>
          </div>
          
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl mb-2">🎬</div>
            <h4 className="font-semibold text-slate-800 dark:text-white">Animado</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Framer Motion</p>
          </div>
          
          <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <h4 className="font-semibold text-slate-800 dark:text-white">Responsivo</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">4 tamaños disponibles</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}