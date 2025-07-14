export interface UsuarioRegistroPayload {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  password: string;
  telefono: string;
  fechaNacimiento: string; // formato: YYYY-MM-DD
  activo: boolean;
  correoConfirmado: boolean;
  rolId: number;
  direccion: string;
  referencia: string;
}

export interface UsuarioRegistroResponse {
  usuarioId: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  activo: boolean;
  correoConfirmado: boolean;
  rolId: number;
} 