import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PedidoCrearPayload } from '../interfaces/pedido-crear.interface';
import { ApiBaseResponse } from '../interfaces/api-response.interface';
import { Pedido } from '../interfaces/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarPedidos(): Observable<ApiBaseResponse<Pedido[]>> {
    return this.http.get<ApiBaseResponse<Pedido[]>>(`${this.baseUrl}pedidos`);
  }

  listarPedidosPorUsuario(usuarioId: number): Observable<ApiBaseResponse<Pedido[]>> {
    return this.http.post<ApiBaseResponse<Pedido[]>>(
      `${this.baseUrl}pedidos/by_user`,
      { usuario_id: usuarioId }
    );
  }

  crearPedido(payload: PedidoCrearPayload): Observable<ApiBaseResponse<Pedido>> {
    return this.http.post<ApiBaseResponse<Pedido>>(
      `${this.baseUrl}pedidos`,
      payload
    );
  }
} 