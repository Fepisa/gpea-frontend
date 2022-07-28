import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private uri = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
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

  getUserById(id: any): Observable<any> {
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

  saveUser(data: any): Observable<any> {
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

  updateUser(data: any, id: any): Observable<any> {
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

  deleteUser(id: any): Observable<any> {
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