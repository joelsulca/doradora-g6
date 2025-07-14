import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiBaseResponse } from '../interfaces/api-response.interface';
import { UsuarioLogin } from '../interfaces/usuario-login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(user_email: string, user_password: string): Observable<ApiBaseResponse<UsuarioLogin>> {
    const payload = { user_email, user_password };
    const url = `${this.baseUrl}login`;
    
    console.log('🔍 AuthService - URL:', url);
    console.log('🔍 AuthService - Payload:', payload);
    
    // Agregar headers para evitar problemas de CORS
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    return this.http.post<ApiBaseResponse<UsuarioLogin>>(url, payload, { headers });
  }
} 