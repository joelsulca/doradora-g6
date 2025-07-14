import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../shared/interfaces/producto.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../shared/services/producto.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-productosdetalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productosdetalle.component.html',
  styleUrl: './productosdetalle.component.css'
})
export class ProductosdetalleComponent {
  producto: Producto | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private toastr: ToastrService
  ) {
    this.cargarProducto();
  }

  cargarProducto() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (response) => {
        if (response.data) {
          this.producto = response.data;
        } else {
          this.producto = undefined;
        }
      },
      error: () => {
        this.producto = undefined;
      }
    });
  }

  agregarAlCarrito() {
    if (!this.producto) {
      return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    let productoExistente = carrito.find((p: any) => p.productoId === this.producto?.productoId);
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ ...this.producto, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    this.toastr.success('Producto agregado al carrito', 'Éxito');
    this.router.navigate(['/carrito']);
  }
}
