import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActorResponse } from '../interfaces/actor-response';
import { AllNetworkResult } from '../interfaces/all-network-result';

@Injectable({
  providedIn: 'root'
})
export class NetworkDegreeService {

  private readonly baseUrl: string = "http://localhost:5265/api/network-degree";

  constructor(private http: HttpClient) { }

  getAllActors(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/actors/all`);
  }

  getActor(query: string): Observable<ActorResponse> {
    const params = new HttpParams()
      .set('query', query);
      
    return this.http.get<ActorResponse>(`${this.baseUrl}/actor`, { params });
  }

  getNetwork(origin: string, destiny: string): Observable<{ [key: string]: string }> {
    const params = new HttpParams()
      .set('origin', origin)
      .set('destiny', destiny);
  
    return this.http.get<{ [key: string]: string }>(`${this.baseUrl}/network`, { params });
  }  

  getAllNetwork(origin: string, destiny: string): Observable<AllNetworkResult> {
    const params = new HttpParams()
      .set('origin', origin)
      .set('destiny', destiny);
  
    return this.http.get<AllNetworkResult>(`${this.baseUrl}/network/all`, { params });
  }

  getImage(text: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${text}`);
  }
}
