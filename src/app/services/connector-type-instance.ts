import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectorTypeInstance {

  private baseUrl = 'http://3.6.68.94/services/form-builder/connector-instances';

  constructor(private http: HttpClient) {}

  getAllConnectorTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/connector-instances`);
  }

  getConnectorMetadata(connectorTypeId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/connector-instances/${connectorTypeId}`);
  }

  metaDataConnectorType(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/connector-instances/test`, body);
  }
}
