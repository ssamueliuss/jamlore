import { 
  Users, 
  MapPin, 
  Sword, 
  History, 
  Library, 
  PlusCircle, 
  Settings,
  Search,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projectName: string; // Nombre del juego activo
  onBack: () => void;  // Función para volver al selector de proyectos
}

export function Sidebar({ activeTab, setActiveTab, projectName, onBack }: SidebarProps) {
  
  const menuItems = [
    { id: 'todos', label: 'Biblioteca', icon: Library },
    { id: 'personaje', label: 'Personajes', icon: Users },
    { id: 'lugar', label: 'Localizaciones', icon: MapPin },
    { id: 'objeto', label: 'Artefactos', icon: Sword },
    { id: 'evento', label: 'Cronología', icon: History },
  ];

  return (
    <aside className="w-64 h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200">
      
      {/* HEADER - Logo & Info de Proyecto */}
      <div className="p-6">
        {/* Botón Volver */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-4 hover:text-indigo-700 transition-colors group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          Proyectos
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
            JL
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-900 truncate">
            {projectName}
          </h1>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mb-6 px-1">Workspace Activo</p>

        {/* BUSCADOR RÁPIDO */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Buscar en el lore..."
            className="w-full bg-slate-100 border border-transparent rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700"
          />
        </div>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Categorías</p>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
              ${activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm' 
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-transparent'
              }`}
          >
            <item.icon size={18} className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
            {item.label}
          </button>
        ))}

        <div className="pt-6">
          <button className="w-full flex items-center gap-3 px-3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95">
            <PlusCircle size={18} />
            Nueva Entrada
          </button>
        </div>
      </nav>

      {/* FOOTER - Ajustes y Perfil */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all">
          <Settings size={16} />
          Ajustes
        </button>
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="w-6 h-6 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold">
            SA
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 leading-none">Samuel A.</span>
            <span className="text-[9px] text-slate-400">SillyDevs Editor</span>
          </div>
        </div>
      </div>
    </aside>
  );
}