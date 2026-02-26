import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  variant?: 'primary' | 'danger';
}

export function Modal({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirmar", variant = 'primary' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-8 text-slate-600 font-medium">
            {children}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                variant === 'danger' 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-100' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}