// src/app/services/inaturalist.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InaturalistService {
  private apiUrl = 'https://api.inaturalist.org/v1/observations?project_slug=fenotropic';

  constructor(private http: HttpClient) {}

  getObservacionesFenotropic(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}

