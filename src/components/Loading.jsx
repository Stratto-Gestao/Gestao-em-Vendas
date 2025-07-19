import React from 'react';
import { Package } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Círculo externo */}
          <div 
            className="w-24 h-24 border-4 border-white/20 rounded-full animate-spin border-t-white/80 mx-auto mb-4"
            role="status"
            aria-label="Carregando"
          ></div>
          
          {/* Logo no centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 backdrop-blur-md bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <p className="text-white/80 text-lg font-medium">
          Carregando...
        </p>
      </div>
    </div>
  );
};

export default Loading;