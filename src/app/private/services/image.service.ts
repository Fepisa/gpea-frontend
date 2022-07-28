import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private uri = 'http://localhost:8000/api/image';

  constructor(private http: HttpClient) { }

  getImageByCodigo(codigo: any): Observable<any> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    return this.http.get(`${this.uri}/${codigo}`, { headers });
  }

  saveImage(data: any): Observable<any> {
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

  deleteImage(id: any): Observable<any> {
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
