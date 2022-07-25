import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri = 'http://localhost:8000/api/login';

  constructor(private http: HttpClient) { }

  doLogin(user: any) {    
    return this.http.post(`${this.uri}`, user);
  }

  userAuthenticated() {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    if (auth) {
      const dtExpires = new Date(auth.expires);
      if (new Date().getTime() > dtExpires.getTime()) {
        return false;
      }
      return true;
    }
    return false;
  }

}
