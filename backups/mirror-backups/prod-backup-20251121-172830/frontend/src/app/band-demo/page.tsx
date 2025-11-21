import { DafelBandPremium } from '@/components/DafelBandPremium';

export default function BandDemoPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-12 p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Dafel Band Premium - 4K Renovated
      </h1>
      
      {/* Versión XL - Showcase principal */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          Extra Large - Premium Quality
        </h2>
        <div className="flex justify-center">
          <DafelBandPremium size="xl" animated={true} />
        </div>
      </div>

      {/* Versión Large - Estándar web */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          Large - Web Standard
        </h2>
        <div className="flex justify-center">
          <DafelBandPremium size="lg" animated={true} />
        </div>
      </div>

      {/* Versión Medium - Responsive */}
      <div className="w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
          Medium - Mobile Responsive
        </h2>
        <div className="flex justify-center">
          <DafelBandPremium size="md" animated={true} />
        </div>
      </div>

      {/* Versión sin animación */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          Static Version - No Animation
        </h2>
        <div className="flex justify-center">
          <DafelBandPremium size="lg" animated={false} />
        </div>
      </div>

      {/* Fondo oscuro demo */}
      <div className="w-full max-w-4xl bg-gray-900 p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center text-white">
          Dark Background Test
        </h2>
        <div className="flex justify-center">
          <DafelBandPremium size="lg" animated={true} />
        </div>
      </div>
    </div>
  );
}