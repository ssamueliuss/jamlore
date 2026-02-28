import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { ProjectSelector } from './components/ProjectSelector';
import { SplashScreen } from './components/ui/SplashScreen';
import { Modal } from './components/ui/Modal';
import { Workspace, Entidad, EntidadTipo } from './types';
import { Image as ImageIcon, Plus } from 'lucide-react';

function App() {
  const [proyectos, setProyectos] = useState<Workspace[]>([]);
  const [proyectoActivo, setProyectoActivo] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');

  // ESTADOS PARA MODALES Y FORMULARIOS
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | 'entity' | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Estados de inputs para Entidades
  const [inputValue, setInputValue] = useState(''); 
  const [descValue, setDescValue] = useState('');    
  const [imgValue, setImgValue] = useState(''); // Imagen principal
  const [tipoEntidad, setTipoEntidad] = useState<EntidadTipo>('personaje');

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('jamlore_projects');
      if (saved) {
        try { setProyectos(JSON.parse(saved)); } catch (e) { setProyectos([]); }
      }
      setIsLoading(false); 
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // --- LÓGICA DE DATOS ---

  const addEntidad = (nuevaEntidad: Entidad) => {
    if (!proyectoActivo) return;

    const proyectoActualizado: Workspace = {
      ...proyectoActivo,
      ultimaModificacion: Date.now(),
      biblioteca: {
        ...proyectoActivo.biblioteca,
        entidades: [...proyectoActivo.biblioteca.entidades, nuevaEntidad]
      }
    };

    setProyectoActivo(proyectoActualizado);
    const proyectosActualizados = proyectos.map(p => 
      p.id === proyectoActivo.id ? proyectoActualizado : p
    );
    setProyectos(proyectosActualizados);
    localStorage.setItem('jamlore_projects', JSON.stringify(proyectosActualizados));
  };

  const handleConfirmAction = () => {
    if (modalMode === 'create') {
      if (!inputValue.trim()) return;
      const nuevo: Workspace = {
        id: crypto.randomUUID(),
        nombre: inputValue,
        descripcion: "Un nuevo mundo por documentar...",
        ultimaModificacion: Date.now(),
        biblioteca: { entidades: [], configuracionVisual: { colorAcento: '#9333ea' } }
      };
      const actualizados = [...proyectos, nuevo];
      setProyectos(actualizados);
      localStorage.setItem('jamlore_projects', JSON.stringify(actualizados));
      setProyectoActivo(nuevo);
    } 
    else if (modalMode === 'edit' && selectedProjectId) {
      const actualizados = proyectos.map(p => 
        p.id === selectedProjectId ? { ...p, nombre: inputValue, ultimaModificacion: Date.now() } : p
      );
      setProyectos(actualizados);
      localStorage.setItem('jamlore_projects', JSON.stringify(actualizados));
    } 
    else if (modalMode === 'delete' && selectedProjectId) {
      const filtrados = proyectos.filter(p => p.id !== selectedProjectId);
      setProyectos(filtrados);
      localStorage.setItem('jamlore_projects', JSON.stringify(filtrados));
    }
    else if (modalMode === 'entity') {
      if (!inputValue.trim()) return;
      const nueva: Entidad = {
        id: crypto.randomUUID(),
        tipo: tipoEntidad,
        titulo: inputValue,
        descripcion: descValue,
        imagen: imgValue || undefined,
        tags: [],
        relaciones: [],
        fechaCreacion: Date.now(),
        metadata: {
          galeria: imgValue ? [imgValue] : [] // La imagen principal inicia la galería
        }
      };
      addEntidad(nueva);
    }
    closeModals();
  };

  const closeModals = () => {
    setModalMode(null);
    setSelectedProjectId(null);
    setInputValue('');
    setDescValue('');
    setImgValue('');
    setTipoEntidad('personaje');
  };

  // --- LÓGICA DE FILTRADO ---
  const entidadesFiltradas = proyectoActivo?.biblioteca.entidades.filter(entidad => {
    if (activeTab === 'todos') return true;
    return activeTab.includes(entidad.tipo);
  }) || [];

  if (isLoading) return <SplashScreen />;

  return (
    <>
      {!proyectoActivo ? (
        <ProjectSelector 
          proyectos={proyectos} 
          onSelect={setProyectoActivo} 
          onCreate={() => setModalMode('create')}
          onDelete={(id) => { setSelectedProjectId(id); setModalMode('delete'); }}
          onEdit={(id) => { 
            const p = proyectos.find(p => p.id === id);
            setSelectedProjectId(id);
            setInputValue(p?.nombre || '');
            setModalMode('edit'); 
          }}
        />
      ) : (
        <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 animate-in fade-in duration-500">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} projectName={proyectoActivo.nombre} onBack={() => setProyectoActivo(null)} />
          
          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-black tracking-tight text-slate-900">{proyectoActivo.nombre}</h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-purple-200">
                  {activeTab}
                </span>
              </div>
              <p className="text-slate-500 font-medium">{entidadesFiltradas.length} registros encontrados</p>
            </header>

            <section className="flex-1 p-8 pt-4 overflow-y-auto">
              {entidadesFiltradas.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-200 mb-6 flex items-center justify-center text-3xl">
                     {activeTab === 'todos' ? '✨' : '📂'}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {activeTab === 'todos' ? 'Universo en expansión...' : `No hay ${activeTab}`}
                  </h2>
                  <button 
                    onClick={() => setModalMode('entity')}
                    className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
                  >
                    Crear {activeTab === 'todos' ? 'entrada' : activeTab.slice(0, -1)}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {entidadesFiltradas.map(entidad => (
                    <div key={entidad.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all group overflow-hidden flex flex-col">
                      {/* Thumbnail de Imagen */}
                      <div className="h-40 bg-slate-100 relative overflow-hidden">
                        {entidad.imagen ? (
                          <img src={entidad.imagen} alt={entidad.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={40} strokeWidth={1.5} />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-tighter bg-white/90 backdrop-blur text-purple-600 px-2 py-1 rounded-lg shadow-sm">
                          {entidad.tipo}
                        </span>
                      </div>

                      <div className="p-5 flex-1">
                        <h3 className="font-black text-xl text-slate-800 leading-tight mb-2 line-clamp-1">{entidad.titulo}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed italic">
                          {entidad.descripcion || "Sin descripción..."}
                        </p>
                      </div>

                      {/* Mini Galería Preview */}
                      {entidad.metadata?.galeria?.length > 0 && (
                        <div className="px-5 pb-4 flex gap-1.5">
                           {entidad.metadata.galeria.slice(0, 3).map((img: string, i: number) => (
                             <div key={i} className="w-6 h-6 rounded-md bg-slate-200 overflow-hidden border border-white">
                               <img src={img} className="w-full h-full object-cover" />
                             </div>
                           ))}
                           {entidad.metadata.galeria.length > 3 && (
                             <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center text-[8px] font-bold text-purple-600 border border-purple-100">
                               +{entidad.metadata.galeria.length - 3}
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Botón rápido para añadir más dentro del grid */}
                  <button 
                    onClick={() => setModalMode('entity')}
                    className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-purple-300 hover:text-purple-500 transition-all hover:bg-purple-50/30"
                  >
                    <Plus size={32} />
                    <span className="mt-2 font-bold text-sm">Nueva Entrada</span>
                  </button>
                </div>
              )}
            </section>
          </main>
        </div>
      )}

      {/* MODAL DINÁMICO */}
      <Modal
        isOpen={modalMode !== null}
        onClose={closeModals}
        onConfirm={handleConfirmAction}
        title={
          modalMode === 'create' ? "Nuevo Universo" : 
          modalMode === 'edit' ? "Renombrar Proyecto" : 
          modalMode === 'entity' ? "Nueva Entrada al Lore" : "Eliminar Proyecto"
        }
        confirmText={modalMode === 'delete' ? "Eliminar para siempre" : "Guardar en la Biblioteca"}
        variant={modalMode === 'delete' ? 'danger' : 'primary'}
      >
        {modalMode === 'delete' ? (
          <p>¿Estás seguro de que quieres borrar este lore? Esta acción es irreversible.</p>
        ) : modalMode === 'entity' ? (
          <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              {(['personaje', 'lugar', 'objeto', 'faccion'] as EntidadTipo[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipoEntidad(t)}
                  className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${
                    tipoEntidad === t ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Input de Imagen Principal */}
            <div className="flex gap-4 items-end">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {imgValue ? <img src={imgValue} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300" />}
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL de Imagen / Icono</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none text-xs"
                  value={imgValue}
                  onChange={(e) => setImgValue(e.target.value)}
                  placeholder="https://link-a-tu-imagen.png"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
              <input 
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nombre de la entidad..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción Breve</label>
              <textarea 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none text-sm min-h-[80px] resize-none"
                value={descValue}
                onChange={(e) => setDescValue(e.target.value)}
                placeholder="¿Quién es o qué hace este elemento?"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre del proyecto</label>
            <input 
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-bold text-slate-800"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmAction()}
            />
          </div>
        )}
      </Modal>
    </>
  );
}

export default App;