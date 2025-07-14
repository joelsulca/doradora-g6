import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiBaseResponse } from '../interfaces/api-response.interface';
import { Cupon } from '../interfaces/cupon.interface';

@Injectable({
  providedIn: 'root'
})
export class CuponService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarCupones(): Observable<ApiBaseResponse<Cupon[]>> {
    return this.http.get<ApiBaseResponse<Cupon[]>>(`${this.baseUrl}cupones`);
  }
} 