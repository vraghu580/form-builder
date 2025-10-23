import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private baseUrl = 'http://localhost:3000/api/connections'; // adjust your API URL

  constructor(private http: HttpClient) {}

  getConnectionConfig(type: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/config/${type}`);
  }

  connect(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/connect`, payload);
  }
}
