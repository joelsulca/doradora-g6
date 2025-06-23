import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../clasess/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  pedidos: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']); // Si no hay usuario logueado, redirigir al login
    } else {
      this.usuario = JSON.parse(userData);
      this.cargarPedidos();
    }
  }

  cargarPedidos() {
    this.http.get<any[]>('/json/pedidos.json').subscribe(data => {
      this.pedidos = data
        .filter(pedido => pedido.usuario === this.usuario?.username)
        .map(pedido => ({
          ...pedido,
          factura: this.generarNumeroFactura(pedido.id),
          urlFactura: this.generarLinkFactura(pedido.id),
        }));
    });
  }

  generarNumeroFactura(idPedido: number): string {
    return `FAC-${idPedido.toString().padStart(6, '0')}`;
  }

  generarLinkFactura(idPedido: number): string {
    return `/facturas/factura_${idPedido}.pdf`; // Ruta simulada para el PDF
  }

  cerrarSesion() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}