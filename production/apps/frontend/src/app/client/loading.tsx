export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <img 
          src="/dafel-logo-optimized.svg" 
          alt="DAFEL Consulting" 
          className="h-16 w-auto mx-auto mb-8 animate-pulse"
        />
        
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Cargando Portal del Cliente
        </h2>
        
        <p className="text-gray-600">
          Preparando tus valuaciones actuariales...
        </p>
      </div>
    </div>
  );
}