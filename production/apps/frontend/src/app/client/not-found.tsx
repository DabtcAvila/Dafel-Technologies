import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <img 
          src="/dafel-logo-optimized.svg" 
          alt="DAFEL Consulting" 
          className="h-16 w-auto mx-auto mb-8"
        />
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Página no encontrada
          </h2>
          
          <p className="text-gray-600 mb-6">
            La página que buscas no existe o ha sido movida.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/client"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Portal del Cliente
            </Link>
            
            <Link
              href="/login"
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Ir al Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}