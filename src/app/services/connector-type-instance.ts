import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectorTypeInstance {
    baseUrl: string = 'http://3.6.68.94/services/form-builder/connector-instances';

     constructor(private http: HttpClient) {}

  testConnection(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/test`, payload);
  }

  createInstance(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }

  fetchSchema(instanceId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${instanceId}/fetch?mode=api`, {});
  }
  
}
