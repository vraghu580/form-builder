import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectorType } from '../connector-type/get-connector-type/get-connector-type';
import { bootstrapApplication } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class connectionTypeService {
  baseUrl: string = 'http://3.6.68.94/services/form-builder/connector-types';

  constructor(private http: HttpClient) {}

  createConnectionType(body: any ){
    return this.http.post(this.baseUrl, body)
  }

// deleteConnectionType(body: any){
//   return this.http.delete(this.baseUrl, body)
// }


  update(id: string, data: any): Observable<ConnectorType> {
    return this.http.put<ConnectorType>(`${this.baseUrl}/${id}`, data);
  }

  getAll(): Observable<ConnectorType[]> {
    return this.http.get<ConnectorType[]>(this.baseUrl);
  }

  deleteConnectionType(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getById(id: string): Observable<ConnectorType> {
    return this.http.get<ConnectorType>(`${this.baseUrl}/${id}`);
  }
}
