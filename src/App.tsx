import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { ProjectSelector } from './components/ProjectSelector';
import { SplashScreen } from './components/ui/SplashScreen';
import { Modal } from './components/ui/Modal'; // Importamos el modal
import { Workspace } from './types';

function App() {
  const [proyectos, setProyectos] = useState<Workspace[]>([]);
  const [proyectoActivo, setProyectoActivo] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');

  // ESTADOS PARA MODALES
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

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

  // --- HANDLERS DE LOGICA ---

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

    closeModals();
  };

  const closeModals = () => {
    setModalMode(null);
    setSelectedProjectId(null);
    setInputValue('');
  };

  // --- RENDERIZADO ---

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
            {/* ... Resto de tu cabecera y sección de contenido ... */}
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
          modalMode === 'edit' ? "Renombrar Proyecto" : "Eliminar Proyecto"
        }
        confirmText={modalMode === 'delete' ? "Eliminar para siempre" : "Guardar Cambios"}
        variant={modalMode === 'delete' ? 'danger' : 'primary'}
      >
        {modalMode === 'delete' ? (
          <p>¿Estás seguro de que quieres borrar este lore? Esta acción es irreversible y todos los personajes y datos se perderán.</p>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre del proyecto</label>
            <input 
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-bold text-slate-800"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ej: Crónicas de Aether..."
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmAction()}
            />
          </div>
        )}
      </Modal>
    </>
  );
}

export default App;