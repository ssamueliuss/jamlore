export type EntidadTipo = 'personaje' | 'lugar' | 'objeto' | 'evento' | 'faccion';

export interface Relacion {
  id: string;
  targetId: string; // ID de la entidad con la que conecta
  tipo: string;     // Ej: "Enemigo de", "Líder de", "Ubicado en"
}

export interface Entidad {
  id: string;
  tipo: EntidadTipo;
  titulo: string;
  descripcion: string; // Soporte para Markdown
  imagen?: string;     // Base64 o path local de Tauri
  tags: string[];
  relaciones: Relacion[];
  fechaCreacion: number; // Usamos timestamp para evitar líos con JSON
  metadata: Record<string, any>; // Para campos como "Raza", "Clima", "Poder", etc.
}

export interface Workspace {
  id: string;
  nombre: string;
  descripcion: string;
  ultimaModificacion: number;
  biblioteca: {
    entidades: Entidad[];
    configuracionVisual?: {
      colorAcento?: string; // Para lo que hablamos de personalizar cada juego
      banner?: string;
    };
  };
}

export interface AppState {
  proyectos: Workspace[];
  proyectoActivoId: string | null;
}

export interface Entidad {
  id: string;
  tipo: EntidadTipo;
  titulo: string;
  descripcion: string;
  tags: string[];
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  ultimaModificacion: number;
  entidades: Entidad[];
}