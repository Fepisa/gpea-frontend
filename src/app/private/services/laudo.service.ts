import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaudoService {

  private uri = 'http://localhost:8000/api/laudos';

  constructor(private http: HttpClient) { }

  getLaudos(): Observable<any> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    return this.http.get(this.uri, { headers });
  }

  getLaudoById(id: any): Observable<any> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    return this.http.get(`${this.uri}/${id}`, { headers });
  }

  saveLaudo(data: any): Observable<any> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    return this.http.post(`${this.uri}`, data, { headers });
  }

  updateLaudo(data: any, id: any): Observable<any> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    return this.http.post(`${this.uri}/${id}?_method=PATCH`, data, { headers });
  }

  deleteLaudo(id: any): Observable<any> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    return this.http.delete(`${this.uri}/${id}`, { headers });    
  }
  
}
