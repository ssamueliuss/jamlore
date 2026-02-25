import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { ProjectSelector } from './components/ProjectSelector';
import { Workspace } from './types';

function App() {
  const [proyectos, setProyectos] = useState<Workspace[]>([]);
  const [proyectoActivo, setProyectoActivo] = useState<Workspace | null>(null);
  const [activeTab, setActiveTab] = useState('todos');

  // Cargar proyectos al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('jamlore_projects');
    if (saved) {
      try {
        setProyectos(JSON.parse(saved));
      } catch (e) {
        console.error("Error cargando proyectos:", e);
        setProyectos([]);
      }
    }
  }, []);

  const crearProyecto = () => {
    const nombre = prompt("Nombre del nuevo universo:");
    if (!nombre) return;

    const nuevo: Workspace = {
      id: crypto.randomUUID(),
      nombre,
      descripcion: "Un nuevo mundo por documentar...",
      ultimaModificacion: Date.now(),
      biblioteca: {
        entidades: [],
        configuracionVisual: {
          colorAcento: '#9333ea' // Tu detalle morado por defecto
        }
      }
    };

    const actualizados = [...proyectos, nuevo];
    setProyectos(actualizados);
    localStorage.setItem('jamlore_projects', JSON.stringify(actualizados));
    setProyectoActivo(nuevo);
  };

  // Función para salir al selector y guardar cambios
  const cerrarProyecto = () => {
    setProyectoActivo(null);
    // Aquí podrías añadir una lógica de guardado automático si hubiera cambios
  };

  if (!proyectoActivo) {
    return (
      <ProjectSelector 
        proyectos={proyectos} 
        onSelect={setProyectoActivo} 
        onCreate={crearProyecto} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        projectName={proyectoActivo.nombre}
        onBack={cerrarProyecto} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Cabecera del área de trabajo */}
        <header className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {proyectoActivo.nombre}
            </h1>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {activeTab}
            </span>
          </div>
          <p className="text-slate-500">
            {proyectoActivo.biblioteca.entidades.length} entradas en la biblioteca
          </p>
        </header>

        {/* Zona de Contenido */}
        <section className="flex-1 p-8 pt-4 overflow-y-auto">
          {proyectoActivo.biblioteca.entidades.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-20 h-20 bg-slate-200 rounded-full mb-4 flex items-center justify-center text-slate-400">
                 {/* Icono de placeholder */}
                 ✨
              </div>
              <p className="text-xl font-medium">Este universo está vacío</p>
              <p className="text-sm">Empieza creando tu primer personaje o facción.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Aquí mapearemos las entidades cuando las tengamos */}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;