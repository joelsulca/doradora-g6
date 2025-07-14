export interface Pedido {
  pedidoId: number;
  usuarioId: number;
  fechaPedido: string;
  estadoId: number;
  total: number;
  cuponId?: number | null;
  descuento: number;
  subtotalPedido: number;
  igvMonto: number;
  direccionEnvioId: number;
  direccionFacturacionId: number;
  notas: string;
  fechaActualizacion: string;
  fechaEntrega: string;
  qProductos: number;
  facturaUrl: string | null;
} 