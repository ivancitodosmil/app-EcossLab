import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  cargarCSVDesdeAssets(path: string): Observable<any[]> {
    return new Observable(observer => {
      this.http.get(path, { responseType: 'text' }).subscribe({
        next: csvData => {
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (result: any) => {
              observer.next(result.data);
              observer.complete();
            }
          });
        },
        error: err => observer.error(err)
      });
    });
  }
}

