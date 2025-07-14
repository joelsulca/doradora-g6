export interface UsuarioLogin {
  usuarioId: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  rolId: number;
  nombreRol: string;
  activo: boolean;
  correoConfirmado: boolean;
  distrito: string;
  direccion: string;
  referencia: string;
  ciudad: string; //mejorar
} 