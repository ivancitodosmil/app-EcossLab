import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

interface InatResponse {
  results: any[];
  total_results: number;
  page: number;
  per_page: number;
}

@Injectable({
  providedIn: 'root'
})
export class InaturalistService {
  private baseUrl = 'https://api.inaturalist.org/v1/observations?project_id=fenotropic&verifiable=any';

  constructor(private http: HttpClient) {}

  getAllObservations(perPage: number = 200): Observable<any[]> {
    return this.http.get<InatResponse>(`${this.baseUrl}&page=1&per_page=${perPage}`).pipe(
      switchMap(firstPage => {
        const totalPages = Math.ceil(firstPage.total_results / perPage);
        const observaciones = firstPage.results;

        if (totalPages === 1) {
          return of(observaciones);
        }

        const observables = [];
        for (let page = 2; page <= totalPages; page++) {
          observables.push(
            this.http.get<InatResponse>(`${this.baseUrl}&page=${page}&per_page=${perPage}`).pipe(
              map(res => res.results)
            )
          );
        }

        return forkJoin(observables).pipe(
          map(resultsArrays => observaciones.concat(...resultsArrays))
        );
      })
    );
  }
}
