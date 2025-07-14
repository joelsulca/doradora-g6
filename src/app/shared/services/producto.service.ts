import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiBaseResponse } from '../interfaces/api-response.interface';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarProductos(): Observable<ApiBaseResponse<Producto[]>> {
    return this.http.get<ApiBaseResponse<Producto[]>>(`${this.baseUrl}producto`);
  }

  obtenerProductoPorId(productoId: number): Observable<ApiBaseResponse<Producto>> {
    return this.http.post<ApiBaseResponse<Producto>>(
      `${this.baseUrl}producto/byId`,{ productoId: productoId.toString() }
    );
  }
}
