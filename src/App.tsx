import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('todos');

  return (
    /* 1. Fondo principal cambiado a slate-50 (gris casi blanco) */
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Componente Sidebar (Asegúrate de actualizar los colores dentro de este componente también) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Contenido Principal: Fondo blanco puro para resaltar sobre el fondo grisáceo */}
      <main className="flex-1 overflow-y-auto bg-white text-slate-900 p-8 shadow-inner">
        <header className="mb-8">
          {/* 3. Título en slate-900 para máximo contraste */}
          <h2 className="text-3xl font-bold capitalize text-slate-900">
            {activeTab === 'todos' ? 'Biblioteca Global' : activeTab + 's'}
          </h2>
          <p className="text-slate-600">Gestiona los elementos de tu mundo creativo.</p>
        </header>

        {/* Rejilla de contenido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 4. Tarjeta vacía: Borde más suave (slate-200) y fondo sutil (slate-50) */}
          <div className="h-40 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex items-center justify-center text-slate-400 font-medium">
            No hay {activeTab} creados aún.
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;