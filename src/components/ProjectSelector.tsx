import { Plus, FolderKanban, Clock, Trash2, Pencil } from 'lucide-react';
import { Workspace } from '../types';
import logo from '../assets/logo.png';

interface Props {
  proyectos: Workspace[];
  onSelect: (p: Workspace) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ProjectSelector({ proyectos, onSelect, onCreate, onDelete, onEdit }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center justify-center gap-3">
            <img src={logo} alt="JamLore" className="h-32 w-auto" />
          </h1>
          <p className="text-slate-500 font-medium">Selecciona un workspace para empezar a escribir.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={onCreate}
            className="h-48 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 transition-all group bg-white shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
               <Plus size={32} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-bold">Nuevo Proyecto</span>
          </button>

          {proyectos.map(proyecto => (
            <div 
              key={proyecto.id}
              onClick={() => onSelect(proyecto)}
              className="h-48 bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all group relative overflow-hidden shadow-sm flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <FolderKanban size={20} />
                </div>
                
                {/* Botones de Acción */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(proyecto.id); }}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-purple-600 transition-colors"
                    title="Editar nombre"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(proyecto.id); }}
                    className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    title="Eliminar proyecto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-purple-700 transition-colors truncate">
                {proyecto.nombre}
              </h3>
              <p className="text-slate-500 text-sm line-clamp-2">
                {proyecto.descripcion || 'Sin descripción...'}
              </p>
              
              <div className="mt-auto flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                <Clock size={12} className="text-purple-400" />
                {new Date(proyecto.ultimaModificacion).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}