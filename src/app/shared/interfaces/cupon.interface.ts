export interface Cupon {
  cuponId: number;
  codigo: string;
  tipoDescuento: string;
  valorDescuento: number;
  fechaInicio: string;
  fechaFin: string;
  usoMaximo: number;
  usoPorUsuario: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
} 