import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectorTypeInstance {
    baseUrl: string = 'http://3.6.68.94/services/form-builder/connector-instances';

    constructor (private http : HttpClient){}

    testConnectorInstance(body: any ){
      return this.http.post(this.baseUrl, body)
    }

     createConnectorInstance(body: any): Observable<any> {
    return this.http.post(this.baseUrl, body);
  }

  /** Fetch connector instance by ID with mode=api */
  fetchConnectorInstance(instanceId: string): Observable<any> {
    const fetchUrl = `${this.baseUrl}/${instanceId}/fetch?mode=api`;
    return this.http.post(fetchUrl, {});
  }

  
}
