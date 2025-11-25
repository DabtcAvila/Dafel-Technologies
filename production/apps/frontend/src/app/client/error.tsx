'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <img 
          src="/dafel-logo-optimized.svg" 
          alt="DAFEL Consulting" 
          className="h-16 w-auto mx-auto mb-8"
        />
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Algo salió mal
          </h2>
          
          <p className="text-gray-600 mb-6">
            Ha ocurrido un error inesperado. Intenta nuevamente o contacta al soporte técnico.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => reset()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Intentar nuevamente
            </button>
            
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}