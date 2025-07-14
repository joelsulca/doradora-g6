export interface PedidoCrearPayload {
  usuarioId: number;
  cuponId?: number | null;
  direccionEnvioId: number;
  direccionFacturacionId: number;
  notas?: string;
  productos: Array<{
    productoId: number;
    cantidad: number;
    precio: number;
  }>;
  // Agrega aquí otros campos requeridos por la API, como fechaEntrega, etc.
} 