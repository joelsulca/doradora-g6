import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Producto } from '../../clasess/producto';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})

export class ProductosComponent {

  productos: Producto[] = []; // Esto almacena la lista de productos

  constructor(private http: HttpClient, private router: Router) {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<Producto[]>('/json/productos.json').subscribe(data => {
      this.productos = data;
    });
  }

  verDetalle(producto: Producto) {
    this.router.navigate(['/producto', producto.id]);
  }
}
