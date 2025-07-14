import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Producto } from '../../shared/interfaces/producto.interface';
import { ProductoService } from '../../shared/services/producto.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService, private router: Router) {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.listarProductos().subscribe({
      next: (response) => {
        if (response.statusCode === 200 && Array.isArray(response.data)) {
          this.productos = response.data;
        } else {
          this.productos = [];
        }
      },
      error: (err) => {
        this.productos = [];
      }
    });
  }

  getImagenUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('/') ? url : '/' + url;
  }

  verDetalle(producto: Producto) {
    this.router.navigate(['/producto', producto.productoId]);
  }
}
