import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectorTypeInstance {
    baseUrl: string = 'http://3.6.68.94/services/form-builder/connector-instances';

    constructor (http : HttpClient){}

    connectorInstance(body: any ){}

  
}
