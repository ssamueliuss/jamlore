import banner from '../../assets/banner.png';

export function SplashScreen() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-slate-50">
      <div className="flex flex-col items-center animate-in fade-in duration-700">
        
        {/* Contenedor del Logo con animación de respiración */}
        <div className="w-64 h-auto flex items-center justify-center mb-8 animate-pulse">
           <img 
             src={banner} 
             alt="Logo SillyDevs" 
             className="w-full h-auto object-contain" 
             onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=JAMDOC")} 
           />
        </div>

        {/* Sección de texto y barra */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl font-bold text-slate-800">Cargando JamLore</h2>
          
          {/* Barra de carga con tu acento morado */}
          <div className="mt-4 w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full animate-loading" />
          </div>
          
          <p className="mt-4 text-sm text-slate-500 font-medium tracking-wide">
            Preparando tu espacio de trabajo...
          </p>
        </div>
      </div>

      {/* Estilos locales para la animación */}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-loading {
          animation: loading 5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}