import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActorResponse } from '../interfaces/actor-response';

@Injectable({
  providedIn: 'root'
})
export class NetworkDegreeService {

  private readonly baseUrl: string = "http://localhost:3000/api/network-degree";

  constructor(private http: HttpClient) { }

  getAllActors(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/actors/all`);
  }

  getActor(query: string): Observable<ActorResponse> {
    const params = new HttpParams()
      .set('query', query);
      
    return this.http.get<ActorResponse>(`${this.baseUrl}/actors`, { params });
  }

  getNetwork(origin: string, destiny: string): Observable<{ [key: string]: string }> {
    const params = new HttpParams()
      .set('origin', origin)
      .set('destiny', destiny);
  
    return this.http.get<{ [key: string]: string }>(`${this.baseUrl}/network`, { params });
  }  
}
