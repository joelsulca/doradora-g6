import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioLogin } from '../../shared/interfaces/usuario-login.interface';
import { PedidoService } from '../../shared/services/pedido.service';
import { Pedido } from '../../shared/interfaces/pedido.interface';

const ESTADOS_MAP: Record<number, string> = {
  1: 'Pendiente',
  2: 'Enviado',
  3: 'Entregado',
  4: 'Cancelado',
  // Agrega más estados según tu lógica de negocio
};

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PerfilComponent implements OnInit {
  usuario: UsuarioLogin | null = null;
  pedidos: Pedido[] = [];
  estadosMap = ESTADOS_MAP;

  constructor(private router: Router, private pedidoService: PedidoService) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
    } else {
      this.usuario = JSON.parse(userData);
      this.cargarPedidos();
    }
  }

  cargarPedidos() {
    if (!this.usuario) return;
    this.pedidoService.listarPedidosPorUsuario(this.usuario.usuarioId).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.pedidos = response.data;
        } else {
          this.pedidos = [];
        }
      },
      error: () => {
        this.pedidos = [];
      }
    });
  }

  getEstadoNombre(estadoId: number): string {
    return this.estadosMap[estadoId] || 'Desconocido';
  }

  getFacturaUrl(pedido: Pedido): string {
    return pedido.facturaUrl || '#';
  }

  cerrarSesion() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}