import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectorType } from '../connector-type/get-connector-type/get-connector-type';

@Injectable({
  providedIn: 'root'
})
export class connectionTypeService {

  baseUrl:string = 'http://3.6.68.94/services/form-builder/connector-types'

   constructor( private http: HttpClient){}

  createConnectionType(body: any ){
    return this.http.post(this.baseUrl, body)
  }
   
  getAll(): Observable<ConnectorType[]> {
    return this.http.get<ConnectorType[]>(this.baseUrl);
  }

  /** 🔹 Delete a connector type by ID */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: string, body: any) {
  return this.http.put(`${this.baseUrl}/${id}`, body);
}

/** 🔹 Get a connector type by ID (optional if you want to prefill form) */
getById(id: string) {
  return this.http.get<ConnectorType>(`${this.baseUrl}/${id}`);
}
}
