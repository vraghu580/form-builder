import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class connectionTypeService {

  baseUrl:string = 'http://3.6.68.94/services/form-builder/connector-types'

   constructor( private http: HttpClient){}

  createConnectionType(body: any ){
    return this.http.post(this.baseUrl, body)
  }
   
}
