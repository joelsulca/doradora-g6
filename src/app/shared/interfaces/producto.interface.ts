export interface Producto {
  productoId: number;
  nombreProducto: string;
  descripcionCorta: string;
  precio: number;
  stock: number;
  sku: string;
  imagenPrincipalUrl: string;
  activo: boolean;
  categoriaId: number;
  nombreCategoria: string;
  marcaId: number;
  nombreMarca: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  descripcionDetallada: string;
} 