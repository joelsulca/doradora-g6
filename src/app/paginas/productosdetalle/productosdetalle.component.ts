import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../clasess/producto';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-productosdetalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productosdetalle.component.html',
  styleUrl: './productosdetalle.component.css'
})
export class ProductosdetalleComponent {
  producto: Producto | undefined;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.cargarProducto();
  }

  cargarProducto() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Obtener el ID de la URL

    this.http.get<Producto[]>('json/productos.json').subscribe(data => {
      this.producto = data.find(p => p.id === id);
      console.log(this.producto);
    });
  }

  agregarAlCarrito() {
    if (!this.producto) return;
  
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  
    // Buscar si el producto ya está en el carrito
    let productoExistente = carrito.find((p: any) => p.id === this.producto?.id);
  
    if (productoExistente) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      productoExistente.cantidad += 1;
    } else {
      // Si no existe, agregarlo con cantidad 1
      carrito.push({ ...this.producto, cantidad: 1 });
    }
  
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
  
    alert('Producto agregado al carrito');
    this.router.navigate(['/carrito']); // Redirige a la página del carrito
  }
  
}
