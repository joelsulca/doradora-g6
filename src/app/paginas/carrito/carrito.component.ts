import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  imports: [CommonModule]
})
export class CarritoComponent {
  carrito: any[] = [];
  usuarioLogueado = false;

  constructor(private router: Router) {
    this.cargarCarrito();
    this.verificarSesion();
  }

  verificarSesion() {
    this.usuarioLogueado = !!localStorage.getItem('user');
  }
  cargarCarrito() {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  cambiarCantidad(producto: any, cambio: number) {
    const index = this.carrito.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      this.carrito[index].cantidad += cambio;
      if (this.carrito[index].cantidad <= 0) {
        this.eliminarDelCarrito(producto.id);
      }
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  eliminarDelCarrito(productoId: number) {
    this.carrito = this.carrito.filter(producto => producto.productoId !== productoId);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }

  finalizarCompra() {
    this.router.navigate(['/checkout']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  seguirComprando(){
    this.router.navigate(['/productos']);
  }

}
