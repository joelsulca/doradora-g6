import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiBaseResponse } from '../interfaces/api-response.interface';
import { UsuarioRegistroPayload, UsuarioRegistroResponse } from '../interfaces/usuario-registro.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registrarUsuario(payload: UsuarioRegistroPayload): Observable<ApiBaseResponse<UsuarioRegistroResponse>> {
    return this.http.post<ApiBaseResponse<UsuarioRegistroResponse>>(
      `${this.baseUrl}usuario`,
      payload
    );
  }
} 