import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaudoService {

  private uri = 'https://scan.gpea.eng.br/gpea-api/public/api/laudos';
  // private uri = 'http://localhost:8000/api/laudos';

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

  getLaudoByLocalGeralAndContratante(localGeral: any, contratante: any): Observable<any> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    return this.http.get(`${this.uri}/local/${localGeral}/contratante/${contratante}`, { headers });
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

  updateObservacao(data: any): Observable<any> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    return this.http.post(`${this.uri}/observacao?_method=PATCH`, data, { headers });
  }

  upload(file: File): Observable<HttpEvent<any>> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.uri}/importar`, formData, {
      headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  download(): Observable<any> {
    let auth = null;
    const lsGpea = localStorage.getItem('gpea');
    if (typeof lsGpea === 'string') {
      auth = JSON.parse(lsGpea);
    }
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + auth.token
    });

    return this.http.get(`${this.uri}/exportar`, { headers, responseType: 'blob' });
  }

  downloadFile(data: any) {
    const blob = new Blob([data], {type: 'text/csv'});
    const filename = 'laudos.csv';
    const objectURL = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
    a.href = objectURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectURL);
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
