export type EntidadTipo = 'personaje' | 'lugar' | 'objeto' | 'evento' | 'faccion';

export interface Relacion {
  id: string;
  targetId: string; // ID de la entidad con la que conecta
  tipo: string;     // Ej: "Enemigo de", "Capital de", "Creador de"
}

export interface Entidad {
  id: string;
  tipo: EntidadTipo;
  titulo: string;
  descripcion: string; // Soporte para Markdown
  imagen?: string;     // Base64 o URL local
  tags: string[];
  relaciones: Relacion[];
  fechaCreacion: Date;
  metadata: Record<string, any>; // Para campos personalizados según el tipo
}

export interface ProyectoLore {
  id: string;
  nombre: string;
  entidades: Entidad[];
  ultimoAcceso: Date;
}